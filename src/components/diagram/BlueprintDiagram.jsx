import { useState } from "react";
import { Plus, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PRIORITY_COLORS } from "@/lib/constants";
import BranchModal from "./BranchModal";

export default function BlueprintDiagram({ business, branches, centerHubLabel, onUpdateBusiness, onUpdateBranch, onAddBranch, onRemoveBranch }) {
  const [editingBranch, setEditingBranch] = useState(null);
  const [editingHub, setEditingHub] = useState(false);
  const visibleBranches = branches.filter(b => b.visible !== false);
  const total = visibleBranches.length;

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
      <h3 className="font-semibold text-sm text-muted-foreground mb-4 text-center">Visual Marketing Blueprint</h3>

      <div className="relative min-h-[500px] flex items-center justify-center">
        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
          {visibleBranches.map((_, i) => {
            const angle = (i / total) * 2 * Math.PI - Math.PI / 2;
            const radius = Math.min(200, 160);
            const cx = 50;
            const cy = 50;
            const x2 = cx + Math.cos(angle) * (radius / 5);
            const y2 = cy + Math.sin(angle) * (radius / 5);
            return (
              <line
                key={i}
                x1={`${cx}%`} y1={`${cy}%`}
                x2={`${x2}%`} y2={`${y2}%`}
                stroke="hsl(var(--border))"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
            );
          })}
        </svg>

        {/* Center Hub */}
        <button
          onClick={() => setEditingHub(true)}
          className="absolute z-10 w-40 h-40 rounded-full bg-primary text-primary-foreground flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
          style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
        >
          <Edit3 className="w-4 h-4 opacity-50 mb-1" />
          <span className="text-xs font-medium opacity-75">{centerHubLabel}</span>
          <span className="text-sm font-bold text-center px-2 leading-tight mt-1">
            {business.business_name || "Your Business"}
          </span>
          <span className="text-xs opacity-60 mt-1">{business.main_goal || "Main Goal"}</span>
        </button>

        {/* Branch nodes */}
        {visibleBranches.map((branch, i) => {
          const angle = (i / total) * 2 * Math.PI - Math.PI / 2;
          const radius = Math.min(200, 160);
          const x = 50 + Math.cos(angle) * (radius / 2.5);
          const y = 50 + Math.sin(angle) * (radius / 2.5);

          return (
            <button
              key={i}
              onClick={() => setEditingBranch(branches.indexOf(branch))}
              className={`absolute z-10 w-28 px-2 py-2.5 rounded-xl bg-card border-2 shadow-sm hover:shadow-md transition-all cursor-pointer text-center ${
                PRIORITY_COLORS[branch.priority_level] || "border-border"
              }`}
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <span className="text-xs font-semibold leading-tight block">{branch.branch_name}</span>
              {branch.time_percent > 0 && (
                <span className="text-xs text-muted-foreground mt-0.5 block">{branch.time_percent}% time</span>
              )}
            </button>
          );
        })}

        {/* Add button */}
        <button
          onClick={onAddBranch}
          className="absolute z-10 w-10 h-10 rounded-full bg-muted border-2 border-dashed border-border flex items-center justify-center hover:bg-muted/80 transition-colors"
          style={{ left: "50%", bottom: "8px", transform: "translateX(-50%)" }}
        >
          <Plus className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Core system line */}
      <div className="text-center mt-4 py-3 bg-primary/5 rounded-xl">
        <p className="text-sm font-medium text-primary">
          Traffic → Conversion → Follow-Up → Sales
        </p>
        <p className="text-xs text-muted-foreground mt-1">This is your marketing home base</p>
      </div>

      {/* Branch editor modal */}
      {editingBranch !== null && (
        <BranchModal
          branch={branches[editingBranch]}
          onUpdate={(field, value) => onUpdateBranch(editingBranch, field, value)}
          onClose={() => setEditingBranch(null)}
          onRemove={() => { onRemoveBranch(editingBranch); setEditingBranch(null); }}
        />
      )}

      {/* Hub editor */}
      {editingHub && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setEditingHub(false)}>
          <div className="bg-card rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-lg font-semibold mb-4">Edit Center Hub</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Business Name</label>
                <input
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                  value={business.business_name || ""}
                  onChange={(e) => onUpdateBusiness("business_name", e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Main Offer</label>
                <input
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                  value={business.main_offer || ""}
                  onChange={(e) => onUpdateBusiness("main_offer", e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Main Goal</label>
                <input
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                  value={business.main_goal || ""}
                  onChange={(e) => onUpdateBusiness("main_goal", e.target.value)}
                />
              </div>
            </div>
            <Button className="w-full mt-4" onClick={() => setEditingHub(false)}>Done</Button>
          </div>
        </div>
      )}
    </div>
  );
}