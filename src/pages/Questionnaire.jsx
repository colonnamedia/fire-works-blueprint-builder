import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, LayoutGrid, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const BUSINESS_TYPES = [
  { value: "service_local", label: "Local Service Business", desc: "Plumber, gym, salon, contractor, clinic" },
  { value: "service_online", label: "Online Service / Consulting", desc: "Coach, agency, freelancer, consultant" },
  { value: "product_physical", label: "Physical Product / Retail", desc: "Store, boutique, restaurant, e-commerce" },
  { value: "product_digital", label: "Digital Product / SaaS", desc: "App, software, online course, membership" },
  { value: "hybrid", label: "Hybrid — Service + Products", desc: "Sell both services and physical/digital products" },
];

const INDUSTRIES = [
  "Fitness & Wellness", "Home Services", "Food & Restaurant", "Healthcare & Medical",
  "Beauty & Salon", "Real Estate", "Legal", "Financial Services",
  "Education & Coaching", "Retail & E-commerce", "Construction & Trades",
  "Auto & Transportation", "Technology & Software", "Marketing & Advertising",
  "Events & Entertainment", "Non-Profit", "Other",
];

const TEAM_SIZES = [
  { value: "solo", label: "Just me" },
  { value: "small", label: "2–5 people" },
  { value: "medium", label: "6–20 people" },
  { value: "large", label: "20+ people" },
];

const WEBSITE_STATUS = [
  { value: "none", label: "No website yet" },
  { value: "poor", label: "Have one but it needs work" },
  { value: "okay", label: "It's okay but not converting" },
  { value: "good", label: "It's good and converting well" },
  { value: "inprogress", label: "Currently being built" },
];

const ONLINE_PRESENCE = [
  "Google Business Profile", "Facebook", "Instagram", "TikTok",
  "YouTube", "LinkedIn", "Pinterest", "Twitter/X",
  "Email Newsletter", "Podcast", "None yet",
];

const CURRENT_MARKETING = [
  "Google Ads", "Meta/Facebook Ads", "SEO", "Email Marketing",
  "Organic Social Media", "Word of Mouth / Referrals",
  "Print / Direct Mail", "Influencer / Partnerships", "None",
];

const CHALLENGES = [
  { value: "no_leads", label: "Not getting enough leads or customers" },
  { value: "bad_website", label: "Website doesn't convert visitors" },
  { value: "no_social", label: "No consistent social media presence" },
  { value: "no_followup", label: "No follow-up system after inquiry" },
  { value: "no_automation", label: "Everything is manual — no automations" },
  { value: "no_strategy", label: "No clear marketing strategy or plan" },
  { value: "no_reviews", label: "Not getting reviews or referrals" },
  { value: "no_budget", label: "Limited budget — need free/low-cost wins" },
];

const PRIMARY_GOALS = [
  { value: "more_leads", label: "Get more leads and inquiries" },
  { value: "more_sales", label: "Convert more leads into paying customers" },
  { value: "build_brand", label: "Build brand awareness in my market" },
  { value: "retain_customers", label: "Retain existing customers longer" },
  { value: "launch", label: "Launch a new product or service" },
  { value: "automate", label: "Automate and systematize my marketing" },
];

const BUDGETS = [
  { value: "0", label: "$0 — Free strategies only" },
  { value: "100_500", label: "$100 – $500/month" },
  { value: "500_2000", label: "$500 – $2,000/month" },
  { value: "2000_5000", label: "$2,000 – $5,000/month" },
  { value: "5000_plus", label: "$5,000+/month" },
];

const YEARS_IN_BIZ = [
  { value: "new", label: "Just starting out" },
  { value: "1_2", label: "1–2 years" },
  { value: "3_5", label: "3–5 years" },
  { value: "5_plus", label: "5+ years" },
];

const PAGES = [
  { title: "Tell us about your business", subtitle: "This helps us build a roadmap specific to your business type and industry." },
  { title: "Where are you right now?", subtitle: "Understanding your current situation helps us prioritize what to fix first." },
  { title: "Your goals and resources", subtitle: "The last few questions help us set realistic priorities for your 90-day plan." },
];

