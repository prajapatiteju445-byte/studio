'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { FakeCallButton } from '@/components/features/fake-call';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-8">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <h1 className="font-headline text-xl md:text-2xl text-primary">SafeHer</h1>
      <div className="ml-auto">
        <FakeCallButton />
      </div>
    </header>
  );
}
