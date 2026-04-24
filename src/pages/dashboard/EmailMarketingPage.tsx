import { useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Mail, Plus, Send, Eye, Trash2, FileText, Clock,
  CheckCircle2, XCircle, AlertCircle, Search, Filter, Megaphone, AtSign
} from "lucide-react";
import { format } from "date-fns";
import { usePatients } from "@/hooks/usePatients";
import {
  useCampaigns, useCampaignMessages, useMarketingTemplates,
  useCreateCampaign, useDeleteCampaign,
  useCreateBulkMessages, useCreateTemplate, useDeleteTemplate,
} from "@/hooks/useMarketingCampaigns";
import { useAuth } from "@/hooks/useAuth";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { TableSkeleton } from "@/components/dashboard/TableSkeleton";
import { MarketingMediaUpload } from "@/components/dashboard/MarketingMediaUpload";
import { toast } from "@/hooks/use-toast";

const statusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  scheduled: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  sending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  sent: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  failed: "bg-destructive/10 text-destructive",
};

const msgStatusIcons: Record<string, React.ReactNode> = {
  pending: <Clock className="h-4 w-4 text-muted-foreground" />,
  sent: <Send className="h-4 w-4 text-blue-500" />,
  delivered: <CheckCircle2 className="h-4 w-4 text-green-500" />,
  read: <Eye className="h-4 w-4 text-primary" />,
  failed: <XCircle className="h-4 w-4 text-destructive" />,
};

