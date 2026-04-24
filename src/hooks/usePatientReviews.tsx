import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export function usePatientReviews() {
  return useQuery({
    queryKey: ["patient_reviews"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("patient_reviews")
        .select("*, patients(first_name, last_name), staff(full_name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useCreatePatientReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (review: {
      patient_id: string;
      appointment_id?: string;
      dentist_id?: string;
      rating: number;
      comments?: string;
      service_categories?: string[];
      recorded_by?: string;
    }) => {
      const { data, error } = await supabase.from("patient_reviews").insert(review).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["patient_reviews"] });
      toast({ title: "Review recorded" });
    },
    onError: (e) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });
}
