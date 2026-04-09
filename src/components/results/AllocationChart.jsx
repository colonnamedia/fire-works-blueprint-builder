import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const CHART_COLORS = [
  "bg-blue-500", "bg-indigo-500", "bg-violet-500", "bg-purple-500",
  "bg-pink-500", "bg-rose-500", "bg-amber-500", "bg-emerald-500",
  "bg-teal-500", "bg-cyan-500",
];

export default function AllocationChart({ title, branches, field }) {
  const sorted = [...branches].sort((a, b) => (b[field] || 0) - (a[field] || 0));
  const total = sorted.reduce((acc, b) => acc + (b[field] || 0), 0);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sorted.map((b, i) => {
          const val = b[field] || 0;
          if (val === 0) return null;
          return (
            <div key={i} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{b.branch_name}</span>
                <span className="text-muted-foreground">{val}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${CHART_COLORS[i % CHART_COLORS.length]} transition-all duration-500`}
                  style={{ width: `${Math.min(val, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
        {total > 0 && (
          <div className="pt-2 border-t border-border flex items-center justify-between text-sm">
            <span className="font-semibold">Total</span>
            <span className={`font-semibold ${total > 100 ? "text-destructive" : ""}`}>{total}%</span>
          </div>
        )}
        {total === 0 && (
          <p className="text-sm text-muted-foreground italic text-center py-4">No allocation data yet</p>
        )}
      </CardContent>
    </Card>
  );
}