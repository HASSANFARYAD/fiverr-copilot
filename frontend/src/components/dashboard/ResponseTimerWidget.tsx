"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const conversations = [
  { name: "Sarah Johnson", deadline: "2h 14m", status: "urgent" as const, href: "/inbox/1" },
  { name: "Mike Chen", deadline: "4h 30m", status: "normal" as const, href: "/inbox/2" },
  { name: "Jenny Park", deadline: "8h 10m", status: "normal" as const, href: "/inbox/3" },
];

export function ResponseTimerWidget() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Response Deadlines</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {conversations.length === 0 && (
          <p className="text-sm text-muted-foreground">No active conversations</p>
        )}
        {conversations.map((conv) => (
          <Link key={conv.name} href={conv.href} className="flex items-center justify-between group">
            <span className="text-sm font-medium group-hover:text-primary transition-colors">{conv.name}</span>
            <span className={`text-xs font-mono tabular-nums ${conv.status === "urgent" ? "text-destructive font-semibold" : "text-muted-foreground"}`}>
              {conv.deadline}
            </span>
          </Link>
        ))}
        <Link href="/inbox" className="block text-xs text-primary font-medium pt-1">
          View all conversations →
        </Link>
      </CardContent>
    </Card>
  );
}
