import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";

export default function TimeCostForm({ business, onChange, branches, onUpdateBranch }) {
  const totalTime = branches.reduce((acc, b) => acc + (b.time_percent || 0), 0);
  const totalCost = branches.reduce((acc, b) => acc + (b.cost_percent || 0), 0);
  const visibleBranches = branches.filter(b => b.visible !== false);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold mb-1">Time + Cost Allocation</h2>
        <p className="text-sm text-muted-foreground">
          Time and cost are the two main levers. Distribute your resources across your active channels.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Monthly Marketing Budget ($)</Label>
          <Input
            type="number"
            value={business.monthly_marketing_budget || ""}
            onChange={(e) => onChange("monthly_marketing_budget", parseFloat(e.target.value) || 0)}
            placeholder="1000"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Weekly Time Available (hours)</Label>
          <Input
            type="number"
            value={business.weekly_time_available || ""}
            onChange={(e) => onChange("weekly_time_available", parseFloat(e.target.value) || 0)}
            placeholder="10"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Who is Doing the Marketing?</Label>
        <Input
          value={business.who_is_doing_marketing || ""}
          onChange={(e) => onChange("who_is_doing_marketing", e.target.value)}
          placeholder="Me, my team, an agency..."
        />
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="flex items-center justify-between py-2">
          <Label className="text-sm">Can create content in-house?</Label>
          <Switch checked={!!business.can_create_content} onCheckedChange={(v) => onChange("can_create_content", v)} />
        </div>
        <div className="flex items-center justify-between py-2">
          <Label className="text-sm">Can run ads?</Label>
          <Switch checked={!!business.can_run_ads} onCheckedChange={(v) => onChange("can_run_ads", v)} />
        </div>
        <div className="flex items-center justify-between py-2">
          <Label className="text-sm">Can follow up quickly?</Label>
          <Switch checked={!!business.can_follow_up_quickly} onCheckedChange={(v) => onChange("can_follow_up_quickly", v)} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Email List Size</Label>
          <Input type="number" value={business.email_list_size || ""} onChange={(e) => onChange("email_list_size", parseInt(e.target.value) || 0)} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Customer List Size</Label>
          <Input type="number" value={business.customer_list_size || ""} onChange={(e) => onChange("customer_list_size", parseInt(e.target.value) || 0)} />
        </div>
      </div>

      {/* Allocation per channel */}
      <div className="space-y-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Channel Allocation</h3>
          <div className="flex gap-4 text-xs">
            <span className={totalTime > 100 ? "text-destructive font-medium" : "text-muted-foreground"}>
              Time: {totalTime}%
            </span>
            <span className={totalCost > 100 ? "text-destructive font-medium" : "text-muted-foreground"}>
              Cost: {totalCost}%
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {visibleBranches.map((branch, i) => {
            const idx = branches.indexOf(branch);
            return (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{branch.branch_name}</span>
                  <div className="flex gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-muted-foreground">Time</span>
                      <Input
                        type="number" min={0} max={100}
                        className="w-16 h-7 text-xs"
                        value={branch.time_percent || ""}
                        onChange={(e) => onUpdateBranch(idx, "time_percent", parseInt(e.target.value) || 0)}
                      />
                      <span className="text-xs text-muted-foreground">%</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-muted-foreground">Cost</span>
                      <Input
                        type="number" min={0} max={100}
                        className="w-16 h-7 text-xs"
                        value={branch.cost_percent || ""}
                        onChange={(e) => onUpdateBranch(idx, "cost_percent", parseInt(e.target.value) || 0)}
                      />
                      <span className="text-xs text-muted-foreground">%</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Progress value={branch.time_percent || 0} className="h-1.5" />
                  <Progress value={branch.cost_percent || 0} className="h-1.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}