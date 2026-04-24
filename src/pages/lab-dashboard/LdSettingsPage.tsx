import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Settings, Save, Edit2, X, DollarSign, TrendingUp, Building2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLdSettings, useLdInvoices } from "@/hooks/useLabDashboard";
import { useLabAllocationRules, useUpdateLabAllocationRules } from "@/hooks/useLabAllocation";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const fmt = (v: number) => "₦" + v.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function LdSettingsPage() {
  const { data: settings, isLoading } = useLdSettings();
  const { data: invoices = [] } = useLdInvoices();
  const { data: rules = [], isLoading: rulesLoading } = useLabAllocationRules();
  const updateRules = useUpdateLabAllocationRules();

  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ lab_name: "", address: "", phone: "", email: "" });

  // Allocation editing
  const [editingRules, setEditingRules] = useState(false);
  const [draft, setDraft] = useState<Record<string, number>>({});
  const total = useMemo(() => Object.values(draft).reduce((s, v) => s + (v || 0), 0), [draft]);

  // Revenue summary from ld_invoices
  const totalRevenue = invoices.reduce((s: number, i: any) => s + Number(i.total_amount), 0);
  const totalPaid = invoices.reduce((s: number, i: any) => s + Number(i.amount_paid), 0);
  const outstanding = Math.max(totalRevenue - totalPaid, 0);

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthRevenue = invoices
    .filter((i: any) => new Date(i.invoice_date) >= startOfMonth)
    .reduce((s: number, i: any) => s + Number(i.total_amount), 0);

  // Branding editing
  const [editingBranding, setEditingBranding] = useState(false);

  useEffect(() => {
    if (settings) {
      setForm({
        lab_name: settings.lab_name || "",
        address: settings.address || "",
        phone: settings.phone || "",
        email: settings.email || "",
      });
    }
  }, [settings]);

  useEffect(() => {
    if (rules.length > 0 && !editingRules) {
      const m: Record<string, number> = {};
      rules.forEach((r: any) => (m[r.id] = Number(r.percentage)));
      setDraft(m);
    }
  }, [rules, editingRules]);

  const handleSaveBranding = async () => {
    if (!settings?.id) return;
    setSaving(true);
    const { error } = await supabase.from("ld_settings").update(form as any).eq("id", settings.id);
    setSaving(false);
    if (error) toast.error(error.message);
    else { toast.success("Settings saved"); setEditingBranding(false); }
  };

  const handleSaveRules = () => {
    const arr = Object.entries(draft).map(([id, percentage]) => ({ id, percentage }));
    updateRules.mutate(arr, { onSuccess: () => setEditingRules(false) });
  };

  if (isLoading) return <p className="text-muted-foreground p-8">Loading...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Lab Settings</h1>
        <p className="text-sm text-muted-foreground">Configure your lab details and revenue allocation</p>
      </div>

      {/* Lab Branding */}
      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Lab Identity
            </CardTitle>
            <CardDescription>This name appears on all lab invoices and communications.</CardDescription>
          </div>
          {!editingBranding ? (
            <Button variant="outline" size="sm" onClick={() => setEditingBranding(true)}>
              <Edit2 className="h-4 w-4 mr-1.5" /> Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setEditingBranding(false)}>
                <X className="h-4 w-4 mr-1" /> Cancel
              </Button>
              <Button size="sm" onClick={handleSaveBranding} disabled={saving}>
                <Save className="h-4 w-4 mr-1.5" /> Save
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {editingBranding ? (
            <div className="space-y-3">
              <div><Label>Lab Name</Label><Input value={form.lab_name} onChange={(e) => setForm(f => ({ ...f, lab_name: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
                <div><Label>Email</Label><Input value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} /></div>
              </div>
              <div><Label>Address</Label><Input value={form.address} onChange={(e) => setForm(f => ({ ...f, address: e.target.value }))} /></div>
            </div>
          ) : (
            <div className="space-y-1 text-sm">
              <p className="text-lg font-bold text-foreground">{settings?.lab_name || "Impression n Teeth"}</p>
              {settings?.phone && <p className="text-muted-foreground">📞 {settings.phone}</p>}
              {settings?.email && <p className="text-muted-foreground">✉️ {settings.email}</p>}
              {settings?.address && <p className="text-muted-foreground">📍 {settings.address}</p>}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Revenue Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xl font-bold">{fmt(totalRevenue)}</p>
              <p className="text-xs text-muted-foreground">Total Lab Revenue</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-emerald-600">{fmt(monthRevenue)}</p>
              <p className="text-xs text-muted-foreground">This Month</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-xl font-bold text-destructive">{fmt(outstanding)}</p>
              <p className="text-xs text-muted-foreground">Outstanding</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Allocation Rules */}
      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Revenue Allocation Rules
            </CardTitle>
            <CardDescription>Configure how lab revenue is distributed across categories.</CardDescription>
          </div>
          {!editingRules ? (
            <Button variant="outline" size="sm" onClick={() => setEditingRules(true)}>
              <Edit2 className="h-4 w-4 mr-1.5" /> Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setEditingRules(false)}>
                <X className="h-4 w-4 mr-1" /> Cancel
              </Button>
              <Button size="sm" onClick={handleSaveRules} disabled={total !== 100 || updateRules.isPending}>
                <Save className="h-4 w-4 mr-1.5" /> Save
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {editingRules && total !== 100 && (
            <div className="mb-3 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              Total must equal 100%. Currently: {total}%
            </div>
          )}
          {rulesLoading ? (
            <p className="text-sm text-muted-foreground text-center py-6">Loading...</p>
          ) : rules.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No allocation rules configured. Set them up in the main dashboard.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right w-24">%</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules.map((rule: any) => (
                  <TableRow key={rule.id}>
                    <TableCell className="font-medium">{rule.category}</TableCell>
                    <TableCell className="text-right">
                      {editingRules ? (
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          className="w-20 ml-auto text-right h-8"
                          value={draft[rule.id] ?? ""}
                          onChange={(e) => setDraft((p) => ({ ...p, [rule.id]: Number(e.target.value) }))}
                        />
                      ) : (
                        <Badge variant="secondary">{rule.percentage}%</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {editingRules && (
                  <TableRow className="border-t-2">
                    <TableCell className="font-bold">Total</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={total === 100 ? "default" : "destructive"}>{total}%</Badge>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
