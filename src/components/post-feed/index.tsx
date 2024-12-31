import { useAccount } from 'wagmi';

interface PostFeedProps {
  tokenAddress: string;
  userAddress?: string;
}

export default function PostFeed({ tokenAddress, userAddress }: PostFeedProps) {
  if (!userAddress) return null;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-center text-gray-500"></p>
    </div>
  );
} 