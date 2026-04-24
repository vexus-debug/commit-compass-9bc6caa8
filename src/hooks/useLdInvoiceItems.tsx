import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useLdInvoiceItems(invoiceId: string | null) {
  return useQuery({
    queryKey: ["ld-invoice-items", invoiceId],
    enabled: !!invoiceId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ld_invoice_items")
        .select("*")
        .eq("invoice_id", invoiceId!)
        .order("created_at");
      if (error) throw error;
      return data || [];
    },
  });
}

export function useCreateLdInvoiceItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: Record<string, unknown>) => {
      const { error } = await supabase.from("ld_invoice_items").insert([values as any]);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["ld-invoice-items"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useBulkCreateLdInvoiceItems() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (items: Record<string, unknown>[]) => {
      const { error } = await supabase.from("ld_invoice_items").insert(items as any[]);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["ld-invoice-items"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
}
