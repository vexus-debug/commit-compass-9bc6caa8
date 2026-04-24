import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, Search, DollarSign, TrendingDown, ArrowUpDown, Settings } from "lucide-react";
import { useLdExpenses, useCreateLdExpense, useUpdateLdExpense, useDeleteLdExpense } from "@/hooks/useLdExpenses";
import { useLdExpenseCategories, useCreateLdExpenseCategory, useUpdateLdExpenseCategory, useDeleteLdExpenseCategory } from "@/hooks/useLdExpenseCategories";
import { format, startOfMonth, endOfMonth } from "date-fns";

const fmt = (v: number) => `₦${v.toLocaleString()}`;

const FALLBACK_CATEGORIES = ["general", "materials", "equipment", "utilities", "rent", "courier", "maintenance", "salary_advance", "other"];

export default function LdExpensesPage() {
  const { data: expenses = [], isLoading } = useLdExpenses();
  const { data: dbCategories = [] } = useLdExpenseCategories();
  const createExpense = useCreateLdExpense();
  const updateExpense = useUpdateLdExpense();
  const deleteExpense = useDeleteLdExpense();
  const createCategory = useCreateLdExpenseCategory();
  const updateCategory = useUpdateLdExpenseCategory();
  const deleteCategory = useDeleteLdExpenseCategory();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editExpense, setEditExpense] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [catDialogOpen, setCatDialogOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [editCatId, setEditCatId] = useState<string | null>(null);
  const [editCatName, setEditCatName] = useState("");

  const categories = dbCategories.length > 0
    ? dbCategories.filter(c => c.is_active).map(c => c.name)
    : FALLBACK_CATEGORIES;

  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const totalExpenses = expenses.reduce((s: number, e: any) => s + Number(e.amount), 0);
  const monthExpenses = expenses
    .filter((e: any) => new Date(e.expense_date) >= monthStart && new Date(e.expense_date) <= monthEnd)
    .reduce((s: number, e: any) => s + Number(e.amount), 0);

  const filtered = expenses
    .filter((e: any) => {
      const matchSearch = !search || e.vendor?.toLowerCase().includes(search.toLowerCase()) || e.description?.toLowerCase().includes(search.toLowerCase());
      const matchCategory = filterCategory === "all" || e.category === filterCategory;
      const matchDateFrom = !dateFrom || e.expense_date >= dateFrom;
      const matchDateTo = !dateTo || e.expense_date <= dateTo;
      return matchSearch && matchCategory && matchDateFrom && matchDateTo;
    })
    .sort((a: any, b: any) => {
      const cmp = a.expense_date.localeCompare(b.expense_date);
      return sortDir === "asc" ? cmp : -cmp;
    });

  const filteredTotal = filtered.reduce((s: number, e: any) => s + Number(e.amount), 0);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const expenseDate = fd.get("expense_date") as string;
    if (!expenseDate) return;
    const values = {
      expense_date: expenseDate,
      category: fd.get("category") as string,
      vendor: fd.get("vendor") as string,
      description: fd.get("description") as string,
      amount: Number(fd.get("amount") || 0),
      payment_method: fd.get("payment_method") as string,
      receipt_reference: fd.get("receipt_reference") as string,
    };
    if (editExpense) {
      updateExpense.mutate({ id: editExpense.id, ...values }, { onSuccess: () => { setDialogOpen(false); setEditExpense(null); } });
    } else {
      createExpense.mutate(values, { onSuccess: () => setDialogOpen(false) });
    }
  };

  const handleAddCategory = () => {
    if (!newCatName.trim()) return;
    createCategory.mutate(newCatName.trim().toLowerCase().replace(/\s+/g, "_"), {
      onSuccess: () => setNewCatName(""),
    });
  };

  const handleUpdateCategory = () => {
    if (!editCatId || !editCatName.trim()) return;
    updateCategory.mutate({ id: editCatId, name: editCatName.trim().toLowerCase().replace(/\s+/g, "_") }, {
      onSuccess: () => { setEditCatId(null); setEditCatName(""); },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Lab Expenses</h1>
          <p className="text-sm text-muted-foreground">Track all lab expenditures</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setCatDialogOpen(true)}>
            <Settings className="h-4 w-4 mr-1" /> Categories
          </Button>
          <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) setEditExpense(null); }}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-1" /> Add Expense</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editExpense ? "Edit Expense" : "Add Expense"}</DialogTitle></DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Date *</Label>
                    <Input name="expense_date" type="date" required defaultValue={editExpense?.expense_date || new Date().toISOString().split("T")[0]} />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <select name="category" className="w-full border rounded-md p-2 text-sm bg-background" defaultValue={editExpense?.category || "general"}>
                      {categories.map(c => <option key={c} value={c} className="capitalize">{c.replace(/_/g, " ")}</option>)}
                    </select>
                  </div>
                  <div><Label>Vendor</Label><Input name="vendor" defaultValue={editExpense?.vendor || ""} /></div>
                  <div><Label>Amount (₦) *</Label><Input name="amount" type="number" step="0.01" required defaultValue={editExpense?.amount || ""} /></div>
                  <div className="col-span-2"><Label>Description</Label><Input name="description" defaultValue={editExpense?.description || ""} /></div>
                  <div>
                    <Label>Payment Method</Label>
                    <select name="payment_method" className="w-full border rounded-md p-2 text-sm bg-background" defaultValue={editExpense?.payment_method || "cash"}>
                      <option value="cash">Cash</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="card">Card</option>
                      <option value="mobile">Mobile Money</option>
                    </select>
                  </div>
                  <div><Label>Receipt Ref</Label><Input name="receipt_reference" defaultValue={editExpense?.receipt_reference || ""} /></div>
                </div>
                <Button type="submit" className="w-full">{editExpense ? "Update" : "Add Expense"}</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-2">
        <Card><CardContent className="flex items-center gap-3 p-4">
          <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center"><TrendingDown className="h-5 w-5 text-destructive" /></div>
          <div><p className="text-xl font-bold">{fmt(totalExpenses)}</p><p className="text-xs text-muted-foreground">Total Expenses</p></div>
        </CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-4">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center"><DollarSign className="h-5 w-5 text-amber-600" /></div>
          <div><p className="text-xl font-bold">{fmt(monthExpenses)}</p><p className="text-xs text-muted-foreground">This Month</p></div>
        </CardContent></Card>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search expenses..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(c => <SelectItem key={c} value={c} className="capitalize">{c.replace(/_/g, " ")}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-3 items-end flex-wrap">
        <div>
          <Label className="text-xs text-muted-foreground">From Date</Label>
          <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-[160px]" />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">To Date</Label>
          <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-[160px]" />
        </div>
        {(dateFrom || dateTo) && (
          <Button variant="ghost" size="sm" onClick={() => { setDateFrom(""); setDateTo(""); }}>Clear dates</Button>
        )}
        <div className="ml-auto text-sm text-muted-foreground">
          Showing {filtered.length} expense(s) — Total: <span className="font-semibold text-destructive">{fmt(filteredTotal)}</span>
        </div>
      </div>

      <Card className="border-border/50">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-muted/30">
                  <th className="text-left p-3 font-medium text-muted-foreground cursor-pointer select-none" onClick={() => setSortDir(d => d === "asc" ? "desc" : "asc")}>
                    <span className="flex items-center gap-1">Date <ArrowUpDown className="h-3 w-3" /></span>
                  </th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Category</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Vendor</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Description</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Amount</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Method</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">Loading...</td></tr>
                ) : !filtered.length ? (
                  <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">No expenses found</td></tr>
                ) : filtered.map((e: any) => (
                  <tr key={e.id} className="border-b border-border/30 hover:bg-muted/20">
                    <td className="p-3 text-xs font-medium">{format(new Date(e.expense_date), "MMM d, yyyy")}</td>
                    <td className="p-3"><Badge variant="outline" className="text-[10px] capitalize">{(e.category || "").replace(/_/g, " ")}</Badge></td>
                    <td className="p-3">{e.vendor || "—"}</td>
                    <td className="p-3 text-xs">{e.description || "—"}</td>
                    <td className="p-3 text-right font-medium text-destructive">{fmt(Number(e.amount))}</td>
                    <td className="p-3 text-xs capitalize">{e.payment_method?.replace(/_/g, " ")}</td>
                    <td className="p-3 text-right">
                      <div className="flex gap-1 justify-end">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditExpense(e); setDialogOpen(true); }}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteExpense.mutate(e.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Category Management Dialog */}
      <Dialog open={catDialogOpen} onOpenChange={setCatDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Manage Expense Categories</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="New category name..."
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCategory())}
              />
              <Button onClick={handleAddCategory} disabled={createCategory.isPending} size="sm">
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {dbCategories.map((cat) => (
                <div key={cat.id} className="flex items-center gap-2 p-2 rounded-lg border border-border/30">
                  {editCatId === cat.id ? (
                    <>
                      <Input
                        value={editCatName}
                        onChange={(e) => setEditCatName(e.target.value)}
                        className="flex-1 h-8"
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleUpdateCategory())}
                      />
                      <Button size="sm" variant="outline" className="h-8" onClick={handleUpdateCategory}>Save</Button>
                      <Button size="sm" variant="ghost" className="h-8" onClick={() => setEditCatId(null)}>Cancel</Button>
                    </>
                  ) : (
                    <>
                      <span className={`flex-1 text-sm capitalize ${!cat.is_active ? "line-through text-muted-foreground" : ""}`}>
                        {cat.name.replace(/_/g, " ")}
                      </span>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditCatId(cat.id); setEditCatName(cat.name); }}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateCategory.mutate({ id: cat.id, is_active: !cat.is_active })}
                      >
                        {cat.is_active ? <span className="text-xs text-emerald-600">✓</span> : <span className="text-xs text-muted-foreground">✗</span>}
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteCategory.mutate(cat.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </>
                  )}
                </div>
              ))}
              {dbCategories.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No categories yet</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCatDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
