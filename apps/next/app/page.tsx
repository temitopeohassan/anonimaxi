'use client'

import { ConnectButton } from '@/components/connect-button'
import { CreatePost } from '@/components/create-post'
import PostFeed from '@/components/post-feed'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ANON_ADDRESS } from '@anon/utils/src/config'
import { CircleHelp } from 'lucide-react'
import { useAccount, useSignMessage } from 'wagmi'

export default function Home() {
  const { address } = useAccount()
  const { signMessageAsync } = useSignMessage()

  const getSignature = async ({
    address,
    timestamp,
  }: { address: string; timestamp: number }) => {
    try {
      const message = `${address}:${timestamp}`
      const signature = await signMessageAsync({
        message,
      })
      return { signature, message }
    } catch {
      return
    }
  }

  return (
    <div className="flex h-screen w-screen flex-col p-4 max-w-screen-sm mx-auto gap-8">
      <div className="flex items-center justify-between">
        <div className="text-3xl font-bold">Anonimaxi</div>
        <ConnectButton />
      </div>
      <Alert>
        <CircleHelp className="h-4 w-4" />
        <AlertTitle className="font-bold">
          Post anonymously to Farcaster
        </AlertTitle>
        <AlertDescription>
          Posts are made anonymous to Farcaster. Currently, you can only post 5 posts per day.
        </AlertDescription>
        <div className="mt-4 flex flex-row gap-2 justify-end">
          <a
            href="https://warpcast.com/anonimaxi"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 font-semibold"
          >
            Farcaster
          </a>
        </div>
      </Alert>
      {address && (
        <CreatePost
          tokenAddress={ANON_ADDRESS}
          userAddress={address}
          getSignature={getSignature}
        />
      )}
      <PostFeed tokenAddress={ANON_ADDRESS} userAddress={address} />
    </div>
  )
}
