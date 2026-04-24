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
import { Plus, Edit, Trash2, Palette, Search } from "lucide-react";
import { toast } from "sonner";
import { useLdShadeLibrary, useAddLdShade, useUpdateLdShade, useDeleteLdShade } from "@/hooks/useLdExtendedFeatures";
import { motion } from "framer-motion";

const shadeSystems = [
  { value: "vita-classic", label: "VITA Classical" },
  { value: "vita-3d", label: "VITA 3D-Master" },
  { value: "chromascop", label: "Chromascop" },
  { value: "other", label: "Other" },
];

// Common VITA Classical shades
const vitaClassicShades = [
  { code: "A1", name: "A1 - Light Reddish Brown" },
  { code: "A2", name: "A2 - Reddish Brown" },
  { code: "A3", name: "A3 - Dark Reddish Brown" },
  { code: "A3.5", name: "A3.5 - Darker Reddish Brown" },
  { code: "A4", name: "A4 - Darkest Reddish Brown" },
  { code: "B1", name: "B1 - Light Reddish Yellow" },
  { code: "B2", name: "B2 - Reddish Yellow" },
  { code: "B3", name: "B3 - Dark Reddish Yellow" },
  { code: "B4", name: "B4 - Darkest Reddish Yellow" },
  { code: "C1", name: "C1 - Light Grayish" },
  { code: "C2", name: "C2 - Grayish" },
  { code: "C3", name: "C3 - Dark Grayish" },
  { code: "C4", name: "C4 - Darkest Grayish" },
  { code: "D2", name: "D2 - Reddish Gray" },
  { code: "D3", name: "D3 - Dark Reddish Gray" },
  { code: "D4", name: "D4 - Darkest Reddish Gray" },
];

export default function LdShadeLibraryPage() {
  const { data: shades = [], isLoading } = useLdShadeLibrary();
  const addShade = useAddLdShade();
  const updateShade = useUpdateLdShade();
  const deleteShade = useDeleteLdShade();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingShade, setEditingShade] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSystem, setFilterSystem] = useState<string>("all");

  const [formCode, setFormCode] = useState("");
  const [formName, setFormName] = useState("");
  const [formSystem, setFormSystem] = useState("vita-classic");
  const [formColorHex, setFormColorHex] = useState("#F5DEB3");
  const [formDescription, setFormDescription] = useState("");
  const [formIsActive, setFormIsActive] = useState(true);

  const filteredShades = useMemo(() => {
    let result = shades;
    if (filterSystem !== "all") {
      result = result.filter(s => s.shade_system === filterSystem);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(s => 
        s.shade_code.toLowerCase().includes(term) || 
        s.shade_name.toLowerCase().includes(term)
      );
    }
    return result;
  }, [shades, filterSystem, searchTerm]);

  const resetForm = () => {
    setFormCode("");
    setFormName("");
    setFormSystem("vita-classic");
    setFormColorHex("#F5DEB3");
    setFormDescription("");
    setFormIsActive(true);
    setEditingShade(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (shade: any) => {
    setEditingShade(shade);
    setFormCode(shade.shade_code);
    setFormName(shade.shade_name);
    setFormSystem(shade.shade_system);
    setFormColorHex(shade.color_hex || "#F5DEB3");
    setFormDescription(shade.description || "");
    setFormIsActive(shade.is_active);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formCode || !formName) {
      toast.error("Shade code and name are required");
      return;
    }
    const payload = {
      shade_code: formCode.toUpperCase(),
      shade_name: formName,
      shade_system: formSystem,
      color_hex: formColorHex,
      description: formDescription,
      is_active: formIsActive,
    };
    try {
      if (editingShade) {
        await updateShade.mutateAsync({ id: editingShade.id, ...payload });
        toast.success("Shade updated");
      } else {
        await addShade.mutateAsync(payload as any);
        toast.success("Shade added");
      }
      setDialogOpen(false);
      resetForm();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this shade?")) return;
    try {
      await deleteShade.mutateAsync(id);
      toast.success("Deleted");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const importVitaClassic = async () => {
    try {
      for (const shade of vitaClassicShades) {
        await addShade.mutateAsync({
          shade_code: shade.code,
          shade_name: shade.name,
          shade_system: "vita-classic",
          is_active: true,
        } as any);
      }
      toast.success("VITA Classical shades imported!");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Shade Library"
        description="Manage dental shade references"
      >
        {shades.filter(s => s.shade_system === "vita-classic").length === 0 && (
          <Button variant="outline" onClick={importVitaClassic}>
            Import VITA Classical
          </Button>
        )}
        <Button onClick={openCreateDialog} className="gap-2">
          <Plus className="h-4 w-4" /> Add Shade
        </Button>
      </PageHeader>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            Shades ({filteredShades.length})
          </CardTitle>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search shades..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 w-48"
              />
            </div>
            <Select value={filterSystem} onValueChange={setFilterSystem}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Systems" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Systems</SelectItem>
                {shadeSystems.map(s => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : filteredShades.length === 0 ? (
            <p className="text-muted-foreground">No shades in library. Import VITA Classical or add custom shades.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredShades.map((shade, idx) => (
                <motion.div
                  key={shade.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.02 }}
                  className={`border rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer ${!shade.is_active ? "opacity-50" : ""}`}
                  onClick={() => openEditDialog(shade)}
                >
                  <div 
                    className="h-16 rounded-lg mb-2 border"
                    style={{ backgroundColor: shade.color_hex || "#F5DEB3" }}
                  />
                  <p className="font-bold text-center">{shade.shade_code}</p>
                  <p className="text-xs text-muted-foreground text-center truncate" title={shade.shade_name}>
                    {shade.shade_name}
                  </p>
                  <Badge variant="outline" className="mt-2 w-full justify-center text-xs">
                    {shadeSystems.find(s => s.value === shade.shade_system)?.label || shade.shade_system}
                  </Badge>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingShade ? "Edit Shade" : "Add Shade"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Shade Code *</Label>
                <Input value={formCode} onChange={e => setFormCode(e.target.value)} placeholder="e.g., A2" className="uppercase" />
              </div>
              <div className="space-y-2">
                <Label>Shade System</Label>
                <Select value={formSystem} onValueChange={setFormSystem}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {shadeSystems.map(s => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Shade Name *</Label>
              <Input value={formName} onChange={e => setFormName(e.target.value)} placeholder="e.g., A2 - Reddish Brown" />
            </div>
            <div className="space-y-2">
              <Label>Color Preview</Label>
              <div className="flex gap-2 items-center">
                <Input 
                  type="color" 
                  value={formColorHex} 
                  onChange={e => setFormColorHex(e.target.value)} 
                  className="w-16 h-10 p-1"
                />
                <Input 
                  value={formColorHex} 
                  onChange={e => setFormColorHex(e.target.value)} 
                  placeholder="#F5DEB3" 
                  className="flex-1"
                />
                <div 
                  className="w-10 h-10 rounded-lg border"
                  style={{ backgroundColor: formColorHex }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={formDescription} onChange={e => setFormDescription(e.target.value)} rows={2} />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={formIsActive} onCheckedChange={setFormIsActive} />
              <Label>Active</Label>
            </div>
          </div>
          <DialogFooter className="flex justify-between">
            {editingShade && (
              <Button variant="destructive" size="sm" onClick={() => { handleDelete(editingShade.id); setDialogOpen(false); }}>
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </Button>
            )}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={addShade.isPending || updateShade.isPending}>
                {editingShade ? "Save Changes" : "Add Shade"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
