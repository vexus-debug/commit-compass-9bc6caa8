import { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Plus, Search, Pencil, CalendarIcon, LayoutGrid, Table, Eye, Trash2 } from "lucide-react";
import { useLdSharedAllocations, useCreateLdSharedAllocation, useDeleteLdSharedAllocation } from "@/hooks/useLdSharedAllocations";
import { useLdCases, useCreateLdCase, useUpdateLdCase, useDeleteLdCase, useLdClients, useLdStaff, useLdWorkTypes } from "@/hooks/useLabDashboard";
import { useLdExternalLabs, useLdClientPrices } from "@/hooks/useLdExtendedFeatures";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const STATUSES = ["pending", "in-progress", "ready", "delivered"] as const;

const statusColor: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  "in-progress": "bg-blue-100 text-blue-800",
  ready: "bg-emerald-100 text-emerald-800",
  delivered: "bg-muted text-muted-foreground",
};

const statusDots: Record<string, string> = {
  pending: "bg-amber-500",
  "in-progress": "bg-blue-500",
  ready: "bg-emerald-500",
  delivered: "bg-muted-foreground/50",
};

// Due date alert logic: Red = overdue & not delivered, Yellow = ready, Normal = delivered
function getCaseAlertColor(c: any, workTypes: any[]): string {
  if (c.status === "delivered") return ""; // normal, no color
  if (c.status === "ready") return "border-l-4 border-l-amber-400 bg-amber-50/30 dark:bg-amber-950/10"; // yellow

  // Calculate due date from received_date + work type estimated_days
  const dueDate = getComputedDueDate(c, workTypes);
  if (dueDate && new Date(dueDate) <= new Date()) {
    return "border-l-4 border-l-destructive bg-destructive/5"; // red
  }
  return "";
}

function getComputedDueDate(c: any, workTypes: any[]): string | null {
  if (c.due_date) return c.due_date;
  const receivedDate = c.received_date || c.created_at;
  if (!receivedDate) return null;
  const wt = workTypes.find((w: any) => w.id === c.work_type_id);
  if (!wt?.estimated_days) return null;
  const d = new Date(receivedDate);
  d.setDate(d.getDate() + Number(wt.estimated_days));
  return d.toISOString().split("T")[0];
}

function getDueLabel(c: any, workTypes: any[]): { text: string; className: string } | null {
  const dueDate = getComputedDueDate(c, workTypes);
  if (!dueDate) return null;
  const due = new Date(dueDate);
  const now = new Date();
  const isOverdue = due <= now && !["delivered", "ready"].includes(c.status);
  return {
    text: `Due: ${format(due, "MMM d")} (${getDayOfWeek(dueDate)})`,
    className: isOverdue ? "text-destructive font-bold" : c.status === "ready" ? "text-amber-600 font-medium" : "text-muted-foreground",
  };
}

const JOB_INSTRUCTION_OPTIONS = [
  "Courier Charge", "Acrylic Dentures", "Flexible Dentures", "AJC Crowns",
  "PFM Crowns", "Zirconia Crowns", "Shell Crowns (Gold)", "Shell Crowns (Silver)",
  "VFR", "Orthodontic Appliances", "Denture Repair", "Crown Repair", "Gingival Masking",
  "Bleaching Tray",
];

const REMARK_OPTIONS = ["Express", "Rejected", "Damaged", "Repeat", "Remake", "Suspended"];

const DELIVERY_METHODS = [
  { value: "", label: "Not set" },
  { value: "pickup", label: "Pickup" },
  { value: "delivery", label: "Delivery" },
  { value: "courier", label: "Courier" },
];

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } },
  item: { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } },
};

function getDayOfWeek(dateStr: string) {
  try {
    return format(new Date(dateStr), "EEE");
  } catch { return ""; }
}

