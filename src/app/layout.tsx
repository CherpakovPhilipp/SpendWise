import type { Metadata } from "next";
import Link from "next/link";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { SpendWiseLogo } from "@/components/icons";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { SidebarFooterNav } from "@/components/layout/sidebar-footer-nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "SpendWise",
  description: "A budgeting and expense tracking app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <SidebarProvider>
          <Sidebar>
            <SidebarHeader>
              <Link href="/" className="flex items-center gap-2">
                <SpendWiseLogo className="w-6 h-6 text-primary" />
                <span className="font-semibold text-lg">SpendWise</span>
              </Link>
            </SidebarHeader>
            <SidebarContent>
              <SidebarNav />
            </SidebarContent>
            <SidebarFooter>
              <SidebarFooterNav />
            </SidebarFooter>
          </Sidebar>
          <SidebarInset>
            {children}
          </SidebarInset>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
