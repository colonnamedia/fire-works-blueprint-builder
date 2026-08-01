import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Target, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const BIZ_TYPES = [
  { value: "local_service", label: "Local Service Business", desc: "Plumber, gym, salon, contractor, clinic, therapist" },
  { value: "brick_mortar", label: "Brick & Mortar / Restaurant", desc: "Retail store, restaurant, cafe, boutique" },
  { value: "online_store", label: "Online Store / E-commerce", desc: "Sell products online — clothing, gifts, digital products" },
  { value: "online_service", label: "Online Service / Consulting", desc: "Coach, agency, freelancer, course creator" },
  { value: "hybrid", label: "Hybrid — Service + Products", desc: "Sell both services and physical or digital products" },
];

const GOALS = [
  { value: "more_leads", label: "Get more leads and inquiries" },
  { value: "more_sales", label: "Drive more direct sales or purchases" },
  { value: "brand_awareness", label: "Build brand awareness in my market" },
  { value: "retarget", label: "Re-engage people who already showed interest" },
  { value: "launch", label: "Launch a new product or service" },
];

const BUDGETS = [
  { value: "under_300", label: "Under $300/month" },
  { value: "300_1000", label: "$300 – $1,000/month" },
  { value: "1000_3000", label: "$1,000 – $3,000/month" },
  { value: "3000_plus", label: "$3,000+/month" },
];

const CURRENT_ADS = [
  { value: "none", label: "Not running any ads yet" },
  { value: "google_only", label: "Running Google Ads only" },
  { value: "meta_only", label: "Running Meta/Facebook Ads only" },
  { value: "both", label: "Running both Google and Meta Ads" },
  { value: "paused", label: "Ran ads before but paused them" },
];

const WEBSITE_STATUS = [
  { value: "none", label: "No website yet" },
  { value: "poor", label: "Have one but it needs work" },
  { value: "okay", label: "Decent but not converting well" },
  { value: "good", label: "Good website that converts" },
];

const PIXEL_STATUS = [
  { value: "both", label: "Yes — Google Tag + Meta Pixel installed" },
  { value: "google_only", label: "Google Tag only" },
  { value: "meta_only", label: "Meta Pixel only" },
  { value: "none", label: "No tracking set up yet" },
  { value: "not_sure", label: "Not sure" },
];

const PAGES = [
  { title: "About your business", sub: "This helps us recommend the right ad platforms for your specific business type." },
  { title: "Your advertising situation", sub: "Understanding where you are now helps us build the right strategy from here." },
  { title: "Your goals and budget", sub: "The last few questions set your ad strategy priorities and budget allocation." },
];

function SingleSelect({ options, field, form, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      {options.map(o => {
        const val = typeof o === "string" ? o : o.value;
        const label = typeof o === "string" ? o : o.label;
        const desc = typeof o === "string" ? null : o.desc;
        const sel = form[field] === val;
        return (
          <button key={val} type="button" onClick={() => onChange(field, val)}
            className={`text-left px-4 py-3 rounded-xl border text-sm transition-all ${sel ? "border-blue-500 bg-blue-50 text-blue-700 font-medium" : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/40"}`}>
            <p className="font-medium">{label}</p>
            {desc && <p className={`text-xs mt-0.5 ${sel ? "text-blue-500" : "text-gray-400"}`}>{desc}</p>}
          </button>
        );
      })}
    </div>
  );
}

export default function AdvertisingQuestionnaire() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    business_name: "", email: "", what_you_sell: "", ideal_customer: "",
    business_type: "", website_status: "", pixel_status: "",
    current_ads: "", ad_goal: "", monthly_budget: "", biggest_competitor: "",
    success_goal: "",
  });

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const canAdvance = () => {
    if (page === 0) return form.business_name && form.email && form.business_type;
    if (page === 1) return form.website_status && form.current_ads && form.pixel_status;
    if (page === 2) return form.ad_goal && form.monthly_budget;
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/submit-advertising", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error("Failed to submit");

      const paymentRes = await fetch("/api/create-advertising-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ strategyId: data.id, email: form.email }),
      });
      const paymentData = await paymentRes.json();
      if (!paymentRes.ok) throw new Error("Payment failed");

      window.location.href = paymentData.url;
    } catch (err) {
      toast({ title: "Something went wrong.", description: "Please try again.", variant: "destructive" });
      setLoading(false);
    }
  };

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
  const progress = ((page + 1) / 3) * 100;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-gray-900">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
            <Target className="w-4 h-4 text-white" />
          </div>
          Advertising Strategy Guide
        </Link>
        <span className="text-xs text-gray-400 font-medium">Step {page + 1} of 3</span>
      </header>

      <div className="h-1.5 bg-gray-100">
        <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500" style={{ width: `${progress}%` }} />
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
              <p className="text-gray-500 text-sm">{PAGES[page].sub}</p>
            </div>

            <div className="space-y-6">

              {page === 0 && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">Business Name *</label>
                      <input className={inputClass} placeholder="e.g. Ace Plumbing Co." value={form.business_name} onChange={e => update("business_name", e.target.value)} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">Your Email *</label>
                      <input className={inputClass} type="email" placeholder="you@email.com" value={form.email} onChange={e => update("email", e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">What do you sell?</label>
                    <input className={inputClass} placeholder="e.g. Residential plumbing services / Women's clothing online" value={form.what_you_sell} onChange={e => update("what_you_sell", e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">Who is your ideal customer?</label>
                    <input className={inputClass} placeholder="e.g. Homeowners aged 35-65 in Pittsburgh" value={form.ideal_customer} onChange={e => update("ideal_customer", e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Business type *</label>
                    <SingleSelect options={BIZ_TYPES} field="business_type" form={form} onChange={update} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">Biggest competitor (optional)</label>
                    <input className={inputClass} placeholder="e.g. competitor name or website" value={form.biggest_competitor} onChange={e => update("biggest_competitor", e.target.value)} />
                  </div>
                </>
              )}

              {page === 1 && (
                <>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Your website right now *</label>
                    <SingleSelect options={WEBSITE_STATUS} field="website_status" form={form} onChange={update} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Are you currently running ads? *</label>
                    <SingleSelect options={CURRENT_ADS} field="current_ads" form={form} onChange={update} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Tracking pixels installed? *</label>
                    <SingleSelect options={PIXEL_STATUS} field="pixel_status" form={form} onChange={update} />
                  </div>
                </>
              )}

              {page === 2 && (
                <>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Primary advertising goal *</label>
                    <SingleSelect options={GOALS} field="ad_goal" form={form} onChange={update} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Monthly ad budget *</label>
                    <SingleSelect options={BUDGETS} field="monthly_budget" form={form} onChange={update} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">What does success look like for your ads?</label>
                    <textarea
                      className={inputClass + " min-h-[90px] resize-none"}
                      placeholder="e.g. 20 new leads per month, $5,000 in online sales, 50 new gym members"
                      value={form.success_goal}
                      onChange={e => update("success_goal", e.target.value)}
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
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/25"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canAdvance() || loading}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/25"
                >
                  {loading ? "Processing..." : "Get My Ad Strategy — $14.99"} <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
