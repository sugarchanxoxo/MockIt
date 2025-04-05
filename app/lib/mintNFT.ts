import { concat, Contract, ethers, formatUnits, Interface, toBeHex, Wallet } from 'ethers'
import {
	ADDRESS,
	EOAValidatorModule,
	KernelV3Account,
	PimlicoBundler,
	sendop,
	zeroPadLeft,
	type GetPaymasterStubDataResult,
	type UserOp,
} from 'sendop'
import { chainId, client, getPermitData, usdc, USDC_ADDRESS, USDC_PAYMASTER_ADDRESS, BUNDLER_URL } from './common'
import { TypedDataEncoder } from 'ethers'

const NFT_CONTRACT_ADDRESS = '0xaE9EcABC662e5A6D4EB1d4e5697aC13fAfB12619'

export interface MintNFTParams {
	tokenURI: string
	privateKey: string
}

export async function mintNFTWithUSDC({ tokenURI, privateKey }: MintNFTParams) {
	const bundler = new PimlicoBundler(chainId.toString(), BUNDLER_URL, {
		parseError: true,
		skipGasEstimation: true,
	})

	const signer = new Wallet(privateKey, client)
	const creationOptions = {
		salt: zeroPadLeft('0x22'),
		validatorAddress: ADDRESS.ECDSAValidator,
		validatorInitData: await signer.getAddress(),
	}
	const accountAddress = await KernelV3Account.getNewAddress(client, creationOptions)

	const balance = await usdc.balanceOf?.(accountAddress)

	if (balance === 0n) {
		throw new Error('USDC Balance is 0 for account: ' + accountAddress)
	}

	const eoaValidator = new EOAValidatorModule({
		address: ADDRESS.ECDSAValidator,
		signer,
	})

	// NFT Contract interface for minting
	// const nftInterface = new Interface(['function mint(address to, string memory tokenURI) external returns (uint256)'])

	const op = await sendop({
		bundler,
		executions: [
			{
				to: NFT_CONTRACT_ADDRESS,
				data: new Interface([
					'function mintWithUSDC(string memory _imageURI, string memory _promptText, uint256 _amount)',
				]).encodeFunctionData('mintWithUSDC', [tokenURI, 'test', 1]),
				value: 0n,
			},
		],
		opGetter: new KernelV3Account({
			address: accountAddress,
			client,
			bundler,
			validator: eoaValidator,
		}),
		// initCode: KernelV3Account.getInitCode(creationOptions),
		pmGetter: {
			async getPaymasterStubData(userOp: UserOp): Promise<GetPaymasterStubDataResult> {
				const usdcPaymaster = new Contract(
					USDC_PAYMASTER_ADDRESS,
					new Interface(['function additionalGasCharge() view returns (uint256)']),
					client,
				)
				// const additionalGasCharge = await usdcPaymaster.getFunction('additionalGasCharge')()

				// The max amount allowed to be paid per user op
				const MAX_GAS_USDC = 2n * 10n ** 6n

				// 1. First get the permit data and hash as you're doing
				const permitData = await getPermitData({
					provider: client,
					tokenAddress: USDC_ADDRESS,
					chainId: chainId,
					ownerAddress: accountAddress,
					spenderAddress: USDC_PAYMASTER_ADDRESS,
					amount: MAX_GAS_USDC,
				})

				const permitHash = TypedDataEncoder.hash(...permitData)

				// 2. Create the Kernel domain
				const KERNEL_DOMAIN = {
					name: 'Kernel',
					version: '0.3.1',
					chainId: chainId,
					verifyingContract: accountAddress,
				}

				// 3. First create the struct hash using KERNEL_WRAPPER_TYPE_HASH
				const KERNEL_WRAPPER_TYPE_HASH = '0x1547321c374afde8a591d972a084b071c594c275e36724931ff96c25f2999c83'
				const structHash = ethers.keccak256(
					ethers.AbiCoder.defaultAbiCoder().encode(
						['bytes32', 'bytes32'],
						[KERNEL_WRAPPER_TYPE_HASH, permitHash],
					),
				)

				// 4. Create the full EIP-712 typed data hash
				const DOMAIN_SEPARATOR = TypedDataEncoder.hashDomain(KERNEL_DOMAIN)
				const fullHash = ethers.keccak256(concat(['0x1901', DOMAIN_SEPARATOR, structHash]))

				// 5. Sign the full EIP-712 hash
				const signature = await signer.signMessage(ethers.getBytes(fullHash))

				// 6. Prefix with validator info
				const wrappedSignature = concat([
					'0x01', // Validation mode for validator
					ADDRESS.ECDSAValidator,
					signature,
				])

				const paymasterData = concat([
					'0x00', // Reserved for future use
					USDC_ADDRESS, // Token address
					zeroPadLeft(toBeHex(MAX_GAS_USDC)), // Max spendable gas in USDC
					wrappedSignature, // EIP-2612 permit signature
				])

				return {
					paymaster: USDC_PAYMASTER_ADDRESS,
					paymasterData,
					// TODO: should be fetch from the bundler
					paymasterVerificationGasLimit: toBeHex(999_999n),
					paymasterPostOpGasLimit: toBeHex(999_999n),
					isFinal: true,
				}
			},
		},
	})

	console.log(`userOp hash: ${op.hash}`)
	const receipt = await op.wait()

	console.log('success:', receipt.success)

	return {
		success: receipt.success,
		hash: op.hash,
	}
}
