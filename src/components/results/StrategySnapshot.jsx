import { Card, CardContent } from "@/components/ui/card";

export default function StrategySnapshot({ business, centerHub }) {
  if (!business) return null;

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-transparent">
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground font-display font-bold text-xl">
            {(business.business_name || "B")[0]}
          </div>
          <div>
            <h2 className="font-display text-xl font-bold">{business.business_name}</h2>
            <p className="text-sm text-muted-foreground">{business.business_type} • {business.industry}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 pt-2">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Main Goal</p>
            <p className="text-sm font-medium">{business.main_goal || "—"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Center Hub</p>
            <p className="text-sm font-medium">{centerHub}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Target Audience</p>
            <p className="text-sm font-medium">{business.target_audience || "—"}</p>
          </div>
        </div>

        <div className="bg-card rounded-xl p-4 text-center">
          <p className="text-sm font-semibold text-primary tracking-wide">
            Traffic → Conversion → Follow-Up → Sales
          </p>
          <p className="text-xs text-muted-foreground mt-1">This is your core marketing system</p>
        </div>
      </CardContent>
    </Card>
  );
}