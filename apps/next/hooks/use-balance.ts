import { erc20Abi } from 'viem'
import { useReadContract } from 'wagmi'

export function useBalance(tokenAddress: string, userAddress?: string) {
  return useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: userAddress ? [userAddress as `0x${string}`] : undefined,
  })
}
