import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { useUpdateLabCase, type LabCaseRow } from "@/hooks/useLabCases";

const JOB_INSTRUCTION_OPTIONS = [
  "Courier Charge", "Acrylic Dentures", "Flexible Dentures", "AJC Crowns",
  "PFM Crowns", "Zirconia Crowns", "Shell Crowns (Gold)", "Shell Crowns (Silver)",
  "VFR", "Orthodontic Appliances", "Denture Repair", "Crown Repair", "Gingival Masking",
] as const;

const REMARK_OPTIONS = ["Express", "Rejected", "Damaged", "Repeat", "Remake"] as const;

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "in-progress", label: "In Progress" },
  { value: "ready", label: "Ready" },
  { value: "delivered", label: "Delivered" },
];

const editSchema = z.object({
  status: z.string(),
  clinicCode: z.string().optional(),
  clinicDoctorName: z.string().min(1, "Required"),
  jobInstructions: z.array(z.string()).min(1, "Select at least one"),
  jobDescription: z.string().optional(),
  shade: z.string().optional(),
  cost: z.coerce.number().min(0),
  discount: z.coerce.number().min(0).default(0),
  dueDate: z.date().optional(),
  isPaid: z.boolean().default(false),
  remark: z.string().optional(),
  instructions: z.string().optional(),
  deliveryMethod: z.string().optional(),
});

type EditFormValues = z.infer<typeof editSchema>;

