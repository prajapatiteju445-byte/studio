'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HeartPulse,
  LayoutGrid,
  MapPin,
  Settings,
  Shield,
  Users,
} from 'lucide-react';

import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { href: '/community', label: 'Community', icon: MapPin },
  { href: '/contacts', label: 'Contacts', icon: Users },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          <div className="bg-sidebar-primary text-sidebar-primary-foreground p-2 rounded-lg">
            <Shield className="size-6" />
          </div>
          <span className="font-headline text-lg font-semibold text-sidebar-primary">
            SafeHer
          </span>
        </div>
      </SidebarHeader>
      <SidebarMenu>
        {menuItems.map(({ href, label, icon: Icon }) => (
          <SidebarMenuItem key={href}>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith(href)}
              tooltip={label}
            >
              <Link href={href}>
                <Icon />
                <span>{label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </Sidebar>
  );
}
