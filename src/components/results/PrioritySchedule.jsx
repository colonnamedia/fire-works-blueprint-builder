import { CheckCircle, Circle, AlertCircle, ArrowRight } from "lucide-react";

// Funnel-based phase definitions — order reflects what must come first strategically
const FUNNEL_PHASES = [
  {
    phase: 1,
    label: "Phase 1 — Foundation (Do First)",
    desc: "Your home base must exist and convert before anything else matters.",
    color: "border-blue-300 bg-blue-50",
    badge: "bg-blue-100 text-blue-700",
    keywords: ["website", "landing page", "home base", "booking", "checkout", "crm", "store", "storefront", "lead form", "opt-in"],
  },
  {
    phase: 2,
    label: "Phase 2 — Lead Capture & Automation (Do Second)",
    desc: "Capture leads and set up follow-up before spending on traffic.",
    color: "border-violet-300 bg-violet-50",
    badge: "bg-violet-100 text-violet-700",
    keywords: ["email", "sms", "text", "automation", "follow-up", "followup", "nurture", "drip", "sequence", "crm", "list", "capture"],
  },
  {
    phase: 3,
    label: "Phase 3 — Organic & Free Traffic",
    desc: "Build long-term, low-cost traffic channels once your foundation is solid.",
    color: "border-emerald-300 bg-emerald-50",
    badge: "bg-emerald-100 text-emerald-700",
    keywords: ["seo", "blog", "content", "social", "organic", "instagram", "facebook", "tiktok", "youtube", "google my business", "gmb", "reviews"],
  },
  {
    phase: 4,
    label: "Phase 4 — Paid Acquisition",
    desc: "Run ads only after your conversion system is ready to handle leads.",
    color: "border-orange-300 bg-orange-50",
    badge: "bg-orange-100 text-orange-700",
    keywords: ["google ads", "meta ads", "paid", "ppc", "ad campaign", "retargeting", "facebook ads", "instagram ads", "sponsored", "search ads"],
  },
  {
    phase: 5,
    label: "Phase 5 — Retention & Growth",
    desc: "Maximize existing customer value and generate referrals.",
    color: "border-rose-300 bg-rose-50",
    badge: "bg-rose-100 text-rose-700",
    keywords: ["referral", "loyalty", "upsell", "repeat", "retention", "review", "word of mouth", "affiliate", "partnership"],
  },
];

const PRIORITY_RANK = { critical: 0, high: 1, medium: 2, low: 3 };

function assignPhase(branch) {
  const name = branch.branch_name.toLowerCase();
  const purpose = (branch.purpose || "").toLowerCase();
  const combined = name + " " + purpose;

  for (const phase of FUNNEL_PHASES) {
    if (phase.keywords.some(k => combined.includes(k))) {
      return phase.phase;
    }
  }
  // Default to phase 3 if no match
  return 3;
}

export default function PrioritySchedule({ branches }) {
  // Assign each branch to a funnel phase
  const assigned = branches.map(b => ({ ...b, _phase: assignPhase(b) }));

  // Group by phase, sort within phase by user priority
  const grouped = FUNNEL_PHASES.map(phase => ({
    ...phase,
    items: assigned
      .filter(b => b._phase === phase.phase)
      .sort((a, b) => (PRIORITY_RANK[a.priority_level || "medium"] ?? 2) - (PRIORITY_RANK[b.priority_level || "medium"] ?? 2)),
  })).filter(p => p.items.length > 0);

  if (grouped.length === 0) return null;

  return (
    <div className="space-y-3">
      <div>
        <h2 className="font-display text-xl font-semibold">Priority Action Schedule</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Ordered by marketing funnel logic — foundation first, then automation, organic, paid, and retention.
        </p>
      </div>

      <div className="space-y-4">
        {grouped.map(({ phase, label, desc, color, badge, items }) => (
          <div key={phase} className={`border rounded-xl p-4 ${color}`}>
            <div className="mb-3">
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${badge}`}>{label}</span>
              <p className="text-xs text-muted-foreground mt-1.5">{desc}</p>
            </div>
            <div className="space-y-2">
              {items.map((b, i) => (
                <div key={i} className="bg-white/70 border border-white rounded-lg px-4 py-3 flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">
                    {b.status === "active" || b.status === "strong" ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Circle className="w-4 h-4 text-muted-foreground/40" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm">{b.branch_name}</p>
                      {b.priority_level && (
                        <span className="text-xs bg-muted px-1.5 py-0.5 rounded capitalize">{b.priority_level}</span>
                      )}
                    </div>
                    {b.objective && <p className="text-xs text-muted-foreground mt-0.5">{b.objective}</p>}
                    {b.metric_to_watch && <p className="text-xs text-muted-foreground mt-0.5">📊 {b.metric_to_watch}</p>}
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">{b.time_percent || 0}% time</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground italic text-center pt-1">
        Do not run paid ads until your website converts and your follow-up automation is live.
      </p>
    </div>
  );
}