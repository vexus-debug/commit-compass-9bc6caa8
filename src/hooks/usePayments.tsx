import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Payment {
  id: string;
  invoice_id: string;
  amount: number;
  payment_method: string;
  payment_date: string;
  reference: string;
  created_at: string;
}

export function usePayments(invoiceId: string | null) {
  return useQuery({
    queryKey: ["payments", invoiceId],
    enabled: !!invoiceId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .eq("invoice_id", invoiceId!)
        .order("payment_date", { ascending: true });
      if (error) throw error;
      return data as Payment[];
    },
  });
}

export function useRecordPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      invoice_id: string;
      amount: number;
      payment_method: string;
      reference?: string;
    }) => {
      // Insert payment
      const { error: payError } = await supabase.from("payments").insert({
        invoice_id: input.invoice_id,
        amount: input.amount,
        payment_method: input.payment_method,
        reference: input.reference || "",
      });
      if (payError) throw payError;

      // Update invoice amount_paid and status
      const { data: invoice, error: fetchError } = await supabase
        .from("invoices")
        .select("total_amount, amount_paid")
        .eq("id", input.invoice_id)
        .single();
      if (fetchError) throw fetchError;

      const newPaid = Number(invoice.amount_paid) + input.amount;
      const newStatus = newPaid >= Number(invoice.total_amount) ? "paid" : "partial";

      const { error: updError } = await supabase
        .from("invoices")
        .update({ amount_paid: newPaid, status: newStatus })
        .eq("id", input.invoice_id);
      if (updError) throw updError;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["payments", variables.invoice_id] });
      queryClient.invalidateQueries({ queryKey: ["billing_stats"] });
    },
  });
}
