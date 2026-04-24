import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, CreditCard, TrendingUp, AlertCircle, Receipt, CalendarRange, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { CreateInvoiceDialog } from "@/components/dashboard/CreateInvoiceDialog";
import { InvoiceDetailDialog } from "@/components/dashboard/InvoiceDetailDialog";
import { GenerateClientInvoiceDialog } from "@/components/dashboard/GenerateClientInvoiceDialog";
import { useInvoices, useBillingStats, type InvoiceWithPatient } from "@/hooks/useInvoices";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { TableSkeleton } from "@/components/dashboard/TableSkeleton";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { AnimatedCounter } from "@/components/dashboard/AnimatedCounter";
import { motion } from "framer-motion";

const statusStyles: Record<string, string> = {
  paid: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  pending: "bg-red-500/10 text-red-700 dark:text-red-400",
  partial: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
};

const statusDots: Record<string, string> = {
  paid: "bg-emerald-500",
  pending: "bg-red-500",
  partial: "bg-amber-500",
};

function formatCurrency(amount: number) {
  return `₦${amount.toLocaleString()}`;
}

const PAGE_SIZE = 15;

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } },
  item: { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } },
};

export default function BillingPage() {
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [statementOpen, setStatementOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceWithPatient | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const { data: invoices = [], isLoading } = useInvoices();
  const { data: stats } = useBillingStats();

  const filtered = useMemo(() => {
    let list = invoices;
    if (statusFilter !== "all") {
      list = list.filter((inv) => inv.status === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (inv) =>
          inv.patient_name.toLowerCase().includes(q) ||
          inv.invoice_number.toLowerCase().includes(q)
      );
    }
    return list;
  }, [invoices, statusFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const billingCards = [
    {
      label: "Collected Today",
      value: stats?.collectedToday ?? 0,
      icon: TrendingUp,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-600",
      formatter: formatCurrency,
    },
    {
      label: "Outstanding Balance",
      value: stats?.totalOutstanding ?? 0,
      icon: CreditCard,
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-600",
      formatter: formatCurrency,
    },
    {
      label: "Overdue Invoices",
      value: stats?.overdueCount ?? 0,
      icon: AlertCircle,
      iconBg: "bg-red-500/10",
      iconColor: "text-red-600",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Billing & Payments" description="Manage invoices and track payments">
        <div className="flex gap-2 flex-wrap">
          <Button size="sm" variant="outline" onClick={() => setStatementOpen(true)}>
            <CalendarRange className="mr-2 h-4 w-4" />
            Client Statement
          </Button>
          <Button size="sm" className="bg-secondary hover:bg-secondary/90 shadow-lg shadow-secondary/20" onClick={() => setInvoiceOpen(true)}>
            <FileText className="mr-2 h-4 w-4" />
            Create Invoice
          </Button>
        </div>
      </PageHeader>

      {/* Billing Stats */}
      <motion.div className="grid gap-4 sm:grid-cols-3" variants={stagger.container} initial="hidden" animate="visible">
        {billingCards.map((card, i) => (
          <motion.div key={i} variants={stagger.item}>
            <Card className="stat-card glass-card">
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`h-11 w-11 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                  <card.icon className={`h-5 w-5 ${card.iconColor}`} />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{card.label}</p>
                  <p className="text-xl font-bold tracking-tight">
                    <AnimatedCounter value={card.value} formatter={card.formatter} />
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by patient or invoice number..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
          <SelectTrigger className="w-[160px]">
            <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="partial">Partial</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Recent Invoices */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="glass-card overflow-hidden">
          <CardHeader className="pb-3 border-b border-border/30">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Invoices</CardTitle>
                <CardDescription>{filtered.length} invoice{filtered.length !== 1 ? "s" : ""} found</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <TableSkeleton columns={6} rows={6} />
            ) : filtered.length === 0 ? (
              <EmptyState
                icon={Receipt}
                title="No invoices found"
                description={search || statusFilter !== "all" ? "Try adjusting your filters." : "Create your first invoice to start tracking payments."}
                actionLabel={!search && statusFilter === "all" ? "Create Invoice" : undefined}
                onAction={!search && statusFilter === "all" ? () => setInvoiceOpen(true) : undefined}
              />
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/20">
                        <th className="py-3 px-4 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider">Invoice</th>
                        <th className="py-3 px-4 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider">Patient</th>
                        <th className="py-3 px-4 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider hidden md:table-cell">Date</th>
                        <th className="py-3 px-4 text-right font-medium text-muted-foreground text-xs uppercase tracking-wider">Amount</th>
                        <th className="py-3 px-4 text-right font-medium text-muted-foreground text-xs uppercase tracking-wider hidden md:table-cell">Paid</th>
                        <th className="py-3 px-4 text-right font-medium text-muted-foreground text-xs uppercase tracking-wider hidden lg:table-cell">Balance</th>
                        <th className="py-3 px-4 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginated.map((inv, i) => {
                        const balance = inv.total_amount - inv.amount_paid;
                        return (
                          <motion.tr
                            key={inv.id}
                            className="border-b border-border/30 last:border-0 hover:bg-accent/30 cursor-pointer transition-all duration-200 group"
                            onClick={() => setSelectedInvoice(inv)}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.02 }}
                          >
                            <td className="py-3 px-4 font-mono text-xs text-secondary font-medium">{inv.invoice_number}</td>
                            <td className="py-3 px-4 font-medium group-hover:text-secondary transition-colors">{inv.patient_name}</td>
                            <td className="py-3 px-4 hidden md:table-cell text-muted-foreground font-mono text-xs">{inv.invoice_date}</td>
                            <td className="py-3 px-4 font-semibold text-right">{formatCurrency(inv.total_amount)}</td>
                            <td className="py-3 px-4 hidden md:table-cell text-muted-foreground text-right">{formatCurrency(inv.amount_paid)}</td>
                            <td className="py-3 px-4 hidden lg:table-cell text-right font-semibold">
                              <span className={balance > 0 ? "text-red-600" : "text-emerald-600"}>{formatCurrency(balance)}</span>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${statusStyles[inv.status] || ""}`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${statusDots[inv.status] || ""}`} />
                                {inv.status}
                              </span>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-4 py-3 border-t border-border/30">
                    <p className="text-xs text-muted-foreground">
                      Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length}
                    </p>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-xs font-medium px-2">{currentPage} / {totalPages}</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8" disabled={currentPage >= totalPages} onClick={() => setPage(currentPage + 1)}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <CreateInvoiceDialog open={invoiceOpen} onOpenChange={setInvoiceOpen} />
      <InvoiceDetailDialog open={!!selectedInvoice} onOpenChange={(open) => !open && setSelectedInvoice(null)} invoice={selectedInvoice} />
      <GenerateClientInvoiceDialog open={statementOpen} onOpenChange={setStatementOpen} />
    </div>
  );
}
