import { useState, useMemo } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Phone, Mail, MessageSquare, User, ArrowUpRight, ArrowDownLeft, Calendar } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { useLdCommunications, useAddLdCommunication } from "@/hooks/useLdExtendedFeatures";
import { useLdClients, useLdCases } from "@/hooks/useLabDashboard";
import { motion } from "framer-motion";

const commTypes = [
  { value: "call", label: "Phone Call", icon: Phone },
  { value: "email", label: "Email", icon: Mail },
  { value: "whatsapp", label: "WhatsApp", icon: MessageSquare },
  { value: "in-person", label: "In Person", icon: User },
];

const typeColors: Record<string, string> = {
  call: "bg-blue-100 text-blue-800",
  email: "bg-purple-100 text-purple-800",
  whatsapp: "bg-emerald-100 text-emerald-800",
  "in-person": "bg-amber-100 text-amber-800",
};

export default function LdCommunicationsPage() {
  const { data: comms = [], isLoading } = useLdCommunications();
  const { data: clients = [] } = useLdClients();
  const { data: cases = [] } = useLdCases();
  const addComm = useAddLdCommunication();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [filterClientId, setFilterClientId] = useState<string>("all");

  const [formClientId, setFormClientId] = useState("");
  const [formCaseId, setFormCaseId] = useState("");
  const [formType, setFormType] = useState("call");
  const [formDirection, setFormDirection] = useState("outgoing");
  const [formSubject, setFormSubject] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formContactPerson, setFormContactPerson] = useState("");
  const [formCommunicatedByName, setFormCommunicatedByName] = useState("");
  const [formFollowUpRequired, setFormFollowUpRequired] = useState(false);
  const [formFollowUpDate, setFormFollowUpDate] = useState("");

  const filteredComms = useMemo(() => {
    if (filterClientId === "all") return comms;
    return comms.filter(c => c.client_id === filterClientId);
  }, [comms, filterClientId]);

  const followUpRequired = comms.filter(c => c.follow_up_required && c.follow_up_date && new Date(c.follow_up_date) <= new Date()).length;

  const resetForm = () => {
    setFormClientId("");
    setFormCaseId("");
    setFormType("call");
    setFormDirection("outgoing");
    setFormSubject("");
    setFormContent("");
    setFormContactPerson("");
    setFormCommunicatedByName("");
    setFormFollowUpRequired(false);
    setFormFollowUpDate("");
  };

  const handleSave = async () => {
    if (!formClientId) {
      toast.error("Client is required");
      return;
    }
    try {
      await addComm.mutateAsync({
        client_id: formClientId,
        case_id: formCaseId || null,
        communication_type: formType,
        direction: formDirection,
        subject: formSubject,
        content: formContent,
        contact_person: formContactPerson,
        communicated_by_name: formCommunicatedByName,
        communicated_at: new Date().toISOString(),
        follow_up_required: formFollowUpRequired,
        follow_up_date: formFollowUpDate || null,
      } as any);
      toast.success("Communication logged");
      setDialogOpen(false);
      resetForm();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const getClientName = (id: string | null) => clients.find(c => c.id === id)?.clinic_name || "Unknown";
  const getCaseNumber = (id: string | null) => cases.find(c => c.id === id)?.case_number || null;
  const clientCases = cases.filter(c => c.client_id === formClientId);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Communication Log"
        description="Track all client interactions"
      >
        <Button onClick={() => { resetForm(); setDialogOpen(true); }} className="gap-2">
          <Plus className="h-4 w-4" /> Log Communication
        </Button>
      </PageHeader>

      {/* Follow-up Alert */}
      {followUpRequired > 0 && (
        <Card className="border-amber-500/50 bg-amber-50">
          <CardContent className="flex items-center gap-4 py-4">
            <div className="p-3 rounded-full bg-amber-200">
              <Calendar className="h-6 w-6 text-amber-700" />
            </div>
            <div>
              <p className="font-semibold text-amber-800">{followUpRequired} Follow-up{followUpRequired > 1 ? "s" : ""} Required</p>
              <p className="text-sm text-amber-700">Communications needing follow-up action</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Communications ({filteredComms.length})
          </CardTitle>
          <Select value={filterClientId} onValueChange={setFilterClientId}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Clients" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clients</SelectItem>
              {clients.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.clinic_name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : filteredComms.length === 0 ? (
            <p className="text-muted-foreground">No communications logged yet.</p>
          ) : (
            <div className="space-y-3">
              {filteredComms.map((comm, idx) => {
                const TypeIcon = commTypes.find(t => t.value === comm.communication_type)?.icon || MessageSquare;
                const caseNum = getCaseNumber(comm.case_id);
                return (
                  <motion.div
                    key={comm.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    className="border rounded-lg p-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full ${typeColors[comm.communication_type] || "bg-muted"}`}>
                          <TypeIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">{getClientName(comm.client_id)}</p>
                            {comm.direction === "outgoing" ? (
                              <ArrowUpRight className="h-4 w-4 text-emerald-600" />
                            ) : (
                              <ArrowDownLeft className="h-4 w-4 text-blue-600" />
                            )}
                            <Badge variant="outline" className="text-xs capitalize">{comm.communication_type}</Badge>
                            {caseNum && (
                              <Badge variant="secondary" className="text-xs">{caseNum}</Badge>
                            )}
                          </div>
                          {comm.subject && <p className="text-sm font-medium">{comm.subject}</p>}
                          {comm.content && <p className="text-sm text-muted-foreground mt-1">{comm.content}</p>}
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            {comm.contact_person && <span>Contact: {comm.contact_person}</span>}
                            {comm.communicated_by_name && <span>By: {comm.communicated_by_name}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <p className="text-muted-foreground">
                          {format(new Date(comm.communicated_at), "MMM dd, yyyy")}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {format(new Date(comm.communicated_at), "h:mm a")}
                        </p>
                        {comm.follow_up_required && (
                          <Badge variant="outline" className="mt-2 text-amber-600 border-amber-300">
                            Follow-up: {comm.follow_up_date ? format(new Date(comm.follow_up_date), "MMM dd") : "Required"}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Log Communication</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Client *</Label>
                <Select value={formClientId} onValueChange={(v) => { setFormClientId(v); setFormCaseId(""); }}>
                  <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
                  <SelectContent>
                    {clients.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.clinic_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Related Case (optional)</Label>
                <Select value={formCaseId} onValueChange={setFormCaseId}>
                  <SelectTrigger><SelectValue placeholder="Select case" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {clientCases.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.case_number}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={formType} onValueChange={setFormType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {commTypes.map(t => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Direction</Label>
                <Select value={formDirection} onValueChange={setFormDirection}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="outgoing">Outgoing</SelectItem>
                    <SelectItem value="incoming">Incoming</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input value={formSubject} onChange={e => setFormSubject(e.target.value)} placeholder="Brief summary" />
            </div>
            <div className="space-y-2">
              <Label>Content/Notes</Label>
              <Textarea value={formContent} onChange={e => setFormContent(e.target.value)} rows={3} placeholder="Details of the communication..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Contact Person</Label>
                <Input value={formContactPerson} onChange={e => setFormContactPerson(e.target.value)} placeholder="Who you spoke with" />
              </div>
              <div className="space-y-2">
                <Label>Communicated By</Label>
                <Input value={formCommunicatedByName} onChange={e => setFormCommunicatedByName(e.target.value)} placeholder="Your name" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch checked={formFollowUpRequired} onCheckedChange={setFormFollowUpRequired} />
                <Label>Follow-up Required</Label>
              </div>
              {formFollowUpRequired && (
                <Input type="date" value={formFollowUpDate} onChange={e => setFormFollowUpDate(e.target.value)} className="w-40" />
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={addComm.isPending}>
              Log Communication
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
