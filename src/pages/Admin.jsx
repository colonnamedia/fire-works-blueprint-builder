import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Users, FileText, CreditCard, Download, Search, Settings, Shield } from "lucide-react";

export default function Admin() {
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [payments, setPayments] = useState([]);
  const [users, setUsers] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    Promise.all([
      base44.auth.me(),
      base44.entities.Business.list("-created_date", 100),
      base44.entities.BlueprintDraft.list("-created_date", 100),
      base44.entities.Payment.list("-created_date", 100),
      base44.entities.User.list(),
      base44.entities.AppSettings.list("-updated_date", 1),
    ]).then(([u, b, d, p, us, s]) => {
      setUser(u);
      setBusinesses(b);
      setDrafts(d);
      setPayments(p);
      setUsers(us);
      setSettings(s[0] || { trial_mode: false, standard_price: 19.99, admin_free_access: true });
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" /></div>;
  }

  if (user?.role !== "admin") {
    return (
      <div className="text-center py-20">
        <Shield className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
        <h2 className="font-display text-2xl font-bold mb-2">Admin Access Required</h2>
        <p className="text-muted-foreground">Only admin users can access this page.</p>
      </div>
    );
  }

  const totalDrafts = drafts.length;
  const paidDrafts = drafts.filter(d => d.payment_status === "paid").length;
  const exportCount = drafts.reduce((a, d) => a + (d.export_count || 0), 0);
  const totalRevenue = payments.filter(p => p.payment_status === "completed").reduce((a, p) => a + (p.amount || 0), 0);

  const filteredBusinesses = businesses.filter(b =>
    b.business_name?.toLowerCase().includes(search.toLowerCase())
  );

  const saveSettings = async () => {
    if (settings.id) {
      await base44.entities.AppSettings.update(settings.id, settings);
    } else {
      const created = await base44.entities.AppSettings.create(settings);
      setSettings({ ...settings, id: created.id });
    }
    toast({ title: "Settings saved!" });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage blueprints, payments, users, and settings</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{totalDrafts}</div>
              <p className="text-xs text-muted-foreground">Total Drafts</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{paidDrafts}</div>
              <p className="text-xs text-muted-foreground">Paid Drafts</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
              <Download className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{exportCount}</div>
              <p className="text-xs text-muted-foreground">Exports</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Revenue</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" /> App Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Trial Mode</Label>
              <p className="text-xs text-muted-foreground">Allow free access for testing</p>
            </div>
            <Switch
              checked={!!settings?.trial_mode}
              onCheckedChange={(v) => setSettings(prev => ({ ...prev, trial_mode: v }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Admin Free Access</Label>
              <p className="text-xs text-muted-foreground">Admins bypass payment</p>
            </div>
            <Switch
              checked={settings?.admin_free_access !== false}
              onCheckedChange={(v) => setSettings(prev => ({ ...prev, admin_free_access: v }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Standard Price ($)</Label>
            <Input
              type="number"
              value={settings?.standard_price || 19.99}
              onChange={(e) => setSettings(prev => ({ ...prev, standard_price: parseFloat(e.target.value) || 19.99 }))}
              className="max-w-[200px]"
            />
          </div>
          <Button onClick={saveSettings} size="sm">Save Settings</Button>
        </CardContent>
      </Card>

      {/* Submissions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by business name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="space-y-2">
            {filteredBusinesses.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No submissions found</p>
            )}
            {filteredBusinesses.map((biz) => {
              const draft = drafts.find(d => d.business_id === biz.id);
              return (
                <div key={biz.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="font-medium text-sm">{biz.business_name}</p>
                    <p className="text-xs text-muted-foreground">{biz.industry || "No industry"} • {biz.storefront_type}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {draft && (
                      <span className={`text-xs px-2 py-1 rounded ${
                        draft.payment_status === "paid" || draft.payment_status === "admin_free"
                          ? "bg-green-50 text-green-700"
                          : "bg-amber-50 text-amber-700"
                      }`}>
                        {draft.payment_status || "unpaid"}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {draft?.status || "no draft"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Users */}
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {users.map((u) => (
              <div key={u.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div>
                  <p className="font-medium text-sm">{u.full_name || u.email}</p>
                  <p className="text-xs text-muted-foreground">{u.email}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${u.role === "admin" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  {u.role || "user"}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}