"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";

const conversations = [
  { id: "1", name: "Sarah Johnson", message: "Hi, I need a React app for my startup...", time: "2m ago", intent: "serious" as const, deadline: "23h 50m" },
  { id: "2", name: "Mike Chen", message: "What are your rates for a full website?", time: "1h ago", intent: "pricing" as const, deadline: "22h 15m" },
  { id: "3", name: "Jenny Park", message: "Hey, are you available for work?", time: "3h ago", intent: "unclear" as const, deadline: "20h 10m" },
  { id: "4", name: "Alex Rivera", message: "I need someone who can...", time: "8h ago", intent: "low-fit" as const, deadline: "15h 40m" },
  { id: "5", name: "Spam Bot", message: "Buy followers cheap!!!", time: "12h ago", intent: "spam" as const, deadline: "-" },
];

const intentStyles = {
  serious: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  pricing: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  unclear: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  "low-fit": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  spam: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400",
};

const filterTabs = ["All", "Serious", "Pricing", "Unclear", "Low-fit"];

export default function InboxPage() {
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState("1");

  const filtered = filter === "All"
    ? conversations
    : conversations.filter((c) => c.intent === filter.toLowerCase());

  return (
    <div className="grid gap-0 lg:grid-cols-2 border rounded-lg overflow-hidden min-h-[600px]">
      <div className="border-r flex flex-col">
        <div className="p-3 border-b">
          <Input placeholder="Search conversations..." className="h-9" />
        </div>
        <div className="flex gap-1 px-3 py-2 border-b overflow-x-auto">
          {filterTabs.map((tab) => (
            <Button
              key={tab}
              variant={filter === tab ? "secondary" : "ghost"}
              size="sm"
              className="h-7 text-xs"
              onClick={() => setFilter(tab)}
            >
              {tab}
            </Button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto divide-y">
          {filtered.map((conv) => (
            <div
              key={conv.id}
              className={cn(
                "p-3 cursor-pointer transition-colors hover:bg-muted/50",
                selected === conv.id && "bg-muted"
              )}
              onClick={() => setSelected(conv.id)}
            >
              <div className="flex items-start justify-between mb-1">
                <span className="font-medium text-sm">{conv.name}</span>
                <span className="text-xs text-muted-foreground">{conv.time}</span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-1 mb-1">{conv.message}</p>
              <div className="flex items-center gap-2">
                <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-medium", intentStyles[conv.intent])}>
                  {conv.intent}
                </span>
                {conv.deadline !== "-" && (
                  <span className="text-[10px] text-muted-foreground font-mono">⏰ {conv.deadline}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col">
        {selected && (
          <>
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{conversations.find((c) => c.id === selected)?.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      Serious Buyer
                    </Badge>
                    <span className="text-xs text-muted-foreground">92% confidence</span>
                  </div>
                </div>
                <span className="text-sm font-mono text-destructive">⏰ 23h 50m</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg bg-muted p-3">
                  <p className="text-xs text-muted-foreground mb-1">Sarah — 10:32 AM</p>
                  <p className="text-sm">Hi, I need a React app for my startup. We're looking for someone who can build an MVP in 3 weeks. Budget is flexible. Are you available?</p>
                </div>
              </div>
            </div>

            <div className="p-4 border-t space-y-3">
              <div className="rounded-lg border p-3 bg-muted/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium">Draft Reply</span>
                  <Badge variant="outline" className="text-xs">87% confidence</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Hi Sarah, thanks for reaching out! I'd love to help with your React MVP. I have availability in the next 2 weeks. Could you share more about the core features you need?
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="flex-1">Approve & Copy</Button>
                <Button size="sm" variant="outline">Edit Draft</Button>
                <Button size="sm" variant="ghost">Regen</Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