const MultiSelect = ({ options, selected, onChange, cols = 2 }) => (
  <div className={`grid grid-cols-${cols} gap-2`}>
    {options.map(opt => {
      const val = typeof opt === "string" ? opt : opt.value;
      const label = typeof opt === "string" ? opt : opt.label;
      const desc = typeof opt === "string" ? null : opt.desc;
      const isSelected = selected.includes(val);
      return (
        <button
          key={val}
          type="button"
          onClick={() => onChange(isSelected ? selected.filter(v => v !== val) : [...selected, val])}
          className={`text-left px-4 py-3 rounded-xl border transition-all ${isSelected ? "border-violet-500 bg-violet-50" : "border-gray-200 hover:border-violet-300"}`}
        >
          <div className="flex items-start gap-2">
            <div className={`w-4 h-4 rounded border flex-shrink-0 mt-0.5 flex items-center justify-center ${isSelected ? "bg-violet-500 border-violet-500" : "border-gray-300"}`}>
              {isSelected && <Check className="w-3 h-3 text-white" />}
            </div>
            <div>
              <p className={`text-sm font-medium ${isSelected ? "text-violet-700" : "text-gray-700"}`}>{label}</p>
              {desc && <p className="text-xs text-gray-400 mt-0.5">{desc}</p>}
            </div>
          </div>
        </button>
      );
    })}
  </div>
);

const SingleSelect = ({ options, selected, onChange, cols = 1 }) => (
  <div className={`grid grid-cols-${cols} gap-2`}>
    {options.map(opt => {
      const val = typeof opt === "string" ? opt : opt.value;
      const label = typeof opt === "string" ? opt : opt.label;
      const desc = typeof opt === "string" ? null : opt.desc;
      const isSelected = selected === val;
      return (
        <button
          key={val}
          type="button"
          onClick={() => onChange(val)}
          className={`text-left px-4 py-3 rounded-xl border transition-all ${isSelected ? "border-violet-500 bg-violet-50" : "border-gray-200 hover:border-violet-300"}`}
        >
          <p className={`text-sm font-medium ${isSelected ? "text-violet-700" : "text-gray-700"}`}>{label}</p>
          {desc && <p className={`text-xs mt-0.5 ${isSelected ? "text-violet-500" : "text-gray-400"}`}>{desc}</p>}
        </button>
      );
    })}
  </div>
);

