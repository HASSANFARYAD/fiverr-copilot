import { GigScoreCard } from "@/components/dashboard/GigScoreCard";
import { ResponseTimerWidget } from "@/components/dashboard/ResponseTimerWidget";
import { OverdueAlert } from "@/components/dashboard/OverdueAlert";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <GigScoreCard score={72} />
        <ResponseTimerWidget />
        <OverdueAlert />
      </div>
      <ActivityFeed />
    </div>
  );
}
