import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
              <div className="px-4 pb-4 pt-2 border-t border-border space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">What Happens at This Stage</Label>
                  <Textarea
                    value={stage.stage_description || ""}
                    onChange={(e) => onUpdate(i, "stage_description", e.target.value)}
                    rows={2}
                    placeholder="Describe what happens..."
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Supporting Channel</Label>
                    <Input value={stage.supporting_channel || ""} onChange={(e) => onUpdate(i, "supporting_channel", e.target.value)} placeholder="Google Ads, Email..." />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Owner</Label>
                    <Input value={stage.owner || ""} onChange={(e) => onUpdate(i, "owner", e.target.value)} placeholder="Who handles this?" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Customer Action</Label>
                    <Input value={stage.customer_action || ""} onChange={(e) => onUpdate(i, "customer_action", e.target.value)} placeholder="What does the customer do?" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Business Action</Label>
                    <Input value={stage.business_action || ""} onChange={(e) => onUpdate(i, "business_action", e.target.value)} placeholder="What should you do?" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Drop-Off Risk</Label>
                  <Textarea value={stage.dropoff_risk || ""} onChange={(e) => onUpdate(i, "dropoff_risk", e.target.value)} rows={2} placeholder="Where can leads fall off?" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Improvement Plan</Label>
                  <Textarea value={stage.improvement_plan || ""} onChange={(e) => onUpdate(i, "improvement_plan", e.target.value)} rows={2} placeholder="How to improve this stage?" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}