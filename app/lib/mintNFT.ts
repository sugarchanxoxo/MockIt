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

const NFT_CONTRACT_ADDRESS = '0x949Cc6B33AA52C456bD0162fb167715D74e05df2'

export interface MintNFTParams {
	tokenURI: string
	privateKey: string
}

export async function mintNFT({ tokenURI, privateKey }: MintNFTParams) {
	const bundler = new PimlicoBundler(chainId.toString(), BUNDLER_URL, {
		parseError: true,
		debugSend: true,
	})

	const signer = new Wallet(privateKey)
	const creationOptions = {
		salt: zeroPadLeft('0x22'),
		validatorAddress: ADDRESS.ECDSAValidator,
		validatorInitData: await signer.getAddress(),
	}
	const accountAddress = await KernelV3Account.getNewAddress(client, creationOptions)

	const balance = await usdc.balanceOf?.(accountAddress)
	console.log('usdc balance of accountAddress:', formatUnits(balance, 6))

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
				data: new Interface(['function setNumber(uint256)']).encodeFunctionData('setNumber', [24]),
				value: 0n,
			},
		],
		opGetter: new KernelV3Account({
			address: accountAddress,
			client,
			bundler,
			validator: eoaValidator,
		}),
		pmGetter: {
			async getPaymasterStubData(userOp: UserOp): Promise<GetPaymasterStubDataResult> {
				const usdcPaymaster = new Contract(
					USDC_PAYMASTER_ADDRESS,
					new Interface(['function additionalGasCharge() view returns (uint256)']),
					client,
				)
				const additionalGasCharge = await usdcPaymaster.getFunction('additionalGasCharge')()
				console.log('additionalGasCharge:', additionalGasCharge)

				const MAX_GAS_USDC = 2n * 10n ** 6n

				const permitData = await getPermitData({
					provider: client,
					tokenAddress: USDC_ADDRESS,
					chainId: chainId,
					ownerAddress: accountAddress,
					spenderAddress: USDC_PAYMASTER_ADDRESS,
					amount: MAX_GAS_USDC,
				})

				const permitHash = TypedDataEncoder.hash(...permitData)

				const KERNEL_DOMAIN = {
					name: 'Kernel',
					version: '0.3.1',
					chainId: chainId,
					verifyingContract: accountAddress,
				}

				const KERNEL_WRAPPER_TYPE_HASH = '0x1547321c374afde8a591d972a084b071c594c275e36724931ff96c25f2999c83'
				const structHash = ethers.keccak256(
					ethers.AbiCoder.defaultAbiCoder().encode(
						['bytes32', 'bytes32'],
						[KERNEL_WRAPPER_TYPE_HASH, permitHash],
					),
				)

				const DOMAIN_SEPARATOR = TypedDataEncoder.hashDomain(KERNEL_DOMAIN)
				const fullHash = ethers.keccak256(concat(['0x1901', DOMAIN_SEPARATOR, structHash]))

				const signature = await signer.signMessage(ethers.getBytes(fullHash))

				const wrappedSignature = concat(['0x01', ADDRESS.ECDSAValidator, signature])

				const paymasterData = concat([
					'0x00',
					USDC_ADDRESS,
					zeroPadLeft(toBeHex(MAX_GAS_USDC)),
					wrappedSignature,
				])

				return {
					paymaster: USDC_PAYMASTER_ADDRESS,
					paymasterData,
					paymasterVerificationGasLimit: toBeHex(999_999n),
					paymasterPostOpGasLimit: toBeHex(999_999n),
					isFinal: true,
				}
			},
		},
	})

	console.log(`Transaction hash: ${op.hash}`)
	const receipt = await op.wait()
	return {
		success: receipt.success,
		hash: op.hash,
	}
}
