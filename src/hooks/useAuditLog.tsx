import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useAuditLog(filters?: { eventType?: string; dateFrom?: string; dateTo?: string }) {
  return useQuery({
    queryKey: ["audit_log", filters],
    queryFn: async () => {
      let query = supabase
        .from("activity_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);

      if (filters?.eventType) {
        query = query.eq("event_type", filters.eventType);
      }
      if (filters?.dateFrom) {
        query = query.gte("created_at", filters.dateFrom);
      }
      if (filters?.dateTo) {
        query = query.lte("created_at", filters.dateTo + "T23:59:59");
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}
