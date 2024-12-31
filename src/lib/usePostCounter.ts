import { useEffect, useState } from 'react';

interface PostCount {
  count: number;
  lastReset: number;
}

export function usePostCounter(walletAddress: string) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const loadCount = () => {
      const stored = localStorage.getItem(`post_count_${walletAddress}`);
      if (!stored) return;

      const data: PostCount = JSON.parse(stored);
      const now = Date.now();
      const hoursSinceReset = (now - data.lastReset) / (1000 * 60 * 60);

      if (hoursSinceReset >= 24) {
        // Reset if 24 hours have passed
        setCount(0);
        localStorage.setItem(
          `post_count_${walletAddress}`,
          JSON.stringify({ count: 0, lastReset: now })
        );
      } else {
        setCount(data.count);
      }
    };

    loadCount();
  }, [walletAddress]);

  const incrementCount = () => {
    const newCount = count + 1;
    setCount(newCount);
    localStorage.setItem(
      `post_count_${walletAddress}`,
      JSON.stringify({ count: newCount, lastReset: Date.now() })
    );
    return newCount;
  };

  return { count, incrementCount };
} 