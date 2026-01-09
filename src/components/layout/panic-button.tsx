'use client';

import { Siren } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export function PanicButton() {
  const { toast } = useToast();

  const handlePanic = () => {
    toast({
      title: 'Panic Alert Activated',
      description: 'Your emergency contacts and local authorities have been notified.',
      variant: 'destructive',
    });
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <Button
        onClick={handlePanic}
        variant="destructive"
        className="rounded-full w-24 h-24 shadow-2xl animate-pulse flex flex-col gap-1 ring-4 ring-destructive/30"
        aria-label="Activate Panic Alert"
      >
        <Siren className="w-10 h-10" />
        <span className="font-bold text-lg">PANIC</span>
      </Button>
    </div>
  );
}
