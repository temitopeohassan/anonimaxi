import { useCreatePost } from './context';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Loader2, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import dynamic from 'next/dynamic';
import { useToast } from "@/hooks/use-toast";
import { usePostCounter } from "@/lib/usePostCounter";

// Dynamically import Confetti to avoid SSR issues
const Confetti = dynamic(() => import('confetti-react'), {
  ssr: false
});

export function CreatePostForm() {
  const { text, setText, state, createPost, userAddress } = useCreatePost();
  const { toast } = useToast();
  const [confetti, setConfetti] = useState(false);
  const { count: dailyPostCount, incrementCount } = usePostCounter(userAddress);
  
  const length = new Blob([text ?? '']).size;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text) return;
    
    const newCount = incrementCount();
    if (newCount > 5) {
      toast({
        title: 'Daily post limit reached',
        description: 'You can only post 5 times per day',
        variant: 'destructive',
      });
      return;
    }

    await createPost();
    toast({
      title: 'Post will be created in 1-2 minutes',
    });
    setConfetti(true);
  };

  const handleSetText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (new Blob([e.target.value]).size > 320) return;
    setText(e.target.value);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          <span className="text-sm text-muted-foreground">
            Daily posts: {dailyPostCount}/5
          </span>
        </div>
        <span className="text-sm text-muted-foreground">
          {`${length} / 320`}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder="What's happening?"
          value={text || ''}
          onChange={handleSetText}
          className={cn(
            "h-32 resize-none",
            "bg-background",
            "text-base leading-relaxed",
            "placeholder:text-muted-foreground",
            "border-2 rounded-xl",
            "hover:border-primary/50 focus:border-primary",
            "transition-all duration-200",
            state.status === 'posting' && "opacity-50 cursor-not-allowed"
          )}
          disabled={state.status === 'posting'}
        />

        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={!text || state.status === 'posting' || dailyPostCount >= 5}
            className="font-bold text-md rounded-xl hover:scale-105 transition-all duration-300"
          >
            {state.status === 'posting' ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Posting...
              </span>
            ) : 'Post'}
          </Button>
        </div>
      </form>

      {confetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          colors={['#0000FF']}
          drawShape={(ctx: CanvasRenderingContext2D) => {
            ctx.beginPath();
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#0000FF';

            ctx.moveTo(-10, 10);
            ctx.lineTo(-10, -10);
            ctx.lineTo(0, 0);
            ctx.lineTo(10, -10);
            ctx.lineTo(10, 10);

            ctx.stroke();
            ctx.closePath();
          }}
          gravity={0.25}
          recycle={false}
          onConfettiComplete={() => setConfetti(false)}
        />
      )}
    </div>
  );
} 