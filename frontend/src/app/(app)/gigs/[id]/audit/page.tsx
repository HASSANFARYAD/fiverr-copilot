import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const checklist = [
  { label: "Title contains primary keyword", done: true },
  { label: "Description has intro section", done: true },
  { label: "Description includes proof / portfolio link", done: true },
  { label: "Process section present", done: false },
  { label: "CTA present in conclusion", done: true },
  { label: "All 3 package tiers active", done: false },
  { label: "All 5 tags filled", done: true },
  { label: "FAQs generated", done: false },
];

export default async function GigAuditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const score = Math.round((checklist.filter((c) => c.done).length / checklist.length) * 100);

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Gig Audit</h2>
        <p className="text-sm text-muted-foreground">React Developer for Web Apps</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Score</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <div className="size-20 rounded-full border-4 border-yellow-400 flex items-center justify-center">
            <span className="text-2xl font-bold text-yellow-600">{score}</span>
          </div>
          <div>
            <p className="font-medium">{score >= 80 ? "Great shape" : score >= 50 ? "Needs improvement" : "Needs work"}</p>
            <p className="text-sm text-muted-foreground">{checklist.filter((c) => c.done).length} of {checklist.length} items complete</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Checklist</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {checklist.map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`text-lg ${item.done ? "text-green-500" : "text-destructive"}`}>
                  {item.done ? "✓" : "✗"}
                </span>
                <span className="text-sm">{item.label}</span>
              </div>
              {!item.done && (
                <Button variant="outline" size="sm">Add</Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline">Regenerate Draft</Button>
        <Button>Publish to Fiverr</Button>
      </div>
    </div>
  );
}
