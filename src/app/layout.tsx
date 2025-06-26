
import type { Metadata } from "next";
import Link from "next/link";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { SpendWiseLogo } from "@/components/icons";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { SidebarFooterNav } from "@/components/layout/sidebar-footer-nav";
import { AppProvider } from "@/context/AppProvider";
import { ModeSwitcher } from "@/components/layout/mode-switcher";
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
        <AppProvider>
          <SidebarProvider>
            <Sidebar>
              <SidebarHeader className="p-2">
                <div className="flex w-full items-center group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:gap-4">
                    <Link href="/" className="flex items-center gap-2 mr-auto group-data-[collapsible=icon]:mr-0">
                        <SpendWiseLogo className="w-6 h-6 text-primary" />
                        <span className="font-semibold text-lg group-data-[collapsible=icon]:hidden">SpendWise</span>
                    </Link>
                    <SidebarTrigger className="hidden md:block" />
                </div>
                <div className="flex justify-center pt-2 group-data-[collapsible=icon]:hidden">
                    <ModeSwitcher />
                </div>
              </SidebarHeader>
              <SidebarContent>
                <SidebarNav />
              </SidebarContent>
              <SidebarFooter>
                <SidebarFooterNav />
              </SidebarFooter>
            </Sidebar>
            <SidebarInset>
              <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background px-4 md:hidden">
                <Link href="/" className="flex items-center gap-2 font-semibold">
                  <SpendWiseLogo className="h-6 w-6 text-primary" />
                  <span className="text-lg font-semibold">SpendWise</span>
                </Link>
                <SidebarTrigger />
              </header>
              {children}
            </SidebarInset>
          </SidebarProvider>
        </AppProvider>
        <Toaster />
      </body>
    </html>
  );
}
