import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, LayoutGrid } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const STEPS = [
  {
    id: "basics",
    question: "Tell us about your business.",
    fields: [
      { id: "business_name", label: "Business Name", type: "text", placeholder: "e.g. Acme Plumbing" },
      { id: "what_you_do", label: "What do you do?", type: "text", placeholder: "e.g. We fix residential plumbing issues" },
      { id: "email", label: "Your Email", type: "email", placeholder: "you@email.com" },
    ]
  },
  {
    id: "customer",
    question: "Who is your ideal customer?",
    fields: [
      { id: "ideal_customer", label: "Describe your ideal customer", type: "textarea", placeholder: "e.g. Homeowners aged 35-60 in the Pittsburgh area who need reliable plumbing services" },
    ]
  },
  {
    id: "goal",
    question: "What is your main goal right now?",
    fields: [
      {
        id: "main_goal", label: "Select your main goal", type: "select", options: [
          "Get more leads",
          "Convert more leads into customers",
          "Retain existing customers",
          "Build brand awareness",
        ]
      },
    ]
  },
  {
    id: "website",
    question: "Do you have a website?",
    fields: [
      {
        id: "has_website", label: "Website status", type: "select", options: [
          "Yes, it's live",
          "Yes but it needs work",
          "No, I need one",
          "In progress",
        ]
      },
    ]
  },
  {
    id: "marketing",
    question: "What marketing are you currently doing?",
    fields: [
      {
        id: "current_marketing", label: "Select all that apply", type: "multiselect", options: [
          "Google Ads",
          "Meta Ads (Facebook/Instagram)",
          "SEO",
          "Email Marketing",
          "Organic Social Media",
          "Word of Mouth / Referrals",
          "None yet",
        ]
      },
    ]
  },
  {
    id: "budget",
    question: "What is your monthly marketing budget?",
    fields: [
      {
        id: "monthly_budget", label: "Select a range", type: "select", options: [
          "$0 - $500",
          "$500 - $2,000",
          "$2,000 - $5,000",
          "$5,000+",
        ]
      },
      {
        id: "who_does_marketing", label: "Who handles your marketing?", type: "select", options: [
          "I do it myself",
          "An employee",
          "An agency",
          "Nobody yet",
        ]
      },
    ]
  },
  {
    id: "challenge",
    question: "What is your biggest marketing challenge?",
    fields: [
      {
        id: "biggest_challenge", label: "Select your biggest challenge", type: "select", options: [
          "Not enough traffic / people finding me",
          "Traffic but no conversions",
          "No follow-up system",
          "No clear strategy",
          "Limited budget",
          "No time to do marketing",
        ]
      },
    ]
  },
  {
    id: "history",
    question: "How long have you been in business?",
    fields: [
      {
        id: "years_in_business", label: "Select one", type: "select", options: [
          "Just starting out",
          "1-2 years",
          "3-5 years",
          "5+ years",
        ]
      },
    ]
  },
  {
    id: "success",
    question: "What does success look like in 90 days?",
    fields: [
      { id: "success_in_90_days", label: "Describe your 90-day goal", type: "textarea", placeholder: "e.g. I want 20 new leads per month and a clear system for following up with them" },
    ]
  },
];

export default function Questionnaire() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    business_name: "", what_you_do: "", email: "", ideal_customer: "",
    main_goal: "", has_website: "", current_marketing: [], monthly_budget: "",
    who_does_marketing: "", biggest_challenge: "", years_in_business: "",
    success_in_90_days: "",
  });

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const updateField = (id, value) => setForm(prev => ({ ...prev, [id]: value }));

  const toggleMultiselect = (id, value) => {
    setForm(prev => {
      const arr = prev[id] || [];
      return { ...prev, [id]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value] };
    });
  };

  const canProceed = () => {
    return current.fields.every(f => {
      if (f.type === 'multiselect') return (form[f.id] || []).length > 0;
      return form[f.id] && form[f.id].toString().trim() !== '';
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/submit-blueprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error('Failed to submit');

      // Go to payment
      const paymentRes = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blueprintId: data.id, email: form.email }),
      });
      const paymentData = await paymentRes.json();
      if (!paymentRes.ok) throw new Error('Failed to create payment');

      window.location.href = paymentData.url;
    } catch (err) {
      toast({ title: "Something went wrong.", description: "Please try again.", variant: "destructive" });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-100 px-6 py-4 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
          <LayoutGrid className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-gray-900">Blueprint Builder</span>
      </header>

      {/* Progress bar */}
      <div className="h-1.5 bg-gray-100">
        <div
          className="h-full bg-gradient-to-r from-violet-600 to-blue-600 transition-all duration-500"
          style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
        />
      </div>

      {/* Step counter */}
      <div className="text-center pt-8 pb-2">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">
          Step {step + 1} of {STEPS.length}
        </span>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-lg"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
              {current.question}
            </h2>

            <div className="space-y-4">
              {current.fields.map(field => (
                <div key={field.id}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>

                  {field.type === 'text' || field.type === 'email' ? (
                    <input
                      type={field.type}
                      value={form[field.id]}
                      onChange={e => updateField(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    />
                  ) : field.type === 'textarea' ? (
                    <textarea
                      value={form[field.id]}
                      onChange={e => updateField(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      rows={4}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                    />
                  ) : field.type === 'select' ? (
                    <div className="grid grid-cols-1 gap-2">
                      {field.options.map(opt => (
                        <button
                          key={opt}
                          onClick={() => updateField(field.id, opt)}
                          className={`text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                            form[field.id] === opt
                              ? 'border-violet-500 bg-violet-50 text-violet-700 font-medium'
                              : 'border-gray-200 hover:border-violet-300 hover:bg-violet-50/50'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  ) : field.type === 'multiselect' ? (
                    <div className="grid grid-cols-1 gap-2">
                      {field.options.map(opt => (
                        <button
                          key={opt}
                          onClick={() => toggleMultiselect(field.id, opt)}
                          className={`text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                            (form[field.id] || []).includes(opt)
                              ? 'border-violet-500 bg-violet-50 text-violet-700 font-medium'
                              : 'border-gray-200 hover:border-violet-300 hover:bg-violet-50/50'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep(s => s - 1)}
                disabled={step === 0}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              {isLast ? (
                <button
                  onClick={handleSubmit}
                  disabled={!canProceed() || loading}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-medium hover:from-violet-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-violet-500/25"
                >
                  {loading ? "Processing..." : "Get My Blueprint — $19.99"} <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setStep(s => s + 1)}
                  disabled={!canProceed()}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-medium hover:from-violet-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-violet-500/25"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
