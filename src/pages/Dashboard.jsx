import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Plus, FileText, ArrowRight, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const [businesses, setBusinesses] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      base44.auth.me().catch(() => null),
      base44.entities.Business.list("-created_date", 50).catch(() => []),
      base44.entities.BlueprintDraft.list("-created_date", 50).catch(() => []),
    ]).then(([u, b, d]) => {
      setUser(u);
      setBusinesses(b);
      setDrafts(d);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const isAdmin = user?.role === "admin";

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Welcome back{user?.full_name ? `, ${user.full_name}` : ""}</h1>
          <p className="text-muted-foreground mt-1">
            {isAdmin ? "Admin access — unlimited blueprints" : "Your marketing blueprints"}
          </p>
        </div>
        <Link to="/builder">
          <Button className="gap-2">
            <Plus className="w-4 h-4" /> New Blueprint
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">{businesses.length}</div>
            <p className="text-sm text-muted-foreground mt-1">Businesses</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">{drafts.length}</div>
            <p className="text-sm text-muted-foreground mt-1">Drafts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">{drafts.filter(d => d.status === "generated").length}</div>
            <p className="text-sm text-muted-foreground mt-1">Generated</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">{drafts.filter(d => d.payment_status === "paid" || d.payment_status === "admin_free").length}</div>
            <p className="text-sm text-muted-foreground mt-1">Unlocked</p>
          </CardContent>
        </Card>
      </div>

      {/* Business List */}
      {businesses.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-16 text-center">
            <Building2 className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">No blueprints yet</h3>
            <p className="text-muted-foreground mb-6">Create your first marketing blueprint to get started</p>
            <Link to="/builder">
              <Button className="gap-2">
                <Plus className="w-4 h-4" /> Start Your Blueprint
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          <h2 className="font-semibold text-lg">Your Businesses</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {businesses.map((biz) => {
              const draft = drafts.find(d => d.business_id === biz.id);
              return (
                <Card key={biz.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => {
                  if (draft) navigate(`/results?draftId=${draft.id}&businessId=${biz.id}`);
                  else navigate(`/builder?businessId=${biz.id}`);
                }}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center justify-between">
                      {biz.business_name}
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="bg-muted px-2 py-1 rounded">{biz.industry || "No industry"}</span>
                      <span className="bg-muted px-2 py-1 rounded">{biz.storefront_type || "N/A"}</span>
                      {draft && (
                        <span className={`px-2 py-1 rounded ${draft.payment_status === "paid" || draft.payment_status === "admin_free" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
                          {draft.status || "draft"}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-1">{biz.main_goal || "No goal set"}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Consultant quote */}
      <div className="bg-primary/5 rounded-2xl p-6 text-center">
        <p className="text-sm italic text-muted-foreground">
          "When results get unclear, return to the blueprint. Do not change every channel at once.
          Focus on the business objective, the current bottleneck, and the next 1–2 improvements."
        </p>
      </div>
    </div>
  );
}