import { ethers } from 'ethers'

// Replace with your RPC URL
export const RPC_URL = 'https://base-sepolia.g.alchemy.com/v2/g7UHrvWmvajJwQTwR68loAroNVh4IUnG'

export const client = new ethers.JsonRpcProvider(RPC_URL)
export const chainId = 84532 // base sepolia

// USDC contract on Base
export const USDC_ADDRESS = '0x036CbD53842c5426634e7929541eC2318f3dCF7e'
export const USDC_PAYMASTER_ADDRESS = '0x31BE08D380A21fc740883c0BC434FcFc88740b58'

export const usdc = new ethers.Contract(USDC_ADDRESS, ['function balanceOf(address) view returns (uint256)'], client)
export const BUNDLER_URL = `https://public.pimlico.io/v2/${chainId.toString()}/rpc`

export interface PermitData {
	provider: ethers.Provider
	tokenAddress: string
	chainId: number
	ownerAddress: string
	spenderAddress: string
	amount: bigint
}

export async function getPermitData({
	provider,
	tokenAddress,
	chainId,
	ownerAddress,
	spenderAddress,
	amount,
}: PermitData) {
	const token = new ethers.Contract(
		tokenAddress,
		[
			'function nonces(address) view returns (uint256)',
			'function name() view returns (string)',
			'function version() view returns (string)',
		],
		provider,
	)

	const nonce = await token.nonces(ownerAddress)
	const name = await token.name()
	const version = '1'

	const domain = {
		name,
		version,
		chainId,
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

	const values = {
		owner: ownerAddress,
		spender: spenderAddress,
		value: amount,
		nonce,
		deadline: ethers.MaxUint256,
	}

	return [domain, types, values] as const
}
