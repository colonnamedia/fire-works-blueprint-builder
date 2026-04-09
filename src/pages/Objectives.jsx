import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Trash2, Save, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { DEFAULT_OBJECTIVES } from "@/lib/constants";

export default function Objectives() {
  const { toast } = useToast();
  const [objectives, setObjectives] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [selectedDraft, setSelectedDraft] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.BlueprintDraft.list("-created_date", 50).then((d) => {
      setDrafts(d);
      if (d.length > 0) {
        setSelectedDraft(d[0]);
        loadObjectives(d[0].id);
      } else {
        setObjectives(DEFAULT_OBJECTIVES.map((name, i) => ({
          objective_name: name, target_result: "", why_it_matters: "",
          related_channel: "", metric: "", weekly_focus_action: "", sort_order: i,
        })));
        setLoading(false);
      }
    });
  }, []);

  const loadObjectives = async (draftId) => {
    const o = await base44.entities.Objective.filter({ draft_id: draftId }, "sort_order");
    if (o.length > 0) {
      setObjectives(o);
    } else {
      setObjectives(DEFAULT_OBJECTIVES.map((name, i) => ({
        objective_name: name, target_result: "", why_it_matters: "",
        related_channel: "", metric: "", weekly_focus_action: "", sort_order: i,
      })));
    }
    setLoading(false);
  };

  const addObjective = () => {
    setObjectives(prev => [...prev, {
      objective_name: "", target_result: "", why_it_matters: "",
      related_channel: "", metric: "", weekly_focus_action: "", sort_order: prev.length,
    }]);
  };

  const removeObjective = (index) => {
    const obj = objectives[index];
    if (obj.id) {
      base44.entities.Objective.delete(obj.id);
    }
    setObjectives(prev => prev.filter((_, i) => i !== index));
  };

  const updateObjective = (index, field, value) => {
    setObjectives(prev => prev.map((o, i) => i === index ? { ...o, [field]: value } : o));
  };

  const saveAll = async () => {
    if (!selectedDraft) {
      toast({ title: "Please create a blueprint first", variant: "destructive" });
      return;
    }
    for (let i = 0; i < objectives.length; i++) {
      const obj = objectives[i];
      if (obj.id) {
        await base44.entities.Objective.update(obj.id, obj);
      } else {
        const created = await base44.entities.Objective.create({ ...obj, draft_id: selectedDraft.id });
        setObjectives(prev => prev.map((o, idx) => idx === i ? { ...o, id: created.id } : o));
      }
    }
    toast({ title: "Objectives saved!" });
  };

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Business Objectives</h1>
          <p className="text-muted-foreground mt-1">
            Define what you want to achieve and connect each objective to the channels and metrics that support it.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={addObjective} className="gap-2">
            <Plus className="w-4 h-4" /> Add Objective
          </Button>
          <Button onClick={saveAll} className="gap-2">
            <Save className="w-4 h-4" /> Save All
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {objectives.map((obj, i) => (
          <div key={i} className="bg-card rounded-xl border border-border p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <Input
                  value={obj.objective_name}
                  onChange={(e) => updateObjective(i, "objective_name", e.target.value)}
                  className="font-semibold border-0 px-0 text-base focus-visible:ring-0 shadow-none"
                  placeholder="Objective name..."
                />
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0" onClick={() => removeObjective(i)}>
                <Trash2 className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Target Result</Label>
                <Input value={obj.target_result || ""} onChange={(e) => updateObjective(i, "target_result", e.target.value)} placeholder="What do you want to achieve?" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Related Channel</Label>
                <Input value={obj.related_channel || ""} onChange={(e) => updateObjective(i, "related_channel", e.target.value)} placeholder="Google Ads, Email..." />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Metric</Label>
                <Input value={obj.metric || ""} onChange={(e) => updateObjective(i, "metric", e.target.value)} placeholder="CTR, conversion rate..." />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Weekly Focus Action</Label>
                <Input value={obj.weekly_focus_action || ""} onChange={(e) => updateObjective(i, "weekly_focus_action", e.target.value)} placeholder="What to do this week?" />
              </div>
            </div>

            <div className="mt-3 space-y-1">
              <Label className="text-xs">Why It Matters</Label>
              <Textarea value={obj.why_it_matters || ""} onChange={(e) => updateObjective(i, "why_it_matters", e.target.value)} rows={2} placeholder="Why is this objective important?" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}