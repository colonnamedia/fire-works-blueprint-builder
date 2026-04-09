import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { DEFAULT_BRANCHES, JOURNEY_STAGES, getCenterHubLabel } from "@/lib/constants";
import BusinessBasicsForm from "../components/builder/BusinessBasicsForm";
import WebsiteHubForm from "../components/builder/WebsiteHubForm";
import ChannelsForm from "../components/builder/ChannelsForm";
import TimeCostForm from "../components/builder/TimeCostForm";
import StrategyForm from "../components/builder/StrategyForm";
import JourneyInputForm from "../components/builder/JourneyInputForm";
import ReviewForm from "../components/builder/ReviewForm";
import BuilderStepper from "../components/builder/BuilderStepper";
import BlueprintDiagram from "../components/diagram/BlueprintDiagram";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Sparkles, Eye } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const STEPS = [
  { id: "basics", label: "Business Basics" },
  { id: "website", label: "Website / Hub" },
  { id: "channels", label: "Channels" },
  { id: "timecost", label: "Time + Cost" },
  { id: "strategy", label: "Strategy" },
  { id: "journey", label: "Journey" },
  { id: "review", label: "Review" },
];

export default function Builder() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState("form"); // form, visual, hybrid
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [user, setUser] = useState(null);

  const [business, setBusiness] = useState({
    business_name: "",
    business_type: "",
    storefront_type: "non-storefront",
    industry: "",
    main_offer: "",
    secondary_offer: "",
    target_audience: "",
    service_area: "",
    average_ticket_value: 0,
    main_goal: "",
    secondary_goal: "",
    status: "draft",
    has_website: false,
    website_url: "",
    needs_landing_page: false,
    has_booking_form: false,
    has_lead_form: false,
    has_email_capture: false,
    has_crm: false,
    has_online_checkout: false,
    conversion_strength: "moderate",
    lead_response_speed: "moderate",
    selected_channels: [],
    monthly_marketing_budget: 0,
    weekly_time_available: 0,
    who_is_doing_marketing: "",
    can_create_content: false,
    can_run_ads: false,
    can_follow_up_quickly: false,
    email_list_size: 0,
    customer_list_size: 0,
    need_fast_leads: false,
    want_lowest_cost: false,
    want_long_term_growth: false,
    need_better_followup: false,
    need_better_conversion: false,
    want_automation: false,
    want_clear_homebase: false,
    strategy_style: "moderate",
    payment_status: "unpaid",
  });

  const [branches, setBranches] = useState(
    DEFAULT_BRANCHES.map((b, i) => ({
      ...b,
      purpose: "", objective: "", time_percent: 0, cost_percent: 0,
      priority_level: "medium", owner: "unassigned", status: "not_started",
      metric_to_watch: "", what_to_adjust_if_weak: "", review_note: "",
      while_waiting_action: "", notes: "", visible: true,
    }))
  );

  const [journeyStages, setJourneyStages] = useState(
    JOURNEY_STAGES.map((s, i) => ({
      stage_name: s,
      stage_description: "", supporting_channel: "", customer_action: "",
      business_action: "", owner: "", dropoff_risk: "", improvement_plan: "",
      sort_order: i,
    }))
  );

  const [reviewSettings, setReviewSettings] = useState({
    testing_period_days: 7,
    review_frequency: "weekly",
    max_variables_to_adjust: 2,
    key_metrics_to_watch: "",
    weekly_notes: "",
  });

  // Load existing business if URL has businessId
  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
    const params = new URLSearchParams(window.location.search);
    const bizId = params.get("businessId");
    if (bizId) {
      base44.entities.Business.filter({ id: bizId }).then((res) => {
        if (res.length > 0) setBusiness(prev => ({ ...prev, ...res[0] }));
      });
    }
  }, []);

  const updateBusiness = (field, value) => {
    setBusiness(prev => ({ ...prev, [field]: value }));
  };

  const updateBranch = (index, field, value) => {
    setBranches(prev => prev.map((b, i) => i === index ? { ...b, [field]: value } : b));
  };

  const addBranch = () => {
    setBranches(prev => [...prev, {
      branch_name: "New Channel", purpose: "", objective: "", time_percent: 0,
      cost_percent: 0, priority_level: "medium", owner: "unassigned", status: "not_started",
      metric_to_watch: "", what_to_adjust_if_weak: "", review_note: "",
      while_waiting_action: "", notes: "", visible: true, sort_order: prev.length,
    }]);
  };

  const removeBranch = (index) => {
    setBranches(prev => prev.filter((_, i) => i !== index));
  };

  const updateJourneyStage = (index, field, value) => {
    setJourneyStages(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
  };

  const saveDraft = async () => {
    setSaving(true);
    const isAdmin = user?.role === "admin";

    // Save business
    let savedBiz;
    if (business.id) {
      await base44.entities.Business.update(business.id, business);
      savedBiz = business;
    } else {
      savedBiz = await base44.entities.Business.create({
        ...business,
        payment_status: isAdmin ? "admin_free" : "unpaid",
      });
      setBusiness(prev => ({ ...prev, id: savedBiz.id }));
    }

    // Save draft
    const draftData = {
      business_id: savedBiz.id,
      draft_name: business.business_name + " Blueprint",
      center_hub_label: getCenterHubLabel(business.storefront_type),
      strategy_style: business.strategy_style,
      monthly_budget: business.monthly_marketing_budget,
      weekly_time_available: business.weekly_time_available,
      ...reviewSettings,
      status: "draft",
      payment_status: isAdmin ? "admin_free" : "unpaid",
      export_count: 0,
    };

    const savedDraft = await base44.entities.BlueprintDraft.create(draftData);

    // Save branches
    const branchData = branches.filter(b => b.visible).map(b => ({
      ...b, draft_id: savedDraft.id,
    }));
    if (branchData.length > 0) {
      await base44.entities.BlueprintBranch.bulkCreate(branchData);
    }

    // Save journey stages
    const stageData = journeyStages.map(s => ({ ...s, draft_id: savedDraft.id }));
    await base44.entities.CustomerJourneyStage.bulkCreate(stageData);

    setSaving(false);
    toast({ title: "Draft saved!", description: "Your blueprint draft has been saved." });
    return savedDraft;
  };

  const generateBlueprint = async () => {
    setGenerating(true);
    const draft = await saveDraft();
    await base44.entities.BlueprintDraft.update(draft.id, { status: "generated" });
    setGenerating(false);
    navigate(`/results?draftId=${draft.id}&businessId=${business.id || draft.business_id}`);
  };

  const centerHubLabel = business.storefront_type
    ? getCenterHubLabel(business.storefront_type)
    : "Website / Digital Storefront";

  const formSteps = {
    basics: <BusinessBasicsForm business={business} onChange={updateBusiness} />,
    website: <WebsiteHubForm business={business} onChange={updateBusiness} />,
    channels: <ChannelsForm business={business} onChange={updateBusiness} branches={branches} onUpdateBranch={updateBranch} onAddBranch={addBranch} onRemoveBranch={removeBranch} />,
    timecost: <TimeCostForm business={business} onChange={updateBusiness} branches={branches} onUpdateBranch={updateBranch} />,
    strategy: <StrategyForm business={business} onChange={updateBusiness} />,
    journey: <JourneyInputForm stages={journeyStages} onUpdate={updateJourneyStage} />,
    review: <ReviewForm settings={reviewSettings} onChange={(f, v) => setReviewSettings(prev => ({ ...prev, [f]: v }))} />,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">Blueprint Builder</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Build a simple marketing home base for your business
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Tabs value={mode} onValueChange={setMode}>
            <TabsList>
              <TabsTrigger value="form">Form</TabsTrigger>
              <TabsTrigger value="visual">Visual</TabsTrigger>
              <TabsTrigger value="hybrid">Hybrid</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {mode === "form" && (
        <div className="space-y-6">
          <BuilderStepper steps={STEPS} current={step} onStepClick={setStep} />
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
            {formSteps[STEPS[step].id]}
          </div>
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
              Previous
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={saveDraft} disabled={saving} className="gap-2">
                <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Draft"}
              </Button>
              {step === STEPS.length - 1 ? (
                <Button onClick={generateBlueprint} disabled={generating} className="gap-2">
                  <Sparkles className="w-4 h-4" /> {generating ? "Generating..." : "Generate Blueprint"}
                </Button>
              ) : (
                <Button onClick={() => setStep(Math.min(STEPS.length - 1, step + 1))}>
                  Next
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {mode === "visual" && (
        <div className="space-y-4">
          <BlueprintDiagram
            business={business}
            branches={branches}
            centerHubLabel={centerHubLabel}
            onUpdateBusiness={updateBusiness}
            onUpdateBranch={updateBranch}
            onAddBranch={addBranch}
            onRemoveBranch={removeBranch}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={saveDraft} disabled={saving} className="gap-2">
              <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Draft"}
            </Button>
            <Button onClick={generateBlueprint} disabled={generating} className="gap-2">
              <Sparkles className="w-4 h-4" /> {generating ? "Generating..." : "Generate Blueprint"}
            </Button>
          </div>
        </div>
      )}

      {mode === "hybrid" && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <BuilderStepper steps={STEPS} current={step} onStepClick={setStep} />
            <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
              {formSteps[STEPS[step].id]}
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} size="sm">
                Previous
              </Button>
              {step < STEPS.length - 1 ? (
                <Button onClick={() => setStep(step + 1)} size="sm">Next</Button>
              ) : null}
            </div>
          </div>
          <div className="space-y-4">
            <BlueprintDiagram
              business={business}
              branches={branches}
              centerHubLabel={centerHubLabel}
              onUpdateBusiness={updateBusiness}
              onUpdateBranch={updateBranch}
              onAddBranch={addBranch}
              onRemoveBranch={removeBranch}
            />
          </div>
          <div className="lg:col-span-2 flex justify-end gap-2">
            <Button variant="outline" onClick={saveDraft} disabled={saving} className="gap-2">
              <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Draft"}
            </Button>
            <Button onClick={generateBlueprint} disabled={generating} className="gap-2">
              <Sparkles className="w-4 h-4" /> {generating ? "Generating..." : "Generate Blueprint"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}