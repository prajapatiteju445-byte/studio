'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Phone, PhoneIncoming, PhoneOff } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { cn } from '@/lib/utils';

function FakeCallScreen({ onEndCall }: { onEndCall: () => void }) {
  const [timer, setTimer] = useState(0);
  const [callActive, setCallActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (callActive) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="fixed inset-0 z-[100] bg-gray-800 text-white flex flex-col items-center justify-between p-8">
      <div className="text-center mt-16">
        <h2 className="font-headline text-4xl">Mom</h2>
        <p className="text-lg text-gray-300">
          {callActive ? `Call time: ${formatTime(timer)}` : 'calling...'}
        </p>
      </div>

      <div className="flex flex-col items-center">
        <Avatar className="w-32 h-32 mb-8 ring-4 ring-white/20">
          <AvatarImage
            src="https://picsum.photos/seed/mom/200/200"
            alt="Mom"
            data-ai-hint="woman portrait"
          />
          <AvatarFallback>M</AvatarFallback>
        </Avatar>
      </div>

      <div className="flex w-full justify-around items-center">
        {!callActive ? (
          <>
            <div className="flex flex-col items-center gap-2">
              <Button
                size="icon"
                className="bg-green-500 hover:bg-green-600 rounded-full w-16 h-16"
                onClick={() => setCallActive(true)}
                aria-label="Accept Call"
              >
                <PhoneIncoming className="w-8 h-8" />
              </Button>
              <span className="text-sm">Accept</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Button
                size="icon"
                variant="destructive"
                className="rounded-full w-16 h-16"
                onClick={onEndCall}
                aria-label="Decline Call"
              >
                <PhoneOff className="w-8 h-8" />
              </Button>
              <span className="text-sm">Decline</span>
            </div>
          </>
        ) : (
          <Button
            size="icon"
            variant="destructive"
            className="rounded-full w-20 h-20"
            onClick={onEndCall}
            aria-label="End Call"
          >
            <PhoneOff className="w-10 h-10" />
          </Button>
        )}
      </div>
    </div>
  );
}

export function FakeCallButton() {
  const [isCalling, setIsCalling] = useState(false);

  return (
    <>
      {isCalling && <FakeCallScreen onEndCall={() => setIsCalling(false)} />}
      <Button
        variant="outline"
        onClick={() => setIsCalling(true)}
        className={cn('gap-2 font-semibold')}
      >
        <Phone className="w-4 h-4" />
        <span className="hidden sm:inline">Fake Call</span>
      </Button>
    </>
  );
}
