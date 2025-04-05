import { formatUnits, Wallet } from 'ethers'
import { ADDRESS, EOAValidatorModule, KernelV3Account, PimlicoBundler, sendop, zeroPadLeft } from 'sendop'
import { chainId, client, usdc } from './common'

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
	validatorAddress: ADDRESS.K1Validator,
	validatorInitData: await signer.getAddress(),
}
const computedAddress = await KernelV3Account.getNewAddress(client, creationOptions)
console.log(`salt: ${creationOptions.salt}`)
console.log('computedAddress:', computedAddress)

const balance = await usdc.balanceOf?.(computedAddress)
console.log('usdc balance of computedAddress:', formatUnits(balance, 6))

const op = await sendop({
	bundler,
	executions: [],
	opGetter: new KernelV3Account({
		address: computedAddress,
		client,
		bundler,
		validator: new EOAValidatorModule({
			address: ADDRESS.K1Validator,
			signer,
		}),
	}),
	initCode: KernelV3Account.getInitCode(creationOptions),
})

console.log(`hash: ${op.hash}`)
const receipt = await op.wait()
console.log('success:', receipt.success)
