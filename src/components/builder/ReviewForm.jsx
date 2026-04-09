import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ReviewForm({ settings, onChange }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold mb-1">Weekly Review Framework</h2>
        <p className="text-sm text-muted-foreground">
          Run for 5–7 days, then adjust 1–2 variables — not everything. This keeps your system stable.
        </p>
      </div>

      <div className="bg-primary/5 rounded-xl p-4 space-y-2">
        <p className="text-sm font-medium">Default Guidance:</p>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
          <li>Test for 5–7 days before making changes</li>
          <li>Adjust only 1–2 variables at a time</li>
          <li>Do not restart the full system</li>
          <li>Return to the home base if results feel unclear</li>
        </ul>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Testing Period (days)</Label>
          <Input
            type="number"
            value={settings.testing_period_days || 7}
            onChange={(e) => onChange("testing_period_days", parseInt(e.target.value) || 7)}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Review Frequency</Label>
          <Select value={settings.review_frequency || "weekly"} onValueChange={(v) => onChange("review_frequency", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="biweekly">Biweekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Max Variables to Adjust per Review</Label>
        <Input
          type="number"
          value={settings.max_variables_to_adjust || 2}
          onChange={(e) => onChange("max_variables_to_adjust", parseInt(e.target.value) || 2)}
        />
        <p className="text-xs text-muted-foreground italic">Recommended: 1–2</p>
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Key Metrics to Watch</Label>
        <Textarea
          value={settings.key_metrics_to_watch || ""}
          onChange={(e) => onChange("key_metrics_to_watch", e.target.value)}
          rows={3}
          placeholder="CTR, leads, conversion rate, cost per lead..."
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Weekly Notes</Label>
        <Textarea
          value={settings.weekly_notes || ""}
          onChange={(e) => onChange("weekly_notes", e.target.value)}
          rows={3}
          placeholder="What to focus on this week..."
        />
      </div>
    </div>
  );
}