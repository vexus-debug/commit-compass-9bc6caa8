import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { useLdClients, useCreateLdClient, useUpdateLdClient, useDeleteLdClient } from "@/hooks/useLabDashboard";
import { useAuth } from "@/hooks/useAuth";

export default function LdClientsPage() {
  const { data: clients = [], isLoading } = useLdClients();
  const createClient = useCreateLdClient();
  const updateClient = useUpdateLdClient();
  const deleteClient = useDeleteLdClient();
  const { roles } = useAuth();
  const isAdmin = roles.includes("admin") || roles.includes("lab_manager");
  const maskPhone = (phone: string | null) => {
    if (!phone) return "—";
    if (isAdmin) return phone;
    return "xxxxxxxxx";
  };

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editClient, setEditClient] = useState<any>(null);

  const filtered = clients.filter((c: any) =>
    !search || c.clinic_name?.toLowerCase().includes(search.toLowerCase()) || c.doctor_name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const values = {
      clinic_name: fd.get("clinic_name") as string,
      doctor_name: fd.get("doctor_name") as string,
      clinic_code: fd.get("clinic_code") as string,
      phone: fd.get("phone") as string,
      email: fd.get("email") as string,
      address: fd.get("address") as string,
      notes: fd.get("notes") as string,
    };
    if (editClient) {
      updateClient.mutate({ id: editClient.id, ...values }, { onSuccess: () => { setDialogOpen(false); setEditClient(null); } });
    } else {
      createClient.mutate(values, { onSuccess: () => setDialogOpen(false) });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Clients</h1>
          <p className="text-sm text-muted-foreground">Clinics & doctors who send lab work</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) setEditClient(null); }}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-1" /> Add Client</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editClient ? "Edit Client" : "Add Client"}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2"><Label>Clinic Name *</Label><Input name="clinic_name" required defaultValue={editClient?.clinic_name || ""} /></div>
                <div><Label>Doctor Name *</Label><Input name="doctor_name" required defaultValue={editClient?.doctor_name || ""} /></div>
                <div><Label>Clinic Code</Label><Input name="clinic_code" defaultValue={editClient?.clinic_code || ""} /></div>
                <div><Label>Phone</Label><Input name="phone" defaultValue={editClient?.phone || ""} disabled={!isAdmin && !!editClient} placeholder={isAdmin ? "" : "Admin only"} /></div>
                <div><Label>Email</Label><Input name="email" type="email" defaultValue={editClient?.email || ""} /></div>
                <div className="col-span-2"><Label>Address</Label><Input name="address" defaultValue={editClient?.address || ""} /></div>
                <div className="col-span-2"><Label>Notes</Label><Input name="notes" defaultValue={editClient?.notes || ""} /></div>
              </div>
              <Button type="submit" className="w-full" disabled={createClient.isPending || updateClient.isPending}>
                {editClient ? "Update" : "Add Client"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search clients..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <Card className="border-border/50">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-muted/30">
                  <th className="text-left p-3 font-medium text-muted-foreground">Clinic</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Doctor</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Code</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Phone</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Email</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">Loading...</td></tr>
                ) : !filtered.length ? (
                  <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">No clients found</td></tr>
                ) : filtered.map((c: any) => (
                  <tr key={c.id} className="border-b border-border/30 hover:bg-muted/20">
                    <td className="p-3 font-medium">{c.clinic_name}</td>
                    <td className="p-3">{c.doctor_name}</td>
                    <td className="p-3 font-mono text-xs">{c.clinic_code || "—"}</td>
                    <td className="p-3 text-xs">{maskPhone(c.phone)}</td>
                    <td className="p-3 text-xs">{c.email || "—"}</td>
                    <td className="p-3"><Badge variant={c.status === "active" ? "default" : "secondary"}>{c.status}</Badge></td>
                    <td className="p-3 text-right">
                      <div className="flex gap-1 justify-end">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditClient(c); setDialogOpen(true); }}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive">
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Client</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {c.doctor_name} ({c.clinic_name})? This cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteClient.mutate(c.id)} className="bg-destructive hover:bg-destructive/90">
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
