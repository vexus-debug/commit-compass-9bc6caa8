import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface UserWithRoles {
  user_id: string;
  full_name: string;
  email: string;
  roles: string[];
}

export function useAllUsersWithRoles() {
  return useQuery({
    queryKey: ["all-users-roles"],
    queryFn: async () => {
      const [profilesRes, rolesRes] = await Promise.all([
        supabase.from("profiles").select("user_id, full_name"),
        supabase.from("user_roles").select("user_id, role"),
      ]);
      if (profilesRes.error) throw profilesRes.error;
      if (rolesRes.error) throw rolesRes.error;

      const roleMap = new Map<string, string[]>();
      (rolesRes.data || []).forEach((r) => {
        const existing = roleMap.get(r.user_id) || [];
        existing.push(r.role);
        roleMap.set(r.user_id, existing);
      });

      return (profilesRes.data || []).map((p) => ({
        user_id: p.user_id,
        full_name: p.full_name,
        email: "",
        roles: roleMap.get(p.user_id) || [],
      })) as UserWithRoles[];
    },
  });
}

export function useAssignRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ user_id, role }: { user_id: string; role: "admin" | "dentist" | "assistant" | "hygienist" | "receptionist" | "accountant" | "lab_manager" | "lab_technician" | "lab_entry_clerk" }) => {
      const { error } = await supabase.from("user_roles").insert([{ user_id, role }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-users-roles"] });
      toast({ title: "Role assigned" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useRemoveRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ user_id, role }: { user_id: string; role: "admin" | "dentist" | "assistant" | "hygienist" | "receptionist" | "accountant" | "lab_manager" | "lab_technician" | "lab_entry_clerk" }) => {
      const { error } = await supabase.from("user_roles").delete().eq("user_id", user_id).eq("role", role as any);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-users-roles"] });
      toast({ title: "Role removed" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}
