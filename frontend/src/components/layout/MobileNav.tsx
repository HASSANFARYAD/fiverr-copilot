"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const mobileItems = [
  { href: "/dashboard", label: "Home", icon: "◻" },
  { href: "/gigs", label: "Gigs", icon: "⚡" },
  { href: "/inbox", label: "Inbox", icon: "✉" },
  { href: "/templates", label: "Templates", icon: "📄" },
  { href: "/settings", label: "Settings", icon: "⚙" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t bg-background">
      <div className="flex items-center justify-around h-14">
        {mobileItems.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1 text-xs",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
