import { Interface, JsonRpcProvider } from 'ethers'
import { Contract } from 'ethers'
import usdcAbi from './abis/usdc.json'
import { Wallet } from 'ethers'
import { MaxUint256 } from 'ethers'
import type { TypedDataDomain, TypedDataField } from 'ethers'

export const USDC_ADDRESS = '0x036CbD53842c5426634e7929541eC2318f3dCF7e'
export const USDC_PAYMASTER_ADDRESS = '0x31BE08D380A21fc740883c0BC434FcFc88740b58'
export const BUNDLER_URL = 'https://api.pimlico.io/v2/84532/rpc?apikey=pim_D3FG1UPaiDo7ezfVR3bACV'
export const client = new JsonRpcProvider(process.env.baseSepolia as string)
export const usdc = new Contract(USDC_ADDRESS, new Interface(usdcAbi), client)
export const acc0 = new Wallet(process.env.acc0pk as string, client)
export const acc1 = new Wallet(process.env.acc1pk as string, client)
export const dev = new Wallet(process.env.PRIVATE_KEY as string, client)

const network = await client.getNetwork()
export const chainId = network.chainId

export async function getPermitData({
	provider,
	tokenAddress,
	chainId,
	ownerAddress,
	spenderAddress,
	amount,
}: {
	provider: JsonRpcProvider
	tokenAddress: string
	chainId: bigint
	ownerAddress: string
	spenderAddress: string
	amount: bigint
}): Promise<[TypedDataDomain, Record<string, Array<TypedDataField>>, Record<string, any>]> {
	const token = new Contract(
		tokenAddress,
		new Interface([
			'function name() view returns (string)',
			'function version() view returns (string)',
			'function nonces(address owner) view returns (uint256)',
		]),
		provider,
	)

	const domain: TypedDataDomain = {
		name: await token.getFunction('name')(),
		version: await token.getFunction('version')(),
		chainId: chainId,
		verifyingContract: tokenAddress,
	}

	const types = {
		Permit: [
			{ name: 'owner', type: 'address' },
			{ name: 'spender', type: 'address' },
			{ name: 'value', type: 'uint256' },
			{ name: 'nonce', type: 'uint256' },
			{ name: 'deadline', type: 'uint256' },
		],
	}

	const value = {
		owner: ownerAddress,
		spender: spenderAddress,
		value: amount,
		nonce: await token.getFunction('nonces')(ownerAddress),
		deadline: MaxUint256,
	}

	return [domain, types, value]
}
