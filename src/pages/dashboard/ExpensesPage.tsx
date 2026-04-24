import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, DollarSign, Search, TrendingDown } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useExpenses, useCreateExpense, useDeleteExpense } from "@/hooks/useExpenses";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { format } from "date-fns";

const expenseCategories = [
  "supplies", "rent", "utilities", "equipment", "salaries", "marketing", "maintenance",
  "logistics", "lab_job_outsourcing", "staff_appraisal", "loan_repayment", "dental_consumables", "other"
];

const categoryLabels: Record<string, string> = {
  supplies: "Supplies",
  rent: "Rent",
  utilities: "Utilities",
  equipment: "Equipment",
  salaries: "Salaries",
  marketing: "Marketing",
  maintenance: "Maintenance",
  logistics: "Logistics",
  lab_job_outsourcing: "Lab Job Outsourcing",
  staff_appraisal: "Staff Appraisal",
  loan_repayment: "Loan Repayment",
  dental_consumables: "Dental Consumables",
  other: "Other",
};

export default function ExpensesPage() {
  const { data: expenses = [] } = useExpenses();
  const { user } = useAuth();
  const createExpense = useCreateExpense();
  const deleteExpense = useDeleteExpense();
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    vendor: "", category: "other", description: "", amount: "",
    expense_date: format(new Date(), "yyyy-MM-dd"), payment_method: "cash", receipt_reference: "",
  });

  const filtered = expenses.filter((e: any) => {
    const matchSearch = e.vendor.toLowerCase().includes(search.toLowerCase()) || e.description?.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "all" || e.category === catFilter;
    return matchSearch && matchCat;
  });

  const totalExpenses = expenses.reduce((s: number, e: any) => s + Number(e.amount), 0);
  const thisMonth = expenses.filter((e: any) => e.expense_date?.startsWith(format(new Date(), "yyyy-MM"))).reduce((s: number, e: any) => s + Number(e.amount), 0);

  const handleSubmit = () => {
    if (!form.vendor || !form.amount) return;
    createExpense.mutate({
      vendor: form.vendor,
      category: form.category,
      description: form.description,
      amount: Number(form.amount),
      expense_date: form.expense_date,
      payment_method: form.payment_method,
      receipt_reference: form.receipt_reference,
      created_by: user?.id,
    }, {
      onSuccess: () => {
        setDialogOpen(false);
        setForm({ vendor: "", category: "other", description: "", amount: "", expense_date: format(new Date(), "yyyy-MM-dd"), payment_method: "cash", receipt_reference: "" });
      },
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Expenses" description="Track clinic expenses and outgoings">
        <Button onClick={() => setDialogOpen(true)} className="bg-secondary hover:bg-secondary/90">
          <Plus className="mr-2 h-4 w-4" /> Add Expense
        </Button>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="glass-card">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-red-100 flex items-center justify-center"><TrendingDown className="h-6 w-6 text-red-600" /></div>
              <div>
                <p className="text-2xl font-bold">₦{totalExpenses.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Expenses</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <Card className="glass-card">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center"><DollarSign className="h-6 w-6 text-amber-600" /></div>
            <div>
              <p className="text-2xl font-bold">₦{thisMonth.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">This Month</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search expenses..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={catFilter} onValueChange={setCatFilter}>
          <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {expenseCategories.map(c => <SelectItem key={c} value={c}>{categoryLabels[c] || c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Card className="glass-card">
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground py-10 text-center">No expenses found.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="py-2 px-4 text-left font-medium text-muted-foreground">Date</th>
                  <th className="py-2 px-4 text-left font-medium text-muted-foreground">Vendor</th>
                  <th className="py-2 px-4 text-left font-medium text-muted-foreground">Category</th>
                  <th className="py-2 px-4 text-left font-medium text-muted-foreground">Amount</th>
                  <th className="py-2 px-4 text-left font-medium text-muted-foreground">Method</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((e: any) => (
                  <tr key={e.id} className="border-b last:border-0 hover:bg-muted/20">
                    <td className="py-2 px-4 text-muted-foreground">{e.expense_date}</td>
                    <td className="py-2 px-4 font-medium">{e.vendor}</td>
                    <td className="py-2 px-4"><Badge variant="outline" className="text-[10px] capitalize">{e.category}</Badge></td>
                    <td className="py-2 px-4 font-medium text-red-600">₦{Number(e.amount).toLocaleString()}</td>
                    <td className="py-2 px-4 text-muted-foreground capitalize">{e.payment_method}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Expense</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Vendor *</Label>
                <Input value={form.vendor} onChange={e => setForm(f => ({ ...f, vendor: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Amount *</Label>
                <Input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Category</Label>
                <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map(c => <SelectItem key={c} value={c}>{categoryLabels[c] || c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Date</Label>
                <Input type="date" value={form.expense_date} onChange={e => setForm(f => ({ ...f, expense_date: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Payment Method</Label>
                <Select value={form.payment_method} onValueChange={v => setForm(f => ({ ...f, payment_method: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Receipt Ref</Label>
                <Input value={form.receipt_reference} onChange={e => setForm(f => ({ ...f, receipt_reference: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Description</Label>
              <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} className="bg-secondary hover:bg-secondary/90" disabled={createExpense.isPending}>
              {createExpense.isPending ? "Saving..." : "Save Expense"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
