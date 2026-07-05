"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "◻" },
  { href: "/gigs", label: "Gigs", icon: "⚡" },
  { href: "/keywords", label: "Keywords", icon: "#" },
  { href: "/inbox", label: "Inbox", icon: "✉" },
  { href: "/templates", label: "Templates", icon: "📄" },
  { href: "/settings", label: "Settings", icon: "⚙" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-60 lg:w-72 flex-col border-r bg-sidebar">
      <div className="p-4 md:p-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
            FG
          </div>
          <span className="font-semibold">Fiverr Copilot</span>
        </Link>
      </div>
      <Separator />
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                active
                  ? "bg-secondary text-secondary-foreground font-medium"
                  : "hover:bg-muted text-foreground font-normal"
              )}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <Separator />
      <div className="p-4">
        <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
          <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
            H
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Hassan</p>
            <p className="text-xs text-muted-foreground truncate">Free plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
