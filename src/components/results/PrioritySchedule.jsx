import { CheckCircle, Circle, AlertCircle } from "lucide-react";

const PRIORITY_ORDER = ["critical", "high", "medium", "low"];

const DEPENDENCY_RULES = [
  { channel: "Google Ads", requires: ["Website / Landing Page", "Website"], label: "Needs a website/landing page first" },
  { channel: "Meta Ads", requires: ["Website / Landing Page", "Website"], label: "Needs a website/landing page first" },
  { channel: "Facebook/Instagram Ads", requires: ["Website / Landing Page", "Website"], label: "Needs a website first" },
  { channel: "SEO / Blog", requires: ["Website / Landing Page", "Website"], label: "Needs a website first" },
  { channel: "Email Marketing", requires: ["Email Capture", "Landing Page"], label: "Needs an email capture/list first" },
  { channel: "Retargeting Ads", requires: ["Google Ads", "Meta Ads", "Facebook/Instagram Ads"], label: "Needs a primary ad campaign first" },
];

export default function PrioritySchedule({ branches }) {
  const sorted = [...branches].sort((a, b) => {
    const ai = PRIORITY_ORDER.indexOf(a.priority_level || "medium");
    const bi = PRIORITY_ORDER.indexOf(b.priority_level || "medium");
    return ai - bi;
  });

  const branchNames = branches.map(b => b.branch_name.toLowerCase());

  const getDependencyWarning = (branch) => {
    const rule = DEPENDENCY_RULES.find(r =>
      branch.branch_name.toLowerCase().includes(r.channel.toLowerCase()) ||
      r.channel.toLowerCase().includes(branch.branch_name.toLowerCase())
    );
    if (!rule) return null;
    const hasReq = rule.requires.some(req =>
      branchNames.some(n => n.includes(req.toLowerCase()) || req.toLowerCase().includes(n))
    );
    if (!hasReq) return rule.label;
    return null;
  };

  const PRIORITY_STYLES = {
    critical: "bg-red-50 border-red-200 text-red-700",
    high: "bg-orange-50 border-orange-200 text-orange-700",
    medium: "bg-blue-50 border-blue-200 text-blue-700",
    low: "bg-gray-50 border-gray-200 text-gray-600",
  };

  const PHASE_LABELS = {
    critical: "Phase 1 — Do First",
    high: "Phase 2 — Do Next",
    medium: "Phase 3 — Build Out",
    low: "Phase 4 — Optional / Later",
  };

  const phases = PRIORITY_ORDER.reduce((acc, p) => {
    const items = sorted.filter(b => (b.priority_level || "medium") === p);
    if (items.length > 0) acc.push({ priority: p, items });
    return acc;
  }, []);

  return (
    <div className="space-y-3">
      <h2 className="font-display text-xl font-semibold">Priority Action Schedule</h2>
      <p className="text-sm text-muted-foreground">What to set up first — ordered by priority level. Dependency warnings shown where applicable.</p>
      <div className="space-y-4">
        {phases.map(({ priority, items }) => (
          <div key={priority} className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{PHASE_LABELS[priority]}</h3>
            {items.map((b, i) => {
              const warning = getDependencyWarning(b);
              return (
                <div key={i} className={`border rounded-xl p-4 ${PRIORITY_STYLES[priority]}`}>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {b.status === "active" || b.status === "strong" ? (
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Circle className="w-5 h-5 opacity-50" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{b.branch_name}</p>
                      {b.objective && <p className="text-xs opacity-80 mt-0.5">{b.objective}</p>}
                      {b.metric_to_watch && <p className="text-xs opacity-70 mt-0.5">📊 Watch: {b.metric_to_watch}</p>}
                      {warning && (
                        <div className="flex items-center gap-1 mt-1.5 text-xs font-medium text-amber-700 bg-amber-100 rounded px-2 py-1 w-fit">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {warning}
                        </div>
                      )}
                    </div>
                    <span className="text-xs font-medium opacity-60 shrink-0">{b.time_percent || 0}% time</span>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}