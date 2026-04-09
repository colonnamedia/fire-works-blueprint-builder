import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, LayoutGrid, Map, PieChart, FileDown, CheckCircle, Sparkles, Zap, TrendingUp, Users, Star, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: "easeOut" },
});

const channels = [
  "Google Ads", "Meta Ads", "Email Automations", "SEO / Google", "SMS Follow-Up",
  "Referrals", "Organic Social", "Landing Pages", "Email Newsletters", "Sales Handling",
];

function PricingFeature({ text }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0 mt-0.5">
        <CheckCircle className="w-3 h-3 text-white" />
      </div>
      <span className="text-sm text-gray-700">{text}</span>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Nav */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
              <LayoutGrid className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-gray-900 text-lg">Blueprint Builder</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="text-gray-600">Dashboard</Button>
            </Link>
            <Link to="/builder">
              <Button size="sm" className="gap-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white border-0">
                Start Free <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-16 pb-24 px-4 overflow-hidden">
        {/* Background gradient blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-200 rounded-full blur-3xl opacity-40 -translate-y-1/2" />
          <div className="absolute top-20 right-1/4 w-80 h-80 bg-blue-200 rounded-full blur-3xl opacity-40" />
          <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-200 rounded-full blur-3xl opacity-30" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div {...fadeUp(0)}>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-50 to-blue-50 border border-violet-200 text-violet-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              AI-Powered Marketing Strategy Builder
              <span className="bg-violet-600 text-white text-xs px-2 py-0.5 rounded-full">NEW</span>
            </div>
          </motion.div>

          <motion.h1 {...fadeUp(0.1)} className="font-display text-5xl md:text-7xl font-bold leading-tight tracking-tight mb-6">
            <span className="text-gray-900">Build Your</span>
            <br />
            <span className="bg-gradient-to-r from-violet-600 via-blue-600 to-teal-500 bg-clip-text text-transparent">
              Marketing Blueprint
            </span>
          </motion.h1>

          <motion.p {...fadeUp(0.2)} className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Map your customer journey, marketing channels, time, cost, and weekly actions
            into <strong className="text-gray-700">one clear visual system.</strong>
            <br />Turn random marketing ideas into a structured plan.
          </motion.p>

          <motion.div {...fadeUp(0.3)} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/builder">
              <Button size="lg" className="gap-2 px-8 text-base bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white border-0 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all">
                Start Your Blueprint <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/results">
              <Button size="lg" variant="outline" className="px-8 text-base border-gray-200 hover:border-violet-300 hover:bg-violet-50">
                See Example
              </Button>
            </Link>
          </motion.div>

          <motion.p {...fadeUp(0.4)} className="mt-8 text-sm text-gray-400 italic">
            "Traffic → Conversion → Follow-Up → Sales"
          </motion.p>
        </div>

        {/* Scrolling channel badges */}
        <motion.div {...fadeUp(0.5)} className="mt-16 relative">
          <div className="flex gap-3 overflow-hidden">
            <div className="flex gap-3 animate-[scroll_20s_linear_infinite] flex-shrink-0">
              {[...channels, ...channels].map((c, i) => (
                <div key={i} className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border ${
                  i % 5 === 0 ? "bg-violet-50 text-violet-700 border-violet-200" :
                  i % 5 === 1 ? "bg-blue-50 text-blue-700 border-blue-200" :
                  i % 5 === 2 ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                  i % 5 === 3 ? "bg-amber-50 text-amber-700 border-amber-200" :
                  "bg-pink-50 text-pink-700 border-pink-200"
                }`}>
                  {c}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats bar */}
      <section className="py-8 bg-gradient-to-r from-violet-600 via-blue-600 to-teal-500">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center text-white">
          {[
            { val: "10+", label: "Marketing Channels" },
            { val: "8", label: "Journey Stages" },
            { val: "AI", label: "Strategy Advisor" },
            { val: "$19.99", label: "Per Blueprint" },
          ].map((s, i) => (
            <div key={i}>
              <div className="text-3xl font-bold font-display">{s.val}</div>
              <div className="text-sm opacity-80 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Value Cards */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp(0)} className="text-center mb-14">
            <h2 className="font-display text-4xl font-bold mb-3 text-gray-900">Everything in One Blueprint</h2>
            <p className="text-gray-500 text-lg">From chaos to clarity — all your marketing in one connected system</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: LayoutGrid,
                title: "Visual Business Map",
                desc: "See every marketing channel connected to your business center hub in a beautiful visual diagram.",
                gradient: "from-violet-500 to-purple-600",
                bg: "from-violet-50 to-purple-50",
              },
              {
                icon: Map,
                title: "Customer Journey",
                desc: "Map every stage from awareness to referral with actions, owners, and drop-off risk analysis.",
                gradient: "from-blue-500 to-indigo-600",
                bg: "from-blue-50 to-indigo-50",
              },
              {
                icon: PieChart,
                title: "Time + Cost Allocation",
                desc: "See exactly where your marketing time and money go with dynamic percentage breakdowns.",
                gradient: "from-teal-500 to-emerald-600",
                bg: "from-teal-50 to-emerald-50",
              },
              {
                icon: Sparkles,
                title: "AI Strategy Advisor",
                desc: "Get personalized recommendations, content ideas, and budget adjustments powered by AI.",
                gradient: "from-amber-500 to-orange-600",
                bg: "from-amber-50 to-orange-50",
              },
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 + 0.2 }}
                  className={`bg-gradient-to-br ${card.bg} rounded-2xl p-6 border border-white shadow-sm hover:shadow-md transition-all group`}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-gray-900">{card.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{card.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-violet-50/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl font-bold mb-3 text-gray-900">How It Works</h2>
            <p className="text-gray-500">Three simple steps to your complete marketing blueprint</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", color: "from-violet-500 to-purple-600", title: "Set Up Your Business", desc: "Enter your business basics, choose your storefront type, and select your active marketing channels." },
              { step: "02", color: "from-blue-500 to-indigo-600", title: "Build Your Blueprint", desc: "Fill in channel details, map your customer journey, define objectives, and set time & cost allocations." },
              { step: "03", color: "from-teal-500 to-emerald-600", title: "Generate & Export", desc: "View your complete blueprint, get AI strategy advice, download the PDF, and email yourself a copy." },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 + 0.2 }}
                className="text-center relative"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <span className="text-white font-display font-bold text-lg">{item.step}</span>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[40%] border-t-2 border-dashed border-gray-200" />
                )}
                <h3 className="font-semibold text-lg mb-2 text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Consultant phrases */}
      <section className="py-16 px-4 bg-gradient-to-r from-violet-900 via-blue-900 to-teal-900">
        <div className="max-w-4xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: "🏠", text: "Your website acts as your digital storefront — your marketing home base" },
              { icon: "📈", text: "Traffic → Conversion → Follow-Up → Sales" },
              { icon: "⏱️", text: "Run for 5–7 days, then adjust 1–2 variables — not everything" },
              { icon: "🎯", text: "Time and cost are the two main levers. Use them wisely." },
            ].map((q, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 + 0.2 }}
                className="flex items-start gap-3 bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10"
              >
                <span className="text-2xl flex-shrink-0">{q.icon}</span>
                <p className="text-white/90 text-sm font-medium leading-relaxed italic">"{q.text}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-4" id="pricing">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-display text-4xl font-bold mb-3 text-gray-900">Simple Pricing</h2>
            <p className="text-gray-500">One price, everything included. No subscriptions.</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative rounded-3xl overflow-hidden shadow-2xl"
          >
            {/* Gradient border effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500 via-blue-500 to-teal-500 p-0.5 rounded-3xl">
              <div className="bg-white h-full w-full rounded-3xl" />
            </div>

            <div className="relative bg-white rounded-3xl p-8">
              {/* Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <div className="bg-gradient-to-r from-violet-600 to-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                  MOST POPULAR
                </div>
              </div>

              <div className="text-center mb-8 pt-4">
                <div className="text-6xl font-bold font-display text-gray-900 mb-1">$19.99</div>
                <p className="text-gray-400">per business • one-time</p>
              </div>

              <div className="space-y-3 mb-8">
                <PricingFeature text="1 complete business blueprint draft" />
                <PricingFeature text="Full visual marketing diagram" />
                <PricingFeature text="Customer journey map (8 stages)" />
                <PricingFeature text="Time & cost allocation summary" />
                <PricingFeature text="AI Strategy Advisor access" />
                <PricingFeature text="Downloadable PDF export" />
                <PricingFeature text="Email results to client" />
                <PricingFeature text="Weekly action plan" />
              </div>

              <Link to="/builder" className="block">
                <Button
                  className="w-full gap-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white border-0 shadow-lg shadow-violet-500/25 py-6 text-base rounded-xl"
                  size="lg"
                >
                  Start Your Blueprint <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <p className="text-xs text-center text-gray-400 mt-4">
                Works whether you do marketing yourself or hire someone
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
                <LayoutGrid className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-white text-lg">Marketing Blueprint Builder</span>
            </div>
            <p className="text-gray-400 text-sm text-center">
              Build a simple marketing home base for your business.
            </p>
            <Link to="/builder">
              <Button size="sm" className="bg-gradient-to-r from-violet-600 to-blue-600 text-white border-0">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}