import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

function useSupabaseUser() {
  const [userId, setUserId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id ?? null);
      setReady(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
      setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  return { userId, ready };
}

function useAuthedLdQuery<TData>(queryKey: readonly unknown[], queryFn: () => Promise<TData>) {
  const { userId, ready } = useSupabaseUser();

  return useQuery({
    queryKey: [...queryKey, userId ?? "anonymous"],
    enabled: ready && !!userId,
    queryFn,
  });
}

// ─── Settings ───
export function useLdSettings() {
  return useAuthedLdQuery(["ld-settings"], async () => {
      const { data, error } = await supabase.from("ld_settings").select("*").limit(1).single();
      if (error) throw error;
      return data;
  });
}

// ─── Clients ───
export function useLdClients() {
  return useAuthedLdQuery(["ld-clients"], async () => {
      const { data, error } = await supabase.from("ld_clients").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
  });
}

export function useCreateLdClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: Record<string, unknown>) => {
      const { error } = await supabase.from("ld_clients").insert([values as any]);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["ld-clients"] }); toast.success("Client added"); },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateLdClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...values }: { id: string } & Record<string, unknown>) => {
      const { error } = await supabase.from("ld_clients").update(values as any).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["ld-clients"] }); toast.success("Client updated"); },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteLdClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("ld_clients").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["ld-clients"] }); toast.success("Client deleted"); },
    onError: (e: Error) => toast.error(e.message),
  });
}

// ─── Staff ───
export function useLdStaff() {
  return useAuthedLdQuery(["ld-staff"], async () => {
      const { data, error } = await supabase.from("ld_staff").select("*").order("seniority_level", { ascending: true }).order("created_at", { ascending: true });
      if (error) throw error;
      return data || [];
  });
}

export function useCreateLdStaff() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: Record<string, unknown>) => {
      const { error } = await supabase.from("ld_staff").insert([values as any]);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["ld-staff"] }); toast.success("Staff added"); },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateLdStaff() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...values }: { id: string } & Record<string, unknown>) => {
      const { error } = await supabase.from("ld_staff").update(values as any).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["ld-staff"] }); toast.success("Staff updated"); },
    onError: (e: Error) => toast.error(e.message),
  });
}

// ─── Work Types ───
export function useLdWorkTypes() {
  return useAuthedLdQuery(["ld-work-types"], async () => {
      const { data, error } = await supabase.from("ld_work_types").select("*").order("name");
      if (error) throw error;
      return data || [];
  });
}

export function useCreateLdWorkType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: Record<string, unknown>) => {
      const { error } = await supabase.from("ld_work_types").insert([values as any]);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["ld-work-types"] }); toast.success("Work type added"); },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateLdWorkType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...values }: { id: string } & Record<string, unknown>) => {
      const { error } = await supabase.from("ld_work_types").update(values as any).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["ld-work-types"] }); toast.success("Work type updated"); },
    onError: (e: Error) => toast.error(e.message),
  });
}

// ─── Cases ───
export function useLdCases() {
  return useAuthedLdQuery(["ld-cases"], async () => {
      const { data, error } = await supabase
        .from("ld_cases")
        .select("*, client:ld_clients(clinic_name, doctor_name, clinic_code), technician:ld_staff!ld_cases_assigned_technician_id_fkey(full_name), work_type:ld_work_types(name)")
        .order("case_number", { ascending: false });
      if (error) throw error;
      return data || [];
  });
}

export function useCreateLdCase() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: Record<string, unknown>) => {
      const { error } = await supabase.from("ld_cases").insert([values as any]);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["ld-cases"] }); qc.invalidateQueries({ queryKey: ["ld-dashboard-stats"] }); toast.success("Case created"); },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateLdCase() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, _oldStatus, _changedBy, _changedByName, ...values }: { id: string; _oldStatus?: string; _changedBy?: string; _changedByName?: string } & Record<string, unknown>) => {
      const { error } = await supabase.from("ld_cases").update(values as any).eq("id", id);
      if (error) throw error;

      // Log status change to history
      if (values.status && _oldStatus && values.status !== _oldStatus) {
        await supabase.from("ld_case_history").insert({
          lab_case_id: id,
          field_changed: "status",
          old_value: _oldStatus,
          new_value: values.status as string,
          changed_by: _changedBy || null,
          changed_by_name: _changedByName || "",
        });
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["ld-cases"] }); qc.invalidateQueries({ queryKey: ["ld-case-history"] }); qc.invalidateQueries({ queryKey: ["ld-dashboard-stats"] }); toast.success("Case updated"); },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteLdCase() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("ld_cases").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["ld-cases"] }); qc.invalidateQueries({ queryKey: ["ld-dashboard-stats"] }); toast.success("Case deleted"); },
    onError: (e: Error) => toast.error(e.message),
  });
}

