import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const gigs = [
  { id: "1", title: "React Developer for Web Apps", niche: "Web Development", score: 72, status: "draft" as const, keywords: 5, packages: 3 },
  { id: "2", title: "Next.js Full-Stack Developer", niche: "Web Development", score: 88, status: "complete" as const, keywords: 5, packages: 3 },
  { id: "3", title: "UI/UX Designer for Mobile Apps", niche: "Design", score: 45, status: "draft" as const, keywords: 3, packages: 2 },
];

export default function GigsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{gigs.length} gig drafts</p>
        <Link href="/gigs/new" className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-2.5 text-sm font-medium hover:bg-primary/80 transition-colors">
          + New Gig
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {gigs.map((gig) => (
          <Link key={gig.id} href={`/gigs/${gig.id}`}>
            <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">{gig.title}</CardTitle>
                  <Badge variant={gig.status === "complete" ? "default" : "secondary"}>
                    {gig.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Niche</span>
                    <span>{gig.niche}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Score</span>
                    <span className={`font-mono font-medium ${gig.score >= 80 ? "text-green-600" : gig.score >= 50 ? "text-yellow-600" : "text-red-600"}`}>
                      {gig.score}/100
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Keywords</span>
                    <span>{gig.keywords}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Packages</span>
                    <span>{gig.packages}/3</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
