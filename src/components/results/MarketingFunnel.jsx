const FUNNEL_STAGES = [
  { key: "Awareness", label: "Awareness", desc: "People discover you exist", color: "bg-blue-500", width: "w-full" },
  { key: "Interest", label: "Interest", desc: "They learn about your offer", color: "bg-indigo-500", width: "w-11/12" },
  { key: "Consideration", label: "Consideration", desc: "They compare & evaluate", color: "bg-violet-500", width: "w-10/12" },
  { key: "Intent", label: "Intent", desc: "They show buying signals", color: "bg-purple-500", width: "w-8/12" },
  { key: "Purchase", label: "Purchase / Conversion", desc: "They become a customer", color: "bg-pink-500", width: "w-7/12" },
  { key: "Retention", label: "Retention", desc: "They come back & stay", color: "bg-rose-500", width: "w-6/12" },
  { key: "Referral", label: "Referral", desc: "They send others to you", color: "bg-red-500", width: "w-5/12" },
];

export default function MarketingFunnel({ stages, branches }) {
  // Map journey stages or fallback to default funnel
  const stageMap = {};
  stages.forEach(s => {
    const match = FUNNEL_STAGES.find(f =>
      s.stage_name.toLowerCase().includes(f.key.toLowerCase()) ||
      f.key.toLowerCase().includes(s.stage_name.toLowerCase())
    );
    if (match) stageMap[match.key] = s;
  });

  return (
    <div className="space-y-3">
      <h2 className="font-display text-xl font-semibold">Marketing Funnel</h2>
      <p className="text-sm text-muted-foreground">Visual flow of how customers move from discovery to loyal referrers.</p>
      <div className="bg-card border border-border rounded-xl p-6 flex flex-col items-center gap-1">
        {FUNNEL_STAGES.map((stage, i) => {
          const journeyStage = stageMap[stage.key];
          return (
            <div key={i} className={`${stage.width} transition-all`}>
              <div className={`${stage.color} text-white rounded-lg px-4 py-2.5 text-center`}>
                <p className="font-semibold text-sm">{stage.label}</p>
                <p className="text-xs opacity-80">
                  {journeyStage?.supporting_channel ? `via ${journeyStage.supporting_channel}` : stage.desc}
                </p>
                {journeyStage?.dropoff_risk && journeyStage.dropoff_risk.toLowerCase().includes("high") && (
                  <p className="text-xs mt-0.5 bg-white/20 rounded px-2 py-0.5 inline-block">⚠️ High drop-off risk</p>
                )}
              </div>
              {i < FUNNEL_STAGES.length - 1 && (
                <div className="flex justify-center my-0.5">
                  <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-t-[8px] border-l-transparent border-r-transparent border-t-muted-foreground/30" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}