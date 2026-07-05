"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { Button } from "@/components/ui/button";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const getTitle = () => {
    if (pathname.startsWith("/dashboard")) return "Dashboard";
    if (pathname.startsWith("/gigs/new")) return "New Gig";
    if (pathname.startsWith("/gigs")) return "Gigs";
    if (pathname.startsWith("/keywords")) return "Keywords";
    if (pathname.startsWith("/inbox")) return "Inbox";
    if (pathname.startsWith("/templates")) return "Templates";
    if (pathname.startsWith("/settings")) return "Settings";
    return "Fiverr Copilot";
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col pb-16 md:pb-0">
        <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center justify-between h-14 px-4 md:px-6">
            <h1 className="text-lg font-semibold md:text-xl">{getTitle()}</h1>
            <div className="flex items-center gap-2">
              <Link href="https://fiverr.com" target="_blank" className="hidden md:inline-flex h-7 items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 text-sm hover:bg-muted transition-colors">
                Fiverr
              </Link>
              <Button variant="ghost" size="icon" className="size-9">
                <span>🔔</span>
              </Button>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
