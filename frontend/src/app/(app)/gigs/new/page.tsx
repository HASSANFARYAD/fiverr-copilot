"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

type DraftSection = "title" | "description" | "tags" | "packages" | "faq";

export default function NewGigPage() {
  const [service, setService] = useState("");
  const [keywords, setKeywords] = useState("");
  const [tone, setTone] = useState("professional");
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState<Record<DraftSection, number>>({
    title: 0, description: 0, tags: 0, packages: 0, faq: 0,
  });
  const [generated, setGenerated] = useState(false);
  const [draft, setDraft] = useState<{
    titles: string[];
    description: string;
    tags: string[];
    packages: { tier: string; price: string; delivery: string; features: string[] }[];
    faqs: { q: string; a: string }[];
  } | null>(null);

  const tones = [
    { value: "professional", label: "Professional" },
    { value: "friendly", label: "Friendly" },
    { value: "persuasive", label: "Persuasive" },
    { value: "technical", label: "Technical" },
  ];

  const handleGenerate = async () => {
    if (!service.trim()) return;
    setGenerating(true);
    setGenerated(false);

    const sections: DraftSection[] = ["title", "description", "tags", "packages", "faq"];
    for (const section of sections) {
      await new Promise((r) => setTimeout(r, 400));
      setProgress((p) => ({ ...p, [section]: 100 }));
    }

    setDraft({
      titles: [
        `I will build a ${service} for your business`,
        `Professional ${service} for startups and SMEs`,
        `Expert ${service} — fast delivery, clean code`,
      ],
      description: `## What I'll Do\n\nI specialize in ${service}. With years of experience delivering high-quality work, I ensure your project is completed on time and exceeds expectations.\n\n## My Process\n\n1. Discovery — I'll learn about your needs and goals.\n2. Development — I'll build your project with regular updates.\n3. Delivery — I'll hand over a polished product with documentation.\n\n## Why Choose Me?\n\n- 50+ successful projects delivered\n- 100% client satisfaction\n- Fast turnaround times\n\nLet's bring your idea to life!`,
      tags: [service, ...keywords.split(",").map((k) => k.trim()).filter(Boolean), "responsive", "clean code", "fast delivery"],
      packages: [
        { tier: "Basic", price: "$30", delivery: "3 days", features: ["Single page", "Responsive design", "Basic functionality"] },
        { tier: "Standard", price: "$60", delivery: "5 days", features: ["Up to 5 pages", "Responsive design", "API integration", "Admin panel"] },
        { tier: "Premium", price: "$120", delivery: "10 days", features: ["Unlimited pages", "Full-stack development", "Database design", "Deployment", "30 days support"] },
      ],
      faqs: [
        { q: "How long does delivery take?", a: "Delivery time depends on the package you choose. Basic starts at 3 days." },
        { q: "Do you provide revisions?", a: "Yes! I offer revisions until you're satisfied with the result." },
        { q: "What do you need from me to start?", a: "A brief description of your project, any references or examples you like, and your preferred tech stack." },
      ],
    });

    setGenerating(false);
    setGenerated(true);
    toast.success("Gig draft generated successfully!");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Service Details</CardTitle>
            <CardDescription>Tell us what you offer and we'll generate a complete gig draft.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="service">Service / Niche *</Label>
              <Input
                id="service"
                placeholder="e.g. React developer, UI designer..."
                value={service}
                onChange={(e) => setService(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords (comma-separated)</Label>
              <Input
                id="keywords"
                placeholder="react, nextjs, tailwind, typescript"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Tone</Label>
              <div className="flex flex-wrap gap-2">
                {tones.map((t) => (
                  <Badge
                    key={t.value}
                    variant={tone === t.value ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setTone(t.value)}
                  >
                    {t.label}
                  </Badge>
                ))}
              </div>
            </div>
            <Button className="w-full" size="lg" onClick={handleGenerate} disabled={!service.trim() || generating}>
              {generating ? "Generating..." : "Generate Gig Draft"}
            </Button>
          </CardContent>
        </Card>

        {generating && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Generating...</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {(["title", "description", "tags", "packages", "faq"] as DraftSection[]).map((s) => (
                <div key={s} className="flex items-center gap-3">
                  <span className="text-sm capitalize w-24">{s}</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${progress[s]}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-8 text-right">{progress[s]}%</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      <div className="space-y-6">
        {!generated && !generating && (
          <div className="flex items-center justify-center h-full text-center text-muted-foreground p-12">
            <div>
              <p className="text-lg mb-2">⚡</p>
              <p>Fill in your service details and click generate.</p>
              <p className="text-sm">Your gig preview will appear here.</p>
            </div>
          </div>
        )}

        {generated && draft && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Title Variants</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {draft.titles.map((t, i) => (
                  <div key={i} className="p-2 rounded bg-muted/50 text-sm cursor-pointer hover:bg-muted transition-colors">
                    {t}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea className="min-h-[200px]" defaultValue={draft.description} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Tags</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {draft.tags.map((tag, i) => (
                  <Badge key={i} variant="secondary">{tag}</Badge>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Packages</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {draft.packages.map((pkg, i) => (
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

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">FAQs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {draft.faqs.map((faq, i) => (
                  <div key={i}>
                    <p className="text-sm font-medium">Q: {faq.q}</p>
                    <p className="text-sm text-muted-foreground mt-1">A: {faq.a}</p>
                    {i < draft.faqs.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Link href="/gigs" className="flex-1 inline-flex h-9 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/80 transition-colors">
                Save Draft
              </Link>
              <Link href="/gigs/1/audit" className="flex-1 inline-flex h-9 items-center justify-center rounded-lg border border-border bg-background text-sm hover:bg-muted transition-colors">
                View Audit
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
