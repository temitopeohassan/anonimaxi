"use client";

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useSignMessage } from 'wagmi';
import styles from "./page.module.css";
import { CreatePost } from '@/components/create-post';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CircleHelp } from 'lucide-react';
import { MOXIE_ADDRESS } from '../constants/index';
import PostFeed from '@/components/post-feed';

export default function Home() {
  const { isConnected, address } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const getSignature = async ({
    address,
    timestamp,
  }: { address: string; timestamp: number }) => {
    try {
      const message = `${address}:${timestamp}`;
      const signature = await signMessageAsync({
        message,
      });
      return { signature, message };
    } catch {
      return;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>Anonimaxi</div>
        <ConnectButton />
      </div>

      {!isConnected ? (
        <div className={styles.content}>
          <p className={styles.connectMessage}>
            You need to connect your wallet to continue
          </p>
          <ul className={styles.requirementsList}>
            <li>Connect your wallet to access the application</li>
            <li>Post anonymously on Farcaster</li>
          </ul>
        </div>
      ) : (
        <>
          <Alert>
            <CircleHelp className="h-4 w-4" />
            <AlertTitle className="font-bold">
              Post anonymously to Farcaster
            </AlertTitle>
            <AlertDescription>
              Posts are made anonymous to Farcaster. Currently, you can only post 5 posts per day.<br />
              <b>Requirements:</b>
              <ul>
                <li>
                  - <b>1 Moxie Token</b>: Post on Farcaster
                </li>
                <li>
                  - <b>To post more than 5 posts</b>: Coming Soon
                </li>
              </ul>
            </AlertDescription>
          </Alert>
          {address && (
            <CreatePost
              tokenAddress={MOXIE_ADDRESS}
              userAddress={address}
              getSignature={getSignature}
            />
          )}
          <PostFeed tokenAddress={MOXIE_ADDRESS} userAddress={address} />
        </>
      )}
    </div>
  );
}
