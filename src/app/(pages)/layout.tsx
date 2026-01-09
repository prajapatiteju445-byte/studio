import { AppHeader } from '@/components/layout/app-header';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { PanicButton } from '@/components/layout/panic-button';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <div className="p-4 md:p-8">{children}</div>
      </SidebarInset>
      <PanicButton />
    </SidebarProvider>
  );
}