interface EditLabCaseDialogProps {
  labCase: LabCaseRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditLabCaseDialog({ labCase, open, onOpenChange }: EditLabCaseDialogProps) {
  const updateLabCase = useUpdateLabCase();

  const form = useForm<EditFormValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      status: "pending",
      clinicCode: "",
      clinicDoctorName: "",
      jobInstructions: [],
      jobDescription: "",
      shade: "",
      cost: 0,
      discount: 0,
      isPaid: false,
      remark: "",
      instructions: "",
      deliveryMethod: "",
    },
  });

  useEffect(() => {
    if (labCase && open) {
      form.reset({
        status: labCase.status,
        clinicCode: labCase.clinic_code || "",
        clinicDoctorName: labCase.clinic_doctor_name || "",
        jobInstructions: labCase.job_instructions || [],
        jobDescription: labCase.job_description || "",
        shade: labCase.shade || "",
        cost: Number(labCase.lab_fee) || 0,
        discount: Number(labCase.discount) || 0,
        dueDate: labCase.due_date ? new Date(labCase.due_date) : undefined,
        isPaid: labCase.is_paid,
        remark: labCase.remark || "none",
        instructions: labCase.instructions || "",
        deliveryMethod: labCase.delivery_method || "",
      });
    }
  }, [labCase, open, form]);

  const watchCost = form.watch("cost");
  const watchDiscount = form.watch("discount");
  const netAmount = Math.max((watchCost || 0) - (watchDiscount || 0), 0);

  function onSubmit(data: EditFormValues) {
    if (!labCase) return;
    const workType = data.jobInstructions.join(", ");
    const now = new Date().toISOString().split("T")[0];

    updateLabCase.mutate(
      {
        id: labCase.id,
        status: data.status,
        clinic_code: data.clinicCode || "",
        clinic_doctor_name: data.clinicDoctorName,
        job_instructions: data.jobInstructions,
        job_description: data.jobDescription || "",
        shade: data.shade || "",
        lab_fee: data.cost,
        discount: data.discount,
        is_paid: data.isPaid,
        remark: data.remark === "none" ? "" : (data.remark || ""),
        instructions: data.instructions || "",
        delivery_method: data.deliveryMethod || "",
        ...(data.dueDate ? { due_date: format(data.dueDate, "yyyy-MM-dd") } : {}),
        ...(data.status === "ready" && labCase.status !== "ready" ? { completed_date: now } : {}),
        ...(data.status === "delivered" && labCase.status !== "delivered" ? { delivered_date: now } : {}),
      },
      { onSuccess: () => onOpenChange(false) }
    );
  }

  if (!labCase) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Lab Case — {labCase.case_number}</DialogTitle>
          <DialogDescription>
            {labCase.patients ? `${labCase.patients.first_name} ${labCase.patients.last_name}` : "Unknown patient"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Status */}
            <FormField control={form.control} name="status" render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            {/* Clinic Code & Doctor Name */}
            <div className="grid gap-3 sm:grid-cols-2">
              <FormField control={form.control} name="clinicCode" render={({ field }) => (
                <FormItem>
                  <FormLabel>Clinic Code</FormLabel>
                  <FormControl><Input placeholder="e.g. VC-001" {...field} /></FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name="clinicDoctorName" render={({ field }) => (
                <FormItem>
                  <FormLabel>Clinic / Doctor Name *</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Job Instructions */}
            <FormField control={form.control} name="jobInstructions" render={() => (
              <FormItem>
                <FormLabel>Job Instructions *</FormLabel>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 border rounded-lg bg-muted/20">
                  {JOB_INSTRUCTION_OPTIONS.map((option) => (
                    <FormField key={option} control={form.control} name="jobInstructions" render={({ field }) => (
                      <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(option)}
                            onCheckedChange={(checked) => {
                              const current = field.value || [];
                              field.onChange(checked ? [...current, option] : current.filter((v: string) => v !== option));
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-xs font-normal cursor-pointer">{option}</FormLabel>
                      </FormItem>
                    )} />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )} />

            {/* Job Description */}
            <FormField control={form.control} name="jobDescription" render={({ field }) => (
              <FormItem>
                <FormLabel>Job Description</FormLabel>
                <FormControl><Textarea rows={2} {...field} /></FormControl>
              </FormItem>
            )} />

            {/* Shade, Cost, Discount */}
            <div className="grid gap-3 sm:grid-cols-3">
              <FormField control={form.control} name="shade" render={({ field }) => (
                <FormItem>
                  <FormLabel>Shade</FormLabel>
                  <FormControl><Input placeholder="e.g. A2" {...field} /></FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name="cost" render={({ field }) => (
                <FormItem>
                  <FormLabel>Cost (₦)</FormLabel>
                  <FormControl><Input type="number" min={0} step={100} {...field} /></FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name="discount" render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount (₦)</FormLabel>
                  <FormControl><Input type="number" min={0} step={100} {...field} /></FormControl>
                </FormItem>
              )} />
            </div>

            {/* Net Amount Display */}
            <div className="rounded-lg border p-3 bg-muted/20">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Net Amount:</span>
                <span className="font-semibold">₦{netAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Due Date, Remark, Paid */}
            <div className="grid gap-3 sm:grid-cols-3">
              <FormField control={form.control} name="dueDate" render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Due Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                          {field.value ? format(field.value, "PPP") : "Pick a date"}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus className="p-3 pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )} />
              <FormField control={form.control} name="remark" render={({ field }) => (
                <FormItem>
                  <FormLabel>Remark</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {REMARK_OPTIONS.map((r) => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )} />
              <FormField control={form.control} name="isPaid" render={({ field }) => (
                <FormItem className="flex flex-col justify-end">
                  <div className="flex items-center gap-2 h-10">
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} id="edit-isPaid" />
                    <Label htmlFor="edit-isPaid" className="text-sm cursor-pointer">Fully Paid</Label>
                  </div>
                </FormItem>
              )} />
            </div>

            {/* Delivery Method */}
            <FormField control={form.control} name="deliveryMethod" render={({ field }) => (
              <FormItem>
                <FormLabel>Delivery Method</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="">Not set</SelectItem>
                    <SelectItem value="pickup">Pickup</SelectItem>
                    <SelectItem value="delivery">Delivery</SelectItem>
                    <SelectItem value="courier">Courier</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )} />

            {/* Instructions */}
            <FormField control={form.control} name="instructions" render={({ field }) => (
              <FormItem>
                <FormLabel>Special Instructions</FormLabel>
                <FormControl><Textarea rows={2} {...field} /></FormControl>
              </FormItem>
            )} />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" className="bg-secondary hover:bg-secondary/90" disabled={updateLabCase.isPending}>
                {updateLabCase.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
