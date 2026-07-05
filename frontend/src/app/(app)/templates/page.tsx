"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const initialTemplates = [
  { id: "1", type: "away", title: "Away Message", body: "Hi, thanks for your message! I'm currently away but will get back to you within 24 hours." },
  { id: "2", type: "pricing", title: "Pricing Questions", body: "Thanks for your interest! My packages start at $30. Could you share more details so I can recommend the best option?" },
  { id: "3", type: "follow-up", title: "Follow-up", body: "Hi, just checking in on my last message. Are you still interested in moving forward?" },
  { id: "4", type: "custom", title: "Dev Discovery", body: "I've built 12+ React apps. I'd love to learn about your project and see how I can help." },
  { id: "5", type: "custom", title: "Design Process", body: "My design process includes research, wireframing, prototyping, and user testing. Let me know what stage you need help with." },
];

const typeFilters = ["All", "away", "pricing", "follow-up", "custom"];

export default function TemplatesPage() {
  const [filter, setFilter] = useState("All");
  const [templates, setTemplates] = useState(initialTemplates);
  const [open, setOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState({ type: "custom", title: "", body: "" });

  const filtered = filter === "All" ? templates : templates.filter((t) => t.type === filter);

  const handleCreate = () => {
    if (!newTemplate.title.trim() || !newTemplate.body.trim()) return;
    setTemplates((prev) => [...prev, { ...newTemplate, id: String(Date.now()) }]);
    setNewTemplate({ type: "custom", title: "", body: "" });
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{templates.length} templates</p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>
            <Button>+ New Template</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Template</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="t-type">Type</Label>
                <select
                  id="t-type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newTemplate.type}
                  onChange={(e) => setNewTemplate({ ...newTemplate, type: e.target.value })}
                >
                  <option value="away">Away</option>
                  <option value="pricing">Pricing</option>
                  <option value="follow-up">Follow-up</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="t-title">Title</Label>
                <Input
                  id="t-title"
                  value={newTemplate.title}
                  onChange={(e) => setNewTemplate({ ...newTemplate, title: e.target.value })}
                  placeholder="Template name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="t-body">Body</Label>
                <Textarea
                  id="t-body"
                  value={newTemplate.body}
                  onChange={(e) => setNewTemplate({ ...newTemplate, body: e.target.value })}
                  placeholder="Template content..."
                  className="min-h-[120px]"
                />
              </div>
              <Button className="w-full" onClick={handleCreate}>Save Template</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {typeFilters.map((tab) => (
          <Button
            key={tab}
            variant={filter === tab ? "secondary" : "ghost"}
            size="sm"
            className="h-7 text-xs capitalize"
            onClick={() => setFilter(tab)}
          >
            {tab}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((t) => (
          <Card key={t.id} className="hover:border-primary/50 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-sm">{t.title}</CardTitle>
                <Badge variant="outline" className="text-[10px] capitalize">{t.type}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-4">{t.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
