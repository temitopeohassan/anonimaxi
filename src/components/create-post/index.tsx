import { CreatePostProvider } from './context';
import { CreatePostForm } from './form';
import { useContractRead } from 'wagmi';
import { erc20Abi } from 'viem';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { ExternalLink } from 'lucide-react';

interface CreatePostProps {
  tokenAddress: string;
  userAddress: string;
  getSignature: ({
    address,
    timestamp,
  }: {
    address: string;
    timestamp: number;
  }) => Promise<{ signature: string; message: string } | undefined>;
}

export function CreatePost({ tokenAddress, userAddress, getSignature }: CreatePostProps) {
  const { data: balance } = useContractRead({
    address: tokenAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [userAddress as `0x${string}`],
    account: userAddress as `0x${string}`,
  });

  const hasMoxiePass = balance ? Number(balance.toString()) > 0 : false;

  if (!hasMoxiePass) {
    return (
      <Alert className="bg-background border-2">
        <AlertTitle className="font-bold">Moxie Pass Required</AlertTitle>
        <AlertDescription className="mt-2">
          <p>You need to own a Moxie Pass to post anonymously.</p>
          <a 
            href="https://moxie.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-primary hover:underline mt-2"
          >
            Get your Moxie Pass <ExternalLink className="h-4 w-4" />
          </a>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <CreatePostProvider
      tokenAddress={tokenAddress}
      userAddress={userAddress}
      getSignature={getSignature}
    >
      <CreatePostForm />
    </CreatePostProvider>
  );
} 