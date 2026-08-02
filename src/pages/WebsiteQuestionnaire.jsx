import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Globe, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const BIZ_TYPES = [
  { value: "restaurant", label: "Restaurant / Cafe / Bar", desc: "Dine-in, takeout, food truck, catering" },
  { value: "local_service", label: "Local Service Business", desc: "Plumber, electrician, HVAC, landscaper, cleaner" },
  { value: "gym_fitness", label: "Gym / Fitness Studio", desc: "Classes, personal training, boxing, yoga, wellness" },
  { value: "consultant_coach", label: "Consultant / Coach", desc: "Business coach, therapist, advisor, agency" },
  { value: "photographer", label: "Photographer / Creative", desc: "Weddings, portraits, events, videography" },
  { value: "online_store", label: "Online Store / E-commerce", desc: "Clothing, products, digital goods, Shopify/Etsy" },
  { value: "contractor", label: "Contractor / Trades", desc: "Builder, remodeler, roofer, painter, flooring" },
  { value: "retail", label: "Retail / Boutique", desc: "Brick & mortar store, boutique, gift shop" },
  { value: "medical", label: "Medical / Health / Wellness", desc: "Doctor, dentist, chiropractor, massage, spa" },
  { value: "real_estate", label: "Real Estate", desc: "Agent, broker, property management, investor" },
  { value: "salon_beauty", label: "Salon / Beauty", desc: "Hair salon, nail salon, barbershop, esthetician" },
  { value: "other", label: "Other / Something Else", desc: "I'll describe my business" },
];

const WEBSITE_STATUS = [
  { value: "none", label: "No website yet — starting from scratch" },
  { value: "poor", label: "Have one but it needs a complete rebuild" },
  { value: "okay", label: "Have one but it needs improvements" },
  { value: "building", label: "Currently being built" },
];

const BUILDER = [
  { value: "diy_wix", label: "DIY — Wix" },
  { value: "diy_squarespace", label: "DIY — Squarespace" },
  { value: "diy_shopify", label: "DIY — Shopify" },
  { value: "diy_wordpress", label: "DIY — WordPress" },
  { value: "diy_other", label: "DIY — Another platform" },
  { value: "designer", label: "Working with a web designer" },
  { value: "not_sure", label: "Not sure yet" },
];

const PRIMARY_GOALS = [
  { value: "get_leads", label: "Get leads and inquiries" },
  { value: "get_bookings", label: "Get bookings or appointments" },
  { value: "sell_products", label: "Sell products online" },
  { value: "drive_foot_traffic", label: "Drive foot traffic to my location" },
  { value: "show_portfolio", label: "Show my work / portfolio" },
  { value: "build_credibility", label: "Build trust and credibility" },
];

const PRIMARY_CTA = [
  { value: "call", label: "Call us" },
  { value: "book", label: "Book an appointment" },
  { value: "quote", label: "Get a quote" },
  { value: "order", label: "Order online" },
  { value: "reserve", label: "Make a reservation" },
  { value: "contact", label: "Contact / message us" },
  { value: "shop", label: "Shop now" },
  { value: "free_trial", label: "Start a free trial" },
];

const PAGES = [
  { title: "About your business", sub: "This tells us which website structure fits your business type." },
  { title: "Your website goals", sub: "A few more questions so we can tailor the page-by-page plan to what you actually need." },
];

function SingleSelect({ options, field, form, onChange, cols = 1 }) {
  return (
    <div className={`grid grid-cols-${cols} gap-2`}>
      {options.map(o => {
        const val = typeof o === "string" ? o : o.value;
        const label = typeof o === "string" ? o : o.label;
        const desc = o.desc || null;
        const sel = form[field] === val;
        return (
          <button key={val} type="button" onClick={() => onChange(field, val)}
            className={`text-left px-4 py-3 rounded-xl border text-sm transition-all ${sel ? "border-teal-500 bg-teal-50 text-teal-700 font-medium" : "border-gray-200 hover:border-teal-300 hover:bg-teal-50/40"}`}>
            <p className="font-medium">{label}</p>
            {desc && <p className={`text-xs mt-0.5 ${sel ? "text-teal-500" : "text-gray-400"}`}>{desc}</p>}
          </button>
        );
      })}
    </div>
  );
}

