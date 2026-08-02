import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, LayoutGrid, CheckCircle, Target, Mail, Globe, Zap, Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: "easeOut" },
});

const ticker = [
  "Google Ads", "Meta Ads", "Email Automations", "SEO", "SMS Follow-Up",
  "Referrals", "Organic Social", "Landing Pages", "Retargeting",
  "Google Business Profile", "TikTok Shop", "Pinterest", "Booking Systems",
  "CRM Setup", "Website Structure", "Lead Capture",
];

const products = [
  {
    icon: LayoutGrid,
    tag: "Start Here",
    tagColor: "bg-violet-100 text-violet-700",
    title: "Business Blueprint",
    subtitle: "Build / Rebuild",
    question: "What should I work on first?",
    desc: "Get your personalized 90-day marketing roadmap. Know exactly what to build, what to fix, and in what order — based on your business type, industry, and goals.",
    price: "$19.99",
    cta: "Build My Blueprint",
    href: "/questionnaire",
    gradient: "from-violet-600 to-blue-600",
    border: "border-violet-200",
    available: true,
    includes: [
      "Priority order — what to do first, second, third",
      "Hub & spoke marketing diagram for your business",
      "90-day phase plan with SEO and content notes",
      "Week-by-week action timeline",
      "Business-type specific recommendations",
    ],
  },
  {
    icon: Target,
    tag: "Available Now",
    tagColor: "bg-blue-100 text-blue-700",
    title: "Advertising Blueprint",
    subtitle: "Google · Meta · Retargeting",
    question: "Where should I advertise and what should I spend?",
    desc: "Know exactly which platform is right for your business, how to allocate your budget, and how to set up retargeting that turns browsers into buyers.",
    price: "$14.99",
    cta: "Get My Ad Strategy",
    href: "/advertising",
    gradient: "from-blue-600 to-indigo-600",
    border: "border-blue-200",
    available: true,
    includes: [
      "Google vs Meta — which platform is right for you",
      "Retargeting sequence with step-by-step examples",
      "Budget allocation based on your spend level",
      "Ad type and creative recommendations",
      "Competitor strategy if applicable",
    ],
  },
 {
    icon: Globe,
    tag: "Available Now",
    tagColor: "bg-teal-100 text-teal-700",
    title: "Website Blueprint",
    subtitle: "Structure · Pages · Conversion",
    question: "What should my website actually have?",
    desc: "Get a page-by-page website plan based on your industry and what you're selling. Stop guessing what goes where — build a site that converts.",
    price: "$9.99",
    cta: "Get My Website Blueprint",
    href: "/website-blueprint",
    gradient: "from-teal-500 to-emerald-600",
    border: "border-teal-200",
    available: true,
    includes: [
      "Page-by-page site structure for your business type",
      "What to put above the fold on your homepage",
      "Service/product page recommendations",
      "Lead capture and CTA placement guide",
      "Mobile experience priorities",
    ],
  },
  {
    icon: Mail,
    tag: "Coming Soon",
    tagColor: "bg-gray-100 text-gray-500",
    title: "Automations Blueprint",
    subtitle: "Email · SMS · Follow-Up",
    question: "How do I follow up without doing it manually?",
    desc: "Get a complete automation plan — welcome sequences, lead follow-up, post-purchase flows, review requests, and re-engagement campaigns.",
    price: "Coming Soon",
    cta: null,
    href: null,
    gradient: "from-amber-500 to-orange-500",
    border: "border-gray-100",
    available: false,
    includes: [
      "Lead follow-up sequence for your business type",
      "Welcome series for new customers",
      "Review request automation",
      "Re-engagement campaign structure",
      "Tool recommendations for your budget",
    ],
  },
];

