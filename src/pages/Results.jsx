import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutGrid, CheckCircle, ArrowRight, Mail, Download } from "lucide-react";

export default function Results() {
  const [blueprint, setBlueprint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const blueprintId = params.get("blueprintId");
    const success = params.get("success");

    if (blueprintId && success === "true") {
      fetch(`/api/get-blueprint?id=${blueprintId}`)
        .then(res => res.json())
        .then(data => {
          setBlueprint(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 text-sm">Loading your blueprint...</p>
        </div>
      </div>
    );
  }

  if (!blueprint) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Blueprint not found</h2>
          <p className="text-gray-500">Please check your email for your blueprint.</p>
          <Link to="/" className="inline-flex items-center gap-2 text-violet-600 hover:underline text-sm">
            Back to home <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const { business_name, what_you_do, main_goal, biggest_challenge, success_in_90_days, roadmap, email } = blueprint;

  const phaseColors = {
    phase1: { border: "border-l-violet-500", badge: "bg-violet-100 text-violet-700", dot: "bg-violet-500" },
    phase2: { border: "border-l-blue-500", badge: "bg-blue-100 text-blue-700", dot: "bg-blue-500" },
    phase3: { border: "border-l-teal-500", badge: "bg-teal-100 text-teal-700", dot: "bg-teal-500" },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
            <LayoutGrid className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-900">Blueprint Builder</span>
        </div>
        <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
          Back to home
        </Link>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">

        {/* Success banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex items-start gap-4"
        >
          <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-emerald-900">Payment successful!</h3>
            <p className="text-emerald-700 text-sm mt-1">
              Your blueprint has been emailed to <strong>{email}</strong>. Check your inbox.
            </p>
          </div>
        </motion.div>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-violet-600 via-blue-600 to-teal-500 rounded-2xl p-8 text-white"
        >
          <p className="text-white/70 text-sm font-medium uppercase tracking-widest mb-2">Your 90-Day Roadmap</p>
          <h1 className="text-3xl font-bold mb-1">{business_name}</h1>
          <p className="text-white/80 text-sm">{what_you_do}</p>
        </motion.div>

        {/* Business summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl border border-gray-100 p-6"
        >
          <h2 className="font-semibold text-gray-900 mb-4">Your Snapshot</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: "Main Goal", value: main_goal },
              { label: "Biggest Challenge", value: biggest_challenge },
              { label: "90-Day Success", value: success_in_90_days },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">{item.label}</p>
                <p className="text-sm text-gray-700 font-medium">{item.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Phases */}
        {roadmap && ['phase1', 'phase2', 'phase3'].map((phaseKey, i) => {
          const phase = roadmap[phaseKey];
          const colors = phaseColors[phaseKey];
          return (
            <motion.div
              key={phaseKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className={`bg-white rounded-2xl border border-gray-100 border-l-4 ${colors.border} p-6`}
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-gray-900 text-lg">{phase.title}</h2>
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${colors.badge}`}>
                  {phase.timeframe}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-5 leading-relaxed">{phase.focus}</p>
              <ul className="space-y-3">
                {phase.actions.map((action, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full ${colors.dot} flex-shrink-0 mt-1.5`} />
                    <span className="text-sm text-gray-700">{action}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}

        {/* Email reminder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-violet-50 border border-violet-100 rounded-2xl p-6 flex items-center gap-4"
        >
          <Mail className="w-6 h-6 text-violet-500 flex-shrink-0" />
          <div>
            <p className="font-medium text-violet-900 text-sm">Blueprint emailed to you</p>
            <p className="text-violet-600 text-xs mt-0.5">Check <strong>{email}</strong> for your full report. Check spam if you don't see it.</p>
          </div>
        </motion.div>

        {/* CTA */}
        <div className="text-center pb-8">
          <Link to="/">
            <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:border-violet-300 hover:bg-violet-50 transition-all">
              Build Another Blueprint <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
