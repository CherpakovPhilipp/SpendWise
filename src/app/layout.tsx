
import type { Metadata } from "next";
import Link from "next/link";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
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
            <div className="flex min-h-screen w-full bg-background">
              <Sidebar>
                <SidebarHeader className="p-2 flex-shrink-0">
                  <div className="flex w-full items-center justify-between">
                      <Link href="/" className="flex items-center gap-2">
                          <SpendWiseLogo className="w-6 h-6 text-primary" />
                          <span className="font-semibold text-lg group-data-[state=collapsed]/sidebar:hidden">SpendWise</span>
                      </Link>
                  </div>
                  <div className="flex justify-center pt-2 group-data-[state=collapsed]/sidebar:hidden">
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
              <div className="flex flex-1 flex-col">
                <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-inherit px-4 md:hidden">
                    <Link href="/" className="flex items-center gap-2 font-semibold">
                        <SpendWiseLogo className="h-6 w-6 text-primary" />
                        <span className="text-lg font-semibold">SpendWise</span>
                    </Link>
                    <SidebarTrigger />
                </header>
                <main className="flex-1">
                  {children}
                </main>
              </div>
            </div>
          </SidebarProvider>
        </AppProvider>
        <Toaster />
      </body>
    </html>
  );
}
