export const ANON_ADDRESS = '0x235CAD50d8a510Bc9081279996f01877827142D8'
export const COMMENT_ADDRESS = '0x0000000000000000000000000000000000000000'

export const TOKEN_CONFIG: Record<
  string,
  {
    ticker: string
    postAmount: string
    promoteAmount: string
    deleteAmount: string
    farcasterUsername: string
    fid: number
  }
> = {
  [ANON_ADDRESS]: {
    ticker: 'MOXIE',
    postAmount: '1',
    promoteAmount: '1',
    deleteAmount: '1',
    farcasterUsername: 'anonimaxi',
    fid: 891080,
  },
  [COMMENT_ADDRESS]: {
    ticker: 'COMMENT',
    postAmount: '1',
    promoteAmount: '1',
    deleteAmount: '1',
    farcasterUsername: 'comment',
    fid: 891080,
  },
}

export const USERNAME_TO_ADDRESS: Record<string, string> = Object.entries(
  TOKEN_CONFIG
).reduce(
  (acc, [address, { farcasterUsername }]) => {
    acc[farcasterUsername] = address
    return acc
  },
  {} as Record<string, string>
)
