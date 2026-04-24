import { useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, RefreshCw, Calendar, PlayCircle } from "lucide-react";
import { toast } from "sonner";
import { format, addDays, addWeeks, addMonths } from "date-fns";
import { useLdRecurringOrders, useAddLdRecurringOrder, useUpdateLdRecurringOrder, useDeleteLdRecurringOrder } from "@/hooks/useLdExtendedFeatures";
import { useLdClients } from "@/hooks/useLabDashboard";
import { useLdWorkTypes } from "@/hooks/useLabDashboard";
import { motion } from "framer-motion";

const frequencies = [
  { value: "weekly", label: "Weekly" },
  { value: "bi-weekly", label: "Bi-Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
];

export default function LdRecurringOrdersPage() {
  const { data: orders = [], isLoading } = useLdRecurringOrders();
  const { data: clients = [] } = useLdClients();
  const { data: workTypes = [] } = useLdWorkTypes();
  const addOrder = useAddLdRecurringOrder();
  const updateOrder = useUpdateLdRecurringOrder();
  const deleteOrder = useDeleteLdRecurringOrder();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<any>(null);

  const [formClientId, setFormClientId] = useState("");
  const [formWorkTypeId, setFormWorkTypeId] = useState("");
  const [formWorkTypeName, setFormWorkTypeName] = useState("");
  const [formPatientName, setFormPatientName] = useState("");
  const [formFrequency, setFormFrequency] = useState("monthly");
  const [formNextDueDate, setFormNextDueDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [formLabFee, setFormLabFee] = useState(0);
  const [formShade, setFormShade] = useState("");
  const [formInstructions, setFormInstructions] = useState("");
  const [formIsActive, setFormIsActive] = useState(true);

  const resetForm = () => {
    setFormClientId("");
    setFormWorkTypeId("");
    setFormWorkTypeName("");
    setFormPatientName("");
    setFormFrequency("monthly");
    setFormNextDueDate(format(new Date(), "yyyy-MM-dd"));
    setFormLabFee(0);
    setFormShade("");
    setFormInstructions("");
    setFormIsActive(true);
    setEditingOrder(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (order: any) => {
    setEditingOrder(order);
    setFormClientId(order.client_id || "");
    setFormWorkTypeId(order.work_type_id || "");
    setFormWorkTypeName(order.work_type_name || "");
    setFormPatientName(order.patient_name || "");
    setFormFrequency(order.frequency || "monthly");
    setFormNextDueDate(order.next_due_date || format(new Date(), "yyyy-MM-dd"));
    setFormLabFee(order.lab_fee || 0);
    setFormShade(order.shade || "");
    setFormInstructions(order.instructions || "");
    setFormIsActive(order.is_active);
    setDialogOpen(true);
  };

  const handleWorkTypeChange = (wtId: string) => {
    setFormWorkTypeId(wtId);
    const wt = workTypes.find(w => w.id === wtId);
    if (wt) {
      setFormWorkTypeName(wt.name);
      setFormLabFee(wt.base_price || 0);
    }
  };

  const handleSave = async () => {
    if (!formClientId || !formWorkTypeName) {
      toast.error("Client and work type are required");
      return;
    }
    const payload = {
      client_id: formClientId,
      work_type_id: formWorkTypeId || null,
      work_type_name: formWorkTypeName,
      patient_name: formPatientName,
      frequency: formFrequency,
      next_due_date: formNextDueDate,
      lab_fee: formLabFee,
      shade: formShade,
      instructions: formInstructions,
      is_active: formIsActive,
    };
    try {
      if (editingOrder) {
        await updateOrder.mutateAsync({ id: editingOrder.id, ...payload });
        toast.success("Recurring order updated");
      } else {
        await addOrder.mutateAsync(payload as any);
        toast.success("Recurring order created");
      }
      setDialogOpen(false);
      resetForm();
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this recurring order?")) return;
    try {
      await deleteOrder.mutateAsync(id);
      toast.success("Deleted");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleGenerateCase = async (order: any) => {
    // Calculate next due date based on frequency
    let nextDate = new Date(order.next_due_date);
    switch (order.frequency) {
      case "weekly": nextDate = addWeeks(nextDate, 1); break;
      case "bi-weekly": nextDate = addWeeks(nextDate, 2); break;
      case "monthly": nextDate = addMonths(nextDate, 1); break;
      case "quarterly": nextDate = addMonths(nextDate, 3); break;
    }
    try {
      await updateOrder.mutateAsync({
        id: order.id,
        last_generated_date: format(new Date(), "yyyy-MM-dd"),
        next_due_date: format(nextDate, "yyyy-MM-dd"),
      });
      toast.success("Case generated! Next due: " + format(nextDate, "MMM dd, yyyy"));
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const getClientName = (id: string) => clients.find(c => c.id === id)?.clinic_name || "Unknown";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Recurring Orders"
        description="Manage standing orders for regular clients"
      >
        <Button onClick={openCreateDialog} className="gap-2">
          <Plus className="h-4 w-4" /> New Recurring Order
        </Button>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-primary" />
            Active Recurring Orders ({orders.filter(o => o.is_active).length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : orders.length === 0 ? (
            <p className="text-muted-foreground">No recurring orders yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Work Type</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Next Due</TableHead>
                  <TableHead>Fee</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((o, idx) => (
                  <motion.tr
                    key={o.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="border-b"
                  >
                    <TableCell className="font-medium">{getClientName(o.client_id || "")}</TableCell>
                    <TableCell>{o.work_type_name}</TableCell>
                    <TableCell>{o.patient_name || "-"}</TableCell>
                    <TableCell className="capitalize">{o.frequency}</TableCell>
                    <TableCell>
                      {o.next_due_date ? format(new Date(o.next_due_date), "MMM dd, yyyy") : "-"}
                    </TableCell>
                    <TableCell>${o.lab_fee.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={o.is_active ? "default" : "secondary"}>
                        {o.is_active ? "Active" : "Paused"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button size="icon" variant="ghost" onClick={() => handleGenerateCase(o)} title="Generate Case Now">
                        <PlayCircle className="h-4 w-4 text-emerald-600" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => openEditDialog(o)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(o.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingOrder ? "Edit Recurring Order" : "New Recurring Order"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Client *</Label>
                <Select value={formClientId} onValueChange={setFormClientId}>
                  <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
                  <SelectContent>
                    {clients.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.clinic_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Work Type *</Label>
                <Select value={formWorkTypeId} onValueChange={handleWorkTypeChange}>
                  <SelectTrigger><SelectValue placeholder="Select work type" /></SelectTrigger>
                  <SelectContent>
                    {workTypes.filter(w => w.is_active).map(w => (
                      <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Patient Name</Label>
                <Input value={formPatientName} onChange={e => setFormPatientName(e.target.value)} placeholder="Optional" />
              </div>
              <div className="space-y-2">
                <Label>Frequency</Label>
                <Select value={formFrequency} onValueChange={setFormFrequency}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {frequencies.map(f => (
                      <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Next Due Date</Label>
                <Input type="date" value={formNextDueDate} onChange={e => setFormNextDueDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Lab Fee ($)</Label>
                <Input type="number" value={formLabFee} onChange={e => setFormLabFee(Number(e.target.value))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Shade</Label>
              <Input value={formShade} onChange={e => setFormShade(e.target.value)} placeholder="e.g., A2" />
            </div>
            <div className="space-y-2">
              <Label>Instructions</Label>
              <Textarea value={formInstructions} onChange={e => setFormInstructions(e.target.value)} rows={2} />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={formIsActive} onCheckedChange={setFormIsActive} />
              <Label>Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={addOrder.isPending || updateOrder.isPending}>
              {editingOrder ? "Save Changes" : "Create Order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
