import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil } from "lucide-react";
import {
  useDentalChartEntries,
  useCreateDentalChartEntry,
  useUpdateDentalChartEntry,
} from "@/hooks/useDentalCharts";
import { useAuth } from "@/hooks/useAuth";

interface DentalChartTabProps {
  patientId: string;
  canEdit: boolean;
}

// Each condition has a label, tailwind bg class, and hex for the legend dot
const CONDITION_CONFIG: { value: string; label: string; bg: string; hex: string }[] = [
  { value: "Healthy",       label: "Healthy",       bg: "bg-emerald-500",  hex: "#10b981" },
  { value: "Decayed",       label: "Decayed",        bg: "bg-red-500",      hex: "#ef4444" },
  { value: "Treated",       label: "Treated",        bg: "bg-blue-500",     hex: "#3b82f6" },
  { value: "Missing",       label: "Missing",        bg: "bg-gray-400",     hex: "#9ca3af" },
  { value: "Crowned",       label: "Crowned",        bg: "bg-yellow-500",   hex: "#eab308" },
  { value: "Impacted",      label: "Impacted",       bg: "bg-orange-500",   hex: "#f97316" },
  { value: "Rotated",       label: "Rotated",        bg: "bg-purple-500",   hex: "#a855f7" },
  { value: "Fractured",     label: "Fractured",      bg: "bg-rose-600",     hex: "#e11d48" },
  { value: "Sensitive",     label: "Sensitive",      bg: "bg-sky-400",      hex: "#38bdf8" },
  { value: "Bridged",       label: "Bridged",        bg: "bg-indigo-500",   hex: "#6366f1" },
  { value: "Veneer",        label: "Veneer",         bg: "bg-pink-400",     hex: "#f472b6" },
  { value: "RootCanal",     label: "Root Canal",     bg: "bg-amber-600",    hex: "#d97706" },
  { value: "Implant",       label: "Implant",        bg: "bg-teal-500",     hex: "#14b8a6" },
  { value: "Erupting",      label: "Erupting",       bg: "bg-lime-500",     hex: "#84cc16" },
  { value: "Other",         label: "Other / Custom", bg: "bg-fuchsia-500",  hex: "#d946ef" },
];

const conditionBg = (status: string) =>
  CONDITION_CONFIG.find((c) => c.value === status)?.bg ?? "bg-emerald-500";

const TREATMENTS = [
  "Crown", "Inlay/Onlay", "Referral", "Impacted", "Partial Denture",
  "Filling", "Extraction", "Root Canal", "Implant", "Veneer",
  "Bridge", "Scaling", "Bleaching", "Orthodontic Band", "Other",
] as const;

// FDI notation
const UPPER_RIGHT = [18, 17, 16, 15, 14, 13, 12, 11];
const UPPER_LEFT  = [21, 22, 23, 24, 25, 26, 27, 28];
const LOWER_LEFT  = [31, 32, 33, 34, 35, 36, 37, 38];
const LOWER_RIGHT = [48, 47, 46, 45, 44, 43, 42, 41];

const emptyForm = () => ({ condition: "Healthy", customCondition: "", procedure: "", notes: "" });

