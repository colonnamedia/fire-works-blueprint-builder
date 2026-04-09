import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { ArrowRight, Edit3, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { JOURNEY_STAGES } from "@/lib/constants";

const STAGE_GRADIENT = [
  "from-blue-500 to-blue-600",
  "from-indigo-500 to-indigo-600",
  "from-violet-500 to-violet-600",
  "from-purple-500 to-purple-600",
  "from-pink-500 to-pink-600",
  "from-rose-500 to-rose-600",
  "from-amber-500 to-amber-600",
  "from-emerald-500 to-emerald-600",
];

export default function Journey() {
  const { toast } = useToast();
  const [stages, setStages] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [selectedDraft, setSelectedDraft] = useState(null);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.BlueprintDraft.list("-created_date", 50).then((d) => {
      setDrafts(d);
      if (d.length > 0) {
        setSelectedDraft(d[0]);
        loadStages(d[0].id);
      } else {
        setLoading(false);
      }
    });
  }, []);

  const loadStages = async (draftId) => {
    const s = await base44.entities.CustomerJourneyStage.filter({ draft_id: draftId }, "sort_order");
    setStages(s.length > 0 ? s : JOURNEY_STAGES.map((name, i) => ({
      stage_name: name, stage_description: "", supporting_channel: "",
      customer_action: "", business_action: "", owner: "",
      dropoff_risk: "", improvement_plan: "", sort_order: i,
    })));
    setLoading(false);
  };

  const saveStage = async (index) => {
    const stage = stages[index];
    if (stage.id) {
      await base44.entities.CustomerJourneyStage.update(stage.id, stage);
    } else if (selectedDraft) {
      const created = await base44.entities.CustomerJourneyStage.create({ ...stage, draft_id: selectedDraft.id });
      setStages(prev => prev.map((s, i) => i === index ? { ...s, id: created.id } : s));
    }
    setEditing(null);
    toast({ title: "Stage saved!" });
  };

  const updateStage = (index, field, value) => {
    setStages(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
  };

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl font-bold">Customer Journey Map</h1>
        <p className="text-muted-foreground mt-1">
          Map every stage from awareness to referral. Each stage has an owner, action, and drop-off risk.
        </p>
      </div>

      {/* Visual flow */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4">
        {stages.map((stage, i) => (
          <div key={i} className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setEditing(editing === i ? null : i)}
              className={`bg-gradient-to-br ${STAGE_GRADIENT[i]} text-white px-4 py-3 rounded-xl text-sm font-medium shadow-sm hover:shadow-md transition-shadow min-w-[120px] text-center`}
            >
              {stage.stage_name}
            </button>
            {i < stages.length - 1 && <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
          </div>
        ))}
      </div>

      {/* Stage cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {stages.map((stage, i) => (
          <div key={i} className={`bg-card rounded-xl border border-border p-5 shadow-sm transition-shadow ${editing === i ? "ring-2 ring-primary shadow-md" : ""}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${STAGE_GRADIENT[i]} flex items-center justify-center text-white text-xs font-bold`}>
                  {i + 1}
                </div>
                <h3 className="font-semibold">{stage.stage_name}</h3>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditing(editing === i ? null : i)}>
                <Edit3 className="w-4 h-4" />
              </Button>
            </div>

            {editing === i ? (
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs">What Happens</Label>
                  <Textarea value={stage.stage_description || ""} onChange={(e) => updateStage(i, "stage_description", e.target.value)} rows={2} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Supporting Channel</Label>
                    <Input value={stage.supporting_channel || ""} onChange={(e) => updateStage(i, "supporting_channel", e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Owner</Label>
                    <Input value={stage.owner || ""} onChange={(e) => updateStage(i, "owner", e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Customer Action</Label>
                    <Input value={stage.customer_action || ""} onChange={(e) => updateStage(i, "customer_action", e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Business Action</Label>
                    <Input value={stage.business_action || ""} onChange={(e) => updateStage(i, "business_action", e.target.value)} />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Drop-Off Risk</Label>
                  <Textarea value={stage.dropoff_risk || ""} onChange={(e) => updateStage(i, "dropoff_risk", e.target.value)} rows={2} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Improvement Plan</Label>
                  <Textarea value={stage.improvement_plan || ""} onChange={(e) => updateStage(i, "improvement_plan", e.target.value)} rows={2} />
                </div>
                <Button size="sm" onClick={() => saveStage(i)} className="gap-2">
                  <Save className="w-3.5 h-3.5" /> Save Stage
                </Button>
              </div>
            ) : (
              <div className="space-y-2 text-sm">
                {stage.stage_description && <p className="text-muted-foreground">{stage.stage_description}</p>}
                {stage.supporting_channel && <p><span className="font-medium">Channel:</span> {stage.supporting_channel}</p>}
                {stage.customer_action && <p><span className="font-medium">Customer:</span> {stage.customer_action}</p>}
                {stage.business_action && <p><span className="font-medium">Business:</span> {stage.business_action}</p>}
                {stage.owner && <p><span className="font-medium">Owner:</span> {stage.owner}</p>}
                {stage.dropoff_risk && <p className="text-destructive text-xs"><span className="font-medium">Risk:</span> {stage.dropoff_risk}</p>}
                {!stage.stage_description && !stage.supporting_channel && (
                  <p className="text-muted-foreground italic text-xs">Click edit to fill in this stage</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}