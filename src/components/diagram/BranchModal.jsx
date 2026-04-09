import { X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PRIORITY_OPTIONS, OWNER_OPTIONS, STATUS_OPTIONS } from "@/lib/constants";

export default function BranchModal({ branch, onUpdate, onClose, onRemove }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div
        className="bg-card rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[85vh] overflow-y-auto shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h3 className="font-display text-lg font-semibold">{branch.branch_name}</h3>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={onRemove}>
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Branch Name</Label>
            <Input value={branch.branch_name} onChange={(e) => onUpdate("branch_name", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Purpose</Label>
            <Input value={branch.purpose || ""} onChange={(e) => onUpdate("purpose", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Objective</Label>
            <Textarea value={branch.objective || ""} onChange={(e) => onUpdate("objective", e.target.value)} rows={2} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Time %</Label>
              <Input type="number" min={0} max={100} value={branch.time_percent || ""} onChange={(e) => onUpdate("time_percent", parseInt(e.target.value) || 0)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Cost %</Label>
              <Input type="number" min={0} max={100} value={branch.cost_percent || ""} onChange={(e) => onUpdate("cost_percent", parseInt(e.target.value) || 0)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Priority</Label>
              <Select value={branch.priority_level || "medium"} onValueChange={(v) => onUpdate("priority_level", v)}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PRIORITY_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Owner</Label>
              <Select value={branch.owner || "unassigned"} onValueChange={(v) => onUpdate("owner", v)}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {OWNER_OPTIONS.map(o => <SelectItem key={o} value={o}>{o.replace("_", " ")}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Status</Label>
            <Select value={branch.status || "not_started"} onValueChange={(v) => onUpdate("status", v)}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map(o => <SelectItem key={o} value={o}>{o.replace(/_/g, " ")}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Metric to Watch</Label>
            <Input value={branch.metric_to_watch || ""} onChange={(e) => onUpdate("metric_to_watch", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">What to Adjust if Weak</Label>
            <Textarea value={branch.what_to_adjust_if_weak || ""} onChange={(e) => onUpdate("what_to_adjust_if_weak", e.target.value)} rows={2} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">5–7 Day Review Note</Label>
            <Textarea value={branch.review_note || ""} onChange={(e) => onUpdate("review_note", e.target.value)} rows={2} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">While-Waiting Action</Label>
            <Input value={branch.while_waiting_action || ""} onChange={(e) => onUpdate("while_waiting_action", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Notes</Label>
            <Textarea value={branch.notes || ""} onChange={(e) => onUpdate("notes", e.target.value)} rows={2} />
          </div>
        </div>

        <div className="sticky bottom-0 bg-card border-t border-border p-4">
          <Button className="w-full" onClick={onClose}>Done</Button>
        </div>
      </div>
    </div>
  );
}