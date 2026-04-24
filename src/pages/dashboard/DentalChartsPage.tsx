import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { usePatients } from "@/hooks/usePatients";
import { useDentalChartEntries, useDeleteDentalChartEntry, useCreateDentalChartEntry, useUpdateDentalChartEntry } from "@/hooks/useDentalCharts";
import { AddProcedureDialog } from "@/components/dashboard/AddProcedureDialog";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, Calendar, User, FileText, ChevronDown, ChevronUp } from "lucide-react";

const statusOptions = [
  { value: "healthy",    label: "Healthy",    bg: "bg-emerald-200", border: "border-emerald-400", text: "text-emerald-900", dot: "bg-emerald-400" },
  { value: "cavity",     label: "Decayed",    bg: "bg-amber-200",   border: "border-amber-400",   text: "text-amber-900",   dot: "bg-amber-400"   },
  { value: "filling",    label: "Treated",    bg: "bg-indigo-200",  border: "border-indigo-400",  text: "text-indigo-900",  dot: "bg-indigo-400"  },
  { value: "extraction", label: "Missing",    bg: "bg-red-200",     border: "border-red-400",     text: "text-red-900",     dot: "bg-red-400"     },
  { value: "crown",      label: "Crowned",    bg: "bg-yellow-200",  border: "border-yellow-500",  text: "text-yellow-900",  dot: "bg-yellow-500"  },
  { value: "impacted",   label: "Impacted",   bg: "bg-orange-200",  border: "border-orange-500",  text: "text-orange-900",  dot: "bg-orange-500"  },
  { value: "rotated",    label: "Rotated",    bg: "bg-pink-200",    border: "border-pink-400",    text: "text-pink-900",    dot: "bg-pink-400"    },
  { value: "fractured",  label: "Fractured",  bg: "bg-rose-200",    border: "border-rose-500",    text: "text-rose-900",    dot: "bg-rose-500"    },
  { value: "sensitive",  label: "Sensitive",  bg: "bg-sky-200",     border: "border-sky-400",     text: "text-sky-900",     dot: "bg-sky-400"     },
  { value: "bridge",     label: "Bridge",     bg: "bg-violet-200",  border: "border-violet-400",  text: "text-violet-900",  dot: "bg-violet-400"  },
  { value: "veneer",     label: "Veneer",     bg: "bg-purple-200",  border: "border-purple-400",  text: "text-purple-900",  dot: "bg-purple-400"  },
  { value: "root_canal", label: "Root Canal", bg: "bg-teal-200",    border: "border-teal-500",    text: "text-teal-900",    dot: "bg-teal-500"    },
  { value: "implant",    label: "Implant",    bg: "bg-cyan-200",    border: "border-cyan-500",    text: "text-cyan-900",    dot: "bg-cyan-500"    },
  { value: "erupting",   label: "Erupting",   bg: "bg-lime-200",    border: "border-lime-500",    text: "text-lime-900",    dot: "bg-lime-500"    },
  { value: "other",      label: "Other",      bg: "bg-slate-200",   border: "border-slate-400",   text: "text-slate-900",   dot: "bg-slate-400"   },
];

function getStatusStyle(status: string) {
  return statusOptions.find(s => s.value === status) ?? statusOptions[0];
}

// Grid rows matching FDI dental chart reference
const upperRows = [
  [18, 17, 16, 15, 14, 13, 12],
  [11, 21, 22, 23, 24, 25, 26],
];
const upperExtra = [27, 28];
const lowerRows = [
  [48, 47, 46, 45, 44, 43, 42],
  [41, 31, 32, 33, 34, 35, 36],
];
const lowerExtra = [37, 38];

