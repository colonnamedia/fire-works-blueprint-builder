import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CHANNELS = ["Google Ads", "Facebook/Instagram Ads", "Google My Business", "SEO / Blog", "Email Marketing", "SMS / Text", "Referrals / Word of Mouth", "Social Media Organic", "YouTube", "Direct Mail", "Events / In-Person", "Website / Landing Page", "Phone / Sales Call", "Other"];
const OWNERS = ["Me (Owner)", "Team Member", "Virtual Assistant", "Marketing Agency", "Contractor", "Automated / System", "Unassigned"];
const DROPOFF_RISKS = ["Low — most people move forward", "Medium — some people drop off here", "High — this is where we lose most people", "Unknown — need to track this"];

const STAGE_COLORS = [
  "border-l-blue-400", "border-l-indigo-400", "border-l-violet-400",
  "border-l-purple-400", "border-l-pink-400", "border-l-rose-400",
  "border-l-amber-400", "border-l-emerald-400",
];

export default function JourneyInputForm({ stages, onUpdate }) {
  const [expanded, setExpanded] = useState(0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold mb-1">Customer Journey</h2>
        <p className="text-sm text-muted-foreground">
          Map every stage from awareness to referral. Each stage has an owner, action, and potential drop-off risk.
        </p>
      </div>

      {/* Visual flow */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        {stages.map((s, i) => (
          <button
            key={i}
            onClick={() => setExpanded(i)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              expanded === i ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {s.stage_name}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {stages.map((stage, i) => (
          <div key={i} className={`border border-border rounded-xl overflow-hidden bg-card border-l-4 ${STAGE_COLORS[i]}`}>
            <div
              className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={() => setExpanded(expanded === i ? null : i)}
            >
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-mono">{i + 1}</span>
                <span className="font-medium text-sm">{stage.stage_name}</span>
              </div>
              {expanded === i ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>

            {expanded === i && (
              <div className="px-4 pb-4 pt-2 border-t border-border space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">What happens at this stage?</Label>
                  <p className="text-xs text-muted-foreground">Briefly describe the touchpoint — what the customer experiences here (e.g. "They see our Google Ad and click to the landing page").</p>
                  <Textarea
                    value={stage.stage_description || ""}
                    onChange={(e) => onUpdate(i, "stage_description", e.target.value)}
                    rows={2}
                    placeholder="e.g. Customer sees our ad and visits the website..."
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Which marketing channel drives this stage?</Label>
                    <p className="text-xs text-muted-foreground">What tool or platform brings people here?</p>
                    <Select value={stage.supporting_channel || ""} onValueChange={(v) => onUpdate(i, "supporting_channel", v)}>
                      <SelectTrigger><SelectValue placeholder="Select a channel..." /></SelectTrigger>
                      <SelectContent>
                        {CHANNELS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Who is responsible for this stage?</Label>
                    <p className="text-xs text-muted-foreground">Who manages or owns this touchpoint?</p>
                    <Select value={stage.owner || ""} onValueChange={(v) => onUpdate(i, "owner", v)}>
                      <SelectTrigger><SelectValue placeholder="Select owner..." /></SelectTrigger>
                      <SelectContent>
                        {OWNERS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">What does the customer do here?</Label>
                    <p className="text-xs text-muted-foreground">The action the customer takes (e.g. "clicks ad", "fills out form", "calls us").</p>
                    <Input value={stage.customer_action || ""} onChange={(e) => onUpdate(i, "customer_action", e.target.value)} placeholder="e.g. Fills out contact form..." />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">What should your business do in response?</Label>
                    <p className="text-xs text-muted-foreground">Your job at this stage (e.g. "Call back within 1 hour", "Send welcome email").</p>
                    <Input value={stage.business_action || ""} onChange={(e) => onUpdate(i, "business_action", e.target.value)} placeholder="e.g. Call them back within 1 hour..." />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">How likely are people to drop off at this stage?</Label>
                  <p className="text-xs text-muted-foreground">Be honest — this helps identify where your chain is broken.</p>
                  <Select value={stage.dropoff_risk || ""} onValueChange={(v) => onUpdate(i, "dropoff_risk", v)}>
                    <SelectTrigger><SelectValue placeholder="Select drop-off risk..." /></SelectTrigger>
                    <SelectContent>
                      {DROPOFF_RISKS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">How could you improve this stage?</Label>
                  <p className="text-xs text-muted-foreground">What's one thing you could do to get more people to move to the next step?</p>
                  <Textarea value={stage.improvement_plan || ""} onChange={(e) => onUpdate(i, "improvement_plan", e.target.value)} rows={2} placeholder="e.g. Add a stronger call-to-action button, follow up faster..." />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}