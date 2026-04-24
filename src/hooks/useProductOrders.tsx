import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface ProductOrder {
  id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  status: string;
  notes: string;
  approved_by: string | null;
  created_at: string;
  updated_at: string;
}

export const useProductOrders = () => {
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["product_orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_orders" as any)
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as unknown as ProductOrder[];
    },
  });

  const createOrder = useMutation({
    mutationFn: async (order: Omit<ProductOrder, "id" | "created_at" | "updated_at" | "approved_by">) => {
      const { error } = await supabase.from("product_orders" as any).insert(order as any);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product_orders"] });
    },
    onError: (err: any) => toast({ title: "Error creating order", description: err.message, variant: "destructive" }),
  });

  const updateOrderStatus = useMutation({
    mutationFn: async ({ id, status, approved_by }: { id: string; status: string; approved_by?: string }) => {
      const updates: any = { status };
      if (approved_by) updates.approved_by = approved_by;
      const { error } = await supabase.from("product_orders" as any).update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product_orders"] });
      toast({ title: "Order status updated" });
    },
    onError: (err: any) => toast({ title: "Error updating order", description: err.message, variant: "destructive" }),
  });

  const deleteOrder = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("product_orders" as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product_orders"] });
      toast({ title: "Order deleted" });
    },
    onError: (err: any) => toast({ title: "Error deleting order", description: err.message, variant: "destructive" }),
  });

  // Summary stats
  const pendingOrders = orders.filter((o) => o.status === "pending");
  const completedOrders = orders.filter((o) => o.status === "completed");
  const totalSales = completedOrders.reduce((sum, o) => sum + o.total_amount, 0);

  return { orders, isLoading, createOrder, updateOrderStatus, deleteOrder, pendingOrders, completedOrders, totalSales };
};
