import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Clock, CheckCircle, DollarSign, CalendarIcon } from "lucide-react";
import { motion } from "framer-motion";
import { format, startOfMonth, endOfMonth } from "date-fns";

const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "#f59e0b", "#10b981", "#6366f1", "#ec4899"];
const fmt = (v: number) => `₦${v.toLocaleString()}`;

export default function LdAnalyticsPage() {
  const [dateFrom, setDateFrom] = useState(() => format(startOfMonth(new Date()), "yyyy-MM-dd"));
  const [dateTo, setDateTo] = useState(() => format(endOfMonth(new Date()), "yyyy-MM-dd"));
  const [quickRange, setQuickRange] = useState("this-month");

  const setQuick = (range: string) => {
    setQuickRange(range);
    const now = new Date();
    if (range === "this-month") {
      setDateFrom(format(startOfMonth(now), "yyyy-MM-dd"));
      setDateTo(format(endOfMonth(now), "yyyy-MM-dd"));
    } else if (range === "last-month") {
      const lm = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      setDateFrom(format(startOfMonth(lm), "yyyy-MM-dd"));
      setDateTo(format(endOfMonth(lm), "yyyy-MM-dd"));
    } else if (range === "this-year") {
      setDateFrom(`${now.getFullYear()}-01-01`);
      setDateTo(`${now.getFullYear()}-12-31`);
    } else if (range === "all") {
      setDateFrom("2020-01-01");
      setDateTo("2030-12-31");
    }
  };

  const { data: allCases = [] } = useQuery({
    queryKey: ["ld_cases_analytics"],
    queryFn: async () => {
      const { data, error } = await supabase.from("ld_cases").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: allInvoices = [] } = useQuery({
    queryKey: ["ld_invoices_analytics"],
    queryFn: async () => {
      const { data, error } = await supabase.from("ld_invoices").select("*");
      if (error) throw error;
      return data;
    },
  });

  // Filter by date range
  const cases = useMemo(() => {
    return allCases.filter((c: any) => {
      const d = (c.received_date || c.created_at || "").slice(0, 10);
      return d >= dateFrom && d <= dateTo;
    });
  }, [allCases, dateFrom, dateTo]);

  const invoices = useMemo(() => {
    return allInvoices.filter((i: any) => {
      const d = (i.invoice_date || i.created_at || "").slice(0, 10);
      return d >= dateFrom && d <= dateTo;
    });
  }, [allInvoices, dateFrom, dateTo]);

  const totalCases = cases.length;
  const completedCases = cases.filter((c: any) => c.status === "completed" || c.status === "delivered" || c.status === "ready").length;
  const totalRevenue = invoices.reduce((sum: number, i: any) => sum + Number(i.total_amount || 0), 0);
  const pendingCases = cases.filter((c: any) => c.status === "pending" || c.status === "in-progress").length;

  const statusCounts: Record<string, number> = {};
  cases.forEach((c: any) => { statusCounts[c.status] = (statusCounts[c.status] || 0) + 1; });
  const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name: name.replace(/_/g, " "), value }));

  const workTypeCounts: Record<string, number> = {};
  cases.forEach((c: any) => { workTypeCounts[c.work_type_name] = (workTypeCounts[c.work_type_name] || 0) + 1; });
  const workTypeData = Object.entries(workTypeCounts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 6);

  const monthlyRevenue: Record<string, number> = {};
  invoices.forEach((inv: any) => {
    const month = inv.invoice_date?.slice(0, 7) || "Unknown";
    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + Number(inv.total_amount || 0);
  });
  const revenueData = Object.entries(monthlyRevenue).sort().map(([month, total]) => ({
    month: new Date(month + "-01").toLocaleDateString("en", { month: "short", year: "2-digit" }),
    total,
  }));

  const stats = [
    { label: "Total Cases", value: totalCases, icon: CheckCircle, color: "text-blue-500" },
    { label: "Active Cases", value: pendingCases, icon: Clock, color: "text-amber-500" },
    { label: "Completed", value: completedCases, icon: TrendingUp, color: "text-emerald-500" },
    { label: "Total Revenue", value: fmt(totalRevenue), icon: DollarSign, color: "text-green-500" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics & Reports" description="Lab performance overview and insights" />

      {/* Date Range Filter */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex gap-1.5">
              {[
                { key: "this-month", label: "This Month" },
                { key: "last-month", label: "Last Month" },
                { key: "this-year", label: "This Year" },
                { key: "all", label: "All Time" },
              ].map((r) => (
                <Button
                  key={r.key}
                  variant={quickRange === r.key ? "default" : "outline"}
                  size="sm"
                  className="text-xs"
                  onClick={() => setQuick(r.key)}
                >
                  {r.label}
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <div>
                <Label className="text-[10px]">From</Label>
                <Input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setQuickRange("custom"); }} className="h-8 text-xs w-[130px]" />
              </div>
              <div>
                <Label className="text-[10px]">To</Label>
                <Input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setQuickRange("custom"); }} className="h-8 text-xs w-[130px]" />
              </div>
            </div>
            <Badge variant="secondary" className="text-[10px]">
              {format(new Date(dateFrom), "MMM d, yyyy")} — {format(new Date(dateTo), "MMM d, yyyy")}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="border-border/50">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center bg-muted ${s.color}`}>
                  <s.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-xl font-bold">{s.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-border/50">
          <CardHeader><CardTitle className="text-base">Monthly Revenue</CardTitle></CardHeader>
          <CardContent>
            {revenueData.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No revenue data for this period</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader><CardTitle className="text-base">Cases by Status</CardTitle></CardHeader>
          <CardContent>
            {statusData.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No case data for this period</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name} (${value})`}>
                    {statusData.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50 md:col-span-2">
          <CardHeader><CardTitle className="text-base">Top Work Types</CardTitle></CardHeader>
          <CardContent>
            {workTypeData.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No work type data for this period</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={workTypeData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" className="text-xs" />
                  <YAxis dataKey="name" type="category" width={120} className="text-xs" />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
