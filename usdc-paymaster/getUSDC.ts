import { Contract, formatUnits, Interface, JsonRpcProvider } from 'ethers'
import usdcAbi from './abis/usdc.json'

const account0 = process.env.acc0 as string
const clientUrl = process.env.local as string

const client = new JsonRpcProvider(clientUrl)

const tokenOwnerAddress = '0x6ed0c4addc308bb800096b8daa41de5ae219cd36'

await client.send('anvil_impersonateAccount', [tokenOwnerAddress])
const tokenOwner = await client.getSigner(tokenOwnerAddress)

const usdc = new Contract('0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d', new Interface(usdcAbi), tokenOwner)

const balanceBefore = await usdc.balanceOf?.(account0)
console.log('balanceBefore', formatUnits(balanceBefore, 6))

const tx = await usdc.transfer?.(account0, 1000 * 10 ** 6)
const receipt = await tx?.wait()
console.log(receipt?.status === 1 ? 'success' : 'failed')

await client.send('anvil_stopImpersonatingAccount', [tokenOwnerAddress])

const balance = await usdc.balanceOf?.(account0)
console.log('balance', formatUnits(balance, 6))
