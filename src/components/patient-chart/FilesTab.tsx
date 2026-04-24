import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Upload, FileText, StickyNote, Pencil } from "lucide-react";
import { usePatientImages, useUploadPatientImage } from "@/hooks/usePatientImages";
import { usePatientDocuments, useUploadPatientDocument } from "@/hooks/useDocuments";
import { usePatientConsentForms } from "@/hooks/useConsentForms";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface FilesTabProps {
  patientId: string;
  canUpload: boolean;
  userId?: string;
}

export function FilesTab({ patientId, canUpload, userId }: FilesTabProps) {
  const { data: images = [] } = usePatientImages(patientId);
  const { data: documents = [] } = usePatientDocuments(patientId);
  const { data: consentForms = [] } = usePatientConsentForms(patientId);
  const uploadImage = useUploadPatientImage();
  const uploadDoc = useUploadPatientDocument();
  const qc = useQueryClient();

  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [docDialogOpen, setDocDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedDocFile, setSelectedDocFile] = useState<File | null>(null);
  const [imageForm, setImageForm] = useState({ imageType: "x-ray", toothNumber: "", description: "" });
  const [docForm, setDocForm] = useState({ title: "", category: "other", notes: "" });

  // Note editing state
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<any>(null);
  const [noteText, setNoteText] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  const openAddNote = (img: any) => {
    setEditingImage(img);
    setNoteText(img.description || "");
    setNoteDialogOpen(true);
  };

  const handleSaveNote = async () => {
    if (!editingImage) return;
    setSavingNote(true);
    const { error } = await supabase
      .from("patient_images")
      .update({ description: noteText })
      .eq("id", editingImage.id);
    setSavingNote(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Note saved" });
      qc.invalidateQueries({ queryKey: ["patient_images"] });
      setNoteDialogOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="images">
        <div className="flex items-center justify-between mb-2">
          <TabsList>
            <TabsTrigger value="images">X-Rays & Photos ({images.length})</TabsTrigger>
            <TabsTrigger value="documents">Documents ({documents.length})</TabsTrigger>
            <TabsTrigger value="consents">Consents ({consentForms.length})</TabsTrigger>
          </TabsList>
          {canUpload && (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setImageDialogOpen(true)}>
                <Camera className="mr-1 h-3 w-3" /> Upload Image
              </Button>
              <Button size="sm" variant="outline" onClick={() => setDocDialogOpen(true)}>
                <Upload className="mr-1 h-3 w-3" /> Upload Doc
              </Button>
            </div>
          )}
        </div>

        <TabsContent value="images">
          {images.length === 0 ? (
            <Card><CardContent className="py-10 text-center text-sm text-muted-foreground">No images uploaded.</CardContent></Card>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {images.map((img: any) => (
                <Card key={img.id} className="overflow-hidden group">
                  <a href={img.image_url} target="_blank" rel="noopener noreferrer">
                    <div className="aspect-square bg-muted">
                      <img src={img.image_url} alt={img.description || "Patient image"} className="w-full h-full object-cover hover:opacity-90 transition-opacity" />
                    </div>
                  </a>
                  <CardContent className="p-2 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <Badge variant="outline" className="text-[10px] capitalize">{img.image_type}</Badge>
                      {canUpload && (
                        <Button size="icon" variant="ghost" className="h-5 w-5 shrink-0" title="Add/Edit Note" onClick={() => openAddNote(img)}>
                          <StickyNote className="h-3 w-3 text-muted-foreground" />
                        </Button>
                      )}
                    </div>
                    {img.description && <p className="text-xs text-muted-foreground truncate">{img.description}</p>}
                    <p className="text-[10px] text-muted-foreground">{img.date_taken}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="documents">
          {documents.length === 0 ? (
            <Card><CardContent className="py-10 text-center text-sm text-muted-foreground">No documents uploaded.</CardContent></Card>
          ) : (
            documents.map((doc: any) => (
              <Card key={doc.id} className="mb-2">
                <CardContent className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{doc.title}</p>
                      <Badge variant="outline" className="text-[10px] capitalize mt-1">{doc.category}</Badge>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{new Date(doc.created_at).toLocaleDateString()}</p>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="consents">
          {consentForms.length === 0 ? (
            <Card><CardContent className="py-10 text-center text-sm text-muted-foreground">No consent forms found.</CardContent></Card>
          ) : (
            consentForms.map((cf: any) => (
              <Card key={cf.id} className="mb-2">
                <CardContent className="py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{cf.title}</p>
                    <p className="text-xs text-muted-foreground">{new Date(cf.created_at).toLocaleDateString()}</p>
                  </div>
                  <Badge className={cf.status === "signed" ? "bg-emerald-100 text-emerald-700" : cf.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}>
                    {cf.status}
                  </Badge>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Add/Edit Note Dialog */}
      <Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle><Pencil className="inline h-4 w-4 mr-2" />Add Note to Image</DialogTitle></DialogHeader>
          <div className="space-y-2">
            <Label className="text-xs">Note / Description</Label>
            <Textarea value={noteText} onChange={e => setNoteText(e.target.value)} rows={3} placeholder="Describe this image, findings, tooth number, etc..." />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNoteDialogOpen(false)}>Cancel</Button>
            <Button className="bg-secondary hover:bg-secondary/90" disabled={savingNote} onClick={handleSaveNote}>
              {savingNote ? "Saving..." : "Save Note"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Upload Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Upload Patient Image</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1"><Label className="text-xs">File *</Label><Input type="file" accept="image/*" onChange={e => setSelectedFile(e.target.files?.[0] || null)} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Type</Label>
                <Select value={imageForm.imageType} onValueChange={v => setImageForm(f => ({ ...f, imageType: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="x-ray">X-Ray</SelectItem>
                    <SelectItem value="intra-oral">Intra-oral</SelectItem>
                    <SelectItem value="clinical-photo">Clinical Photo</SelectItem>
                    <SelectItem value="scan">Digital Scan</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label className="text-xs">Tooth #</Label><Input type="number" value={imageForm.toothNumber} onChange={e => setImageForm(f => ({ ...f, toothNumber: e.target.value }))} /></div>
            </div>
            <div className="space-y-1"><Label className="text-xs">Description / Note</Label><Input value={imageForm.description} onChange={e => setImageForm(f => ({ ...f, description: e.target.value }))} placeholder="Add a description or note..." /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImageDialogOpen(false)}>Cancel</Button>
            <Button className="bg-secondary hover:bg-secondary/90" disabled={uploadImage.isPending || !selectedFile} onClick={() => {
              if (!selectedFile) return;
              uploadImage.mutate({ file: selectedFile, patientId, imageType: imageForm.imageType, toothNumber: imageForm.toothNumber ? Number(imageForm.toothNumber) : undefined, description: imageForm.description, userId }, {
                onSuccess: () => { setImageDialogOpen(false); setSelectedFile(null); setImageForm({ imageType: "x-ray", toothNumber: "", description: "" }); },
              });
            }}>{uploadImage.isPending ? "Uploading..." : "Upload"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Document Upload Dialog */}
      <Dialog open={docDialogOpen} onOpenChange={setDocDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Upload Patient Document</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1"><Label className="text-xs">File *</Label><Input type="file" onChange={e => setSelectedDocFile(e.target.files?.[0] || null)} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label className="text-xs">Title *</Label><Input value={docForm.title} onChange={e => setDocForm(f => ({ ...f, title: e.target.value }))} /></div>
              <div className="space-y-1">
                <Label className="text-xs">Category</Label>
                <Select value={docForm.category} onValueChange={v => setDocForm(f => ({ ...f, category: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="insurance">Insurance</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                    <SelectItem value="consent">Consent</SelectItem>
                    <SelectItem value="lab">Lab</SelectItem>
                    <SelectItem value="scan">Digital Scan</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1"><Label className="text-xs">Notes</Label><Input value={docForm.notes} onChange={e => setDocForm(f => ({ ...f, notes: e.target.value }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDocDialogOpen(false)}>Cancel</Button>
            <Button className="bg-secondary hover:bg-secondary/90" disabled={uploadDoc.isPending || !selectedDocFile || !docForm.title} onClick={() => {
              if (!selectedDocFile) return;
              uploadDoc.mutate({ file: selectedDocFile, patientId, title: docForm.title, category: docForm.category, notes: docForm.notes, userId }, {
                onSuccess: () => { setDocDialogOpen(false); setSelectedDocFile(null); setDocForm({ title: "", category: "other", notes: "" }); },
              });
            }}>{uploadDoc.isPending ? "Uploading..." : "Upload"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
