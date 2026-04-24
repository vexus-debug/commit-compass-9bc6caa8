import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, FileText, Search, CheckCircle, Clock, AlertCircle, Upload } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useAllConsentForms, useConsentFormTemplates, useCreateConsentFormTemplate, useCreatePatientConsentForm, useSignConsentForm } from "@/hooks/useConsentForms";
import { usePatients } from "@/hooks/usePatients";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const statusIcons: Record<string, any> = {
  pending: Clock,
  signed: CheckCircle,
  expired: AlertCircle,
};

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  signed: "bg-emerald-100 text-emerald-700",
  expired: "bg-red-100 text-red-700",
};

export default function ConsentFormsPage() {
  const { data: forms = [] } = useAllConsentForms();
  const { data: templates = [] } = useConsentFormTemplates();
  const { data: patients = [] } = usePatients();
  const { user, roles } = useAuth();
  const isAdmin = roles.includes("admin");
  const createTemplate = useCreateConsentFormTemplate();
  const createForm = useCreatePatientConsentForm();
  const signForm = useSignConsentForm();

  const [search, setSearch] = useState("");
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [signDialogOpen, setSignDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState("");
  const [signerName, setSignerName] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadFormId, setUploadFormId] = useState("");

  const [templateForm, setTemplateForm] = useState({ title: "", content: "", category: "general" });
  const [consentForm, setConsentForm] = useState({ patientId: "", templateId: "", title: "", content: "" });

  const handleCreateTemplate = () => {
    createTemplate.mutate({ ...templateForm, created_by: user?.id }, {
      onSuccess: () => { setTemplateDialogOpen(false); setTemplateForm({ title: "", content: "", category: "general" }); },
    });
  };

  const handleCreateForm = () => {
    createForm.mutate({
      patient_id: consentForm.patientId,
      template_id: consentForm.templateId || undefined,
      title: consentForm.title,
      content: consentForm.content,
      created_by: user?.id,
    }, {
      onSuccess: () => { setFormDialogOpen(false); setConsentForm({ patientId: "", templateId: "", title: "", content: "" }); },
    });
  };

  const handleSelectTemplate = (templateId: string) => {
    const t = templates.find((t: any) => t.id === templateId);
    if (t) {
      setConsentForm(f => ({ ...f, templateId, title: t.title, content: t.content }));
    }
  };

  const handleSign = () => {
    if (!selectedFormId || !signerName) return;
    signForm.mutate({ id: selectedFormId, signer_name: signerName, witnessed_by: user?.id }, {
      onSuccess: () => { setSignDialogOpen(false); setSignerName(""); },
    });
  };

  const openUploadScan = (formId: string) => {
    setUploadFormId(formId);
    setUploadFile(null);
    setUploadDialogOpen(true);
  };

  const handleUploadScan = async () => {
    if (!uploadFile || !uploadFormId) return;
    setUploading(true);

    // Find the patient_id from the form
    const form = forms.find((f: any) => f.id === uploadFormId);
    const patientId = form?.patient_id;

    const fileExt = uploadFile.name.split(".").pop();
    const filePath = `consent-scans/${uploadFormId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("clinic-documents")
      .upload(filePath, uploadFile);

    if (uploadError) {
      toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("clinic-documents").getPublicUrl(filePath);

    // Save as a patient document linked to consent
    if (patientId) {
      await supabase.from("patient_documents").insert({
        patient_id: patientId,
        title: `Consent Scan — ${form?.title || "Untitled"}`,
        category: "consent",
        file_url: urlData.publicUrl,
        uploaded_by: user?.id,
        notes: `Scanned consent form for: ${form?.title}`,
      });
    }

    toast({ title: "Consent scan uploaded" });
    setUploading(false);
    setUploadDialogOpen(false);
    setUploadFile(null);
  };

  const filtered = forms.filter((f: any) => {
    const name = `${f.patients?.first_name} ${f.patients?.last_name}`.toLowerCase();
    return name.includes(search.toLowerCase()) || f.title.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Consent Forms" description="Manage consent form templates and patient consents">
        <div className="flex gap-2">
          {isAdmin && (
            <Button variant="outline" onClick={() => setTemplateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> New Template
            </Button>
          )}
          <Button onClick={() => setFormDialogOpen(true)} className="bg-secondary hover:bg-secondary/90">
            <Plus className="mr-2 h-4 w-4" /> Create Consent
          </Button>
        </div>
      </PageHeader>

      <Tabs defaultValue="forms">
        <TabsList>
          <TabsTrigger value="forms">Patient Consents</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="forms" className="mt-4 space-y-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>

          {filtered.length === 0 ? (
            <Card><CardContent className="py-10 text-center text-sm text-muted-foreground">No consent forms found.</CardContent></Card>
          ) : filtered.map((f: any) => {
            const StatusIcon = statusIcons[f.status] || Clock;
            return (
              <motion.div key={f.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="glass-card">
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{f.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {f.patients?.first_name} {f.patients?.last_name} · {new Date(f.created_at).toLocaleDateString()}
                          </p>
                          {f.signed_at && <p className="text-xs text-emerald-600 mt-1">Signed by {f.signer_name} on {new Date(f.signed_at).toLocaleDateString()}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`text-[10px] ${statusColors[f.status] || ""}`}>
                          <StatusIcon className="h-3 w-3 mr-1" />{f.status}
                        </Badge>
                        <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => openUploadScan(f.id)} title="Upload scanned consent">
                          <Upload className="h-3 w-3 mr-1" /> Scan
                        </Button>
                        {f.status === "pending" && (
                          <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => { setSelectedFormId(f.id); setSignDialogOpen(true); }}>
                            Sign
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </TabsContent>

        <TabsContent value="templates" className="mt-4 space-y-3">
          {templates.length === 0 ? (
            <Card><CardContent className="py-10 text-center text-sm text-muted-foreground">No templates yet.</CardContent></Card>
          ) : templates.map((t: any) => (
            <Card key={t.id} className="glass-card">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{t.title}</p>
                    <Badge variant="outline" className="text-[10px] capitalize mt-1">{t.category}</Badge>
                  </div>
                  <Badge variant={t.is_active ? "default" : "secondary"} className="text-[10px]">{t.is_active ? "Active" : "Inactive"}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Template Dialog */}
      <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create Consent Template</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label className="text-xs">Title *</Label><Input value={templateForm.title} onChange={e => setTemplateForm(f => ({ ...f, title: e.target.value }))} /></div>
              <div className="space-y-1">
                <Label className="text-xs">Category</Label>
                <Select value={templateForm.category} onValueChange={v => setTemplateForm(f => ({ ...f, category: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="anesthesia">Anesthesia</SelectItem>
                    <SelectItem value="surgical">Surgical</SelectItem>
                    <SelectItem value="orthodontic">Orthodontic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1"><Label className="text-xs">Content *</Label><Textarea value={templateForm.content} onChange={e => setTemplateForm(f => ({ ...f, content: e.target.value }))} rows={6} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTemplateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateTemplate} className="bg-secondary hover:bg-secondary/90" disabled={createTemplate.isPending}>{createTemplate.isPending ? "Creating..." : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Consent Dialog */}
      <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create Patient Consent</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs">Patient *</Label>
              <Select value={consentForm.patientId} onValueChange={v => setConsentForm(f => ({ ...f, patientId: v }))}>
                <SelectTrigger><SelectValue placeholder="Select patient" /></SelectTrigger>
                <SelectContent>{patients.map(p => <SelectItem key={p.id} value={p.id}>{p.first_name} {p.last_name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">From Template</Label>
              <Select value={consentForm.templateId} onValueChange={handleSelectTemplate}>
                <SelectTrigger><SelectValue placeholder="Select template (optional)" /></SelectTrigger>
                <SelectContent>{templates.filter((t: any) => t.is_active).map((t: any) => <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label className="text-xs">Title *</Label><Input value={consentForm.title} onChange={e => setConsentForm(f => ({ ...f, title: e.target.value }))} /></div>
            <div className="space-y-1"><Label className="text-xs">Content *</Label><Textarea value={consentForm.content} onChange={e => setConsentForm(f => ({ ...f, content: e.target.value }))} rows={6} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateForm} className="bg-secondary hover:bg-secondary/90" disabled={createForm.isPending}>{createForm.isPending ? "Creating..." : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sign Dialog */}
      <Dialog open={signDialogOpen} onOpenChange={setSignDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Sign Consent Form</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1"><Label className="text-xs">Signer Full Name *</Label><Input value={signerName} onChange={e => setSignerName(e.target.value)} /></div>
            <p className="text-xs text-muted-foreground">By clicking "Sign", you confirm the patient has reviewed and agreed to the consent form.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSignDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSign} className="bg-secondary hover:bg-secondary/90" disabled={signForm.isPending || !signerName}>{signForm.isPending ? "Signing..." : "Sign"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Consent Scan Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Upload Consent Scan</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs">Picture / Scan *</Label>
              <Input type="file" accept="image/*,.pdf" onChange={e => setUploadFile(e.target.files?.[0] || null)} />
            </div>
            <p className="text-xs text-muted-foreground">Upload a scanned or photographed copy of the signed consent form.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUploadScan} className="bg-secondary hover:bg-secondary/90" disabled={uploading || !uploadFile}>
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
