import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { getCenterHubLabel } from "@/lib/constants";
import { Printer, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import moment from "moment";

export default function PrintView() {
  const [business, setBusiness] = useState(null);
  const [draft, setDraft] = useState(null);
  const [branches, setBranches] = useState([]);
  const [stages, setStages] = useState([]);
  const [objectives, setObjectives] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const draftId = params.get("draftId");
    const businessId = params.get("businessId");

    Promise.all([
      base44.auth.me(),
      draftId ? base44.entities.BlueprintDraft.filter({ id: draftId }) : base44.entities.BlueprintDraft.list("-created_date", 1),
      businessId ? base44.entities.Business.filter({ id: businessId }) : base44.entities.Business.list("-created_date", 1),
    ]).then(async ([u, dArr, bArr]) => {
      setUser(u);
      const d = dArr[0];
      const b = bArr[0];
      setDraft(d);
      setBusiness(b);
      if (d) {
        const [br, st, ob] = await Promise.all([
          base44.entities.BlueprintBranch.filter({ draft_id: d.id }, "sort_order"),
          base44.entities.CustomerJourneyStage.filter({ draft_id: d.id }, "sort_order"),
          base44.entities.Objective.filter({ draft_id: d.id }, "sort_order"),
        ]);
        setBranches(br);
        setStages(st);
        setObjectives(ob);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" /></div>;
  }

  // Free for now — payment not yet configured
  const isUnlocked = true;

  if (!isUnlocked) {
    return (
      <div className="text-center py-20">
        <h2 className="font-display text-2xl font-bold mb-2">Print View Locked</h2>
        <p className="text-muted-foreground mb-6">Payment required to access print view</p>
        <Link to="/results"><Button>Back to Results</Button></Link>
      </div>
    );
  }

  const hub = business ? getCenterHubLabel(business.storefront_type) : "Website";
  const today = moment().format("MMMM D, YYYY");

  return (
    <div>
      {/* Controls */}
      <div className="no-print flex items-center justify-between mb-6">
        <Link to={`/results${window.location.search}`}>
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Results
          </Button>
        </Link>
        <Button onClick={() => window.print()} size="sm" className="gap-2">
          <Printer className="w-4 h-4" /> Print / Save as PDF
        </Button>
      </div>

      {/* Print content */}
      <div className="max-w-3xl mx-auto space-y-8 print:space-y-6">
        {/* Page 1: Header */}
        <div className="text-center space-y-4 pb-8 border-b border-border">
          <h1 className="font-display text-3xl font-bold">Business Marketing Blueprint</h1>
          <p className="text-lg text-muted-foreground italic">Your Marketing Home Base</p>
          <div className="space-y-1">
            <p className="text-xl font-semibold">{business?.business_name}</p>
            <p className="text-muted-foreground">{business?.business_type} • {business?.industry}</p>
            <p className="text-sm text-muted-foreground">Generated {today}</p>
          </div>
          <div className="bg-muted/50 rounded-xl p-4 max-w-md mx-auto">
            <p className="font-semibold">Main Goal: {business?.main_goal || "—"}</p>
            <p className="text-sm text-muted-foreground mt-1">Center Hub: {hub}</p>
          </div>
          <p className="text-sm font-semibold text-primary">Traffic → Conversion → Follow-Up → Sales</p>
        </div>

        {/* Page 2: Channels */}
        <div className="space-y-4">
          <h2 className="font-display text-xl font-bold">Primary Marketing Channels</h2>
          {branches.map((b, i) => (
            <div key={i} className="border border-border rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{b.branch_name}</h3>
                <span className="text-xs bg-muted px-2 py-1 rounded">{b.priority_level}</span>
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
                <p><span className="font-medium">Purpose:</span> {b.purpose || "—"}</p>
                <p><span className="font-medium">Objective:</span> {b.objective || "—"}</p>
                <p><span className="font-medium">Time %:</span> {b.time_percent || 0}%</p>
                <p><span className="font-medium">Cost %:</span> {b.cost_percent || 0}%</p>
                <p><span className="font-medium">Metric:</span> {b.metric_to_watch || "—"}</p>
                <p><span className="font-medium">If Weak:</span> {b.what_to_adjust_if_weak || "—"}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Page 3: Journey */}
        {stages.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-border">
            <h2 className="font-display text-xl font-bold">Customer Journey Map</h2>
            <div className="flex items-center gap-1 text-sm font-medium flex-wrap">
              {stages.map((s, i) => (
                <span key={i}>
                  {s.stage_name}{i < stages.length - 1 ? " → " : ""}
                </span>
              ))}
            </div>
            <div className="space-y-3">
              {stages.map((s, i) => (
                <div key={i} className="border border-border rounded-lg p-3 text-sm">
                  <h4 className="font-semibold mb-1">{i + 1}. {s.stage_name}</h4>
                  {s.stage_description && <p>{s.stage_description}</p>}
                  <div className="grid grid-cols-2 gap-1 mt-1 text-muted-foreground">
                    {s.supporting_channel && <p>Channel: {s.supporting_channel}</p>}
                    {s.owner && <p>Owner: {s.owner}</p>}
                    {s.customer_action && <p>Customer: {s.customer_action}</p>}
                    {s.business_action && <p>Business: {s.business_action}</p>}
                  </div>
                  {s.dropoff_risk && <p className="text-xs text-destructive mt-1">Risk: {s.dropoff_risk}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Page 4: Objectives + Allocations */}
        {objectives.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-border">
            <h2 className="font-display text-xl font-bold">Objectives Summary</h2>
            <div className="space-y-2">
              {objectives.map((o, i) => (
                <div key={i} className="border border-border rounded-lg p-3 text-sm">
                  <h4 className="font-semibold">{o.objective_name}</h4>
                  <div className="grid grid-cols-2 gap-1 text-muted-foreground mt-1">
                    {o.target_result && <p>Target: {o.target_result}</p>}
                    {o.related_channel && <p>Channel: {o.related_channel}</p>}
                    {o.metric && <p>Metric: {o.metric}</p>}
                    {o.weekly_focus_action && <p>Weekly Action: {o.weekly_focus_action}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Time + Cost tables */}
        <div className="space-y-4 pt-4 border-t border-border">
          <h2 className="font-display text-xl font-bold">Time & Cost Allocation</h2>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 font-semibold">Channel</th>
                <th className="text-right py-2 font-semibold">Time %</th>
                <th className="text-right py-2 font-semibold">Cost %</th>
              </tr>
            </thead>
            <tbody>
              {branches.map((b, i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="py-1.5">{b.branch_name}</td>
                  <td className="text-right">{b.time_percent || 0}%</td>
                  <td className="text-right">{b.cost_percent || 0}%</td>
                </tr>
              ))}
              <tr className="font-semibold">
                <td className="py-1.5">Total</td>
                <td className="text-right">{branches.reduce((a, b) => a + (b.time_percent || 0), 0)}%</td>
                <td className="text-right">{branches.reduce((a, b) => a + (b.cost_percent || 0), 0)}%</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Weekly Review */}
        <div className="space-y-3 pt-4 border-t border-border">
          <h2 className="font-display text-xl font-bold">Weekly Review Notes</h2>
          <div className="bg-muted/50 rounded-xl p-4 space-y-2 text-sm">
            <p>• Run this plan for {draft?.testing_period_days || 7} days</p>
            <p>• Review the main bottleneck</p>
            <p>• Adjust only {draft?.max_variables_to_adjust || 2} variable(s)</p>
            <p>• Do not restart the entire system</p>
            <p>• Return to the home base if results feel unclear</p>
            {draft?.weekly_notes && <p className="mt-2 italic">{draft.weekly_notes}</p>}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-8 border-t border-border text-sm text-muted-foreground">
          <p>Generated by Marketing Blueprint Builder</p>
          <p>{today}</p>
        </div>
      </div>
    </div>
  );
}