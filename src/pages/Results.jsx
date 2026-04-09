import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { getCenterHubLabel, PRIORITY_COLORS, STATUS_COLORS } from "@/lib/constants";
import { FileDown, Printer, Copy, Plus, Lock, ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import StrategySnapshot from "../components/results/StrategySnapshot";
import AllocationChart from "../components/results/AllocationChart";
import WeeklyActionPlan from "../components/results/WeeklyActionPlan";
import AIAssistant from "../components/AIAssistant";
import EmailResultsModal from "../components/EmailResultsModal";
import MarketingSpider from "../components/results/MarketingSpider";
import MarketingFunnel from "../components/results/MarketingFunnel";
import PrioritySchedule from "../components/results/PrioritySchedule";
import { sendBlueprintEmail, sendAdminNotification } from "@/lib/blueprintEmail";

export default function Results() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [business, setBusiness] = useState(null);
  const [draft, setDraft] = useState(null);
  const [branches, setBranches] = useState([]);
  const [stages, setStages] = useState([]);
  const [objectives, setObjectives] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEmailModal, setShowEmailModal] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const draftId = params.get("draftId");
    const businessId = params.get("businessId");

    Promise.all([
      base44.auth.me().catch(() => null),
      draftId ? base44.entities.BlueprintDraft.filter({ id: draftId }).catch(() => []) : base44.entities.BlueprintDraft.list("-created_date", 1).catch(() => []),
      businessId ? base44.entities.Business.filter({ id: businessId }).catch(() => []) : base44.entities.Business.list("-created_date", 1).catch(() => []),
    ]).then(async ([u, dArr, bArr]) => {
      setUser(u);
      const d = dArr[0];
      const b = bArr[0];
      setDraft(d);
      setBusiness(b);

      if (d) {
        const [br, st, ob] = await Promise.all([
          base44.entities.BlueprintBranch.filter({ draft_id: d.id }, "sort_order").catch(() => []),
          base44.entities.CustomerJourneyStage.filter({ draft_id: d.id }, "sort_order").catch(() => []),
          base44.entities.Objective.filter({ draft_id: d.id }, "sort_order").catch(() => []),
        ]);
        setBranches(br);
        setStages(st);
        setObjectives(ob);

        // Auto-send email if paid and not yet sent
        if (
          (d.payment_status === "paid" || d.payment_status === "admin_free") &&
          !d.auto_email_sent &&
          b &&
          u?.email
        ) {
          sendBlueprintEmail({ toEmail: u.email, business: b, draft: d, branches: br, stages: st }).catch(() => {});
          if (d.payment_status === "paid") {
            sendAdminNotification({ business: b, draft: d, clientEmail: u.email }).catch(() => {});
          }
          base44.entities.BlueprintDraft.update(d.id, { auto_email_sent: true }).catch(() => {});
        }
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const isAdmin = user?.role === "admin";
  // Payment processing not yet set up — everything is free for now
  const isUnlocked = true;

  const copySummary = () => {
    if (!business || !draft) return;
    const hub = getCenterHubLabel(business.storefront_type);
    let text = `BUSINESS MARKETING BLUEPRINT\n\nBusiness: ${business.business_name}\nType: ${business.business_type}\nMain Goal: ${business.main_goal}\nHome Base: ${hub}\n\nCORE SYSTEM\nTraffic → Conversion → Follow-Up → Sales\n\nPRIMARY CHANNELS\n`;
    branches.forEach(b => {
      text += `\n${b.branch_name}\n  Purpose: ${b.purpose || "—"}\n  Objective: ${b.objective || "—"}\n  Time %: ${b.time_percent || 0}\n  Cost %: ${b.cost_percent || 0}\n  Metric: ${b.metric_to_watch || "—"}\n  If Weak: ${b.what_to_adjust_if_weak || "—"}\n`;
    });
    navigator.clipboard.writeText(text);
    toast({ title: "Summary copied to clipboard!" });
  };

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" /></div>;
  }

  if (!business && !draft) {
    return (
      <div className="text-center py-20">
        <h2 className="font-display text-2xl font-bold mb-2">No Blueprint Yet</h2>
        <p className="text-muted-foreground mb-6">Create your first blueprint to see results here</p>
        <Link to="/builder"><Button className="gap-2">Start Building <ArrowRight className="w-4 h-4" /></Button></Link>
      </div>
    );
  }

  const hub = business ? getCenterHubLabel(business.storefront_type) : "Website";

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 no-print">
        <div>
          <h1 className="font-display text-3xl font-bold">{business?.business_name || "Blueprint"} Results</h1>
          <p className="text-muted-foreground mt-1">Your generated marketing blueprint and strategy outputs</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={copySummary} className="gap-2">
            <Copy className="w-4 h-4" /> Copy Summary
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowEmailModal(true)} className="gap-2">
            <Mail className="w-4 h-4" /> Email Results
          </Button>
          {isUnlocked ? (
            <>
              <Button variant="outline" size="sm" onClick={() => navigate("/print" + window.location.search)} className="gap-2">
                <Printer className="w-4 h-4" /> Print / Save PDF
              </Button>
            </>
          ) : (
            <Button size="sm" className="gap-2" onClick={() => toast({ title: "Payment required", description: "$19.99 to unlock full blueprint, PDF export, and print view." })}>
              <Lock className="w-4 h-4" /> Unlock Full Blueprint — $19.99
            </Button>
          )}
          <Link to="/builder">
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="w-4 h-4" /> New Business
            </Button>
          </Link>
        </div>
      </div>

      {/* Strategy Snapshot */}
      <StrategySnapshot business={business} centerHub={hub} />

      {/* Channel Detail Cards */}
      <div>
        <h2 className="font-display text-xl font-semibold mb-4">Channel Details</h2>
        {!isUnlocked && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 text-sm text-amber-800">
            <Lock className="w-4 h-4 inline mr-2" />
            Full channel details are available after payment. Showing preview only.
          </div>
        )}
        <div className="grid md:grid-cols-2 gap-4">
          {branches.slice(0, isUnlocked ? undefined : 3).map((b, i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  {b.branch_name}
                  <div className="flex gap-1.5">
                    {b.priority_level && (
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${PRIORITY_COLORS[b.priority_level]}`}>
                        {b.priority_level}
                      </span>
                    )}
                    {b.status && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[b.status]}`}>
                        {b.status.replace(/_/g, " ")}
                      </span>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {b.purpose && <p><span className="font-medium">Purpose:</span> {b.purpose}</p>}
                {b.objective && <p><span className="font-medium">Objective:</span> {b.objective}</p>}
                <div className="grid grid-cols-2 gap-2">
                  <p><span className="font-medium">Time:</span> {b.time_percent || 0}%</p>
                  <p><span className="font-medium">Cost:</span> {b.cost_percent || 0}%</p>
                </div>
                {b.owner && <p><span className="font-medium">Owner:</span> {b.owner?.replace("_", " ")}</p>}
                {b.metric_to_watch && <p><span className="font-medium">Metric:</span> {b.metric_to_watch}</p>}
                {b.what_to_adjust_if_weak && <p><span className="font-medium">If Weak:</span> {b.what_to_adjust_if_weak}</p>}
                {b.review_note && <p className="text-xs text-muted-foreground italic">Review: {b.review_note}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Allocations */}
      <div className="grid md:grid-cols-2 gap-6">
        <AllocationChart title="Time Allocation" branches={branches} field="time_percent" />
        <AllocationChart title="Cost Allocation" branches={branches} field="cost_percent" />
      </div>

      {/* Customer Journey */}
      {stages.length > 0 && (
        <div>
          <h2 className="font-display text-xl font-semibold mb-4">Customer Journey Map</h2>
          {!isUnlocked && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 text-sm text-amber-800">
              <Lock className="w-4 h-4 inline mr-2" />
              Full journey map available after payment.
            </div>
          )}
          <div className="flex items-center gap-2 overflow-x-auto pb-4">
            {stages.slice(0, isUnlocked ? undefined : 4).map((s, i) => (
              <div key={i} className="flex items-center gap-2 flex-shrink-0">
                <div className="bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-medium min-w-[100px] text-center">
                  {s.stage_name}
                </div>
                {i < (isUnlocked ? stages.length : 4) - 1 && <ArrowRight className="w-4 h-4 text-muted-foreground" />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Objectives */}
      {objectives.length > 0 && (
        <div>
          <h2 className="font-display text-xl font-semibold mb-4">Objectives Summary</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {objectives.map((obj, i) => (
              <Card key={i}>
                <CardContent className="pt-6 space-y-2 text-sm">
                  <h3 className="font-semibold">{obj.objective_name}</h3>
                  {obj.target_result && <p><span className="font-medium">Target:</span> {obj.target_result}</p>}
                  {obj.related_channel && <p><span className="font-medium">Channel:</span> {obj.related_channel}</p>}
                  {obj.metric && <p><span className="font-medium">Metric:</span> {obj.metric}</p>}
                  {obj.weekly_focus_action && <p><span className="font-medium">Weekly Action:</span> {obj.weekly_focus_action}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Marketing Spider */}
      <MarketingSpider branches={branches} objectives={objectives} />

      {/* Marketing Funnel */}
      <MarketingFunnel stages={stages} branches={branches} />

      {/* Priority Schedule */}
      <PrioritySchedule branches={branches} />

      {/* Weekly Action Plan */}
      <WeeklyActionPlan draft={draft} branches={branches} />

      {/* Home Base Summary */}
      <div className="bg-primary/5 rounded-2xl p-8 text-center space-y-3">
        <h2 className="font-display text-xl font-semibold">Your Marketing Home Base</h2>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          This is the home base of your marketing plan. When results get unclear, return to this blueprint.
          Do not change every channel at once. Focus on the business objective, the current bottleneck,
          and the next 1–2 improvements.
        </p>
        <p className="text-sm font-medium text-primary">
          Traffic → Conversion → Follow-Up → Sales
        </p>
      </div>

      {/* AI Assistant */}
      <AIAssistant
        business={business}
        branches={branches}
        stages={stages}
        objectives={objectives}
        draft={draft}
      />

      {/* Email Modal */}
      {showEmailModal && (
        <EmailResultsModal
          business={business}
          draft={draft}
          branches={branches}
          stages={stages}
          objectives={objectives}
          onClose={() => setShowEmailModal(false)}
        />
      )}
    </div>
  );
}