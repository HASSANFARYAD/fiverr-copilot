"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useState } from "react";

export default function SettingsPage() {
  const [name, setName] = useState("Hassan");
  const [email, setEmail] = useState("hassan@example.com");
  const [timezone, setTimezone] = useState("(UTC+05:00) Islamabad, Karachi");
  const [tone, setTone] = useState("professional");

  const handleSave = () => {
    toast.success("Settings saved");
  };

  return (
    <div className="max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tz">Timezone</Label>
            <select
              id="tz"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
            >
              <option>(UTC+05:00) Islamabad, Karachi</option>
              <option>(UTC+00:00) UTC</option>
              <option>(UTC-05:00) Eastern Time</option>
              <option>(UTC-08:00) Pacific Time</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Business Hours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div key={day} className="flex items-center gap-4">
                <span className="w-10 text-sm font-medium">{day}</span>
                <input type="checkbox" defaultChecked={day !== "Sat" && day !== "Sun"} className="size-4" />
                <div className="flex items-center gap-2 flex-1">
                  <Input type="time" defaultValue="09:00" className="h-8 w-28" disabled={day === "Sat" || day === "Sun"} />
                  <span className="text-xs text-muted-foreground">to</span>
                  <Input type="time" defaultValue="17:00" className="h-8 w-28" disabled={day === "Sat" || day === "Sun"} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tone & Language</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tone">Default Tone</Label>
            <select
              id="tone"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
            >
              <option value="professional">Professional</option>
              <option value="friendly">Friendly</option>
              <option value="persuasive">Persuasive</option>
              <option value="technical">Technical</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: "Email reminders (2h before deadline)", default: true },
            { label: "Browser push notifications", default: true },
            { label: "Telegram (coming soon)", default: false },
          ].map((n) => (
            <div key={n.label} className="flex items-center justify-between">
              <span className="text-sm">{n.label}</span>
              <input type="checkbox" defaultChecked={n.default} className="size-4" />
            </div>
          ))}
          <div className="flex items-center gap-2 pt-2">
            <Label htmlFor="reminder-timing" className="text-sm">Reminder timing</Label>
            <select id="reminder-timing" className="h-8 rounded-md border border-input bg-background px-2 text-sm">
              <option>30 min before</option>
              <option>1 hour before</option>
              <option selected>2 hours before</option>
              <option>4 hours before</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave}>Save Changes</Button>
    </div>
  );
}