function ToothButton({
  tooth,
  status,
  isSelected,
  onSelect,
  onSetStatus,
}: {
  tooth: number;
  status: string;
  isSelected: boolean;
  onSelect: () => void;
  onSetStatus: (status: string, customLabel?: string) => void;
}) {
  const style = getStatusStyle(status);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [customLabel, setCustomLabel] = useState("");

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <button
          onClick={() => { onSelect(); setPopoverOpen(true); }}
          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-md border-2 flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer
            ${style.bg} ${style.border} ${style.text}
            ${isSelected ? "ring-2 ring-primary ring-offset-1 scale-110 shadow-lg z-10" : "hover:scale-105 hover:shadow-sm"}`}
        >
          {tooth}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-2" side="top" align="center">
        <p className="text-xs font-semibold text-muted-foreground mb-2 px-1">Tooth #{tooth} — Set Status</p>
        <div className="grid grid-cols-2 gap-1.5 max-h-56 overflow-y-auto pr-0.5">
          {statusOptions.filter(o => o.value !== "other").map((opt) => (
            <button
              key={opt.value}
              onClick={() => { onSetStatus(opt.value); setPopoverOpen(false); }}
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-medium transition-colors hover:opacity-80
                ${opt.bg} ${opt.border} border ${opt.text}`}
            >
              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${opt.dot}`} />
              {opt.label}
            </button>
          ))}
        </div>
        {/* Other / Custom */}
        <div className="mt-2 border-t pt-2">
          <p className="text-[10px] text-muted-foreground mb-1 font-medium">Other (custom)</p>
          <div className="flex gap-1">
            <Input
              value={customLabel}
              onChange={e => setCustomLabel(e.target.value)}
              placeholder="e.g. Abscess"
              className="h-7 text-xs"
            />
            <Button
              size="sm"
              className="h-7 px-2 text-xs"
              disabled={!customLabel.trim()}
              onClick={() => { onSetStatus("other", customLabel.trim()); setCustomLabel(""); setPopoverOpen(false); }}
            >
              Set
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default function DentalChartsPage() {
  const { data: patients = [] } = usePatients();
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [procedureOpen, setProcedureOpen] = useState(false);
  const [editEntry, setEditEntry] = useState<any>(null);
  const [showAllHistory, setShowAllHistory] = useState(false);

  const deleteEntry = useDeleteDentalChartEntry();
  const createEntry = useCreateDentalChartEntry();
  const updateEntry = useUpdateDentalChartEntry();
  const patientId = selectedPatientId || patients[0]?.id;
  const { data: entries = [] } = useDentalChartEntries(patientId);

  // Build per-tooth data
  const toothData: Record<number, {
    status: string;
    latestEntryId: string | null;
    history: { id: string; date: string; procedure: string; dentist: string; status: string; notes: string; dentist_id: string | null }[];
  }> = {};

  entries.forEach((e: any) => {
    if (!toothData[e.tooth_number]) {
      toothData[e.tooth_number] = { status: e.status, latestEntryId: e.id, history: [] };
    }
    toothData[e.tooth_number].history.push({
      id: e.id, date: e.entry_date, procedure: e.procedure,
      dentist: (e.staff as any)?.full_name || "Unknown",
      status: e.status, notes: e.notes || "", dentist_id: e.dentist_id,
    });
  });

  const selectedData = selectedTooth ? toothData[selectedTooth] : null;

  const handleSetToothStatus = (tooth: number, newStatus: string, customLabel?: string) => {
    if (!patientId) return;
    const existing = toothData[tooth];
    const statusLabel = customLabel || statusOptions.find(s => s.value === newStatus)?.label || newStatus;

    if (existing?.latestEntryId) {
      updateEntry.mutate({
        id: existing.latestEntryId,
        patient_id: patientId,
        status: newStatus,
        procedure: customLabel ? `Status set to ${customLabel}` : undefined,
      } as any);
    } else {
      createEntry.mutate({
        patient_id: patientId,
        tooth_number: tooth,
        procedure: `Status set to ${statusLabel}`,
        status: newStatus,
        entry_date: new Date().toISOString().split("T")[0],
      });
    }
  };

  const handleAddProcedure = () => { setEditEntry(null); setProcedureOpen(true); };
  const handleEditEntry = (entry: any) => {
    setEditEntry({ id: entry.id, tooth_number: selectedTooth!, procedure: entry.procedure, status: entry.status, entry_date: entry.date, notes: entry.notes, dentist_id: entry.dentist_id, patient_id: patientId });
    setProcedureOpen(true);
  };
  const handleDeleteEntry = (entryId: string) => { if (patientId) deleteEntry.mutate({ id: entryId, patient_id: patientId }); };

  const displayedHistory = selectedData?.history
    ? showAllHistory ? selectedData.history : selectedData.history.slice(0, 5)
    : [];

  const renderToothRow = (teeth: number[]) => (
    <div className="flex justify-center gap-1.5">
      {teeth.map((tooth) => (
        <ToothButton
          key={tooth}
          tooth={tooth}
          status={toothData[tooth]?.status || "healthy"}
          isSelected={selectedTooth === tooth}
          onSelect={() => setSelectedTooth(tooth)}
          onSetStatus={(s, custom) => handleSetToothStatus(tooth, s, custom)}
        />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Dental Charts" description="Interactive tooth chart per patient">
        <div className="w-64">
          <Select value={patientId || ""} onValueChange={(v) => { setSelectedPatientId(v); setSelectedTooth(null); }}>
            <SelectTrigger className="bg-muted/30 border-border/40">
              <SelectValue placeholder="Select patient" />
            </SelectTrigger>
            <SelectContent>
              {patients.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.first_name} {p.last_name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </PageHeader>

      {/* Dental Chart Card */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold">Tooth Chart — Adult (FDI Notation)</CardTitle>
          <div className="flex flex-wrap gap-x-3 gap-y-1.5 mt-2">
            {statusOptions.map((item) => (
              <div key={item.value} className="flex items-center gap-1.5">
                <span className={`w-3 h-3 rounded-full ${item.dot}`} />
                <span className="text-xs text-muted-foreground font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upper Jaw */}
          <div>
            <p className="text-center text-sm font-medium text-muted-foreground mb-3">Upper Jaw</p>
            <div className="flex flex-col items-center gap-1.5">
              {upperRows.map((row, i) => (
                <div key={i}>{renderToothRow(row)}</div>
              ))}
              <div>{renderToothRow(upperExtra)}</div>
            </div>
          </div>

          <div className="border-t-2 border-dashed border-border/50" />

          {/* Lower Jaw */}
          <div>
            <p className="text-center text-sm font-medium text-muted-foreground mb-3">Lower Jaw</p>
            <div className="flex flex-col items-center gap-1.5">
              {lowerRows.map((row, i) => (
                <div key={i}>{renderToothRow(row)}</div>
              ))}
              <div>{renderToothRow(lowerExtra)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Tooth Detail */}
      <AnimatePresence>
        {selectedTooth && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.25 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Tooth #{selectedTooth}</CardTitle>
                    <Badge variant="secondary" className="mt-1 text-[10px] capitalize">
                      {getStatusStyle(selectedData?.status || "healthy").label}
                    </Badge>
                  </div>
                  <Button size="sm" onClick={handleAddProcedure} className="gap-1">
                    <Plus className="h-3.5 w-3.5" /> Add Procedure
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {(!selectedData?.history || selectedData.history.length === 0) ? (
                  <div className="text-center py-6">
                    <FileText className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
                    <p className="text-sm text-muted-foreground">No procedures recorded</p>
                  </div>
                ) : (
                  <>
                    <h4 className="text-xs font-semibold mb-3 uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" /> History ({selectedData.history.length})
                    </h4>
                    <div className="space-y-2">
                      {displayedHistory.map((h) => (
                        <div key={h.id} className="group flex items-start gap-3 text-xs bg-muted/30 rounded-lg p-3 border border-border/20 hover:border-border/40 transition-colors">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold">{h.procedure}</span>
                              <Badge variant="outline" className="text-[9px] capitalize">{h.status}</Badge>
                            </div>
                            <div className="flex items-center gap-3 text-muted-foreground">
                              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{h.date}</span>
                              <span className="flex items-center gap-1"><User className="h-3 w-3" />{h.dentist}</span>
                            </div>
                            {h.notes && <p className="mt-1 text-muted-foreground/80 italic">"{h.notes}"</p>}
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleEditEntry(h)}><Edit2 className="h-3 w-3" /></Button>
                            <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDeleteEntry(h.id)} disabled={deleteEntry.isPending}><Trash2 className="h-3 w-3" /></Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    {selectedData.history.length > 5 && (
                      <Button variant="ghost" size="sm" className="w-full mt-2 text-xs text-muted-foreground" onClick={() => setShowAllHistory(!showAllHistory)}>
                        {showAllHistory ? <><ChevronUp className="h-3 w-3 mr-1" /> Show less</> : <><ChevronDown className="h-3 w-3 mr-1" /> Show all {selectedData.history.length} entries</>}
                      </Button>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedTooth && patientId && (
        <AddProcedureDialog
          open={procedureOpen}
          onOpenChange={setProcedureOpen}
          toothNumber={selectedTooth}
          currentStatus={(selectedData?.status || "healthy") as any}
          patientId={patientId}
          editEntry={editEntry}
        />
      )}
    </div>
  );
}
