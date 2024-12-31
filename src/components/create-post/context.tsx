import { createContext, useContext, useState, ReactNode } from 'react';

type State = {
  status: 'idle' | 'posting' | 'done' | 'error';
  error?: string;
};

interface CreatePostContextProps {
  text: string | null;
  setText: (text: string) => void;
  userAddress: string;
  createPost: () => Promise<void>;
  state: State;
}

const CreatePostContext = createContext<CreatePostContextProps | undefined>(undefined);

interface CreatePostProviderProps {
  children: ReactNode;
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

export function CreatePostProvider({
  children,
  userAddress,
}: CreatePostProviderProps) {
  const [text, setText] = useState<string | null>(null);
  const [state, setState] = useState<State>({ status: 'idle' });

  const createPost = async () => {
    if (!text) return;

    setState({ status: 'posting' });
    try {
      const response = await fetch('/api/cast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      setState({ status: 'done' });
      setText('');
      
      setTimeout(() => {
        setState({ status: 'idle' });
      }, 2000);

    } catch (error) {
      setState({ 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Failed to create post' 
      });
      setTimeout(() => {
        setState({ status: 'idle' });
      }, 3000);
    }
  };

  return (
    <CreatePostContext.Provider
      value={{
        text,
        setText,
        state,
        createPost,
        userAddress,
      }}
    >
      {children}
    </CreatePostContext.Provider>
  );
}

export function useCreatePost() {
  const context = useContext(CreatePostContext);
  if (context === undefined) {
    throw new Error('useCreatePost must be used within a CreatePostProvider');
  }
  return context;
} 