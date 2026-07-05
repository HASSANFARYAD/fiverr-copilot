"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const scoreColors = (score: number) => {
  if (score >= 80) return { stroke: "stroke-green-500", text: "text-green-600", label: "Great shape" };
  if (score >= 50) return { stroke: "stroke-yellow-500", text: "text-yellow-600", label: "Needs work" };
  return { stroke: "stroke-red-500", text: "text-red-600", label: "Needs improvement" };
};

export function GigScoreCard({ score = 72 }: { score?: number }) {
  const colors = scoreColors(score);
  const r = 36;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Gig Score</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-1">
        <div className="relative size-24">
          <svg className="size-24 -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r={r} fill="none" stroke="currentColor" className="text-muted stroke-[5]" />
            <circle
              cx="40" cy="40" r={r}
              fill="none"
              className={`stroke-[5] ${colors.stroke}`}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-2xl font-bold ${colors.text}`}>{score}</span>
          </div>
        </div>
        <span className="text-xs text-muted-foreground">{colors.label}</span>
      </CardContent>
    </Card>
  );
}
