import { concat, Contract, formatUnits, Interface, toBeHex, Wallet } from 'ethers'
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
const accountAddress = '0xF5090a4b164e4Ed26CF572333AC31848a101Cbf6'

const balance = await usdc.balanceOf?.(accountAddress)
console.log('usdc balance of accountAddress:', formatUnits(balance, 6))

const op = await sendop({
	bundler,
	executions: [],
	opGetter: new KernelV3Account({
		address: accountAddress,
		client,
		bundler,
		validator: new EOAValidatorModule({
			address: ADDRESS.K1Validator,
			signer,
		}),
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
			const MAX_GAS_USDC = 2n * 10n ** 6n

			const permitData = await getPermitData({
				provider: client,
				tokenAddress: USDC_ADDRESS,
				chainId: chainId,
				ownerAddress: accountAddress,
				spenderAddress: USDC_PAYMASTER_ADDRESS,
				amount: MAX_GAS_USDC,
			})

			console.log('permitData:', permitData)

			const signature = await signer.signTypedData(...permitData)
			const paymasterData = concat([
				'0x00', // Reserved for future use
				USDC_ADDRESS, // Token address
				zeroPadLeft(toBeHex(MAX_GAS_USDC)), // Max spendable gas in USDC
				signature, // EIP-2612 permit signature
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
