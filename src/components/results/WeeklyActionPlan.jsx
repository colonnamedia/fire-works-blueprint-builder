import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, Eye, RefreshCw, Settings } from "lucide-react";

export default function WeeklyActionPlan({ draft, branches }) {
  const activeBranches = branches.filter(b => b.status === "active" || b.status === "testing");
  const needsWork = branches.filter(b => b.status === "needs_work");
  const notStarted = branches.filter(b => b.status === "not_started");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-lg">Weekly Action Plan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <CheckCircle className="w-4 h-4 text-green-600" />
              What to Launch Now
            </div>
            {notStarted.length > 0 ? (
              <ul className="space-y-1 text-sm text-muted-foreground">
                {notStarted.slice(0, 3).map((b, i) => <li key={i}>• {b.branch_name}</li>)}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground italic">All channels active</p>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Eye className="w-4 h-4 text-blue-600" />
              Monitor for 5–7 Days
            </div>
            {activeBranches.length > 0 ? (
              <ul className="space-y-1 text-sm text-muted-foreground">
                {activeBranches.map((b, i) => <li key={i}>• {b.branch_name}: {b.metric_to_watch || "watch metrics"}</li>)}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground italic">No active channels yet</p>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Clock className="w-4 h-4 text-amber-600" />
              While Waiting
            </div>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {branches.filter(b => b.while_waiting_action).slice(0, 3).map((b, i) => (
                <li key={i}>• {b.while_waiting_action}</li>
              ))}
              {branches.filter(b => b.while_waiting_action).length === 0 && (
                <li className="italic">No waiting actions defined</li>
              )}
            </ul>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Settings className="w-4 h-4 text-purple-600" />
              Adjust 1–2 Variables
            </div>
            {needsWork.length > 0 ? (
              <ul className="space-y-1 text-sm text-muted-foreground">
                {needsWork.map((b, i) => <li key={i}>• {b.branch_name}: {b.what_to_adjust_if_weak || "review"}</li>)}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground italic">No channels need adjustment</p>
            )}
          </div>
        </div>

        <div className="bg-muted/50 rounded-xl p-4 text-sm space-y-1">
          <p className="font-medium">Review Framework</p>
          <p className="text-muted-foreground">
            Run for {draft?.testing_period_days || 7} days • Review {draft?.review_frequency || "weekly"} • Adjust max {draft?.max_variables_to_adjust || 2} variables
          </p>
          <p className="text-muted-foreground italic text-xs mt-2">
            "Not every channel needs to change at once. Return to the blueprint when needed."
          </p>
        </div>
      </CardContent>
    </Card>
  );
}