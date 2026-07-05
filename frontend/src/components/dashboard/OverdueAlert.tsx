"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const overdue = [
  { name: "Alex Rivera", time: "26h ago" },
  { name: "Jenny Park", time: "25h ago" },
];

export function OverdueAlert() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-destructive">Overdue Replies</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {overdue.length === 0 && (
          <p className="text-sm text-muted-foreground">No overdue replies</p>
        )}
        {overdue.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-destructive" />
              <span className="text-sm font-medium">{item.name}</span>
            </div>
            <span className="text-xs text-destructive font-mono">{item.time}</span>
          </div>
        ))}
        <Link href="/inbox" className="block text-xs text-primary font-medium pt-1">
          Review overdue →
        </Link>
      </CardContent>
    </Card>
  );
}
