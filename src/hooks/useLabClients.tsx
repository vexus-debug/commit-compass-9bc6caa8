import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface LabClient {
  id: string;
  clinic_name: string;
  doctor_name: string;
  clinic_code: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export function useLabClients() {
  return useQuery({
    queryKey: ["lab_clients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lab_clients")
        .select("*")
        .order("clinic_name", { ascending: true });
      if (error) throw error;
      return data as unknown as LabClient[];
    },
  });
}

export function useCreateLabClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (client: {
      clinic_name: string;
      doctor_name: string;
      clinic_code?: string;
      phone?: string;
      email?: string;
      address?: string;
      notes?: string;
    }) => {
      const { data, error } = await supabase
        .from("lab_clients")
        .insert(client)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["lab_clients"] });
      toast({ title: "Lab client added" });
    },
    onError: (e) => {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    },
  });
}

export function useUpdateLabClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: {
      id: string;
      clinic_name?: string;
      doctor_name?: string;
      clinic_code?: string;
      phone?: string;
      email?: string;
      address?: string;
      notes?: string;
      status?: string;
    }) => {
      const { data, error } = await supabase
        .from("lab_clients")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["lab_clients"] });
      toast({ title: "Lab client updated" });
    },
    onError: (e) => {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    },
  });
}

export function useDeleteLabClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("lab_clients").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["lab_clients"] });
      toast({ title: "Lab client deleted" });
    },
    onError: (e) => {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    },
  });
}

export function useLabSettings() {
  return useQuery({
    queryKey: ["lab_settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lab_settings")
        .select("*")
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data as { id: string; lab_name: string; address: string; phone: string; email: string } | null;
    },
  });
}

export function useUpdateLabSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (updates: {
      id: string;
      lab_name?: string;
      address?: string;
      phone?: string;
      email?: string;
    }) => {
      const { id, ...rest } = updates;
      const { data, error } = await supabase
        .from("lab_settings")
        .update(rest)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["lab_settings"] });
      toast({ title: "Lab settings updated" });
    },
    onError: (e) => {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    },
  });
}