export default function LdCasesPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const techFilterFromUrl = searchParams.get("tech") || "";
  const clientFilterFromUrl = searchParams.get("client") || "";
  const workTypeFilterFromUrl = searchParams.get("workType") || "";
  const assignmentFilterFromUrl = searchParams.get("assigned") || "";
  const fromDateFromUrl = searchParams.get("from") || "";
  const toDateFromUrl = searchParams.get("to") || "";
  const remarkFilterFromUrl = searchParams.get("remark") || "";
  const originalTechFilterFromUrl = searchParams.get("originalTech") || "";
  const { data: cases = [], isLoading } = useLdCases();
  const { data: clients = [] } = useLdClients();
  const { data: staff = [] } = useLdStaff();
  const { data: workTypes = [] } = useLdWorkTypes();
  const { data: externalLabs = [] } = useLdExternalLabs();
  const { data: clientPrices = [] } = useLdClientPrices();
  const { roles, user, profile } = useAuth();
  const isAdmin = roles.includes("admin");
  const isManager = roles.includes("lab_manager");
  const canDeleteCases = isAdmin; // Only admin can delete
  // Manager can edit all cases; staff can only edit their own
  const canEditCase = (c: any) => {
    if (isAdmin || isManager) return true;
    // Staff can edit only cases assigned to them
    const staffMatch = staff.find((s: any) => s.user_id === user?.id);
    return staffMatch && c.assigned_technician_id === staffMatch.id;
  };
  const createCase = useCreateLdCase();
  const updateCase = useUpdateLdCase();
  const deleteCase = useDeleteLdCase();

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterClientId, setFilterClientId] = useState(clientFilterFromUrl || "all");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(() => fromDateFromUrl ? new Date(`${fromDateFromUrl}T00:00:00`) : undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(() => toDateFromUrl ? new Date(`${toDateFromUrl}T00:00:00`) : undefined);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editCase, setEditCase] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");
  const [clientSearch, setClientSearch] = useState("");
  const [workTypeSearch, setWorkTypeSearch] = useState("");
  const [selectedClientId, setSelectedClientId] = useState("");
  const [repeatCaseSearch, setRepeatCaseSearch] = useState("");

  // Form state
  const [formJobInstructions, setFormJobInstructions] = useState<string[]>([]);
  const [formRemark, setFormRemark] = useState("none");
  const [formDeliveryMethod, setFormDeliveryMethod] = useState("");
  const [formIsPaid, setFormIsPaid] = useState(false);
  const [formLabFee, setFormLabFee] = useState(0);
  const [formDiscount, setFormDiscount] = useState(0);
  const [formDeposit, setFormDeposit] = useState(0);
  const [formUnits, setFormUnits] = useState(1);
  const [formCourierAmount, setFormCourierAmount] = useState(0);
  const [formExpressSurcharge, setFormExpressSurcharge] = useState(0);
  const [formClaspUnits, setFormClaspUnits] = useState(0);
  const [formClaspCost, setFormClaspCost] = useState(0);
  const [formGingivalMasking, setFormGingivalMasking] = useState(false);
  const [formGingivalMaskingCost, setFormGingivalMaskingCost] = useState(0);
  const [formCaseNumber, setFormCaseNumber] = useState("");
  const [formRepeatOfCaseId, setFormRepeatOfCaseId] = useState("");
  const [formBonusReassignTechId, setFormBonusReassignTechId] = useState("");
  const [formSharedHelperTechId, setFormSharedHelperTechId] = useState("");
  const [formSharedReason, setFormSharedReason] = useState("");

  useEffect(() => {
    setFilterClientId(clientFilterFromUrl || "all");
    setDateFrom(fromDateFromUrl ? new Date(`${fromDateFromUrl}T00:00:00`) : undefined);
    setDateTo(toDateFromUrl ? new Date(`${toDateFromUrl}T00:00:00`) : undefined);
  }, [clientFilterFromUrl, fromDateFromUrl, toDateFromUrl]);

  // Shared allocation hooks
  const { data: allSharedAllocs = [] } = useLdSharedAllocations(editCase?.id || null);
  const caseSharedAllocs = editCase ? allSharedAllocs : [];
  const createSharedAlloc = useCreateLdSharedAllocation();
  const deleteSharedAlloc = useDeleteLdSharedAllocation();
  // Calculate with units multiplication and additional fees
  const baseAmount = formLabFee * formUnits;
  const additionalFees = formCourierAmount + formExpressSurcharge + (formClaspUnits * formClaspCost) + (formGingivalMasking ? formGingivalMaskingCost : 0);
  const netAmount = Math.max(baseAmount + additionalFees - formDiscount, 0);
  const balance = Math.max(netAmount - formDeposit, 0);

  const filtered = useMemo(() => {
    return cases.filter((c: any) => {
      const matchSearch = !search || c.case_number?.toLowerCase().includes(search.toLowerCase()) || c.patient_name?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === "all" || c.status === filterStatus;
      const matchClient = filterClientId === "all" || c.client_id === filterClientId;
      const matchTech = assignmentFilterFromUrl === "unassigned"
        ? !c.assigned_technician_id
        : !techFilterFromUrl || c.assigned_technician_id === techFilterFromUrl;
      const matchWorkType = !workTypeFilterFromUrl || (c.work_type_name || "") === workTypeFilterFromUrl;
      const caseDate = c.received_date ? new Date(c.received_date) : new Date(c.created_at);
      const matchFrom = !dateFrom || caseDate >= dateFrom;
      const matchTo = !dateTo || caseDate <= new Date(dateTo.getTime() + 86400000);
      const matchRemark = !remarkFilterFromUrl || c.remark === remarkFilterFromUrl || (remarkFilterFromUrl === "Repeat" && (c.remark === "Repeat" || c.remark === "Remake" || c.repeat_of_case_id));
      const matchOriginalTech = !originalTechFilterFromUrl || c.original_technician_id === originalTechFilterFromUrl;
      return matchSearch && matchStatus && matchClient && matchTech && matchWorkType && matchFrom && matchTo && matchRemark && matchOriginalTech;
    });
  }, [cases, search, filterStatus, filterClientId, techFilterFromUrl, assignmentFilterFromUrl, workTypeFilterFromUrl, dateFrom, dateTo, remarkFilterFromUrl, originalTechFilterFromUrl]);

  const activeLinkedFilters = useMemo(() => {
    const techName = staff.find((member: any) => member.id === techFilterFromUrl)?.full_name;
    const origTechName = staff.find((member: any) => member.id === originalTechFilterFromUrl)?.full_name;
    return [
      techName ? `Technician: ${techName}` : null,
      assignmentFilterFromUrl === "unassigned" ? "Unassigned only" : null,
      workTypeFilterFromUrl ? `Work type: ${workTypeFilterFromUrl}` : null,
      remarkFilterFromUrl ? `Remark: ${remarkFilterFromUrl}` : null,
      origTechName ? `Original tech: ${origTechName}` : null,
      fromDateFromUrl ? `From: ${format(new Date(`${fromDateFromUrl}T00:00:00`), "MMM d, yyyy")}` : null,
      toDateFromUrl ? `To: ${format(new Date(`${toDateFromUrl}T00:00:00`), "MMM d, yyyy")}` : null,
    ].filter(Boolean);
  }, [assignmentFilterFromUrl, fromDateFromUrl, originalTechFilterFromUrl, remarkFilterFromUrl, staff, techFilterFromUrl, toDateFromUrl, workTypeFilterFromUrl]);

  // Get custom price for a client + work type combination
  const getClientCustomPrice = (clientId: string, workTypeId: string): number | null => {
    if (!clientId || !workTypeId) return null;
    const now = new Date();
    const match = clientPrices.find((p: any) => {
      if (p.client_id !== clientId || p.work_type_id !== workTypeId) return false;
      const from = p.effective_from ? new Date(p.effective_from) : null;
      const to = p.effective_to ? new Date(p.effective_to) : null;
      if (from && now < from) return false;
      if (to && now > to) return false;
      return true;
    });
    return match ? Number(match.custom_price) : null;
  };

  const resetFormState = () => {
    setFormJobInstructions([]);
    setFormRemark("none");
    setFormDeliveryMethod("");
    setFormIsPaid(false);
    setFormLabFee(0);
    setFormDiscount(0);
    setFormDeposit(0);
    setFormUnits(1);
    setFormCourierAmount(0);
    setFormExpressSurcharge(0);
    setFormClaspUnits(0);
    setFormClaspCost(0);
    setFormGingivalMasking(false);
    setFormGingivalMaskingCost(0);
    setFormCaseNumber("");
    setFormRepeatOfCaseId("");
    setFormBonusReassignTechId("");
    setFormSharedHelperTechId("");
    setFormSharedReason("");
    setClientSearch("");
    setWorkTypeSearch("");
    setSelectedClientId("");
    setRepeatCaseSearch("");
  };

  const openCreate = () => {
    setEditCase(null);
    resetFormState();
    setDialogOpen(true);
  };

  const openEdit = (c: any) => {
    setSelectedClientId(c.client_id || "");
    setEditCase(c);
    setFormJobInstructions(c.job_instructions || []);
    setFormRemark(c.remark || "none");
    setFormDeliveryMethod(c.delivery_method || "");
    setFormIsPaid(c.is_paid || false);
    setFormLabFee(Number(c.lab_fee) || 0);
    setFormDiscount(Number(c.discount) || 0);
    setFormDeposit(Number(c.deposit_amount) || 0);
    setFormUnits(Number(c.tooth_number) || 1);
    setFormCourierAmount(Number(c.courier_amount) || 0);
    setFormExpressSurcharge(Number(c.express_surcharge) || 0);
    setFormClaspUnits(Number(c.clasp_units) || 0);
    setFormClaspCost(Number(c.clasp_cost) || 0);
    setFormGingivalMasking(c.gingival_masking || false);
    setFormGingivalMaskingCost(Number(c.gingival_masking_cost) || 0);
    setFormCaseNumber(c.case_number || "");
    setFormRepeatOfCaseId(c.repeat_of_case_id || "");
    setFormBonusReassignTechId(c.bonus_reassignment_tech_id || "");
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const workTypeName = formJobInstructions.length > 0 ? formJobInstructions.join(", ") : (fd.get("work_type_name") as string);

    const newStatus = editCase ? (fd.get("status") as string || editCase.status) : "pending";
    const now = new Date().toISOString().split("T")[0];

    const values: Record<string, unknown> = {
      patient_name: fd.get("patient_name") || "",
      client_id: fd.get("client_id") || null,
      work_type_id: fd.get("work_type_id") || null,
      work_type_name: workTypeName,
      assigned_technician_id: fd.get("assigned_technician_id") || null,
      tooth_number: formUnits,
      shade: fd.get("shade"),
      instructions: fd.get("instructions"),
      job_description: fd.get("job_description") || "",
      lab_fee: formLabFee,
      discount: formDiscount,
      deposit_amount: formDeposit,
      due_date: fd.get("due_date") || null,
      received_date: fd.get("received_date") || null,
      date_out: fd.get("date_out") || null,
      is_urgent: fd.get("is_urgent") === "on",
      delivery_method: formDeliveryMethod,
      remark: formRemark === "none" ? "" : formRemark,
      is_paid: formIsPaid || formDeposit >= netAmount,
      external_lab_id: fd.get("external_lab_id") || null,
      courier_amount: formCourierAmount,
      express_surcharge: formExpressSurcharge,
      clasp_units: formClaspUnits,
      clasp_cost: formClaspCost,
      gingival_masking: formGingivalMasking,
      gingival_masking_cost: formGingivalMasking ? formGingivalMaskingCost : 0,
      net_amount: netAmount,
      status: newStatus,
      // Repeat/Remake tracking
      ...(formRemark === "Repeat" || formRemark === "Remake" ? {
        repeat_of_case_id: formRepeatOfCaseId || null,
        original_technician_id: editCase?.assigned_technician_id || null,
      } : {}),
      ...(formBonusReassignTechId ? { bonus_reassignment_tech_id: formBonusReassignTechId } : {}),
      ...(editCase && newStatus === "ready" && editCase.status !== "ready" ? { completed_date: now } : {}),
      ...(editCase && newStatus === "delivered" && editCase.status !== "delivered" ? { delivered_date: now } : {}),
      ...(editCase && newStatus === "in-progress" && editCase.status !== "in-progress" ? { started_date: now } : {}),
    };

    // Allow manual case number
    if (formCaseNumber && !editCase) {
      values.case_number = formCaseNumber;
    }
    if (editCase && formCaseNumber && formCaseNumber !== editCase.case_number) {
      values.case_number = formCaseNumber;
    }

    if (editCase) {
      if (!isAdmin && !isManager && editCase.assigned_technician_id && values.assigned_technician_id !== editCase.assigned_technician_id) {
        values.assigned_technician_id = editCase.assigned_technician_id;
      }
      if (newStatus !== editCase.status) {
        values._oldStatus = editCase.status;
        values._changedBy = user?.id;
        values._changedByName = profile?.full_name || "";
      }
      updateCase.mutate({ id: editCase.id, ...values }, { onSuccess: () => { setDialogOpen(false); setEditCase(null); resetFormState(); } });
    } else {
      createCase.mutate(values, { onSuccess: () => { setDialogOpen(false); resetFormState(); } });
    }
  };

  const handleStatusChange = (caseId: string, currentStatus: string, newStatus: string) => {
    const updates: Record<string, unknown> = { status: newStatus, _oldStatus: currentStatus, _changedBy: user?.id, _changedByName: profile?.full_name || "" };
    const now = new Date().toISOString().split("T")[0];
    if (newStatus === "ready" && currentStatus !== "ready") updates.completed_date = now;
    if (newStatus === "delivered" && currentStatus !== "delivered") updates.delivered_date = now;
    if (newStatus === "in-progress" && currentStatus !== "in-progress") updates.started_date = now;
    updateCase.mutate({ id: caseId, ...updates });
  };

  const clearDateFilter = () => { setDateFrom(undefined); setDateTo(undefined); };

  const toggleJobInstruction = (option: string) => {
    setFormJobInstructions(prev => prev.includes(option) ? prev.filter(v => v !== option) : [...prev, option]);
  };

  // Auto-set gingival masking cost from work types catalog
  const handleGingivalToggle = (checked: boolean) => {
    setFormGingivalMasking(checked);
    if (checked && formGingivalMaskingCost === 0) {
      const gmWorkType = workTypes.find((w: any) => w.name?.toLowerCase().includes("gingival"));
      if (gmWorkType) setFormGingivalMaskingCost(Number(gmWorkType.base_price) || 0);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Lab Cases</h1>
          <p className="text-sm text-muted-foreground">{cases.length} total cases</p>
        </div>
        <div className="flex gap-2">
          <div className="flex border rounded-md overflow-hidden">
            <Button variant={viewMode === "table" ? "default" : "ghost"} size="icon" className="h-9 w-9 rounded-none" onClick={() => setViewMode("table")}>
              <Table className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === "kanban" ? "default" : "ghost"} size="icon" className="h-9 w-9 rounded-none" onClick={() => setViewMode("kanban")}>
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={openCreate}><Plus className="h-4 w-4 mr-1" /> New Case</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap items-end">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search cases..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {STATUSES.map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterClientId} onValueChange={setFilterClientId}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="All Clients" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Clients</SelectItem>
            {clients.map((c: any) => (
              <SelectItem key={c.id} value={c.id}>{c.clinic_code ? `[${c.clinic_code}] ` : ""}{c.clinic_name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className={cn("gap-1", (dateFrom || dateTo) && "border-primary text-primary")}>
              <CalendarIcon className="h-3.5 w-3.5" />
              {dateFrom && dateTo ? `${format(dateFrom, "MMM d, yyyy")} – ${format(dateTo, "MMM d, yyyy")}` : dateFrom ? `From ${format(dateFrom, "MMM d, yyyy")}` : dateTo ? `Until ${format(dateTo, "MMM d, yyyy")}` : "Date Range"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-4 space-y-3" align="end">
            <div className="space-y-1">
              <Label className="text-xs">From Date</Label>
              <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} className="pointer-events-auto" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">To Date</Label>
              <Calendar mode="single" selected={dateTo} onSelect={setDateTo} className="pointer-events-auto" />
            </div>
            {(dateFrom || dateTo) && (
              <Button variant="ghost" size="sm" className="w-full text-xs" onClick={clearDateFilter}>Clear Date Filter</Button>
            )}
          </PopoverContent>
        </Popover>
      </div>

      {/* Kanban View */}
      {viewMode === "kanban" && (
        isLoading ? (
          <p className="text-sm text-muted-foreground text-center py-10">Loading lab cases...</p>
        ) : (
          <motion.div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" variants={stagger.container} initial="hidden" animate="visible">
            {STATUSES.map((status) => {
              const statusCases = filtered.filter((c: any) => c.status === status);
              return (
                <motion.div key={status} variants={stagger.item}>
                  <Card className="border-border/50">
                    <CardHeader className="pb-2 border-b border-border/30">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm capitalize">{status.replace("-", " ")}</CardTitle>
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-medium ${statusColor[status]}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${statusDots[status]}`} />
                          {statusCases.length}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-3">
                      {statusCases.map((c: any) => (
                        <div key={c.id} className={`p-3 rounded-lg border border-border/30 bg-card/50 hover:shadow-md transition-all duration-200 ${getCaseAlertColor(c, workTypes)} ${c.is_urgent ? "border-destructive/50" : ""}`}>
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">{c.work_type_name}</p>
                            <div className="flex items-center gap-1">
                              {c.is_urgent && <Badge variant="destructive" className="text-[10px] px-1.5">Urgent</Badge>}
                              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => navigate(`/lab-dashboard/cases/${c.id}`)}>
                                <Eye className="h-3 w-3" />
                              </Button>
                              {canEditCase(c) && (
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => openEdit(c)}>
                                  <Pencil className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{c.patient_name || "Confidential"}</p>
                          <p className="text-[10px] text-muted-foreground">{c.case_number}</p>
                          {c.client?.clinic_name && <p className="text-[10px] text-muted-foreground">Clinic: {c.client.clinic_name}</p>}
                          {c.technician?.full_name && <p className="text-[10px] text-muted-foreground">Tech: {c.technician.full_name}</p>}
                          {c.remark && <Badge variant="outline" className="text-[10px] mt-1">{c.remark}</Badge>}

                          <div className="mt-2 pt-1.5 border-t border-border/20">
                            <Select value={c.status} onValueChange={(val) => handleStatusChange(c.id, c.status, val)}>
                              <SelectTrigger className="h-7 text-[11px]"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {STATUSES.map(s => <SelectItem key={s} value={s} className="text-xs capitalize">{s}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>

      {activeLinkedFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {activeLinkedFilters.map((filterLabel) => (
            <Badge key={filterLabel} variant="secondary">{filterLabel}</Badge>
          ))}
          <Button variant="ghost" size="sm" onClick={() => navigate("/lab-dashboard/cases")}>Clear linked filters</Button>
        </div>
      )}

                          <div className="flex justify-between items-center mt-2 pt-1.5 border-t border-border/20">
                            <span className="text-[10px] text-muted-foreground">
                              ₦{Number(c.net_amount || c.lab_fee).toLocaleString()}
                              {Number(c.discount) > 0 && <span className="text-destructive ml-1">-₦{Number(c.discount).toLocaleString()}</span>}
                            </span>
                            {(() => { const dl = getDueLabel(c, workTypes); return dl ? <span className={`text-[10px] ${dl.className}`}>{dl.text}</span> : null; })()}
                          </div>
                        </div>
                      ))}
                      {statusCases.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">No cases</p>}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )
      )}

      {/* Table View */}
      {viewMode === "table" && (
        <Card className="border-border/50">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/30">
                    <th className="text-left p-3 font-medium text-muted-foreground">Case #</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Patient</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Work Type</th>
                    <th className="text-center p-3 font-medium text-muted-foreground">Unit</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Client</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Technician</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Due</th>
                    <th className="text-right p-3 font-medium text-muted-foreground">Amount</th>
                    <th className="text-right p-3 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan={10} className="p-8 text-center text-muted-foreground">Loading...</td></tr>
                  ) : !filtered.length ? (
                    <tr><td colSpan={10} className="p-8 text-center text-muted-foreground">No cases found</td></tr>
                  ) : filtered.map((c: any) => (
                    <tr key={c.id} className={`border-b border-border/30 hover:bg-muted/20 ${getCaseAlertColor(c, workTypes)}`}>
                      <td className="p-3 font-mono text-xs">{c.case_number}</td>
                      <td className="p-3">
                        {c.patient_name || <span className="text-muted-foreground italic">Confidential</span>}
                        {c.is_urgent && <Badge variant="destructive" className="ml-1 text-[10px]">!</Badge>}
                      </td>
                      <td className="p-3">
                        <span className={c.work_type_name?.includes("Bleaching Tray") ? "text-destructive font-bold" : ""}>{c.work_type_name}</span>
                      </td>
                      <td className="p-3 text-center text-xs">{Number(c.tooth_number) || 1}</td>
                      <td className="p-3 text-xs">{c.client?.clinic_name || "—"}</td>
                      <td className="p-3 text-xs">{c.technician?.full_name || "Unassigned"}</td>
                      <td className="p-3">
                        <Select value={c.status} onValueChange={(v) => handleStatusChange(c.id, c.status, v)}>
                          <SelectTrigger className="h-7 text-xs w-[120px]">
                            <Badge className={`${statusColor[c.status]} text-[10px]`}>{c.status}</Badge>
                          </SelectTrigger>
                          <SelectContent>
                            {STATUSES.map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-3 text-xs">
                        {(() => {
                          const dl = getDueLabel(c, workTypes);
                          if (!dl) return "—";
                          return <span className={dl.className}>{dl.text}</span>;
                        })()}
                      </td>
                      <td className="p-3 text-right font-medium">₦{Number(c.net_amount || 0).toLocaleString()}</td>
                      <td className="p-3 text-right">
                        <div className="flex gap-1 justify-end">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => navigate(`/lab-dashboard/cases/${c.id}`)}>
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          {canEditCase(c) && (
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(c)}>
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          {canDeleteCases && (
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => {
                              if (confirm("Delete this case permanently?")) deleteCase.mutate(c.id);
                            }}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) { setEditCase(null); resetFormState(); } }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editCase ? `Edit Case — ${editCase.case_number}` : "New Lab Case"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Case Number - Manual input */}
            <div>
              <Label>Case # <span className="text-muted-foreground text-xs">(leave blank for auto-generated)</span></Label>
              <Input 
                value={formCaseNumber} 
                onChange={(e) => setFormCaseNumber(e.target.value)} 
                placeholder="e.g. LD-20260310-0036 (auto-generated if empty)" 
              />
            </div>

            {/* Patient & Client */}
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Label>Patient Name <span className="text-muted-foreground text-xs">(optional)</span></Label>
                <Input name="patient_name" placeholder="Leave blank if confidential" defaultValue={editCase?.patient_name || ""} />
              </div>
              <div>
                <Label>Client (Clinic)</Label>
                <div className="relative">
                  <Input
                    placeholder="Type to search clients..."
                    value={clientSearch}
                    onChange={(e) => setClientSearch(e.target.value)}
                    className="mb-1"
                  />
                  <select name="client_id" className="w-full border rounded-md p-2 text-sm bg-background" defaultValue={editCase?.client_id || ""} onChange={(e) => setSelectedClientId(e.target.value)}>
                    <option value="">Walk-in</option>
                    {clients
                      .filter((c: any) => !clientSearch || c.clinic_name?.toLowerCase().includes(clientSearch.toLowerCase()) || c.doctor_name?.toLowerCase().includes(clientSearch.toLowerCase()) || c.clinic_code?.toLowerCase().includes(clientSearch.toLowerCase()))
                      .map((c: any) => <option key={c.id} value={c.id}>{c.clinic_code ? `[${c.clinic_code}] ` : ""}{c.clinic_name} - {c.doctor_name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <Label>Work Type (Catalog)</Label>
                <div className="relative">
                  <Input
                    placeholder="Type to search work types..."
                    value={workTypeSearch}
                    onChange={(e) => setWorkTypeSearch(e.target.value)}
                    className="mb-1"
                  />
                  <select
                    name="work_type_id"
                    className="w-full border rounded-md p-2 text-sm bg-background"
                    defaultValue={editCase?.work_type_id || ""}
                    onChange={(e) => {
                      const selectedWt = workTypes.find((w: any) => w.id === e.target.value);
                      if (selectedWt) {
                        // Check for client custom price first
                        const customPrice = getClientCustomPrice(selectedClientId, e.target.value);
                        if (customPrice !== null) {
                          setFormLabFee(customPrice);
                        } else if (Number(selectedWt.base_price) > 0) {
                          setFormLabFee(Number(selectedWt.base_price));
                        }
                      }
                    }}
                  >
                    <option value="">Select...</option>
                    {workTypes
                      .filter((w: any) => !workTypeSearch || w.name?.toLowerCase().includes(workTypeSearch.toLowerCase()))
                      .map((w: any) => <option key={w.id} value={w.id}>{w.name} {Number(w.base_price) > 0 ? `(₦${Number(w.base_price).toLocaleString()})` : ""}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Job Instructions Checkboxes */}
            <div>
              <Label>Job Instructions *</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 border rounded-lg bg-muted/20 mt-1">
                {JOB_INSTRUCTION_OPTIONS.map((option) => (
                  <div key={option} className="flex items-center gap-2">
                    <Checkbox
                      checked={formJobInstructions.includes(option)}
                      onCheckedChange={() => toggleJobInstruction(option)}
                      id={`ji-${option}`}
                    />
                    <Label htmlFor={`ji-${option}`} className={`text-xs font-normal cursor-pointer ${option === "Bleaching Tray" ? "text-destructive font-bold" : ""}`}>{option}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Work Type Name */}
            <div>
              <Label>Work Type Name {formJobInstructions.length === 0 && "*"}</Label>
              <Input
                name="work_type_name"
                required={formJobInstructions.length === 0}
                defaultValue={editCase?.work_type_name || ""}
                placeholder={formJobInstructions.length > 0 ? formJobInstructions.join(", ") : "Enter work type name"}
              />
            </div>

            {/* Job Description */}
            <div>
              <Label>Job Description</Label>
              <Textarea name="job_description" placeholder="Additional job details..." rows={2} defaultValue={editCase?.job_description || ""} />
            </div>

            {/* Technician, Units, Shade, Dates */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Technician {editCase?.assigned_technician_id && !isAdmin && !isManager ? "(locked)" : ""}</Label>
                <select
                  name="assigned_technician_id"
                  className="w-full border rounded-md p-2 text-sm bg-background"
                  defaultValue={editCase?.assigned_technician_id || ""}
                  disabled={!!editCase?.assigned_technician_id && !isAdmin && !isManager}
                >
                  <option value="">Unassigned</option>
                  {staff.filter((s: any) => s.status === "active").map((s: any) => (
                    <option key={s.id} value={s.id}>Technician {s.seniority_level || "?"} — {s.full_name}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Units Nos</Label>
                <Input type="number" min={1} value={formUnits} onChange={(e) => setFormUnits(Math.max(1, Number(e.target.value)))} />
                <p className="text-[10px] text-muted-foreground mt-0.5">Units × Base Price = ₦{(formLabFee * formUnits).toLocaleString()}</p>
              </div>
              <div>
                <Label>Shade</Label>
                <Input name="shade" defaultValue={editCase?.shade || ""} placeholder="e.g. A2, B1" />
              </div>
              <div>
                <Label>Due Date</Label>
                <Input name="due_date" type="date" defaultValue={editCase?.due_date || ""} />
              </div>
              <div>
                <Label>Date In / Received</Label>
                <Input name="received_date" type="date" defaultValue={editCase?.received_date || new Date().toISOString().split("T")[0]} />
              </div>
              <div>
                <Label>Date Out</Label>
                <Input name="date_out" type="date" defaultValue={editCase?.date_out || ""} />
              </div>
            </div>

            {/* External Lab */}
            <div>
              <Label>External Lab Used</Label>
              <select name="external_lab_id" className="w-full border rounded-md p-2 text-sm bg-background" defaultValue={editCase?.external_lab_id || ""}>
                <option value="">None (In-house)</option>
                {externalLabs.map((lab) => (
                  <option key={lab.id} value={lab.id}>{lab.name} {lab.specialties?.length ? `(${lab.specialties.join(", ")})` : ""}</option>
                ))}
              </select>
            </div>

            {/* Cost, Discount, Deposit */}
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <Label>Base Price / Unit (₦) *</Label>
                <Input type="number" step="0.01" min={0} value={formLabFee} onChange={(e) => setFormLabFee(Number(e.target.value))} />
              </div>
              <div>
                <Label>Discount (₦)</Label>
                <Input type="number" step="0.01" min={0} value={formDiscount} onChange={(e) => setFormDiscount(Number(e.target.value))} />
              </div>
              <div>
                <Label>Deposit (₦)</Label>
                <Input type="number" step="0.01" min={0} value={formDeposit} onChange={(e) => setFormDeposit(Number(e.target.value))} />
              </div>
            </div>

            {/* Additional Fee Buttons */}
            <div className="space-y-3 p-3 border rounded-lg bg-muted/20">
              <Label className="text-xs font-semibold uppercase text-muted-foreground">Additional Fees</Label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Express Surcharge (₦ or %)</Label>
                  <Input type="number" step="0.01" min={0} value={formExpressSurcharge} onChange={(e) => setFormExpressSurcharge(Number(e.target.value))} />
                </div>
                <div>
                  <Label className="text-xs">Courier Amount Paid (₦)</Label>
                  <Input type="number" step="0.01" min={0} value={formCourierAmount} onChange={(e) => setFormCourierAmount(Number(e.target.value))} />
                </div>
                <div>
                  <Label className="text-xs">Clasp Units</Label>
                  <Input type="number" min={0} value={formClaspUnits} onChange={(e) => setFormClaspUnits(Number(e.target.value))} />
                </div>
                <div>
                  <Label className="text-xs">Clasp Cost per Unit (₦)</Label>
                  <Input type="number" step="0.01" min={0} value={formClaspCost} onChange={(e) => setFormClaspCost(Number(e.target.value))} />
                </div>
                <div className="col-span-2 flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Checkbox checked={formGingivalMasking} onCheckedChange={(v) => handleGingivalToggle(!!v)} id="gingival" />
                    <Label htmlFor="gingival" className="text-xs cursor-pointer">Gingival Masking</Label>
                  </div>
                  {formGingivalMasking && (
                    <div className="flex-1">
                      <Input type="number" step="0.01" min={0} value={formGingivalMaskingCost} onChange={(e) => setFormGingivalMaskingCost(Number(e.target.value))} placeholder="Cost (₦)" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Net Amount & Balance Display */}
            <div className="rounded-lg border p-3 bg-muted/20 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Base ({formUnits} units × ₦{formLabFee.toLocaleString()}):</span>
                <span className="font-medium">₦{baseAmount.toLocaleString()}</span>
              </div>
              {additionalFees > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Additional Fees:</span>
                  <span className="font-medium">+₦{additionalFees.toLocaleString()}</span>
                </div>
              )}
              {formDiscount > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Discount:</span>
                  <span className="text-destructive">-₦{formDiscount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-xs border-t pt-1">
                <span className="text-muted-foreground font-semibold">Net Amount:</span>
                <span className="font-semibold">₦{netAmount.toLocaleString()}</span>
              </div>
              {formDeposit > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Deposit:</span>
                  <span className="text-emerald-600">-₦{formDeposit.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Balance Due:</span>
                <span className={`font-bold ${balance > 0 ? "text-destructive" : "text-emerald-600"}`}>
                  ₦{balance.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Remark, Delivery Method, Paid, Urgent */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label>Remark</Label>
                <Select value={formRemark} onValueChange={setFormRemark}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {REMARK_OPTIONS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Delivery Method</Label>
                <Select value={formDeliveryMethod} onValueChange={setFormDeliveryMethod}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {DELIVERY_METHODS.map(d => <SelectItem key={d.value || "empty"} value={d.value || "not-set"}>{d.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Repeat/Remake specific fields */}
            {(formRemark === "Repeat" || formRemark === "Remake") && (
              <div className="space-y-3 p-3 border rounded-lg bg-amber-500/5 border-amber-500/20">
                <Label className="text-xs font-semibold uppercase text-amber-700">Repeat / Remake Details</Label>
                <div>
                  <Label className="text-xs">Old Code — Link to Original Case</Label>
                  <Input
                    placeholder="Type case number to search (e.g. 82)..."
                    value={repeatCaseSearch}
                    onChange={(e) => setRepeatCaseSearch(e.target.value)}
                    className="mb-1"
                  />
                  <select
                    className="w-full border rounded-md p-2 text-sm bg-background"
                    value={formRepeatOfCaseId}
                    onChange={(e) => setFormRepeatOfCaseId(e.target.value)}
                  >
                    <option value="">— Select original case —</option>
                    {cases
                      .filter((c: any) => {
                        if (editCase && c.id === editCase.id) return false;
                        if (!repeatCaseSearch) return true;
                        const q = repeatCaseSearch.toLowerCase();
                        return c.case_number?.toLowerCase().includes(q) ||
                          c.patient_name?.toLowerCase().includes(q) ||
                          c.work_type_name?.toLowerCase().includes(q);
                      })
                      .slice(0, 50)
                      .map((c: any) => (
                        <option key={c.id} value={c.id}>
                          {c.case_number} — {c.work_type_name} — {c.patient_name || "Confidential"}
                          {c.technician?.full_name ? ` (Tech: ${c.technician.full_name})` : ""}
                        </option>
                      ))}
                  </select>
                  <p className="text-[10px] text-amber-600 mt-0.5">
                    Links to the original case. The original technician will receive a pay deduction (1.5× output % + basic salary %) as penalty.
                  </p>
                </div>
                <div>
                  <Label className="text-xs">Bonus Staff Re-Assignment (for records)</Label>
                  <select
                    className="w-full border rounded-md p-2 text-sm bg-background"
                    value={formBonusReassignTechId}
                    onChange={(e) => setFormBonusReassignTechId(e.target.value)}
                  >
                    <option value="">— Same technician / Not reassigned —</option>
                    {staff.filter((s: any) => s.status === "active").map((s: any) => (
                      <option key={s.id} value={s.id}>{s.full_name} ({s.role.replace("_", " ")})</option>
                    ))}
                  </select>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    If the repeat case was re-allocated to a different staff. Shows on staff appraisal/performance page.
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Checkbox checked={formIsPaid} onCheckedChange={(v) => setFormIsPaid(!!v)} id="is-paid" />
                  <Label htmlFor="is-paid" className="text-sm cursor-pointer">Fully Paid</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Label>Urgent</Label>
                  <Switch name="is_urgent" defaultChecked={editCase?.is_urgent || false} />
                </div>
              </div>

              {/* Shared Allocation Section */}
              {editCase && editCase.assigned_technician_id && (
                <div className="border rounded-lg p-3 bg-muted/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold text-primary">⚡ Shared Allocation</Label>
                    <Badge variant="outline" className="text-[10px]">Staff A loses 50% output → Staff B</Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    If this case was completed with help from another staff member, record the helper below. 
                    Staff A (assigned) will be debited 50% of their output share, credited to Staff B automatically.
                  </p>
                  <div className="flex gap-2 items-end">
                    <div className="flex-1">
                      <Label className="text-[10px]">Helper Staff (Staff B)</Label>
                      <select
                        className="w-full border rounded-md p-2 text-sm bg-background"
                        value={formSharedHelperTechId}
                        onChange={(e) => setFormSharedHelperTechId(e.target.value)}
                      >
                        <option value="">— Select helper —</option>
                        {staff
                          .filter((s: any) => s.status === "active" && s.id !== editCase.assigned_technician_id)
                          .map((s: any) => (
                            <option key={s.id} value={s.id}>{s.full_name} ({s.role?.replace("_", " ")})</option>
                          ))}
                      </select>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      disabled={!formSharedHelperTechId || createSharedAlloc.isPending}
                      onClick={() => {
                        if (!formSharedHelperTechId || !editCase) return;
                        createSharedAlloc.mutate({
                          case_id: editCase.id,
                          original_tech_id: editCase.assigned_technician_id,
                          helper_tech_id: formSharedHelperTechId,
                          share_percentage: 50,
                          reason: formSharedReason,
                          recorded_by: user?.id,
                          recorded_by_name: profile?.full_name || "Unknown",
                        });
                        setFormSharedHelperTechId("");
                        setFormSharedReason("");
                      }}
                    >
                      {createSharedAlloc.isPending ? "Saving..." : "Record"}
                    </Button>
                  </div>
                  <div>
                    <Label className="text-[10px]">Reason (optional)</Label>
                    <Input
                      className="text-sm h-8"
                      placeholder="e.g. Staff was slow, needed help finishing"
                      value={formSharedReason}
                      onChange={(e) => setFormSharedReason(e.target.value)}
                    />
                  </div>
                  {/* Show existing shared allocations for this case */}
                  {caseSharedAllocs.length > 0 && (
                    <div className="space-y-1 pt-1 border-t">
                      <p className="text-[10px] font-medium text-muted-foreground">Recorded Shared Allocations:</p>
                      {caseSharedAllocs.map((sa: any) => (
                        <div key={sa.id} className="flex items-center justify-between text-[11px] bg-background rounded px-2 py-1">
                          <span>
                            <span className="text-destructive font-medium">{sa.original_tech?.full_name}</span>
                            {" → "}
                            <span className="text-emerald-600 font-medium">{sa.helper_tech?.full_name}</span>
                            {" (−{sa.share_percentage}% output)"}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0 text-destructive"
                            onClick={() => deleteSharedAlloc.mutate(sa.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Special Instructions */}
            <div>
              <Label>Special Instructions</Label>
              <Textarea name="instructions" defaultValue={editCase?.instructions || ""} rows={2} />
            </div>

            {/* Edit-only: Status */}
            {editCase && (
              <div>
                <Label>Status</Label>
                <select name="status" className="w-full border rounded-md p-2 text-sm bg-background" defaultValue={editCase.status}>
                  {STATUSES.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                </select>
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => { setDialogOpen(false); setEditCase(null); resetFormState(); }}>Cancel</Button>
              <Button type="submit" disabled={createCase.isPending || updateCase.isPending}>
                {editCase ? (updateCase.isPending ? "Saving..." : "Save Changes") : (createCase.isPending ? "Creating..." : "Register Lab Case")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
