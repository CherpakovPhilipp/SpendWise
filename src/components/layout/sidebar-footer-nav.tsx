"use client";

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
        <SidebarMenuButton href="#" tooltip="Settings" isActive={pathname === "/settings"}>
          <Settings />
          Settings
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