export function DentalChartTab({ patientId, canEdit }: DentalChartTabProps) {
  const { user } = useAuth();
  const { data: entries = [] } = useDentalChartEntries(patientId);
  const createEntry = useCreateDentalChartEntry();
  const updateEntry = useUpdateDentalChartEntry();

  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<any>(null);
  const [form, setForm] = useState(emptyForm());
  const [legendExpanded, setLegendExpanded] = useState(false);

  // Build tooth status map from latest entries
  const toothMap = new Map<number, any>();
  entries.forEach((e: any) => {
    if (!toothMap.has(e.tooth_number)) toothMap.set(e.tooth_number, e);
  });

  const openDialog = (tooth: number | null, entry?: any) => {
    if (!canEdit) return;
    setEditingEntry(entry ?? null);
    setSelectedTooth(tooth);
    if (entry) {
      const isCustom = !CONDITION_CONFIG.find((c) => c.value === entry.status);
      setForm({
        condition: isCustom ? "Other" : (entry.status || "Healthy"),
        customCondition: isCustom ? (entry.status || "") : "",
        procedure: entry.procedure || "",
        notes: entry.notes || "",
      });
    } else if (tooth) {
      const existing = toothMap.get(tooth);
      const isCustom = existing && !CONDITION_CONFIG.find((c) => c.value === existing.status);
      setForm({
        condition: isCustom ? "Other" : (existing?.status || "Healthy"),
        customCondition: isCustom ? (existing?.status || "") : "",
        procedure: existing?.procedure || "",
        notes: "",
      });
    } else {
      setForm(emptyForm());
    }
    setDialogOpen(true);
  };

  const handleSave = () => {
    const toothNum = selectedTooth;
    if (!toothNum) return;
    const resolvedStatus = form.condition === "Other"
      ? (form.customCondition.trim() || "Other")
      : form.condition;

    const payload = {
      patient_id: patientId,
      tooth_number: toothNum,
      status: resolvedStatus,
      procedure: form.procedure || resolvedStatus,
      entry_date: new Date().toISOString().split("T")[0],
      notes: form.notes,
    };

    if (editingEntry) {
      updateEntry.mutate(
        { id: editingEntry.id, ...payload },
        { onSuccess: () => { setDialogOpen(false); setEditingEntry(null); setSelectedTooth(null); } }
      );
    } else {
      createEntry.mutate(
        { ...payload, dentist_id: undefined },
        { onSuccess: () => { setDialogOpen(false); setSelectedTooth(null); } }
      );
    }
  };

  const isPending = createEntry.isPending || updateEntry.isPending;

  const renderTooth = (tooth: number) => {
    const entry = toothMap.get(tooth);
    const status = entry?.status || "Healthy";
    const bgClass = conditionBg(status);

    return (
      <button
        key={tooth}
        onClick={() => openDialog(tooth, undefined)}
        className={`flex flex-col items-center gap-1 p-1 rounded-lg hover:bg-accent/50 transition-colors ${canEdit ? "cursor-pointer" : "cursor-default"}`}
        title={`Tooth #${tooth}: ${status}${entry?.procedure ? ` · ${entry.procedure}` : ""}`}
      >
        <div className={`w-7 h-8 rounded-md border-2 ${entry ? "border-foreground/30" : "border-border"} flex items-center justify-center`}>
          <div className={`w-3 h-3 rounded-full ${bgClass}`} />
        </div>
        <span className="text-[10px] font-mono text-muted-foreground">{tooth}</span>
      </button>
    );
  };

  // Visible in legend: conditions that are actually used, plus the first 6 always shown
  const usedConditions = new Set(entries.map((e: any) => e.status));
  const legendConditions = legendExpanded
    ? CONDITION_CONFIG
    : CONDITION_CONFIG.filter((c, i) => i < 6 || usedConditions.has(c.value));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-start gap-2">
        <h3 className="text-sm font-medium">Dental Chart (FDI Notation)</h3>
        <div className="flex flex-wrap items-center gap-2">
          {legendConditions.map((c) => (
            <div key={c.value} className="flex items-center gap-1">
              <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: c.hex }} />
              <span className="text-[10px] text-muted-foreground">{c.label}</span>
            </div>
          ))}
          <button
            className="text-[10px] text-primary underline"
            onClick={() => setLegendExpanded(!legendExpanded)}
          >
            {legendExpanded ? "Less" : "More"}
          </button>
          {canEdit && (
            <Button size="sm" variant="outline" onClick={() => openDialog(null)}>
              <Plus className="mr-1 h-3 w-3" /> Add Entry
            </Button>
          )}
        </div>
      </div>

      {/* Chart */}
      <Card>
        <CardContent className="py-6">
          <div className="text-center mb-2">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Upper Jaw</span>
          </div>
          <div className="flex justify-center gap-0.5 mb-1">
            <div className="flex gap-0.5 border-r border-border pr-2 mr-2">{UPPER_RIGHT.map(renderTooth)}</div>
            <div className="flex gap-0.5">{UPPER_LEFT.map(renderTooth)}</div>
          </div>
          <div className="border-t border-dashed border-border my-4" />
          <div className="flex justify-center gap-0.5 mb-1">
            <div className="flex gap-0.5 border-r border-border pr-2 mr-2">{LOWER_RIGHT.map(renderTooth)}</div>
            <div className="flex gap-0.5">{LOWER_LEFT.map(renderTooth)}</div>
          </div>
          <div className="text-center mt-2">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Lower Jaw</span>
          </div>
        </CardContent>
      </Card>

      {/* Recent Entries */}
      {entries.length > 0 && (
        <Card>
          <CardContent className="py-4">
            <h4 className="text-xs font-medium text-muted-foreground mb-3">Chart Entries</h4>
            <div className="space-y-2">
              {entries.slice(0, 15).map((e: any) => {
                const cfg = CONDITION_CONFIG.find((c) => c.value === e.status);
                return (
                  <div key={e.id} className="flex items-center justify-between text-sm group">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] font-mono">#{e.tooth_number}</Badge>
                      <span
                        className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: cfg?.hex ?? "#9ca3af" }}
                      />
                      <span>{e.procedure}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full text-white font-medium"
                        style={{ background: cfg?.hex ?? "#9ca3af" }}
                      >
                        {e.status}
                      </span>
                      <span className="text-xs text-muted-foreground">{e.entry_date}</span>
                      {canEdit && (
                        <Button
                          size="icon" variant="ghost"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => openDialog(e.tooth_number, e)}
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingEntry
                ? `Edit Entry — Tooth #${selectedTooth}`
                : selectedTooth
                ? `Tooth #${selectedTooth}`
                : "New Dental Entry"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            {/* Tooth number picker when no tooth pre-selected */}
            {!selectedTooth && !editingEntry && (
              <div className="space-y-1">
                <Label className="text-xs">Tooth Number *</Label>
                <Input
                  type="number" min={11} max={48} placeholder="e.g. 21"
                  onChange={(e) => setSelectedTooth(Number(e.target.value) || null)}
                />
              </div>
            )}

            {/* Condition selector */}
            <div className="space-y-1">
              <Label className="text-xs">Condition / Status</Label>
              <Select value={form.condition} onValueChange={(v) => setForm(f => ({ ...f, condition: v, customCondition: "" }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONDITION_CONFIG.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: c.hex }} />
                        {c.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Custom condition field when "Other" is chosen */}
            {form.condition === "Other" && (
              <div className="space-y-1">
                <Label className="text-xs">Custom Condition Label *</Label>
                <Input
                  value={form.customCondition}
                  onChange={(e) => setForm(f => ({ ...f, customCondition: e.target.value }))}
                  placeholder="e.g. Pericoronitis, Abrasion..."
                />
              </div>
            )}

            {/* Treatment selector */}
            <div className="space-y-1">
              <Label className="text-xs">Treatment / Procedure</Label>
              <Select value={form.procedure} onValueChange={(v) => setForm(f => ({ ...f, procedure: v }))}>
                <SelectTrigger><SelectValue placeholder="Select treatment" /></SelectTrigger>
                <SelectContent>
                  {TREATMENTS.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Notes */}
            <div className="space-y-1">
              <Label className="text-xs">Notes</Label>
              <Textarea
                rows={2}
                value={form.notes}
                onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))}
                placeholder="Additional clinical notes..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button
              className="bg-secondary hover:bg-secondary/90"
              disabled={isPending || (!selectedTooth && !editingEntry) || (form.condition === "Other" && !form.customCondition.trim())}
              onClick={handleSave}
            >
              {isPending ? "Saving..." : editingEntry ? "Save Changes" : "Save Entry"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
