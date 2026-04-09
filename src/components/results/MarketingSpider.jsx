import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from "recharts";

export default function MarketingSpider({ branches, objectives }) {
  // Build radar data from branches + objectives
  const channelData = branches.slice(0, 8).map(b => ({
    subject: b.branch_name.length > 12 ? b.branch_name.slice(0, 12) + "…" : b.branch_name,
    Score: Math.round(
      ((b.time_percent || 0) * 0.4 +
      (b.cost_percent || 0) * 0.3 +
      (b.priority_level === "critical" ? 100 : b.priority_level === "high" ? 75 : b.priority_level === "medium" ? 50 : 25) * 0.3)
    ),
    fullName: b.branch_name,
  }));

  if (channelData.length < 3) return null;

  return (
    <div className="space-y-3">
      <h2 className="font-display text-xl font-semibold">Marketing Channel Coverage</h2>
      <p className="text-sm text-muted-foreground">Radar view of your marketing strength across all active channels (based on time, cost & priority).</p>
      <div className="bg-card border border-border rounded-xl p-4">
        <ResponsiveContainer width="100%" height={320}>
          <RadarChart data={channelData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <Radar
              name="Channel Strength"
              dataKey="Score"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.25}
              strokeWidth={2}
            />
            <Tooltip
              formatter={(val, _, props) => [val, props.payload?.fullName || "Score"]}
              contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}