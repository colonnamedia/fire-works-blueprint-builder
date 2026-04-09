import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function StrategyForm({ business, onChange }) {
  const toggle = (name, label, desc) => (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div>
        <Label className="text-sm font-medium">{label}</Label>
        {desc && <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>}
      </div>
      <Switch checked={!!business[name]} onCheckedChange={(v) => onChange(name, v)} />
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold mb-1">Strategy Priorities</h2>
        <p className="text-sm text-muted-foreground">
          Define what matters most right now. This will shape your blueprint's recommendations.
        </p>
      </div>

      {toggle("need_fast_leads", "Need fast leads?", "I need results this week or this month")}
      {toggle("want_lowest_cost", "Want lowest-cost options?", "Budget is tight, need to be scrappy")}
      {toggle("want_long_term_growth", "Want long-term growth?", "I'm building for the long game")}
      {toggle("need_better_followup", "Need better follow-up?", "Leads are slipping through the cracks")}
      {toggle("need_better_conversion", "Need better conversion?", "Traffic comes but doesn't convert")}
      {toggle("want_automation", "Want automation?", "I want systems that work without me")}
      {toggle("want_clear_homebase", "Want a clear home base plan?", "I need a structured marketing system")}

      <div className="space-y-1.5 pt-2">
        <Label className="text-sm font-medium">Strategy Style</Label>
        <Select value={business.strategy_style || "moderate"} onValueChange={(v) => onChange("strategy_style", v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="simple">Simple — Focus on 2–3 channels</SelectItem>
            <SelectItem value="moderate">Moderate — Balanced approach</SelectItem>
            <SelectItem value="aggressive">Aggressive — Full-stack marketing</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground italic">
          "Run for 5–7 days, then adjust 1–2 variables — not everything"
        </p>
      </div>
    </div>
  );
}