export default function EmailMarketingPage() {
  const { user } = useAuth();
  const { data: campaigns, isLoading } = useCampaigns("email");
  const { data: templates } = useMarketingTemplates("email");
  const { data: patients } = usePatients();
  const createCampaign = useCreateCampaign();
  const deleteCampaign = useDeleteCampaign();
  const createBulkMessages = useCreateBulkMessages();
  const createTemplate = useCreateTemplate();
  const deleteTemplate = useDeleteTemplate();

  const [showCreate, setShowCreate] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [selectedPatients, setSelectedPatients] = useState<string[]>([]);
  const [patientSearch, setPatientSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");

  const [campaignName, setCampaignName] = useState("");
  const [subject, setSubject] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);

  const [tplName, setTplName] = useState("");
  const [tplSubject, setTplSubject] = useState("");
  const [tplBody, setTplBody] = useState("");
  const [tplCategory, setTplCategory] = useState("promotional");

  const { data: campaignMessages } = useCampaignMessages(selectedCampaign?.id || null);

  const filteredPatients = (patients || []).filter((p) => {
    if (!p.email) return false;
    const matchesSearch = `${p.first_name} ${p.last_name} ${p.email}`.toLowerCase().includes(patientSearch.toLowerCase());
    const matchesGender = genderFilter === "all" || p.gender === genderFilter;
    return matchesSearch && matchesGender;
  });

  const handleCreateCampaign = async () => {
    if (!campaignName || !messageBody || !subject) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    await createCampaign.mutateAsync({
      name: campaignName,
      channel: "email",
      subject,
      message_body: messageBody,
      media_urls: mediaUrls,
      created_by: user?.id,
    });
    setShowCreate(false);
    setCampaignName("");
    setSubject("");
    setMessageBody("");
    setMediaUrls([]);
  };

  const handleSendCampaign = async () => {
    if (!selectedCampaign || selectedPatients.length === 0) return;
    const targets = (patients || [])
      .filter((p) => selectedPatients.includes(p.id))
      .map((p) => ({ id: p.id, phone: p.phone, email: p.email }));

    await createBulkMessages.mutateAsync({
      campaignId: selectedCampaign.id,
      patients: targets,
      channel: "email",
    });
    setShowSendDialog(false);
    setSelectedPatients([]);
  };

  const handleSaveTemplate = async () => {
    if (!tplName || !tplBody) return;
    await createTemplate.mutateAsync({
      name: tplName,
      channel: "email",
      subject: tplSubject,
      body: tplBody,
      category: tplCategory,
      created_by: user?.id,
    });
    setShowTemplateDialog(false);
    setTplName("");
    setTplSubject("");
    setTplBody("");
  };

  const toggleSelectAll = () => {
    if (selectedPatients.length === filteredPatients.length) {
      setSelectedPatients([]);
    } else {
      setSelectedPatients(filteredPatients.map((p) => p.id));
    }
  };

  const totalSent = (campaigns || []).reduce((s, c) => s + c.total_recipients, 0);
  const totalDelivered = (campaigns || []).reduce((s, c) => s + c.delivered_count, 0);
  const totalFailed = (campaigns || []).reduce((s, c) => s + c.failed_count, 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Email Marketing" description="Send bulk promotional emails to patients via SMTP">
        <div className="flex gap-2">
          <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm"><FileText className="h-4 w-4 mr-1" /> Templates</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>Email Templates</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Template Name</Label>
                  <Input value={tplName} onChange={(e) => setTplName(e.target.value)} placeholder="e.g. Monthly Newsletter" />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={tplCategory} onValueChange={setTplCategory}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="promotional">Promotional</SelectItem>
                      <SelectItem value="appointment_reminder">Appointment Reminder</SelectItem>
                      <SelectItem value="follow_up">Follow Up</SelectItem>
                      <SelectItem value="seasonal">Seasonal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Subject Line</Label>
                  <Input value={tplSubject} onChange={(e) => setTplSubject(e.target.value)} placeholder="Your smile deserves the best!" />
                </div>
                <div className="space-y-2">
                  <Label>Email Body (HTML supported)</Label>
                  <Textarea value={tplBody} onChange={(e) => setTplBody(e.target.value)} rows={5} placeholder="<h1>Hello {{name}}</h1>..." />
                  <p className="text-xs text-muted-foreground">Use {"{{name}}"}, {"{{email}}"} as placeholders. HTML tags are supported.</p>
                </div>
                <Button onClick={handleSaveTemplate} disabled={createTemplate.isPending} className="w-full">Save Template</Button>
                {(templates || []).length > 0 && (
                  <ScrollArea className="h-40 border rounded-md p-2">
                    {(templates || []).map((t) => (
                      <div key={t.id} className="flex items-center justify-between py-2 border-b last:border-0">
                        <div>
                          <p className="text-sm font-medium">{t.name}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[250px]">{t.subject}</p>
                        </div>
                        <Button size="icon" variant="ghost" onClick={() => deleteTemplate.mutate(t.id)}>
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </ScrollArea>
                )}
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={showCreate} onOpenChange={setShowCreate}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="h-4 w-4 mr-1" /> New Campaign</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create Email Campaign</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Campaign Name</Label>
                  <Input value={campaignName} onChange={(e) => setCampaignName(e.target.value)} placeholder="e.g. February Newsletter" />
                </div>
                {(templates || []).length > 0 && (
                  <div className="space-y-2">
                    <Label>Load from Template (optional)</Label>
                    <Select value="" onValueChange={(id) => {
                      const tpl = templates?.find((t) => t.id === id);
                      if (tpl) { setMessageBody(tpl.body); setSubject(tpl.subject || ""); }
                    }}>
                      <SelectTrigger><SelectValue placeholder="Choose template..." /></SelectTrigger>
                      <SelectContent>
                        {(templates || []).map((t) => (
                          <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Subject Line</Label>
                  <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Your dental health matters!" />
                </div>
                <div className="space-y-2">
                  <Label>Email Body</Label>
                  <Textarea value={messageBody} onChange={(e) => setMessageBody(e.target.value)} rows={6} placeholder="Dear {{name}},\n\nWe are excited to..." />
                </div>
                <div className="space-y-2">
                  <Label>Attach Media (Photos, Videos, Files)</Label>
                  <MarketingMediaUpload mediaUrls={mediaUrls} onMediaChange={setMediaUrls} />
                </div>
                <DialogFooter>
                  <Button onClick={handleCreateCampaign} disabled={createCampaign.isPending}>
                    <Megaphone className="h-4 w-4 mr-1" /> Create Campaign
                  </Button>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </PageHeader>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center"><Megaphone className="h-5 w-5 text-primary" /></div>
            <div><p className="text-2xl font-bold">{(campaigns || []).length}</p><p className="text-xs text-muted-foreground">Campaigns</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center"><Send className="h-5 w-5 text-blue-500" /></div>
            <div><p className="text-2xl font-bold">{totalSent}</p><p className="text-xs text-muted-foreground">Total Sent</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center"><CheckCircle2 className="h-5 w-5 text-green-500" /></div>
            <div><p className="text-2xl font-bold">{totalDelivered}</p><p className="text-xs text-muted-foreground">Delivered</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center"><XCircle className="h-5 w-5 text-destructive" /></div>
            <div><p className="text-2xl font-bold">{totalFailed}</p><p className="text-xs text-muted-foreground">Failed</p></div>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Mail className="h-5 w-5" /> Email Campaigns</CardTitle>
          <CardDescription>Create and manage bulk email campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableSkeleton columns={6} rows={4} />
          ) : (campaigns || []).length === 0 ? (
            <EmptyState icon={Mail} title="No email campaigns yet" description="Create your first email marketing campaign" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Recipients</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(campaigns || []).map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell className="text-muted-foreground max-w-[200px] truncate">{c.subject || "—"}</TableCell>
                    <TableCell><Badge className={statusColors[c.status] || ""}>{c.status}</Badge></TableCell>
                    <TableCell>{c.total_recipients}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{format(new Date(c.created_at), "MMM d, yyyy")}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button size="icon" variant="ghost" onClick={() => { setSelectedCampaign(c); setShowDetailDialog(true); }}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      {c.status === "draft" && (
                        <Button size="icon" variant="ghost" onClick={() => { setSelectedCampaign(c); setShowSendDialog(true); }}>
                          <Send className="h-4 w-4 text-primary" />
                        </Button>
                      )}
                      <Button size="icon" variant="ghost" onClick={() => deleteCampaign.mutate(c.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Send Dialog */}
      <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader><DialogTitle>Send "{selectedCampaign?.name}" to Patients</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input className="pl-8" placeholder="Search patients with email..." value={patientSearch} onChange={(e) => setPatientSearch(e.target.value)} />
              </div>
              <Select value={genderFilter} onValueChange={setGenderFilter}>
                <SelectTrigger className="w-32"><Filter className="h-4 w-4 mr-1" /><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genders</SelectItem>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox checked={selectedPatients.length === filteredPatients.length && filteredPatients.length > 0} onCheckedChange={toggleSelectAll} />
              <span className="text-sm font-medium">Select all ({filteredPatients.length})</span>
              <Badge variant="secondary" className="ml-auto">{selectedPatients.length} selected</Badge>
            </div>
            <ScrollArea className="h-64 border rounded-md">
              {filteredPatients.map((p) => (
                <div key={p.id} className="flex items-center gap-3 px-3 py-2 border-b last:border-0 hover:bg-muted/50">
                  <Checkbox
                    checked={selectedPatients.includes(p.id)}
                    onCheckedChange={(checked) => {
                      setSelectedPatients((prev) => checked ? [...prev, p.id] : prev.filter((id) => id !== p.id));
                    }}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{p.first_name} {p.last_name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><AtSign className="h-3 w-3" /> {p.email}</p>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>
          <DialogFooter>
            <Button onClick={handleSendCampaign} disabled={createBulkMessages.isPending || selectedPatients.length === 0}>
              <Send className="h-4 w-4 mr-1" /> Send to {selectedPatients.length} patients
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader><DialogTitle>Campaign: {selectedCampaign?.name}</DialogTitle></DialogHeader>
          <Tabs defaultValue="details">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="messages">Messages ({campaignMessages?.length || 0})</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="space-y-3 mt-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Status:</span> <Badge className={statusColors[selectedCampaign?.status] || ""}>{selectedCampaign?.status}</Badge></div>
                <div><span className="text-muted-foreground">Subject:</span> {selectedCampaign?.subject || "—"}</div>
                <div><span className="text-muted-foreground">Recipients:</span> {selectedCampaign?.total_recipients}</div>
                <div><span className="text-muted-foreground">Delivered:</span> {selectedCampaign?.delivered_count}</div>
                <div><span className="text-muted-foreground">Failed:</span> {selectedCampaign?.failed_count}</div>
                <div><span className="text-muted-foreground">Read:</span> {selectedCampaign?.read_count}</div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Email Body:</p>
                <div className="bg-muted rounded-lg p-3 text-sm whitespace-pre-wrap max-h-48 overflow-auto">{selectedCampaign?.message_body}</div>
              </div>
              {selectedCampaign?.media_urls && selectedCampaign.media_urls.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Attachments ({selectedCampaign.media_urls.length}):</p>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedCampaign.media_urls.map((url: string, i: number) => (
                      <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="rounded-lg border overflow-hidden aspect-square bg-muted block hover:ring-2 hover:ring-primary transition-all">
                        {/\.(jpg|jpeg|png|gif|webp|svg)/i.test(url) ? (
                          <img src={url} alt={`Media ${i + 1}`} className="w-full h-full object-cover" />
                        ) : /\.(mp4|webm|mov)/i.test(url) ? (
                          <video src={url} className="w-full h-full object-cover" muted />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">File {i + 1}</div>
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
            <TabsContent value="messages" className="mt-4">
              <ScrollArea className="h-64">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Sent At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(campaignMessages || []).map((m: any) => (
                      <TableRow key={m.id}>
                        <TableCell className="font-medium">{m.patients?.first_name} {m.patients?.last_name}</TableCell>
                        <TableCell className="text-muted-foreground">{m.recipient_email}</TableCell>
                        <TableCell><span className="flex items-center gap-1">{msgStatusIcons[m.status]} {m.status}</span></TableCell>
                        <TableCell className="text-muted-foreground text-sm">{m.sent_at ? format(new Date(m.sent_at), "MMM d, HH:mm") : "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Integration Notice */}
      <Card className="border-dashed">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium">SMTP Integration Required</p>
              <p className="text-xs text-muted-foreground mt-1">
                To send emails, configure your SMTP credentials (host, port, username, password) in Settings → Integrations.
                Messages will be queued and ready to send once the SMTP server is configured.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
