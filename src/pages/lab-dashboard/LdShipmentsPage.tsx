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
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Package, Truck, CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { useLdShipments, useAddLdShipment, useUpdateLdShipment, useAddCasesToShipment } from "@/hooks/useLdExtendedFeatures";
import { useLdCases, useLdClients } from "@/hooks/useLabDashboard";
import { motion } from "framer-motion";

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  dispatched: "bg-blue-100 text-blue-800",
  delivered: "bg-emerald-100 text-emerald-800",
};

const deliveryMethods = [
  { value: "pickup", label: "Pickup" },
  { value: "delivery", label: "Delivery" },
  { value: "courier", label: "Courier" },
];

export default function LdShipmentsPage() {
  const { data: shipments = [], isLoading } = useLdShipments();
  const { data: cases = [] } = useLdCases();
  const { data: clients = [] } = useLdClients();
  const addShipment = useAddLdShipment();
  const updateShipment = useUpdateLdShipment();
  const addCasesToShipment = useAddCasesToShipment();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [formClientId, setFormClientId] = useState("");
  const [formDeliveryMethod, setFormDeliveryMethod] = useState("pickup");
  const [formCourierName, setFormCourierName] = useState("");
  const [formTrackingNumber, setFormTrackingNumber] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [selectedCaseIds, setSelectedCaseIds] = useState<string[]>([]);

  // Filter completed cases not yet shipped
  const completedCases = useMemo(() => {
    return cases.filter(c => c.status === "completed" && !c.delivered_date);
  }, [cases]);

  const clientCases = useMemo(() => {
    if (!formClientId) return completedCases;
    return completedCases.filter(c => c.client_id === formClientId);
  }, [completedCases, formClientId]);

  const getClientName = (id: string | null) => clients.find(c => c.id === id)?.clinic_name || "Unknown";

  const resetForm = () => {
    setFormClientId("");
    setFormDeliveryMethod("pickup");
    setFormCourierName("");
    setFormTrackingNumber("");
    setFormNotes("");
    setSelectedCaseIds([]);
  };

  const generateShipmentNumber = () => {
    const date = format(new Date(), "yyyyMMdd");
    const rand = Math.floor(Math.random() * 9000) + 1000;
    return `SHP-${date}-${rand}`;
  };

  const handleCreateShipment = async () => {
    if (!formClientId || selectedCaseIds.length === 0) {
      toast.error("Select a client and at least one case");
      return;
    }
    try {
      const shipment = await addShipment.mutateAsync({
        shipment_number: generateShipmentNumber(),
        client_id: formClientId,
        shipment_date: format(new Date(), "yyyy-MM-dd"),
        delivery_method: formDeliveryMethod,
        courier_name: formCourierName,
        tracking_number: formTrackingNumber,
        status: "pending",
        total_cases: selectedCaseIds.length,
        notes: formNotes,
      } as any);
      await addCasesToShipment.mutateAsync({ shipmentId: shipment.id, caseIds: selectedCaseIds });
      toast.success("Shipment created with " + selectedCaseIds.length + " cases");
      setCreateDialogOpen(false);
      resetForm();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const markDispatched = async (id: string) => {
    try {
      await updateShipment.mutateAsync({
        id,
        status: "dispatched",
        dispatched_at: new Date().toISOString(),
      });
      toast.success("Shipment dispatched");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const markDelivered = async (id: string) => {
    try {
      await updateShipment.mutateAsync({ id, status: "delivered" });
      toast.success("Shipment delivered");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const toggleCase = (caseId: string) => {
    setSelectedCaseIds(prev =>
      prev.includes(caseId) ? prev.filter(id => id !== caseId) : [...prev, caseId]
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Batch Shipments"
        description="Group completed cases for dispatch to clients"
      >
        <Button onClick={() => { resetForm(); setCreateDialogOpen(true); }} className="gap-2">
          <Plus className="h-4 w-4" /> Create Shipment
        </Button>
      </PageHeader>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center gap-4 py-4">
            <div className="p-3 rounded-full bg-amber-100">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{shipments.filter(s => s.status === "pending").length}</p>
              <p className="text-sm text-muted-foreground">Pending Shipments</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 py-4">
            <div className="p-3 rounded-full bg-blue-100">
              <Truck className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{shipments.filter(s => s.status === "dispatched").length}</p>
              <p className="text-sm text-muted-foreground">In Transit</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 py-4">
            <div className="p-3 rounded-full bg-emerald-100">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{shipments.filter(s => s.status === "delivered").length}</p>
              <p className="text-sm text-muted-foreground">Delivered</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            All Shipments
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : shipments.length === 0 ? (
            <p className="text-muted-foreground">No shipments yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Shipment #</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Cases</TableHead>
                  <TableHead>Tracking</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shipments.map((s, idx) => (
                  <motion.tr
                    key={s.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="border-b"
                  >
                    <TableCell className="font-medium">{s.shipment_number}</TableCell>
                    <TableCell>{getClientName(s.client_id)}</TableCell>
                    <TableCell>{format(new Date(s.shipment_date), "MMM dd, yyyy")}</TableCell>
                    <TableCell className="capitalize">{s.delivery_method}</TableCell>
                    <TableCell>{s.total_cases}</TableCell>
                    <TableCell>{s.tracking_number || "-"}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[s.status] || "bg-muted"}>{s.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      {s.status === "pending" && (
                        <Button size="sm" variant="outline" onClick={() => markDispatched(s.id)}>
                          Dispatch
                        </Button>
                      )}
                      {s.status === "dispatched" && (
                        <Button size="sm" variant="outline" onClick={() => markDelivered(s.id)}>
                          Delivered
                        </Button>
                      )}
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Shipment Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Batch Shipment</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Client *</Label>
                <Select value={formClientId} onValueChange={(v) => { setFormClientId(v); setSelectedCaseIds([]); }}>
                  <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
                  <SelectContent>
                    {clients.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.clinic_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Delivery Method</Label>
                <Select value={formDeliveryMethod} onValueChange={setFormDeliveryMethod}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {deliveryMethods.map(m => (
                      <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {formDeliveryMethod === "courier" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Courier Name</Label>
                  <Input value={formCourierName} onChange={e => setFormCourierName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Tracking Number</Label>
                  <Input value={formTrackingNumber} onChange={e => setFormTrackingNumber(e.target.value)} />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea value={formNotes} onChange={e => setFormNotes(e.target.value)} rows={2} />
            </div>
            
            {/* Case Selection */}
            <div className="space-y-2">
              <Label>Select Cases to Ship ({selectedCaseIds.length} selected)</Label>
              {clientCases.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">No completed cases available for this client.</p>
              ) : (
                <div className="border rounded-lg max-h-48 overflow-y-auto">
                  {clientCases.map(c => (
                    <div
                      key={c.id}
                      className="flex items-center gap-3 p-3 border-b last:border-b-0 hover:bg-muted/50 cursor-pointer"
                      onClick={() => toggleCase(c.id)}
                    >
                      <Checkbox
                        checked={selectedCaseIds.includes(c.id)}
                        onCheckedChange={() => toggleCase(c.id)}
                      />
                      <div className="flex-1">
                        <p className="font-medium">{c.case_number}</p>
                        <p className="text-sm text-muted-foreground">{c.work_type_name} - {c.patient_name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateShipment} disabled={addShipment.isPending || selectedCaseIds.length === 0}>
              Create Shipment ({selectedCaseIds.length} cases)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