function Check({ text }) {
  return (
    <div className="flex items-start gap-2.5">
      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
      <span className="text-sm text-gray-600">{text}</span>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* Nav */}
      <header className="border-b border-gray-100 bg-white/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
              <LayoutGrid className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-sm sm:text-base">Fire-Works Marketing Blueprint</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/advertising">
              <Button variant="ghost" size="sm" className="text-gray-600 hidden sm:flex">Ad Strategy</Button>
            </Link>
            <Link to="/questionnaire">
              <Button size="sm" className="gap-1.5 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white border-0 text-xs sm:text-sm">
                Get Started <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-20 pb-16 px-4 overflow-hidden bg-gradient-to-b from-gray-50 to-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-violet-100 rounded-full blur-3xl opacity-40 -translate-y-1/2" />
          <div className="absolute top-20 right-1/4 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-30" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 bg-white border border-violet-200 text-violet-700 px-4 py-2 rounded-full text-xs font-medium mb-8 shadow-sm">
            <Zap className="w-3.5 h-3.5" />
            AI-powered · Personalized to your business · Delivered instantly
          </motion.div>

          <motion.h1 {...fadeUp(0.1)} className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight mb-6 text-gray-900">
            Build It Right.{" "}
            <span className="bg-gradient-to-r from-violet-600 via-blue-600 to-teal-500 bg-clip-text text-transparent">
              Then Grow It.
            </span>
          </motion.h1>

          <motion.p {...fadeUp(0.15)} className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-4 leading-relaxed">
            Practical, personalized blueprints for building a better business online.
          </motion.p>

          <motion.p {...fadeUp(0.2)} className="text-base text-gray-700 max-w-2xl mx-auto mb-10 leading-relaxed">
            Start with your complete business marketing roadmap — or choose a blueprint for the specific part of your business you want to improve.
          </motion.p>

          <motion.div {...fadeUp(0.25)} className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <Link to="/questionnaire">
              <Button size="lg" className="gap-2 px-7 text-sm bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white border-0 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 transition-all">
                Build My Blueprint — $19.99 <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/advertising">
              <Button size="lg" variant="outline" className="gap-2 px-7 text-sm border-blue-200 text-blue-700 hover:bg-blue-50">
                Advertising Strategy — $14.99
              </Button>
            </Link>
          </motion.div>

          <motion.p {...fadeUp(0.3)} className="text-xs text-gray-400">
            One-time payment · No subscription · PDF emailed instantly
          </motion.p>
        </div>
      </section>

      {/* Ticker */}
      <div className="py-5 bg-white border-y border-gray-100 overflow-hidden">
        <div className="flex gap-3">
          <div className="flex gap-3 animate-[scroll_30s_linear_infinite] flex-shrink-0">
            {[...ticker, ...ticker].map((c, i) => (
              <div key={i} className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium border ${
                i % 5 === 0 ? "bg-violet-50 text-violet-700 border-violet-200" :
                i % 5 === 1 ? "bg-blue-50 text-blue-700 border-blue-200" :
                i % 5 === 2 ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                i % 5 === 3 ? "bg-amber-50 text-amber-700 border-amber-200" :
                "bg-pink-50 text-pink-700 border-pink-200"
              }`}>{c}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Warning strip */}
      <section className="py-12 px-4 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Before you spend more on marketing, make sure your business is ready for it.</h2>
          <p className="text-gray-400 text-base max-w-3xl mx-auto leading-relaxed">
            Your website, lead capture, customer follow-up, content, advertising, and retargeting should work together — and in the right order. Most businesses spend money driving traffic to a site or system that isn't ready to convert it. Answer a few questions and get a personalized plan showing you what to work on first, what comes next, and where your time and money will have the biggest impact.
          </p>
        </div>
      </section>

      {/* Product cards */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Choose your blueprint</h2>
            <p className="text-gray-500 text-base max-w-2xl mx-auto">Each blueprint is a focused AI-powered guide for one area of your business. Start anywhere — but we recommend starting with the Business Blueprint so you know what order everything else should go in.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {products.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-2xl border ${p.border} overflow-hidden ${!p.available ? "opacity-70" : ""} bg-white shadow-sm hover:shadow-md transition-shadow`}
              >
                <div className={`bg-gradient-to-br ${p.gradient} p-5 text-white`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <p.icon className="w-5 h-5" />
                      <div>
                        <p className="font-bold text-sm">{p.title}</p>
                        <p className="text-xs opacity-70">{p.subtitle}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${p.tagColor}`}>{p.tag}</span>
                  </div>
                  <p className="text-lg font-bold leading-snug mb-1">"{p.question}"</p>
                  <p className="text-sm opacity-80 leading-relaxed">{p.desc}</p>
                </div>

                <div className="p-5">
                  <div className="space-y-2 mb-5">
                    {p.includes.map((item, j) => <Check key={j} text={item} />)}
                  </div>

                  {p.available ? (
                    <Link to={p.href} className="block">
                      <Button className={`w-full gap-2 bg-gradient-to-r ${p.gradient} text-white border-0 hover:opacity-90 transition-opacity py-5 rounded-xl text-sm font-medium`}>
                        {p.cta} — {p.price} <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  ) : (
                    <div className="w-full py-3 px-4 rounded-xl bg-gray-50 border border-gray-200 text-center">
                      <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                        <Clock className="w-4 h-4" />
                        <span>Coming Soon — Notify Me</span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How it works</h2>
            <p className="text-gray-500">A few questions → personalized AI strategy → delivered in minutes</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { n: "01", color: "from-violet-500 to-purple-600", title: "Answer a few questions", desc: "Tell us about your business type, industry, current situation, and goals. Takes about 3 minutes." },
              { n: "02", color: "from-blue-500 to-indigo-600", title: "One-time secure payment", desc: "No subscription. No recurring fees. Pay once, keep your blueprint forever." },
              { n: "03", color: "from-teal-500 to-emerald-600", title: "Get your strategy instantly", desc: "View your complete plan on screen and receive a professionally formatted PDF by email." },
            ].map((s, i) => (
              <div key={i} className="text-center relative">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <span className="text-white font-bold text-lg">{s.n}</span>
                </div>
                {i < 2 && <div className="hidden md:block absolute top-7 left-[60%] w-[40%] border-t-2 border-dashed border-gray-200" />}
                <h3 className="font-semibold text-base mb-2 text-gray-900">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The problem */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Most businesses do this in the wrong order</h2>
            <p className="text-gray-500 max-w-xl mx-auto">They spend money on ads and social media before building the foundation that converts attention into customers.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
              <p className="font-semibold text-red-700 mb-4 text-sm flex items-center gap-2">❌ What most businesses do</p>
              <ul className="space-y-3 text-sm text-red-600">
                {["Start posting on every social platform at once", "Run ads before their website converts visitors", "Spend on trending content before owning Google search", "No follow-up system — leads disappear after first contact", "No strategy — just reacting to what feels popular"].map((t, i) => (
                  <li key={i} className="flex gap-2"><span className="opacity-60">→</span>{t}</li>
                ))}
              </ul>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
              <p className="font-semibold text-emerald-700 mb-4 text-sm flex items-center gap-2">✓ What Fire-Works helps you do</p>
              <ul className="space-y-3 text-sm text-emerald-700">
                {["Build your website and Google presence first — where buyers search", "Set up follow-up systems before driving traffic", "Choose the right 2-3 platforms for your business type", "Run ads only after your foundation converts visitors", "Systematize everything so it runs without you"].map((t, i) => (
                  <li key={i} className="flex gap-2"><span className="opacity-60">→</span>{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="py-16 px-4 bg-gradient-to-r from-violet-600 via-blue-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">The more blueprints you build, the clearer your path becomes.</h2>
            <p className="opacity-80 text-sm max-w-lg">Start with one. Build from there. Each guide gets more specific to your business and builds on what came before.</p>
          </div>
          <div className="flex flex-col gap-3 flex-shrink-0">
            <Link to="/questionnaire">
              <Button size="lg" className="gap-2 w-full bg-white text-violet-700 hover:bg-gray-50 border-0 font-semibold text-sm">
                Business Blueprint — $19.99 <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/advertising">
              <Button size="lg" variant="outline" className="gap-2 w-full border-white/40 text-white hover:bg-white/10 text-sm">
                Advertising Strategy — $14.99
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 bg-gray-900">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
              <LayoutGrid className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-white text-sm">Fire-Works Marketing Blueprint</span>
          </div>
          <p className="text-gray-500 text-xs">A Fire-Works Eco tool by Colonna Media · fireworks-businessblueprint.com</p>
          <Link to="/questionnaire">
            <Button size="sm" className="bg-gradient-to-r from-violet-600 to-blue-600 text-white border-0 text-xs">Get Started</Button>
          </Link>
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
