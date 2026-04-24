import { useState, useMemo } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Shield, AlertTriangle, CheckCircle, XCircle, FileWarning } from "lucide-react";
import { toast } from "sonner";
import { format, addMonths, differenceInDays, parseISO, isBefore } from "date-fns";
import { useLdWarranties, useAddLdWarranty, useUpdateLdWarranty } from "@/hooks/useLdExtendedFeatures";
import { useLdCases } from "@/hooks/useLabDashboard";
import { motion } from "framer-motion";

const statusColors: Record<string, { bg: string; icon: any }> = {
  active: { bg: "bg-emerald-100 text-emerald-800", icon: CheckCircle },
  expired: { bg: "bg-muted text-muted-foreground", icon: XCircle },
  claimed: { bg: "bg-amber-100 text-amber-800", icon: FileWarning },
};

export default function LdWarrantiesPage() {
  const { data: warranties = [], isLoading } = useLdWarranties();
  const { data: cases = [] } = useLdCases();
  const addWarranty = useAddLdWarranty();
  const updateWarranty = useUpdateLdWarranty();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [claimDialogOpen, setClaimDialogOpen] = useState(false);
  const [selectedWarranty, setSelectedWarranty] = useState<any>(null);

  const [formCaseId, setFormCaseId] = useState("");
  const [formMonths, setFormMonths] = useState(12);
  const [formStartDate, setFormStartDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [formNotes, setFormNotes] = useState("");

  const [claimReason, setClaimReason] = useState("");
  const [claimResolution, setClaimResolution] = useState("");

  // Delivered cases without warranty
  const deliveredCasesWithoutWarranty = useMemo(() => {
    const warrantyCaseIds = warranties.map(w => w.case_id);
    return cases.filter(c => c.status === "delivered" && !warrantyCaseIds.includes(c.id));
  }, [cases, warranties]);

  // Check and update expired warranties
  const processedWarranties = useMemo(() => {
    return warranties.map(w => {
      if (w.status === "active" && w.end_date && isBefore(parseISO(w.end_date), new Date())) {
        return { ...w, status: "expired" };
      }
      return w;
    });
  }, [warranties]);

  const expiringCount = processedWarranties.filter(w => {
    if (w.status !== "active" || !w.end_date) return false;
    const days = differenceInDays(parseISO(w.end_date), new Date());
    return days >= 0 && days <= 30;
  }).length;

  const resetCreateForm = () => {
    setFormCaseId("");
    setFormMonths(12);
    setFormStartDate(format(new Date(), "yyyy-MM-dd"));
    setFormNotes("");
  };

  const handleCreateWarranty = async () => {
    if (!formCaseId) {
      toast.error("Case is required");
      return;
    }
    const startDate = parseISO(formStartDate);
    const endDate = addMonths(startDate, formMonths);
    try {
      await addWarranty.mutateAsync({
        case_id: formCaseId,
        warranty_months: formMonths,
        start_date: formStartDate,
        end_date: format(endDate, "yyyy-MM-dd"),
        status: "active",
        notes: formNotes,
      } as any);
      toast.success("Warranty created");
      setCreateDialogOpen(false);
      resetCreateForm();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const openClaimDialog = (warranty: any) => {
    setSelectedWarranty(warranty);
    setClaimReason("");
    setClaimResolution("");
    setClaimDialogOpen(true);
  };

  const handleSubmitClaim = async () => {
    if (!selectedWarranty || !claimReason) {
      toast.error("Claim reason is required");
      return;
    }
    try {
      await updateWarranty.mutateAsync({
        id: selectedWarranty.id,
        status: "claimed",
        claim_date: format(new Date(), "yyyy-MM-dd"),
        claim_reason: claimReason,
        claim_resolution: claimResolution,
      });
      toast.success("Warranty claim recorded");
      setClaimDialogOpen(false);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const getCaseInfo = (id: string | null) => {
    const c = cases.find(c => c.id === id);
    return c ? `${c.case_number} - ${c.patient_name}` : "Unknown";
  };

  const getTimeRemaining = (endDate: string | null) => {
    if (!endDate) return null;
    const days = differenceInDays(parseISO(endDate), new Date());
    if (days < 0) return { text: "Expired", color: "text-destructive" };
    if (days === 0) return { text: "Expires today", color: "text-amber-600" };
    if (days <= 30) return { text: `${days} days left`, color: "text-amber-600" };
    const months = Math.floor(days / 30);
    return { text: `${months} month${months > 1 ? "s" : ""} left`, color: "text-emerald-600" };
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Warranty Tracking"
        description="Track warranty periods and claims on delivered work"
      >
        <Button onClick={() => { resetCreateForm(); setCreateDialogOpen(true); }} className="gap-2">
          <Plus className="h-4 w-4" /> Add Warranty
        </Button>
      </PageHeader>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center gap-4 py-4">
            <div className="p-3 rounded-full bg-emerald-100">
              <Shield className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{processedWarranties.filter(w => w.status === "active").length}</p>
              <p className="text-sm text-muted-foreground">Active Warranties</p>
            </div>
          </CardContent>
        </Card>
        <Card className={expiringCount > 0 ? "border-amber-500/50 bg-amber-50" : ""}>
          <CardContent className="flex items-center gap-4 py-4">
            <div className={`p-3 rounded-full ${expiringCount > 0 ? "bg-amber-200" : "bg-muted"}`}>
              <AlertTriangle className={`h-6 w-6 ${expiringCount > 0 ? "text-amber-700" : "text-muted-foreground"}`} />
            </div>
            <div>
              <p className="text-2xl font-bold">{expiringCount}</p>
              <p className="text-sm text-muted-foreground">Expiring Soon (30 days)</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 py-4">
            <div className="p-3 rounded-full bg-amber-100">
              <FileWarning className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{processedWarranties.filter(w => w.status === "claimed").length}</p>
              <p className="text-sm text-muted-foreground">Claims Made</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 py-4">
            <div className="p-3 rounded-full bg-muted">
              <XCircle className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">{processedWarranties.filter(w => w.status === "expired").length}</p>
              <p className="text-sm text-muted-foreground">Expired</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            All Warranties
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : processedWarranties.length === 0 ? (
            <p className="text-muted-foreground">No warranties recorded yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Case</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Time Remaining</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processedWarranties.map((w, idx) => {
                  const timeRemaining = getTimeRemaining(w.end_date);
                  const StatusIcon = statusColors[w.status]?.icon || Shield;
                  return (
                    <motion.tr
                      key={w.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="border-b"
                    >
                      <TableCell className="font-medium">{getCaseInfo(w.case_id)}</TableCell>
                      <TableCell>{format(new Date(w.start_date), "MMM dd, yyyy")}</TableCell>
                      <TableCell>{format(new Date(w.end_date), "MMM dd, yyyy")}</TableCell>
                      <TableCell>{w.warranty_months} months</TableCell>
                      <TableCell>
                        {timeRemaining && (
                          <span className={timeRemaining.color}>{timeRemaining.text}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[w.status]?.bg || "bg-muted"}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {w.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {w.status === "active" && (
                          <Button size="sm" variant="outline" onClick={() => openClaimDialog(w)}>
                            File Claim
                          </Button>
                        )}
                        {w.status === "claimed" && w.claim_reason && (
                          <span className="text-sm text-muted-foreground" title={w.claim_reason}>
                            Claimed: {w.claim_reason.slice(0, 20)}...
                          </span>
                        )}
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Warranty Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Warranty</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Case *</Label>
              <Select value={formCaseId} onValueChange={setFormCaseId}>
                <SelectTrigger><SelectValue placeholder="Select delivered case" /></SelectTrigger>
                <SelectContent>
                  {deliveredCasesWithoutWarranty.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.case_number} - {c.patient_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {deliveredCasesWithoutWarranty.length === 0 && (
                <p className="text-xs text-muted-foreground">All delivered cases already have warranties</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input type="date" value={formStartDate} onChange={e => setFormStartDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Duration (months)</Label>
                <Select value={String(formMonths)} onValueChange={v => setFormMonths(Number(v))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6 months</SelectItem>
                    <SelectItem value="12">12 months</SelectItem>
                    <SelectItem value="24">24 months</SelectItem>
                    <SelectItem value="36">36 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea value={formNotes} onChange={e => setFormNotes(e.target.value)} rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateWarranty} disabled={addWarranty.isPending}>
              Create Warranty
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Claim Dialog */}
      <Dialog open={claimDialogOpen} onOpenChange={setClaimDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>File Warranty Claim</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Claim Reason *</Label>
              <Textarea value={claimReason} onChange={e => setClaimReason(e.target.value)} rows={3} placeholder="Describe the issue..." />
            </div>
            <div className="space-y-2">
              <Label>Resolution</Label>
              <Textarea value={claimResolution} onChange={e => setClaimResolution(e.target.value)} rows={2} placeholder="How will this be resolved?" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setClaimDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmitClaim} disabled={updateWarranty.isPending}>
              Submit Claim
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
