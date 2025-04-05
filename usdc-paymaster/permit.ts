import { Contract, Interface, Signature, Wallet } from 'ethers'
import { parseUnits } from 'ethers/utils'
import { acc0, acc1, chainId, client, getPermitData, usdc, USDC_ADDRESS } from './common'

const dev = new Wallet(process.env.PRIVATE_KEY as string, client)
const gaslessTransferAddress = '0xcCD4db81AfaAd3E1083E7AaA5E10B0811c930cb4'
const maxUint256 = 2n ** 256n - 1n

const usdcAcc0 = usdc.connect(acc0) as Contract

const balanceBefore = await usdcAcc0.balanceOf?.(acc0.address)
console.log('Balance before:', balanceBefore)

const sender = acc0.address
const recipient = dev.address
const amount = parseUnits('50', 6)

const permitData = await getPermitData({
	provider: client,
	tokenAddress: USDC_ADDRESS,
	chainId: chainId,
	ownerAddress: sender,
	spenderAddress: gaslessTransferAddress,
	amount,
})

const signature = await acc0.signTypedData(...permitData)
const sigObj = Signature.from(signature)

let gaslessTransfer = new Contract(
	gaslessTransferAddress,
	new Interface([
		'function send(address token, address sender, address receiver, uint256 amount, uint256 deadline, uint8 v, bytes32 r, bytes32 s) external',
	]),
)

gaslessTransfer = gaslessTransfer.connect(dev) as Contract

console.log('Sending gasless transfer...')
const tx = await gaslessTransfer.send?.(
	USDC_ADDRESS,
	sender,
	recipient,
	amount,
	maxUint256,
	sigObj.v,
	sigObj.r,
	sigObj.s,
)
console.log('hash:', tx.hash)
const receipt = await tx.wait()
console.log(receipt.status === 1 ? 'success' : 'failed')

const balanceAfter = await usdcAcc0.balanceOf?.(acc0.address)
console.log('Balance after:', balanceAfter)
