import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Upload, Image, MessageSquare, Clock, ShieldCheck, Truck, Plus, Check, X } from "lucide-react";
import { useLdCases, useUpdateLdCase } from "@/hooks/useLabDashboard";
import { useLdCaseImages, useUploadLdCaseImage, useLdCaseNotes, useCreateLdCaseNote, useLdCaseHistory, useCreateLdCaseHistory, useLdQualityChecks, useCreateLdQualityCheck, useUpdateLdQualityCheck } from "@/hooks/useLdCaseExtras";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { motion } from "framer-motion";

const DEFAULT_QC_ITEMS = [
  "Shade verification", "Margin accuracy", "Occlusion check", "Contact points", "Surface finish & polish",
  "Fit verification", "Bite registration match", "Framework integrity", "Aesthetic approval",
];

const statusColor: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  "in-progress": "bg-blue-100 text-blue-800",
  ready: "bg-emerald-100 text-emerald-800",
  delivered: "bg-muted text-muted-foreground",
};

export default function LdCaseDetailPage() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const { data: cases = [] } = useLdCases();
  const caseData = cases.find((c: any) => c.id === caseId);
  const updateCase = useUpdateLdCase();
  const { user, profile } = useAuth();

  const { data: images = [] } = useLdCaseImages(caseId || null);
  const uploadImage = useUploadLdCaseImage();
  const { data: notes = [] } = useLdCaseNotes(caseId || null);
  const createNote = useCreateLdCaseNote();
  const { data: history = [] } = useLdCaseHistory(caseId || null);
  const createHistory = useCreateLdCaseHistory();
  const { data: qcChecks = [] } = useLdQualityChecks(caseId || null);
  const createQcCheck = useCreateLdQualityCheck();
  const updateQcCheck = useUpdateLdQualityCheck();

  const [newNote, setNewNote] = useState("");
  const [imageDesc, setImageDesc] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [courierName, setCourierName] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");

  if (!caseData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-muted-foreground">Case not found</p>
        <Button variant="outline" onClick={() => navigate("/lab-dashboard/cases")}><ArrowLeft className="h-4 w-4 mr-1" /> Back to Cases</Button>
      </div>
    );
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !caseId) return;
    uploadImage.mutate({ file, labCaseId: caseId, description: imageDesc, userId: user?.id });
    setImageDesc("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAddNote = () => {
    if (!newNote.trim() || !caseId) return;
    createNote.mutate({ lab_case_id: caseId, note: newNote, user_id: user?.id, user_name: profile?.full_name || "Staff" });
    setNewNote("");
  };

  const initializeQcChecks = () => {
    if (!caseId) return;
    DEFAULT_QC_ITEMS.forEach(item => {
      if (!qcChecks.find((q: any) => q.check_item === item)) {
        createQcCheck.mutate({ lab_case_id: caseId, check_item: item });
      }
    });
  };

  const toggleQcCheck = (check: any) => {
    const now = new Date().toISOString();
    updateQcCheck.mutate({
      id: check.id,
      is_passed: !check.is_passed,
      checked_by: user?.id,
      checked_by_name: profile?.full_name || "Staff",
      checked_at: !check.is_passed ? now : null as any,
    });
  };

  const handleSaveDelivery = () => {
    if (!caseId) return;
    updateCase.mutate({
      id: caseId,
      courier_name: courierName,
      tracking_number: trackingNumber,
      delivery_notes: deliveryNotes,
    } as any);
    createHistory.mutate({
      lab_case_id: caseId,
      field_changed: "delivery_tracking",
      new_value: `Courier: ${courierName}, Tracking: ${trackingNumber}`,
      changed_by: user?.id,
      changed_by_name: profile?.full_name || "",
    });
  };

  const markQcPassed = () => {
    if (!caseId) return;
    const allPassed = qcChecks.every((q: any) => q.is_passed);
    updateCase.mutate({
      id: caseId,
      qc_passed: allPassed,
      qc_passed_at: allPassed ? new Date().toISOString() : null,
      qc_passed_by: allPassed ? (profile?.full_name || "Staff") : "",
    } as any);
  };

  const passedCount = qcChecks.filter((q: any) => q.is_passed).length;
  const totalQc = qcChecks.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/lab-dashboard/cases")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            {caseData.case_number}
            <Badge className={statusColor[caseData.status] || ""}>{caseData.status}</Badge>
            {caseData.is_urgent && <Badge variant="destructive">Urgent</Badge>}
          </h1>
          <p className="text-sm text-muted-foreground">{caseData.work_type_name} — {caseData.patient_name || "Confidential"}</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-border/50"><CardContent className="p-3">
          <p className="text-[10px] text-muted-foreground uppercase">Client</p>
          <p className="text-sm font-medium">{(caseData as any).client?.clinic_name || "Walk-in"}</p>
        </CardContent></Card>
        <Card className="border-border/50"><CardContent className="p-3">
          <p className="text-[10px] text-muted-foreground uppercase">Technician</p>
          <p className="text-sm font-medium">{(caseData as any).technician?.full_name || "Unassigned"}</p>
        </CardContent></Card>
        <Card className="border-border/50"><CardContent className="p-3">
          <p className="text-[10px] text-muted-foreground uppercase">Net Amount</p>
          <p className="text-sm font-medium">₦{Number(caseData.net_amount || 0).toLocaleString()}</p>
        </CardContent></Card>
        <Card className="border-border/50"><CardContent className="p-3">
          <p className="text-[10px] text-muted-foreground uppercase">Due Date</p>
          <p className="text-sm font-medium">{caseData.due_date ? format(new Date(caseData.due_date), "MMM d, yyyy") : "—"}</p>
        </CardContent></Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="images" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="images" className="gap-1.5 text-xs"><Image className="h-3.5 w-3.5" />Photos ({images.length})</TabsTrigger>
          <TabsTrigger value="notes" className="gap-1.5 text-xs"><MessageSquare className="h-3.5 w-3.5" />Notes ({notes.length})</TabsTrigger>
          <TabsTrigger value="history" className="gap-1.5 text-xs"><Clock className="h-3.5 w-3.5" />Timeline ({history.length})</TabsTrigger>
          <TabsTrigger value="qc" className="gap-1.5 text-xs"><ShieldCheck className="h-3.5 w-3.5" />QC ({passedCount}/{totalQc})</TabsTrigger>
          <TabsTrigger value="delivery" className="gap-1.5 text-xs"><Truck className="h-3.5 w-3.5" />Delivery</TabsTrigger>
        </TabsList>

        {/* Images Tab */}
        <TabsContent value="images">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Case Photos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <Label className="text-xs">Description (optional)</Label>
                  <Input value={imageDesc} onChange={e => setImageDesc(e.target.value)} placeholder="e.g. Impression photo, shade reference" />
                </div>
                <div>
                  <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleImageUpload} />
                  <Button onClick={() => fileInputRef.current?.click()} disabled={uploadImage.isPending} size="sm">
                    <Upload className="h-4 w-4 mr-1" /> {uploadImage.isPending ? "Uploading..." : "Upload"}
                  </Button>
                </div>
              </div>
              {images.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <Image className="h-10 w-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No photos yet. Upload impression photos, shade references, etc.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {images.map((img: any) => (
                    <motion.div key={img.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="group relative rounded-lg overflow-hidden border border-border/50">
                      <img src={img.image_url} alt={img.description || "Case photo"} className="w-full h-32 object-cover" />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                        <p className="text-[10px] text-white truncate">{img.description || "No description"}</p>
                        <p className="text-[9px] text-white/60">{format(new Date(img.created_at), "MMM d, HH:mm")}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Case Notes & Comments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Textarea value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Add a note..." rows={2} className="flex-1" />
                <Button onClick={handleAddNote} disabled={createNote.isPending || !newNote.trim()} size="sm" className="self-end">
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
              {notes.length === 0 ? (
                <p className="text-center py-8 text-sm text-muted-foreground">No notes yet</p>
              ) : (
                <div className="space-y-3">
                  {notes.map((n: any) => (
                    <div key={n.id} className="p-3 rounded-lg border border-border/30 bg-muted/20">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium">{n.user_name || "Staff"}</span>
                        <span className="text-[10px] text-muted-foreground">{format(new Date(n.created_at), "MMM d, yyyy HH:mm")}</span>
                      </div>
                      <p className="text-sm">{n.note}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Timeline Tab */}
        <TabsContent value="history">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Case History Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <p className="text-center py-8 text-sm text-muted-foreground">No history recorded yet. Status changes will appear here.</p>
              ) : (
                <div className="relative pl-6 space-y-4">
                  <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-border" />
                  {history.map((h: any) => (
                    <div key={h.id} className="relative">
                      <div className="absolute -left-[18px] top-1 h-3 w-3 rounded-full bg-primary border-2 border-background" />
                      <div className="p-3 rounded-lg border border-border/30 bg-muted/10">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium capitalize">{h.field_changed.replace(/_/g, " ")}</span>
                          <span className="text-[10px] text-muted-foreground">{format(new Date(h.created_at), "MMM d, yyyy HH:mm")}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          {h.old_value && <span className="px-1.5 py-0.5 rounded bg-destructive/10 text-destructive">{h.old_value}</span>}
                          {h.old_value && h.new_value && <span className="text-muted-foreground">→</span>}
                          {h.new_value && <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-700">{h.new_value}</span>}
                        </div>
                        {h.changed_by_name && <p className="text-[10px] text-muted-foreground mt-1">By: {h.changed_by_name}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* QC Checklist Tab */}
        <TabsContent value="qc">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Quality Control Checklist</CardTitle>
                <div className="flex gap-2">
                  {totalQc === 0 && (
                    <Button size="sm" variant="outline" onClick={initializeQcChecks}>
                      <Plus className="h-4 w-4 mr-1" /> Initialize QC Checks
                    </Button>
                  )}
                  {totalQc > 0 && (
                    <Button size="sm" onClick={markQcPassed} disabled={passedCount !== totalQc} variant={passedCount === totalQc ? "default" : "outline"}>
                      <ShieldCheck className="h-4 w-4 mr-1" /> {passedCount === totalQc ? "Mark QC Passed" : `${passedCount}/${totalQc} Passed`}
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {(caseData as any).qc_passed && (
                <div className="mb-4 p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="text-sm font-medium text-emerald-700">QC Passed</p>
                    <p className="text-[10px] text-emerald-600">
                      {(caseData as any).qc_passed_by && `By ${(caseData as any).qc_passed_by}`}
                      {(caseData as any).qc_passed_at && ` on ${format(new Date((caseData as any).qc_passed_at), "MMM d, yyyy HH:mm")}`}
                    </p>
                  </div>
                </div>
              )}
              {totalQc === 0 ? (
                <p className="text-center py-8 text-sm text-muted-foreground">Click "Initialize QC Checks" to set up the checklist</p>
              ) : (
                <div className="space-y-2">
                  {qcChecks.map((qc: any) => (
                    <div key={qc.id} className={`p-3 rounded-lg border flex items-center gap-3 transition-colors ${qc.is_passed ? "border-emerald-500/30 bg-emerald-500/5" : "border-border/30"}`}>
                      <Checkbox checked={qc.is_passed} onCheckedChange={() => toggleQcCheck(qc)} />
                      <div className="flex-1">
                        <p className={`text-sm ${qc.is_passed ? "line-through text-muted-foreground" : ""}`}>{qc.check_item}</p>
                        {qc.checked_by_name && qc.checked_at && (
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            {qc.is_passed ? "✓" : "✗"} {qc.checked_by_name} — {format(new Date(qc.checked_at), "MMM d, HH:mm")}
                          </p>
                        )}
                      </div>
                      {qc.is_passed ? <Check className="h-4 w-4 text-emerald-500" /> : <X className="h-4 w-4 text-muted-foreground/30" />}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Delivery Tracking Tab */}
        <TabsContent value="delivery">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Delivery Tracking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Delivery Method</Label>
                  <p className="text-sm font-medium mt-1 capitalize">{caseData.delivery_method || "Not set"}</p>
                </div>
                <div>
                  <Label className="text-xs">Status</Label>
                  <Badge className={statusColor[caseData.status]}>{caseData.status}</Badge>
                </div>
              </div>

              {caseData.delivery_method === "courier" && (
                <div className="space-y-3 border-t border-border/30 pt-4">
                  <h4 className="text-sm font-medium">Courier Details</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Courier Name</Label>
                      <Input value={courierName || (caseData as any).courier_name || ""} onChange={e => setCourierName(e.target.value)} placeholder="e.g. DHL, FedEx" />
                    </div>
                    <div>
                      <Label className="text-xs">Tracking Number</Label>
                      <Input value={trackingNumber || (caseData as any).tracking_number || ""} onChange={e => setTrackingNumber(e.target.value)} placeholder="Tracking #" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Delivery Notes</Label>
                    <Textarea value={deliveryNotes || (caseData as any).delivery_notes || ""} onChange={e => setDeliveryNotes(e.target.value)} placeholder="Special delivery instructions..." rows={2} />
                  </div>
                  <Button size="sm" onClick={handleSaveDelivery}>Save Delivery Info</Button>
                </div>
              )}

              <div className="border-t border-border/30 pt-4 space-y-2">
                <h4 className="text-sm font-medium">Delivery Timeline</h4>
                <div className="space-y-2 text-xs">
                  {caseData.received_date && (
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span>Received: {format(new Date(caseData.received_date), "MMM d, yyyy")}</span>
                    </div>
                  )}
                  {caseData.started_date && (
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-500" />
                      <span>Started: {format(new Date(caseData.started_date), "MMM d, yyyy")}</span>
                    </div>
                  )}
                  {caseData.completed_date && (
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-500" />
                      <span>Completed: {format(new Date(caseData.completed_date), "MMM d, yyyy")}</span>
                    </div>
                  )}
                  {caseData.delivered_date && (
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                      <span>Delivered: {format(new Date(caseData.delivered_date), "MMM d, yyyy")}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