export default function Questionnaire() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    // Page 1
    business_name: "",
    email: "",
    what_you_do: "",
    business_type: "",
    industry: "",
    team_size: "",
    years_in_business: "",
    // Page 2
    website_status: "",
    online_presence: [],
    current_marketing: [],
    ideal_customer: "",
    biggest_challenges: [],
    // Page 3
    primary_goal: "",
    monthly_budget: "",
    success_in_90_days: "",
  });

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const canAdvance = () => {
    if (page === 0) return form.business_name && form.email && form.business_type && form.industry;
    if (page === 1) return form.website_status && form.ideal_customer && form.biggest_challenges.length > 0;
    if (page === 2) return form.primary_goal && form.monthly_budget;
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/submit-blueprint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error("Failed to submit");

      const paymentRes = await fetch("/api/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blueprintId: data.id, email: form.email }),
      });
      const paymentData = await paymentRes.json();
      if (!paymentRes.ok) throw new Error("Payment failed");

      window.location.href = paymentData.url;
    } catch (err) {
      toast({ title: "Something went wrong.", description: "Please try again.", variant: "destructive" });
      setLoading(false);
    }
  };

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent";
  const progress = ((page + 1) / 3) * 100;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-gray-900">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
            <LayoutGrid className="w-4 h-4 text-white" />
          </div>
          Blueprint Builder
        </Link>
        <span className="text-xs text-gray-400 font-medium">Step {page + 1} of 3</span>
      </header>

      <div className="h-1.5 bg-gray-100">
        <div
          className="h-full bg-gradient-to-r from-violet-600 to-blue-600 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-2xl"
          >
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{PAGES[page].title}</h2>
              <p className="text-gray-500 text-sm">{PAGES[page].subtitle}</p>
            </div>

            <div className="space-y-6">

              {/* PAGE 1 */}
              {page === 0 && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">Business Name *</label>
                      <input className={inputClass} placeholder="e.g. Acme Plumbing" value={form.business_name} onChange={e => update("business_name", e.target.value)} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">Your Email *</label>
                      <input className={inputClass} type="email" placeholder="you@email.com" value={form.email} onChange={e => update("email", e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">What does your business do?</label>
                    <input className={inputClass} placeholder="e.g. We fix residential plumbing issues in South Pittsburgh" value={form.what_you_do} onChange={e => update("what_you_do", e.target.value)} />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Business type *</label>
                    <SingleSelect options={BUSINESS_TYPES} selected={form.business_type} onChange={v => update("business_type", v)} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Industry *</label>
                      <select className={inputClass} value={form.industry} onChange={e => update("industry", e.target.value)}>
                        <option value="">Select your industry</option>
                        {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Years in business</label>
                      <SingleSelect options={YEARS_IN_BIZ} selected={form.years_in_business} onChange={v => update("years_in_business", v)} cols={2} />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Team size</label>
                    <SingleSelect options={TEAM_SIZES} selected={form.team_size} onChange={v => update("team_size", v)} cols={2} />
                  </div>
                </>
              )}

              {/* PAGE 2 */}
              {page === 1 && (
                <>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Your website right now *</label>
                    <SingleSelect options={WEBSITE_STATUS} selected={form.website_status} onChange={v => update("website_status", v)} />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Where are you currently active online? (select all that apply)</label>
                    <MultiSelect options={ONLINE_PRESENCE} selected={form.online_presence} onChange={v => update("online_presence", v)} cols={2} />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">What marketing are you currently doing? (select all)</label>
                    <MultiSelect options={CURRENT_MARKETING} selected={form.current_marketing} onChange={v => update("current_marketing", v)} cols={2} />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">Who is your ideal customer? *</label>
                    <input className={inputClass} placeholder="e.g. Homeowners aged 35-60 in South Pittsburgh who need plumbing" value={form.ideal_customer} onChange={e => update("ideal_customer", e.target.value)} />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Your biggest marketing challenges right now * (select all that apply)</label>
                    <MultiSelect options={CHALLENGES} selected={form.biggest_challenges} onChange={v => update("biggest_challenges", v)} cols={1} />
                  </div>
                </>
              )}

              {/* PAGE 3 */}
              {page === 2 && (
                <>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Primary goal in the next 90 days *</label>
                    <SingleSelect options={PRIMARY_GOALS} selected={form.primary_goal} onChange={v => update("primary_goal", v)} />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Monthly marketing budget *</label>
                    <SingleSelect options={BUDGETS} selected={form.monthly_budget} onChange={v => update("monthly_budget", v)} />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">What does success look like in 90 days?</label>
                    <textarea
                      className={inputClass + " min-h-[100px] resize-none"}
                      placeholder="e.g. 20 new leads per month, a working follow-up system, and consistent posts on Instagram and Facebook"
                      value={form.success_in_90_days}
                      onChange={e => update("success_in_90_days", e.target.value)}
                    />
                  </div>
                </>
              )}

            </div>

            <div className="flex justify-between mt-10">
              <button
                type="button"
                onClick={() => page === 0 ? navigate("/") : setPage(p => p - 1)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:border-gray-300 transition-all"
              >
                <ArrowLeft className="w-4 h-4" /> {page === 0 ? "Home" : "Back"}
              </button>

              {page < 2 ? (
                <button
                  type="button"
                  onClick={() => setPage(p => p + 1)}
                  disabled={!canAdvance()}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-medium hover:from-violet-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-violet-500/25"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canAdvance() || loading}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-medium hover:from-violet-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-violet-500/25"
                >
                  {loading ? "Processing..." : "Get My Blueprint — $19.99"} <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