export default function WebsiteQuestionnaire() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    business_name: "", email: "", business_type: "", industry_note: "",
    website_status: "", builder: "",
    primary_goal: "", primary_cta: "",
    takes_reservations: "", sells_online: "", has_portfolio: "",
    emergency_service: "", specific_notes: "",
  });

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const canAdvance = () => {
    if (page === 0) return form.business_name && form.email && form.business_type;
    if (page === 1) return form.primary_goal && form.primary_cta;
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/submit-website-blueprint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error("Failed");

      const payRes = await fetch("/api/create-website-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blueprintId: data.id, email: form.email }),
      });
      const payData = await payRes.json();
      if (!payRes.ok) throw new Error("Payment failed");

      window.location.href = payData.url;
    } catch {
      toast({ title: "Something went wrong.", description: "Please try again.", variant: "destructive" });
      setLoading(false);
    }
  };

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent";
  const progress = ((page + 1) / 2) * 100;

  const showReservations = ["restaurant", "gym_fitness", "consultant_coach", "medical", "salon_beauty"].includes(form.business_type);
  const showSellsOnline = ["retail", "online_store", "restaurant"].includes(form.business_type);
  const showPortfolio = ["photographer", "contractor", "consultant_coach"].includes(form.business_type);
  const showEmergency = ["local_service", "contractor", "medical"].includes(form.business_type);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-gray-900">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
            <Globe className="w-4 h-4 text-white" />
          </div>
          Website Blueprint
        </Link>
        <span className="text-xs text-gray-400 font-medium">Step {page + 1} of 2</span>
      </header>

      <div className="h-1.5 bg-gray-100">
        <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-600 transition-all duration-500" style={{ width: `${progress}%` }} />
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
                      <input className={inputClass} placeholder="e.g. The Local Kitchen" value={form.business_name} onChange={e => update("business_name", e.target.value)} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">Your Email *</label>
                      <input className={inputClass} type="email" placeholder="you@email.com" value={form.email} onChange={e => update("email", e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">What type of business are you? *</label>
                    <SingleSelect options={BIZ_TYPES} field="business_type" form={form} onChange={update} />
                  </div>

                  {form.business_type === "other" && (
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">Describe your business</label>
                      <input className={inputClass} placeholder="e.g. We make custom furniture and sell locally" value={form.industry_note} onChange={e => update("industry_note", e.target.value)} />
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Your website right now</label>
                    <SingleSelect options={WEBSITE_STATUS} field="website_status" form={form} onChange={update} />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Who is building your website?</label>
                    <SingleSelect options={BUILDER} field="builder" form={form} onChange={update} cols={2} />
                  </div>
                </>
              )}

              {page === 1 && (
                <>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Primary goal of your website *</label>
                    <SingleSelect options={PRIMARY_GOALS} field="primary_goal" form={form} onChange={update} />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">What's the #1 action you want visitors to take? *</label>
                    <SingleSelect options={PRIMARY_CTA} field="primary_cta" form={form} onChange={update} cols={2} />
                  </div>

                  {showReservations && (
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Do you take reservations or appointments?</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[{v:"yes_third_party",l:"Yes — via third party (OpenTable, Calendly, etc.)"},{v:"yes_manual",l:"Yes — manually (phone/email)"},{v:"no",l:"No"}].map(o => (
                          <button key={o.v} onClick={() => update("takes_reservations", o.v)}
                            className={`text-left px-3 py-2.5 rounded-xl border text-xs transition-all ${form.takes_reservations === o.v ? "border-teal-500 bg-teal-50 text-teal-700" : "border-gray-200 hover:border-teal-300"}`}>
                            {o.l}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {showSellsOnline && (
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Do you sell products online?</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[{v:"yes",l:"Yes — online store"},{v:"want_to",l:"Want to add this"},{v:"no",l:"No — in-person only"}].map(o => (
                          <button key={o.v} onClick={() => update("sells_online", o.v)}
                            className={`text-left px-3 py-2.5 rounded-xl border text-xs transition-all ${form.sells_online === o.v ? "border-teal-500 bg-teal-50 text-teal-700" : "border-gray-200 hover:border-teal-300"}`}>
                            {o.l}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {showPortfolio && (
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Do you need a portfolio or past work gallery?</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[{v:"yes",l:"Yes — essential for my business"},{v:"nice_to_have",l:"Nice to have"},{v:"no",l:"Not needed"}].map(o => (
                          <button key={o.v} onClick={() => update("has_portfolio", o.v)}
                            className={`text-left px-3 py-2.5 rounded-xl border text-xs transition-all ${form.has_portfolio === o.v ? "border-teal-500 bg-teal-50 text-teal-700" : "border-gray-200 hover:border-teal-300"}`}>
                            {o.l}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {showEmergency && (
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Do you offer emergency or 24/7 service?</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[{v:"yes",l:"Yes — 24/7 or emergency service"},{v:"no",l:"No — standard hours only"}].map(o => (
                          <button key={o.v} onClick={() => update("emergency_service", o.v)}
                            className={`text-left px-3 py-2.5 rounded-xl border text-xs transition-all ${form.emergency_service === o.v ? "border-teal-500 bg-teal-50 text-teal-700" : "border-gray-200 hover:border-teal-300"}`}>
                            {o.l}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">Anything specific you want on your website? (optional)</label>
                    <textarea
                      className={inputClass + " min-h-[80px] resize-none"}
                      placeholder="e.g. I want a live chat, a video on the homepage, specific features..."
                      value={form.specific_notes}
                      onChange={e => update("specific_notes", e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-between mt-10">
              <button type="button"
                onClick={() => page === 0 ? navigate("/") : setPage(p => p - 1)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:border-gray-300 transition-all">
                <ArrowLeft className="w-4 h-4" /> {page === 0 ? "Home" : "Back"}
              </button>

              {page < 1 ? (
                <button type="button" onClick={() => setPage(p => p + 1)} disabled={!canAdvance()}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 text-white text-sm font-medium hover:from-teal-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-teal-500/25">
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button type="button" onClick={handleSubmit} disabled={!canAdvance() || loading}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 text-white text-sm font-medium hover:from-teal-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-teal-500/25">
                  {loading ? "Processing..." : "Get My Website Blueprint — $9.99"} <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
