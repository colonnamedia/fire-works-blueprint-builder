import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Sparkles, X, Send, Loader2, ChevronDown, ChevronUp, Copy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import ReactMarkdown from "react-markdown";

const QUICK_PROMPTS = [
  { label: "Improve My Strategy", prompt: "Analyze my marketing setup and suggest 3 specific improvements I should make right now." },
  { label: "New Channel Ideas", prompt: "Based on my business type and goals, suggest 2-3 new marketing channels I haven't tried yet. Explain why each fits my situation." },
  { label: "Budget Reallocation", prompt: "Analyze my current time and cost allocations across channels. Where should I shift budget for better ROI? Be specific with percentages." },
  { label: "Content Ideas", prompt: "Generate 5 specific content ideas for my top marketing channels that match my target audience. Include headlines and formats." },
  { label: "Draft Ad Copy", prompt: "Write 2 ad copy variations for my main offer — one for Google Ads (80 chars) and one for Meta Ads (150 chars)." },
  { label: "Fix Weak Points", prompt: "What are the weakest points in my current marketing funnel and how do I fix them in the next 7 days?" },
];

export default function AIAssistant({ business, branches, stages, objectives, draft }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const buildContext = () => {
    const activeBranches = (branches || []).filter(b => b.visible !== false);
    return `
BUSINESS CONTEXT:
- Name: ${business?.business_name || "Unknown"}
- Type: ${business?.business_type || "Unknown"}
- Industry: ${business?.industry || "Unknown"}
- Storefront: ${business?.storefront_type || "non-storefront"}
- Main Offer: ${business?.main_offer || "Unknown"}
- Target Audience: ${business?.target_audience || "Unknown"}
- Main Goal: ${business?.main_goal || "Unknown"}
- Strategy Style: ${business?.strategy_style || "moderate"}
- Monthly Budget: $${business?.monthly_marketing_budget || 0}
- Weekly Time Available: ${business?.weekly_time_available || 0} hours
- Has Website: ${business?.has_website ? "Yes" : "No"}
- Conversion Strength: ${business?.conversion_strength || "moderate"}
- Lead Response Speed: ${business?.lead_response_speed || "moderate"}
- Email List Size: ${business?.email_list_size || 0}
- Needs: ${[
  business?.need_fast_leads && "Fast Leads",
  business?.want_long_term_growth && "Long-Term Growth",
  business?.need_better_followup && "Better Follow-Up",
  business?.need_better_conversion && "Better Conversion",
  business?.want_automation && "Automation",
].filter(Boolean).join(", ") || "Not specified"}

ACTIVE MARKETING CHANNELS:
${activeBranches.map(b => `- ${b.branch_name}: Purpose: ${b.purpose || "N/A"} | Time: ${b.time_percent || 0}% | Cost: ${b.cost_percent || 0}% | Priority: ${b.priority_level || "medium"} | Status: ${b.status || "not_started"} | Metric: ${b.metric_to_watch || "N/A"}`).join("\n")}

CUSTOMER JOURNEY STAGES:
${(stages || []).map(s => `- ${s.stage_name}: ${s.stage_description || "No details"} | Drop-off risk: ${s.dropoff_risk || "N/A"}`).join("\n")}

OBJECTIVES:
${(objectives || []).map(o => `- ${o.objective_name}: Target: ${o.target_result || "N/A"} | Channel: ${o.related_channel || "N/A"}`).join("\n")}

You are a senior marketing strategist and consultant. Give specific, actionable advice. Use consultant language. Reference the business data above. Be concise but thorough. Format with clear sections when helpful.
    `.trim();
  };

  const sendMessage = async (text) => {
    const msg = text || input;
    if (!msg.trim() || loading) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: msg }]);
    setLoading(true);

    const context = buildContext();
    const fullPrompt = `${context}\n\nUSER QUESTION: ${msg}`;

    const response = await base44.integrations.Core.InvokeLLM({ prompt: fullPrompt });
    setMessages(prev => [...prev, { role: "assistant", content: response }]);
    setLoading(false);
  };

  const copyMessage = (content) => {
    navigator.clipboard.writeText(content);
    toast({ title: "Copied!" });
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 font-medium text-sm"
      >
        <Sparkles className="w-4 h-4" />
        AI Strategy Advisor
      </button>

      {/* Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div className="flex-1 bg-black/40" onClick={() => setOpen(false)} />

          {/* Panel */}
          <div className="w-full max-w-md bg-card shadow-2xl flex flex-col border-l border-border">
            {/* Header */}
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <Sparkles className="w-5 h-5" />
                <div>
                  <p className="font-semibold text-sm">AI Strategy Advisor</p>
                  <p className="text-xs opacity-80">Analyzing your blueprint...</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick prompts */}
            <div className="px-4 py-3 border-b border-border">
              <p className="text-xs text-muted-foreground mb-2 font-medium">Quick Actions</p>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_PROMPTS.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(q.prompt)}
                    disabled={loading}
                    className="text-xs bg-violet-50 text-violet-700 border border-violet-200 px-2.5 py-1.5 rounded-full hover:bg-violet-100 transition-colors disabled:opacity-50"
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Sparkles className="w-10 h-10 mx-auto mb-3 text-violet-300" />
                  <p className="text-sm font-medium">Ask me anything about your marketing strategy</p>
                  <p className="text-xs mt-1">I've analyzed your business data and I'm ready to help</p>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`space-y-1 ${msg.role === "user" ? "flex flex-col items-end" : ""}`}>
                  {msg.role === "user" ? (
                    <div className="bg-primary text-primary-foreground px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[85%] text-sm">
                      {msg.content}
                    </div>
                  ) : (
                    <div className="bg-violet-50 border border-violet-100 rounded-2xl rounded-tl-sm px-4 py-3 text-sm">
                      <div className="prose prose-sm max-w-none text-foreground">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                      <button
                        onClick={() => copyMessage(msg.content)}
                        className="mt-2 text-xs text-violet-500 hover:text-violet-700 flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" /> Copy
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Loader2 className="w-4 h-4 animate-spin text-violet-500" />
                  Analyzing your blueprint...
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder="Ask about strategy, content, budget, channels..."
                  rows={2}
                  className="resize-none text-sm"
                />
                <Button
                  size="icon"
                  onClick={() => sendMessage()}
                  disabled={loading || !input.trim()}
                  className="bg-violet-600 hover:bg-violet-700 self-end"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}