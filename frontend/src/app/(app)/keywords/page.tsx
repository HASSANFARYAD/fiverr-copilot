"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const keywords = {
  primary: [
    { keyword: "React developer", score: 94 },
    { keyword: "frontend developer", score: 88 },
  ],
  secondary: [
    { keyword: "web application developer", score: 78 },
    { keyword: "UI developer", score: 71 },
    { keyword: "TypeScript expert", score: 65 },
  ],
  longTail: [
    { keyword: "React developer for startups", score: 62 },
    { keyword: "frontend developer remote", score: 55 },
    { keyword: "Next.js web app developer", score: 48 },
  ],
};

export default function KeywordsPage() {
  const [selected, setSelected] = useState<string[]>(["React developer", "frontend developer", "web application developer"]);

  const toggle = (kw: string) => {
    setSelected((s) => s.includes(kw) ? s.filter((k) => k !== kw) : [...s, kw]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Keyword Planner</h2>
          <p className="text-sm text-muted-foreground">Discover the best keywords for your gig</p>
        </div>
        <Button>Save to Gig</Button>
      </div>

      <div className="flex items-center gap-2">
        <Input placeholder="Search keywords..." className="max-w-sm" />
        <Button variant="outline">Refresh</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Primary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {keywords.primary.map((kw) => (
              <div
                key={kw.keyword}
                className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                  selected.includes(kw.keyword) ? "bg-primary/10 border border-primary/30" : "bg-muted/50 hover:bg-muted"
                }`}
                onClick={() => toggle(kw.keyword)}
              >
                <div className="flex items-center gap-2">
                  {selected.includes(kw.keyword) && <span className="text-primary">★</span>}
                  <span className="text-sm font-medium">{kw.keyword}</span>
                </div>
                <Badge variant="outline" className="text-xs">{kw.score}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Secondary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {keywords.secondary.map((kw) => (
              <div
                key={kw.keyword}
                className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                  selected.includes(kw.keyword) ? "bg-primary/10 border border-primary/30" : "bg-muted/50 hover:bg-muted"
                }`}
                onClick={() => toggle(kw.keyword)}
              >
                <div className="flex items-center gap-2">
                  {selected.includes(kw.keyword) && <span className="text-primary">★</span>}
                  <span className="text-sm">{kw.keyword}</span>
                </div>
                <Badge variant="outline" className="text-xs">{kw.score}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Long-tail</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {keywords.longTail.map((kw) => (
              <div
                key={kw.keyword}
                className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                  selected.includes(kw.keyword) ? "bg-primary/10 border border-primary/30" : "bg-muted/50 hover:bg-muted"
                }`}
                onClick={() => toggle(kw.keyword)}
              >
                <div className="flex items-center gap-2">
                  {selected.includes(kw.keyword) && <span className="text-primary">★</span>}
                  <span className="text-sm">{kw.keyword}</span>
                </div>
                <Badge variant="outline" className="text-xs">{kw.score}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Selected Tags</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {selected.map((kw) => (
            <Badge key={kw} variant="secondary" className="cursor-pointer" onClick={() => toggle(kw)}>
              {kw} ✕
            </Badge>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
