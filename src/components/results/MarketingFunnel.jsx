const FUNNEL_SECTIONS = [
  {
    label: "Traffic Sources",
    stage: "Top of Funnel (TOFU) — Awareness",
    color: "bg-blue-500",
    width: "w-full",
    channelKeywords: ["google", "meta", "facebook", "instagram", "seo", "blog", "social", "tiktok", "youtube", "ads", "search"],
    fallback: "Google/Meta Ads · Social Media · SEO",
  },
  {
    label: "Website / Home Base",
    stage: "Middle of Funnel (MOFU) — Consideration",
    color: "bg-violet-500",
    width: "w-10/12",
    channelKeywords: ["website", "landing", "booking", "lead", "email capture", "crm"],
    fallback: "Landing Page · Lead Capture · Booking Form",
    note: "If this doesn't convert, nothing else matters.",
  },
  {
    label: "Registration & Sales",
    stage: "Bottom of Funnel (BOFU) — Conversion",
    color: "bg-pink-500",
    width: "w-8/12",
    channelKeywords: ["sales", "call", "consult", "checkout", "purchase", "register", "sign up"],
    fallback: "Sales Calls · Checkout · Consultation",
  },
  {
    label: "Follow-Up & Upsell",
    stage: "Retention / Loyalty",
    color: "bg-rose-600",
    width: "w-6/12",
    channelKeywords: ["email", "sms", "follow", "upsell", "retain", "referral", "loyalty", "repeat"],
    fallback: "Email/SMS · Upsells · Referrals · Welcome Series",
  },
];

export default function MarketingFunnel({ stages, branches }) {
  const getChannels = (keywords) => {
    return branches
      .filter(b => keywords.some(k => b.branch_name.toLowerCase().includes(k)))
      .map(b => b.branch_name)
      .join(" · ");
  };

  return (
    <div className="space-y-3">
      <div>
        <h2 className="font-display text-xl font-semibold">Brick-and-Mortar Customer Acquisition Funnel</h2>
        <p className="text-sm text-muted-foreground mt-1">How customers flow from traffic sources through your conversion hub to sales and retention.</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 flex flex-col items-center gap-0">
        {FUNNEL_SECTIONS.map((section, i) => {
          const matchedChannels = getChannels(section.channelKeywords);
          const displayChannels = matchedChannels || section.fallback;

          // Find matching journey stage
          const journeyStage = stages.find(s =>
            section.channelKeywords.some(k => s.stage_name?.toLowerCase().includes(k))
          );
          const dropoffRisk = journeyStage?.dropoff_risk;

          return (
            <div key={i} className={`${section.width} transition-all`}>
              <div className={`${section.color} text-white rounded-xl px-5 py-3.5`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm">{section.label}</p>
                    <p className="text-xs opacity-75 mt-0.5">{section.stage}</p>
                    <p className="text-xs opacity-90 mt-1 font-medium">{displayChannels}</p>
                    {section.note && (
                      <p className="text-xs italic opacity-80 mt-1">"{section.note}"</p>
                    )}
                  </div>
                  {dropoffRisk && dropoffRisk.toLowerCase().includes("high") && (
                    <span className="shrink-0 text-xs bg-white/25 rounded px-2 py-0.5 font-medium">⚠️ High risk</span>
                  )}
                </div>
              </div>

              {i < FUNNEL_SECTIONS.length - 1 && (
                <div className="flex justify-center my-1">
                  <div className="w-0 h-0 border-l-[14px] border-r-[14px] border-t-[10px] border-l-transparent border-r-transparent border-t-muted/60" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-4 gap-2 text-center text-xs text-muted-foreground">
        <div className="bg-blue-50 border border-blue-100 rounded-lg py-2 px-1">
          <p className="font-semibold text-blue-700">TOFU</p>
          <p>Reach & Attract</p>
        </div>
        <div className="bg-violet-50 border border-violet-100 rounded-lg py-2 px-1">
          <p className="font-semibold text-violet-700">MOFU</p>
          <p>Capture & Nurture</p>
        </div>
        <div className="bg-pink-50 border border-pink-100 rounded-lg py-2 px-1">
          <p className="font-semibold text-pink-700">BOFU</p>
          <p>Convert & Close</p>
        </div>
        <div className="bg-rose-50 border border-rose-100 rounded-lg py-2 px-1">
          <p className="font-semibold text-rose-700">POST</p>
          <p>Retain & Grow</p>
        </div>
      </div>
    </div>
  );
}