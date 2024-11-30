import { ConnectButton as RainbowConnectButton } from '@rainbow-me/rainbowkit'
import { useBalance } from '@/hooks/use-balance'
import { ANON_ADDRESS } from '@anon/utils/src/config'
import { Button } from '@/components/ui/button'

export const ConnectButton = () => {
  return (
    <RainbowConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading'
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated')
        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    onClick={openConnectModal}
                    className="font-bold text-md rounded-xl hover:scale-105 transition-all duration-300"
                  >
                    Login
                  </Button>
                )
              }
              if (chain.unsupported) {
                return (
                  <Button
                    onClick={openChainModal}
                    className="font-bold text-md rounded-xl hover:scale-105 transition-all duration-300"
                  >
                    Switch Network
                  </Button>
                )
              }
              return (
                <button
                  type="button"
                  onClick={openAccountModal}
                  className="flex flex-row rounded-xl overflow-hidden bg-white items-center hover:scale-105 transition-all duration-300"
                >
                  <Balance address={account.address} />
                  <div className="text-md font-bold bg-gray-200 text-black rounded-xl py-1.5 px-3 m-0.5">
                    {account.displayName}
                  </div>
                </button>
              )
            })()}
          </div>
        )
      }}
    </RainbowConnectButton.Custom>
  )
}

function Balance({ address }: { address: string }) {
  const { data } = useBalance(ANON_ADDRESS, address)
  
  // Check if wallet has at least 1 Moxie Pass token
  const hasMoxiePass = data && data > BigInt(0)

  return (
    <div className="text-md font-bold bg-white text-black pl-3 pr-2">
      {`Moxie Pass: ${hasMoxiePass ? 'Yes' : 'No'}`}
    </div>
  )
}