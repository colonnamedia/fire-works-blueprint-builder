import { useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PRIORITY_OPTIONS, OWNER_OPTIONS, STATUS_OPTIONS, PRIORITY_COLORS, STATUS_COLORS } from "@/lib/constants";

export default function ChannelsForm({ branches, onUpdateBranch, onAddBranch, onRemoveBranch }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold mb-1">Marketing Channels</h2>
        <p className="text-sm text-muted-foreground">
          Configure each branch of your marketing system. Not every channel needs to change at once.
        </p>
      </div>

      <div className="space-y-3">
        {branches.map((branch, i) => (
          <div key={i} className="border border-border rounded-xl overflow-hidden bg-card">
            <div
              className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => setExpanded(expanded === i ? null : i)}
            >
              <div className="flex items-center gap-3">
                <Switch
                  checked={branch.visible !== false}
                  onCheckedChange={(v) => onUpdateBranch(i, "visible", v)}
                  onClick={(e) => e.stopPropagation()}
                />
                <span className="font-medium text-sm">{branch.branch_name}</span>
                {branch.priority_level && branch.priority_level !== "medium" && (
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${PRIORITY_COLORS[branch.priority_level]}`}>
                    {branch.priority_level}
                  </span>
                )}
                {branch.status && branch.status !== "not_started" && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[branch.status]}`}>
                    {branch.status.replace("_", " ")}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); onRemoveBranch(i); }}>
                  <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                </Button>
                {expanded === i ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </div>

            {expanded === i && (
              <div className="px-4 pb-4 pt-2 border-t border-border space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Branch Name</Label>
                    <Input value={branch.branch_name} onChange={(e) => onUpdateBranch(i, "branch_name", e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Purpose</Label>
                    <Input value={branch.purpose || ""} onChange={(e) => onUpdateBranch(i, "purpose", e.target.value)} placeholder="What does this channel do?" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Objective</Label>
                  <Textarea value={branch.objective || ""} onChange={(e) => onUpdateBranch(i, "objective", e.target.value)} placeholder="What are you trying to achieve?" rows={2} />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Priority</Label>
                    <Select value={branch.priority_level || "medium"} onValueChange={(v) => onUpdateBranch(i, "priority_level", v)}>
                      <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {PRIORITY_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Owner</Label>
                    <Select value={branch.owner || "unassigned"} onValueChange={(v) => onUpdateBranch(i, "owner", v)}>
                      <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {OWNER_OPTIONS.map(o => <SelectItem key={o} value={o}>{o.replace("_", " ")}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Status</Label>
                    <Select value={branch.status || "not_started"} onValueChange={(v) => onUpdateBranch(i, "status", v)}>
                      <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map(o => <SelectItem key={o} value={o}>{o.replace(/_/g, " ")}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Time %</Label>
                    <Input type="number" min={0} max={100} value={branch.time_percent || ""} onChange={(e) => onUpdateBranch(i, "time_percent", parseInt(e.target.value) || 0)} />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Cost %</Label>
                    <Input type="number" min={0} max={100} value={branch.cost_percent || ""} onChange={(e) => onUpdateBranch(i, "cost_percent", parseInt(e.target.value) || 0)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Metric to Watch</Label>
                    <Input value={branch.metric_to_watch || ""} onChange={(e) => onUpdateBranch(i, "metric_to_watch", e.target.value)} placeholder="CTR, leads, calls..." />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">What to Adjust if Weak</Label>
                  <Textarea value={branch.what_to_adjust_if_weak || ""} onChange={(e) => onUpdateBranch(i, "what_to_adjust_if_weak", e.target.value)} rows={2} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">5–7 Day Review Note</Label>
                  <Textarea value={branch.review_note || ""} onChange={(e) => onUpdateBranch(i, "review_note", e.target.value)} rows={2} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">While-Waiting Action</Label>
                  <Input value={branch.while_waiting_action || ""} onChange={(e) => onUpdateBranch(i, "while_waiting_action", e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Notes</Label>
                  <Textarea value={branch.notes || ""} onChange={(e) => onUpdateBranch(i, "notes", e.target.value)} rows={2} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <Button variant="outline" onClick={onAddBranch} className="gap-2 w-full">
        <Plus className="w-4 h-4" /> Add Custom Channel
      </Button>
    </div>
  );
}