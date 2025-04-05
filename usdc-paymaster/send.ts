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
import { chainId, client, getPermitData, usdc, USDC_ADDRESS } from './common'
import { TypedDataEncoder } from 'ethers'

const USDC_PAYMASTER_ADDRESS = '0x31BE08D380A21fc740883c0BC434FcFc88740b58'
const BUNDLER_URL =
	chainId === 1337n ? `http://localhost:4337` : `https://public.pimlico.io/v2/${chainId.toString()}/rpc`

console.log('BUNDLER_URL', BUNDLER_URL)

const bundler = new PimlicoBundler(chainId.toString(), BUNDLER_URL, {
	parseError: true,
	debugSend: true,
	// debugSend: true,
	async onBeforeEstimation(userOp) {
		// console.log('onBeforeEstimation', userOp)
		return userOp
	},
	async onBeforeSendUserOp(userOp) {
		// console.log('onBeforeSendUserOp', userOp)

		return userOp
	},
})

const signer = new Wallet(process.env.acc0pk as string)
const creationOptions = {
	salt: zeroPadLeft('0x20'),
	validatorAddress: ADDRESS.ECDSAValidator,
	validatorInitData: await signer.getAddress(),
}
const accountAddress = await KernelV3Account.getNewAddress(client, creationOptions)

const balance = await usdc.balanceOf?.(accountAddress)
console.log('usdc balance of accountAddress:', formatUnits(balance, 6))

const eoaValidator = new EOAValidatorModule({
	address: ADDRESS.ECDSAValidator,
	signer,
})

const op = await sendop({
	bundler,
	executions: [],
	opGetter: new KernelV3Account({
		address: accountAddress,
		client,
		bundler,
		// validator: {
		// 	address() {
		// 		return eoaValidator.address()
		// 	},
		// 	getDummySignature(userOp: UserOp) {
		// 		return concat(['0x01', this.address(), eoaValidator.getDummySignature(userOp)])
		// 	},
		// 	async getSignature(userOpHash: Uint8Array, userOp: UserOp) {
		// 		return concat(['0x01', this.address(), await eoaValidator.getSignature(userOpHash, userOp)])
		// 	},
		// },
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

			// paymasterData = 0x00 || usdc address || Max spendable gas in USDC || EIP-2612 permit signature

			// The max amount allowed to be paid per user op
			const MAX_GAS_USDC = 3n * 10n ** 6n

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
			console.log('wrappedSignature:', wrappedSignature)

			const paymasterData = concat([
				'0x00', // Reserved for future use
				USDC_ADDRESS, // Token address
				zeroPadLeft(toBeHex(MAX_GAS_USDC)), // Max spendable gas in USDC
				wrappedSignature, // EIP-2612 permit signature
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

console.log(`hash: ${op.hash}`)
const receipt = await op.wait()
console.log('success:', receipt.success)
