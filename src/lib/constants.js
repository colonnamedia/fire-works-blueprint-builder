export const DEFAULT_BRANCHES = [
  { branch_name: "Website / Landing Pages", sort_order: 0 },
  { branch_name: "Google Ads", sort_order: 1 },
  { branch_name: "Meta Ads", sort_order: 2 },
  { branch_name: "Email Newsletters", sort_order: 3 },
  { branch_name: "Email Automations", sort_order: 4 },
  { branch_name: "Organic Social / Content", sort_order: 5 },
  { branch_name: "SEO / Google Presence", sort_order: 6 },
  { branch_name: "Referrals / Networking", sort_order: 7 },
  { branch_name: "SMS / Direct Follow-Up", sort_order: 8 },
  { branch_name: "Sales / Lead Handling", sort_order: 9 },
];

export const JOURNEY_STAGES = [
  "Awareness",
  "Interest",
  "Visit / Click",
  "Lead / Inquiry",
  "Follow-Up",
  "Conversion / Sale",
  "Retention",
  "Referral / Repeat",
];

export const DEFAULT_OBJECTIVES = [
  "More leads",
  "More calls",
  "More booked appointments",
  "More purchases",
  "Better follow-up",
  "Better retention",
  "Higher conversion rate",
  "More referrals",
  "More awareness",
];

export const PRIORITY_OPTIONS = ["low", "medium", "high", "critical"];
export const OWNER_OPTIONS = ["me", "team_member", "contractor", "agency", "unassigned"];
export const STATUS_OPTIONS = ["not_started", "active", "needs_work", "testing", "strong", "paused"];

export const PRIORITY_COLORS = {
  low: "bg-slate-100 text-slate-600 border-slate-200",
  medium: "bg-blue-50 text-blue-700 border-blue-200",
  high: "bg-amber-50 text-amber-700 border-amber-200",
  critical: "bg-red-50 text-red-700 border-red-200",
};

export const STATUS_COLORS = {
  not_started: "bg-gray-100 text-gray-600",
  active: "bg-green-50 text-green-700",
  needs_work: "bg-orange-50 text-orange-700",
  testing: "bg-purple-50 text-purple-700",
  strong: "bg-emerald-50 text-emerald-700",
  paused: "bg-slate-100 text-slate-500",
};

export const STANDARD_PRICE = 19.99;

export const getCenterHubLabel = (storefrontType) => {
  switch (storefrontType) {
    case "storefront": return "Storefront + Website";
    case "hybrid": return "Physical Location + Website";
    default: return "Website / Digital Storefront";
  }
};

export const CONSULTANT_PHRASES = [
  "Your website acts as your digital storefront",
  "This is your marketing home base",
  "Traffic → Conversion → Follow-Up → Sales",
  "Time and cost are the two main levers",
  "Run for 5–7 days, then adjust 1–2 variables",
  "Not every channel needs to change at once",
];