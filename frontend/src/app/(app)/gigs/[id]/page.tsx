import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default async function GigDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/gigs" className="text-sm text-muted-foreground hover:text-primary">&larr; Back to Gigs</Link>
          <h2 className="text-2xl font-semibold mt-1">React Developer for Web Apps</h2>
        </div>
        <div className="flex gap-2">
          <Link href={`/gigs/${id}/audit`} className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 text-sm hover:bg-muted transition-colors">
            Audit
          </Link>
          <Button>Publish to Fiverr</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-600">72</p>
            <p className="text-xs text-muted-foreground">Needs improvement</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary">Draft</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Packages</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">3/3</p>
            <p className="text-xs text-muted-foreground">All tiers active</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground whitespace-pre-line">
            I specialize in React development. With years of experience delivering high-quality web applications, I ensure your project is completed on time and exceeds expectations.
            
            My process: Discovery, Development, Delivery.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Tags</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {["react", "nextjs", "web development", "frontend", "typescript"].map((tag) => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Packages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { tier: "Basic", price: "$30", delivery: "3 days", features: ["Single page", "Responsive design"] },
            { tier: "Standard", price: "$60", delivery: "5 days", features: ["Up to 5 pages", "API integration", "Admin panel"] },
            { tier: "Premium", price: "$120", delivery: "10 days", features: ["Full-stack", "Database design", "Deployment", "30 days support"] },
          ].map((pkg, i) => (
            <div key={i} className="rounded-lg border p-4">
              <div className="flex items-center justify-between mb-2">
                <Badge>{pkg.tier}</Badge>
                <span className="text-lg font-bold">{pkg.price}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{pkg.delivery}</p>
              <ul className="space-y-1">
                {pkg.features.map((f, j) => (
                  <li key={j} className="text-sm flex items-center gap-2">
                    <span className="text-green-500">✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