// ─── Invoices ───
export function useLdInvoices() {
  return useAuthedLdQuery(["ld-invoices"], async () => {
      const { data, error } = await supabase
        .from("ld_invoices")
        .select("*, case:ld_cases(case_number, patient_name), client:ld_clients(clinic_name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
  });
}

export function useCreateLdInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: Record<string, unknown>) => {
      const { data, error } = await supabase.from("ld_invoices").insert([values as any]).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["ld-invoices"] }); toast.success("Invoice created"); },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateLdInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...values }: { id: string } & Record<string, unknown>) => {
      const { error } = await supabase.from("ld_invoices").update(values as any).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["ld-invoices"] }); toast.success("Invoice updated"); },
    onError: (e: Error) => toast.error(e.message),
  });
}

// ─── Payments ───
export function useLdPayments() {
  return useAuthedLdQuery(["ld-payments"], async () => {
      const { data, error } = await supabase
        .from("ld_payments")
        .select("*, invoice:ld_invoices(invoice_number, client_id), client:ld_clients(clinic_name, clinic_code, doctor_name)")
        .order("payment_date", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
  });
}

export function useUpdateLdPayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...values }: { id: string } & Record<string, unknown>) => {
      const { error } = await supabase.from("ld_payments").update(values as any).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ld-payments"] });
      toast.success("Payment updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useCreateLdPayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: Record<string, unknown>) => {
      const invoiceId = values.invoice_id as string;
      
      // If paying against an invoice and no client_id set, resolve client_id from invoice
      if (invoiceId && !values.client_id) {
        const { data: inv } = await supabase.from("ld_invoices").select("client_id").eq("id", invoiceId).single();
        if (inv?.client_id) {
          values.client_id = inv.client_id;
        }
      }

      const { error: payError } = await supabase.from("ld_payments").insert([values as any]);
      if (payError) throw payError;

      // Update invoice amount_paid and status
      if (invoiceId) {
        const { data: inv } = await supabase.from("ld_invoices").select("total_amount, amount_paid").eq("id", invoiceId).single();
        if (inv) {
          const newPaid = Number(inv.amount_paid) + Number(values.amount || 0);
          const newStatus = newPaid >= Number(inv.total_amount) ? "paid" : newPaid > 0 ? "partial" : "unpaid";
          await supabase.from("ld_invoices").update({ amount_paid: newPaid, status: newStatus }).eq("id", invoiceId);
        }
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ld-payments"] });
      qc.invalidateQueries({ queryKey: ["ld-invoices"] });
      qc.invalidateQueries({ queryKey: ["ld-dashboard-stats"] });
      toast.success("Payment recorded");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

// ─── Dashboard Stats ───
export function useLdDashboardStats() {
  return useAuthedLdQuery(["ld-dashboard-stats"], async () => {
      const [casesRes, clientsRes, staffRes, invoicesRes] = await Promise.all([
        supabase.from("ld_cases").select("id, status, is_urgent, lab_fee, net_amount", { count: "exact" }),
        supabase.from("ld_clients").select("id", { count: "exact" }).eq("status", "active"),
        supabase.from("ld_staff").select("id", { count: "exact" }).eq("status", "active"),
        supabase.from("ld_invoices").select("id, status, total_amount, amount_paid"),
      ]);

      const cases = casesRes.data || [];
      const totalCases = casesRes.count || 0;
      const pendingCases = cases.filter(c => c.status === "pending").length;
      const inProgressCases = cases.filter(c => c.status === "in-progress").length;
      const readyCases = cases.filter(c => c.status === "ready").length;
      const urgentCases = cases.filter(c => c.is_urgent).length;
      const totalRevenue = cases.reduce((sum, c) => sum + (Number(c.net_amount) || 0), 0);

      const invoices = invoicesRes.data || [];
      const unpaidInvoices = invoices.filter(i => i.status === "unpaid").length;
      const totalOutstanding = invoices.reduce((sum, i) => sum + (Number(i.total_amount) - Number(i.amount_paid)), 0);

      return {
        totalCases,
        pendingCases,
        inProgressCases,
        readyCases,
        urgentCases,
        totalRevenue,
        activeClients: clientsRes.count || 0,
        activeStaff: staffRes.count || 0,
        unpaidInvoices,
        totalOutstanding: Math.max(totalOutstanding, 0),
      };
  });
}
