import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function ConversationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="max-w-3xl space-y-6">
      <Link href="/inbox" className="text-sm text-muted-foreground hover:text-primary">&larr; Back to Inbox</Link>

      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Sarah Johnson</h2>
          <div className="flex items-center gap-2 mt-1">
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" variant="outline">
              Serious Buyer
            </Badge>
            <span className="text-xs text-muted-foreground">92% confidence</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-mono text-destructive font-semibold">23h 50m remaining</p>
          <p className="text-xs text-muted-foreground">Deadline: Jul 6, 10:32 AM</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Message</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-1">Sarah — 10:32 AM</p>
          <p className="text-sm">Hi, I need a React app for my startup. We're looking for someone who can build an MVP in 3 weeks. Budget is flexible. Are you available?</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Response Timer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-3 bg-muted rounded-full overflow-hidden mb-2">
            <div className="h-full w-1/2 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full" />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>13h 42m remaining out of 24h</span>
            <span>56%</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Draft Reply</CardTitle>
            <Badge variant="outline" className="text-xs">87% confidence</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm whitespace-pre-line">
Hi Sarah, thanks for reaching out! I'd love to help with your React MVP.

I have availability in the next 2 weeks and can deliver a solid MVP within your 3-week timeline. Could you share more about the core features you need?

Looking forward to working with you!

Best,
[Your Name]
          </p>
          <div className="flex gap-2">
            <Button className="flex-1">Approve & Copy</Button>
            <Button variant="outline">Edit Draft</Button>
            <Button variant="ghost">Regenerate</Button>
          </div>
        </CardContent>
      </Card>

      <div className="text-xs text-muted-foreground bg-muted p-3 rounded-lg">
        ⚠️ Auto-replies don't count toward Fiverr's 24-hour response rate. Reply manually to maintain your response score.
      </div>
    </div>
  );
}
