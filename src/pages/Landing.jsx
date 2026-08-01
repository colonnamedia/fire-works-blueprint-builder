import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, LayoutGrid, CheckCircle, Sparkles, Target, TrendingUp, Mail, Globe, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: "easeOut" },
});

const channels = [
  "Google Ads", "Meta Ads", "Email Automations", "SEO / Google", "SMS Follow-Up",
  "Referrals", "Organic Social", "Landing Pages", "Email Newsletters", "Retargeting",
  "Google Business Profile", "TikTok Shop", "Pinterest", "Booking Systems", "CRM Setup",
];

function Feature({ text }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0 mt-0.5">
        <CheckCircle className="w-3 h-3 text-white" />
      </div>
      <span className="text-sm text-gray-700">{text}</span>
    </div>
  );
}

function ComingSoon() {
  return (
    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">Coming Soon</span>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* Nav */}
      <header className="border-b border-gray-100 bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
              <LayoutGrid className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-base">Fire-Works Marketing Blueprint</span>
          </div>
          <Link to="/questionnaire">
            <Button size="sm" className="gap-1.5 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white border-0">
              Get Started <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-16 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-200 rounded-full blur-3xl opacity-30 -translate-y-1/2" />
          <div className="absolute top-20 right-1/4 w-80 h-80 bg-blue-200 rounded-full blur-3xl opacity-30" />
          <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-200 rounded-full blur-3xl opacity-20" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div {...fadeUp(0)}>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-50 to-blue-50 border border-violet-200 text-violet-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              Your Affordable Digital Marketing Consultant
            </div>
          </motion.div>

          <motion.h1 {...fadeUp(0.1)} className="text-5xl md:text-7xl font-bold leading-tight tracking-tight mb-6">
            <span className="text-gray-900">Build Your</span>
            <br />
            <span className="bg-gradient-to-r from-violet-600 via-blue-600 to-teal-500 bg-clip-text text-transparent">
              Digital Foundation
            </span>
          </motion.h1>

          <motion.p {...fadeUp(0.2)} className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-6 leading-relaxed">
            Answer a few questions and get a personalized strategy that tells you exactly what to build first, what to advertise, and how to turn attention into paying customers.
          </motion.p>

          <motion.p {...fadeUp(0.25)} className="text-base text-gray-700 max-w-xl mx-auto mb-10 font-medium">
            "Most businesses fail online not because they have bad products — but because they build their foundation in the wrong order."
          </motion.p>

          <motion.div {...fadeUp(0.3)} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/questionnaire">
              <Button size="lg" className="gap-2 px-8 text-base bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white border-0 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all">
                Start Your Blueprint — $19.99 <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/advertising">
              <Button size="lg" variant="outline" className="gap-2 px-8 text-base border-violet-200 text-violet-700 hover:bg-violet-50">
                Advertising Strategy — $14.99
              </Button>
            </Link>
          </motion.div>

          <motion.p {...fadeUp(0.4)} className="mt-6 text-sm text-gray-400">
            One-time payment · No subscription · PDF emailed instantly
          </motion.p>
        </div>

        <motion.div {...fadeUp(0.5)} className="mt-14 relative">
          <div className="flex gap-3 overflow-hidden">
            <div className="flex gap-3 animate-[scroll_25s_linear_infinite] flex-shrink-0">
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

      {/* Positioning strip */}
      <section className="py-8 bg-gradient-to-r from-violet-600 via-blue-600 to-teal-500">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center text-white">
          {[
            { val: "Foundation", label: "Build it right first" },
            { val: "Leads", label: "Generate consistently" },
            { val: "Convert", label: "Turn attention into sales" },
            { val: "Scale", label: "Systematize & grow" },
          ].map((s, i) => (
            <div key={i}>
              <div className="text-xl font-bold">{s.val}</div>
              <div className="text-sm opacity-80 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* The problem */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Most businesses get this backwards</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">They spend money on ads and social media before they've built the foundation that converts attention into customers.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
              <p className="font-semibold text-red-700 mb-4 text-base">❌ What most businesses do</p>
              <ul className="space-y-3 text-sm text-red-600">
                <li className="flex gap-2"><span>→</span>Start posting on every social media platform at once</li>
                <li className="flex gap-2"><span>→</span>Run ads before their website converts visitors</li>
                <li className="flex gap-2"><span>→</span>Spend on trending content before owning Google search</li>
                <li className="flex gap-2"><span>→</span>No follow-up system — leads disappear after first contact</li>
                <li className="flex gap-2"><span>→</span>No strategy — just reacting to what feels popular</li>
              </ul>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
              <p className="font-semibold text-emerald-700 mb-4 text-base">✓ What Fire-Works teaches you to do</p>
              <ul className="space-y-3 text-sm text-emerald-700">
                <li className="flex gap-2"><span>→</span>Build your website and Google presence first — where buyers search</li>
                <li className="flex gap-2"><span>→</span>Set up follow-up systems before driving traffic</li>
                <li className="flex gap-2"><span>→</span>Choose the right 2-3 platforms for your business type</li>
                <li className="flex gap-2"><span>→</span>Run ads only after your foundation converts</li>
                <li className="flex gap-2"><span>→</span>Systematize everything so it runs without you</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Products — consulting sessions */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-violet-50/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold mb-3 text-gray-900">Your consulting sessions</h2>
            <p className="text-gray-500 text-lg">Each guide is a focused consulting session on one area of your digital foundation. Start with the blueprint, then build from there.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">

            {/* Blueprint — featured */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-violet-200">
              <div className="bg-gradient-to-br from-violet-600 to-blue-600 p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <LayoutGrid className="w-5 h-5" />
                    <span className="font-bold text-base">Marketing Blueprint</span>
                  </div>
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full font-medium">Start Here</span>
                </div>
                <div className="text-3xl font-bold mb-1">$19.99</div>
                <p className="text-sm opacity-80">Your complete 90-day marketing roadmap</p>
              </div>
              <div className="bg-white p-6">
                <div className="space-y-2.5 mb-6">
                  <Feature text="Business-type specific priority order (local service, e-commerce, restaurant, consulting)" />
                  <Feature text="Hub & spoke marketing diagram — your home base and all channels" />
                  <Feature text="Phase 1 foundation, Phase 2 growth, Phase 3 scale action plans" />
                  <Feature text="SEO notes for your web designer built into Phase 1" />
                  <Feature text="Blog/content strategy recommendation for your industry" />
                  <Feature text="Week-by-week 90-day timeline" />
                  <Feature text="PDF emailed instantly" />
                </div>
                <Link to="/questionnaire" className="block">
                  <Button className="w-full gap-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white border-0 shadow-md py-5 rounded-xl text-sm">
                    Build My Blueprint <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Advertising Strategy */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-blue-200">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    <span className="font-bold text-base">Advertising Strategy Guide</span>
                  </div>
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full font-medium">New</span>
                </div>
                <div className="text-3xl font-bold mb-1">$14.99</div>
                <p className="text-sm opacity-80">Know exactly where and how to advertise</p>
              </div>
              <div className="bg-white p-6">
                <div className="space-y-2.5 mb-6">
                  <Feature text="Google vs Meta — which is right for your business and why" />
                  <Feature text="Ad type recommendations based on product vs service" />
                  <Feature text="Retargeting sequences — how to bring back lost visitors with the right offer" />
                  <Feature text="Budget allocation recommendations for your spending level" />
                  <Feature text="Step-by-step setup priorities so you don't waste money" />
                  <Feature text="Example retargeting flow: saw product → left → coupon ad → sale" />
                  <Feature text="PDF emailed instantly" />
                </div>
                <Link to="/advertising" className="block">
                  <Button className="w-full gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-md py-5 rounded-xl text-sm">
                    Get My Ad Strategy <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>

          </div>

          {/* Coming soon row */}
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: Globe, title: "Website Structure Guide", desc: "How to structure your website for what you're selling — service, product, or both.", color: "from-teal-500 to-emerald-500" },
              { icon: Mail, title: "Email Systems & Automations", desc: "Set up follow-up sequences, welcome series, and automations that run without you.", color: "from-amber-500 to-orange-500" },
              { icon: Zap, title: "CRM Setup Guide", desc: "Choose and configure the right CRM to track every lead from first contact to close.", color: "from-pink-500 to-rose-500" },
            ].map((p, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 opacity-75">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center mb-3`}>
                  <p.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-gray-900 text-sm">{p.title}</h3>
                  <ComingSoon />
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold mb-3 text-gray-900">How it works</h2>
            <p className="text-gray-500">A few questions → an AI-powered strategy → delivered instantly</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", color: "from-violet-500 to-purple-600", title: "Answer a few questions", desc: "Tell us about your business type, industry, current situation, goals, and budget." },
              { step: "02", color: "from-blue-500 to-indigo-600", title: "Secure one-time payment", desc: "No subscription. No recurring fees. Pay once and keep your guide forever." },
              { step: "03", color: "from-teal-500 to-emerald-600", title: "Get your strategy instantly", desc: "View your full plan on screen and receive a professionally formatted PDF by email." },
            ].map((item, i) => (
              <div key={i} className="text-center relative">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <span className="text-white font-bold text-lg">{item.step}</span>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[40%] border-t-2 border-dashed border-gray-200" />
                )}
                <h3 className="font-semibold text-lg mb-2 text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Consultant positioning */}
      <section className="py-20 px-4 bg-gradient-to-br from-violet-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">The more you build, the more personalized it gets</h2>
          <p className="text-lg opacity-80 max-w-2xl mx-auto mb-10">Fire-Works is designed to grow with your business. Start with the blueprint to understand your full strategy. Add the advertising guide when you're ready to run ads. Build each piece of your digital foundation step by step — with AI doing the strategic thinking.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/questionnaire">
              <Button size="lg" className="gap-2 px-8 bg-white text-violet-700 hover:bg-gray-50 border-0 font-semibold">
                Start With the Blueprint — $19.99 <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/advertising">
              <Button size="lg" variant="outline" className="gap-2 px-8 border-white/40 text-white hover:bg-white/10">
                Advertising Strategy — $14.99
              </Button>
            </Link>
          </div>
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
              <span className="font-bold text-white text-base">Fire-Works Marketing Blueprint</span>
            </div>
            <p className="text-gray-400 text-sm text-center">A Fire-Works Eco tool by Colonna Media</p>
            <Link to="/questionnaire">
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
