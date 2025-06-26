"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings } from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export function SidebarFooterNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Link href="/settings" legacyBehavior passHref>
          <SidebarMenuButton
            asChild
            tooltip="Settings"
            isActive={pathname === "/settings"}
          >
            <a>
              <Settings />
              <span>Settings</span>
            </a>
          </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
