"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const activities = [
  { icon: "⚡", text: "Web dev gig draft generated", time: "2 min ago" },
  { icon: "✉", text: "New message from Alex — serious buyer", time: "15 min ago" },
  { icon: "⏰", text: "Response deadline for Sarah — 3h remaining", time: "1h ago" },
  { icon: "📊", text: "Gig score updated: 72/100", time: "2h ago" },
  { icon: "✓", text: "Keyword suggestions saved for React gig", time: "4h ago" },
];

export function ActivityFeed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-base mt-0.5">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm">{item.text}</p>
                <p className="text-xs text-muted-foreground">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
