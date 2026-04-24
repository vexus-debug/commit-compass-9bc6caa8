import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePatientLabCases } from "@/hooks/usePatientLabCases";
import { MessageCircle, Mail, Upload, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useLabCaseImages, useUploadLabCaseImage } from "@/hooks/useLabCaseImages";

interface LabWorkTabProps {
  patientId: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  "in-progress": "bg-blue-100 text-blue-700",
  ready: "bg-emerald-100 text-emerald-700",
  delivered: "bg-gray-100 text-gray-700",
  cancelled: "bg-red-100 text-red-700",
};

function formatCurrency(amount: number) {
  return `₦${amount.toLocaleString()}`;
}

export function LabWorkTab({ patientId }: LabWorkTabProps) {
  const { data: labCases = [], isLoading } = usePatientLabCases(patientId);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const uploadImage = useUploadLabCaseImage();

  // Get images for all lab cases
  const caseIds = labCases.map((lc: any) => lc.id);
  const { data: allLabImages = [] } = useLabCaseImages(caseIds);

  const openUpload = (caseId: string) => {
    setSelectedCaseId(caseId);
    setSelectedFile(null);
    setDescription("");
    setUploadDialogOpen(true);
  };

  const handleUpload = () => {
    if (!selectedFile || !selectedCaseId) return;
    uploadImage.mutate(
      { file: selectedFile, labCaseId: selectedCaseId, description },
      { onSuccess: () => { setUploadDialogOpen(false); setSelectedFile(null); setDescription(""); } }
    );
  };

  if (isLoading) {
    return <p className="text-sm text-muted-foreground py-6 text-center">Loading lab cases...</p>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Lab Work ({labCases.length} cases)</h3>

      {labCases.length === 0 ? (
        <Card><CardContent className="py-10 text-center text-sm text-muted-foreground">No lab work found for this patient.</CardContent></Card>
      ) : (
        labCases.map((lc: any) => {
          const caseImages = allLabImages.filter((img: any) => img.lab_case_id === lc.id);
          return (
            <Card key={lc.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm flex items-center gap-2">
                      {lc.case_number}
                      {lc.is_urgent && <Badge variant="destructive" className="text-[10px]">Urgent</Badge>}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">{lc.work_type} · {(lc.dentist as any)?.full_name || "N/A"}</p>
                  </div>
                  <Badge className={statusColors[lc.status] || ""}>{lc.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span className="text-muted-foreground">Sent: </span>{lc.sent_date || "—"}</div>
                  <div><span className="text-muted-foreground">Due: </span>{lc.due_date || "—"}</div>
                  <div><span className="text-muted-foreground">Completed: </span>{lc.completed_date || "—"}</div>
                  <div><span className="text-muted-foreground">Delivered: </span>{lc.delivered_date || "—"}</div>
                  {lc.tooth_number && <div><span className="text-muted-foreground">Tooth: </span>#{lc.tooth_number}</div>}
                  {lc.shade && <div><span className="text-muted-foreground">Shade: </span>{lc.shade}</div>}
                </div>
                {lc.instructions && <p className="text-xs text-muted-foreground border-t pt-2">{lc.instructions}</p>}

                {/* Lab Case Images */}
                {caseImages.length > 0 && (
                  <div className="border-t pt-2">
                    <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                      <ImageIcon className="h-3 w-3" /> {caseImages.length} file(s)
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {caseImages.map((img: any) => (
                        <a key={img.id} href={img.image_url} target="_blank" rel="noopener noreferrer" className="block">
                          <img src={img.image_url} alt={img.description || "Lab scan"} className="h-16 w-16 object-cover rounded border hover:opacity-80 transition-opacity" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between border-t pt-2">
                  <div className="text-xs">
                    <span className="text-muted-foreground">Fee: </span>
                    <span className="font-medium">{formatCurrency(Number(lc.lab_fee))}</span>
                    {lc.is_paid ? (
                      <Badge variant="outline" className="ml-2 text-[10px] text-emerald-600 border-emerald-300">Paid</Badge>
                    ) : (
                      <Badge variant="outline" className="ml-2 text-[10px] text-amber-600 border-amber-300">Unpaid</Badge>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="h-7 w-7" title="Upload Scan/Image" onClick={() => openUpload(lc.id)}>
                      <Upload className="h-3.5 w-3.5 text-blue-600" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7" title="Send via WhatsApp" asChild>
                      <a href={`https://wa.me/?text=Lab%20Order%20${lc.case_number}%20-%20${lc.work_type}`} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
                      </a>
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7" title="Send via Email" asChild>
                      <a href={`mailto:?subject=Lab%20Order%20${lc.case_number}&body=Work%20Type:%20${lc.work_type}`}>
                        <Mail className="h-3.5 w-3.5" />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })
      )}

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Upload Lab Scan / Image</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs">File *</Label>
              <Input type="file" accept="image/*" onChange={e => setSelectedFile(e.target.files?.[0] || null)} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Description</Label>
              <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g. Lab scan, impression photo..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
            <Button className="bg-secondary hover:bg-secondary/90" disabled={uploadImage.isPending || !selectedFile} onClick={handleUpload}>
              {uploadImage.isPending ? "Uploading..." : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
