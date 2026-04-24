import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, subMonths } from "date-fns";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const today = format(new Date(), "yyyy-MM-dd");
      const monthStart = format(startOfMonth(new Date()), "yyyy-MM-dd");
      const monthEnd = format(endOfMonth(new Date()), "yyyy-MM-dd");

      const [patientsRes, todayAptsRes, pendingInvRes, revenueRes] = await Promise.all([
        supabase.from("patients").select("id", { count: "exact", head: true }),
        supabase.from("appointments").select("id", { count: "exact", head: true }).eq("appointment_date", today),
        supabase.from("invoices").select("id", { count: "exact", head: true }).in("status", ["pending", "partial"]),
        supabase.from("payments").select("amount").gte("payment_date", monthStart).lte("payment_date", monthEnd),
      ]);

      const monthlyRevenue = (revenueRes.data || []).reduce((sum, p) => sum + Number(p.amount), 0);

      return {
        totalPatients: patientsRes.count || 0,
        todayAppointments: todayAptsRes.count || 0,
        pendingPayments: pendingInvRes.count || 0,
        monthlyRevenue,
      };
    },
  });
}

export function useWeeklyAppointments() {
  return useQuery({
    queryKey: ["weekly-appointments"],
    queryFn: async () => {
      const now = new Date();
      const weekStart = format(startOfWeek(now, { weekStartsOn: 1 }), "yyyy-MM-dd");
      const weekEnd = format(endOfWeek(now, { weekStartsOn: 1 }), "yyyy-MM-dd");

      const { data } = await supabase
        .from("appointments")
        .select("appointment_date")
        .gte("appointment_date", weekStart)
        .lte("appointment_date", weekEnd);

      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const counts: Record<string, number> = {};
      days.forEach((d) => (counts[d] = 0));

      (data || []).forEach((a) => {
        const dayIndex = new Date(a.appointment_date).getDay();
        // getDay: 0=Sun, convert to Mon-based
        const idx = dayIndex === 0 ? 6 : dayIndex - 1;
        counts[days[idx]]++;
      });

      return days.map((day) => ({ day, count: counts[day] }));
    },
  });
}

export function useRevenueData() {
  return useQuery({
    queryKey: ["revenue-data"],
    queryFn: async () => {
      const now = new Date();
      const months: { month: string; start: string; end: string }[] = [];
      for (let i = 5; i >= 0; i--) {
        const d = subMonths(now, i);
        months.push({
          month: format(d, "MMM"),
          start: format(startOfMonth(d), "yyyy-MM-dd"),
          end: format(endOfMonth(d), "yyyy-MM-dd"),
        });
      }

      const { data } = await supabase
        .from("payments")
        .select("amount, payment_date")
        .gte("payment_date", months[0].start)
        .lte("payment_date", months[months.length - 1].end);

      return months.map((m) => ({
        month: m.month,
        revenue: (data || [])
          .filter((p) => p.payment_date >= m.start && p.payment_date <= m.end)
          .reduce((sum, p) => sum + Number(p.amount), 0),
      }));
    },
  });
}

export function useTodaySchedule() {
  const today = format(new Date(), "yyyy-MM-dd");
  return useQuery({
    queryKey: ["today-schedule"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("appointments")
        .select("*, patients(first_name, last_name), staff(full_name), treatments(name)")
        .eq("appointment_date", today)
        .order("appointment_time");
      if (error) throw error;
      return (data || []).map((a: any) => ({
        id: a.id,
        time: a.appointment_time?.substring(0, 5),
        patientName: a.patients ? `${a.patients.first_name} ${a.patients.last_name}` : "Unknown",
        dentist: a.staff?.full_name || "Unassigned",
        chair: a.chair || "—",
        treatment: a.treatments?.name || "General",
        status: a.status,
      }));
    },
  });
}

export function useRecentActivity() {
  return useQuery({
    queryKey: ["recent-activity"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("activity_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(8);
      if (error) throw error;
      return data || [];
    },
  });
}

export function useCurrentUserName() {
  return useQuery({
    queryKey: ["current-user-name"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return "Doctor";
      const { data } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("user_id", user.id)
        .maybeSingle();
      return data?.full_name || user.user_metadata?.full_name || "Doctor";
    },
  });
}
