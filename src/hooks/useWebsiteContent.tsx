import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// ── Generic content (key-value) ──
export function useWebsiteContent(sectionGroup?: string) {
  return useQuery({
    queryKey: ["website_content", sectionGroup],
    queryFn: async () => {
      let q = supabase.from("website_content").select("*").order("display_order");
      if (sectionGroup) q = q.eq("section_group", sectionGroup);
      const { data, error } = await q;
      if (error) throw error;
      return data as any[];
    },
  });
}

export function useAllWebsiteContent() {
  return useQuery({
    queryKey: ["website_content"],
    queryFn: async () => {
      const { data, error } = await supabase.from("website_content").select("*").order("display_order");
      if (error) throw error;
      return data as any[];
    },
  });
}

/** Helper: get a content value by key from a content array */
export function getContent(items: any[] | undefined, key: string, fallback = "") {
  if (!items) return fallback;
  const item = items.find((i: any) => i.section_key === key);
  return item?.content_value || fallback;
}

export function useUpsertContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: { section_key: string; content_value: string; content_type?: string; section_group?: string; label?: string; display_order?: number }) => {
      const { error } = await supabase.from("website_content").upsert(row, { onConflict: "section_key" });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["website_content"] }),
  });
}

export function useDeleteContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("website_content").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["website_content"] }),
  });
}

// ── Testimonials ──
export function useWebsiteTestimonials() {
  return useQuery({
    queryKey: ["website_testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase.from("website_testimonials").select("*").order("display_order");
      if (error) throw error;
      return data as any[];
    },
  });
}

export function useUpsertTestimonial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: any) => {
      const { error } = row.id
        ? await supabase.from("website_testimonials").update(row).eq("id", row.id)
        : await supabase.from("website_testimonials").insert(row);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["website_testimonials"] }),
  });
}

export function useDeleteTestimonial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("website_testimonials").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["website_testimonials"] }),
  });
}

// ── FAQs ──
export function useWebsiteFaqs() {
  return useQuery({
    queryKey: ["website_faqs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("website_faqs").select("*").order("display_order");
      if (error) throw error;
      return data as any[];
    },
  });
}

export function useUpsertFaq() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: any) => {
      const { error } = row.id
        ? await supabase.from("website_faqs").update(row).eq("id", row.id)
        : await supabase.from("website_faqs").insert(row);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["website_faqs"] }),
  });
}

export function useDeleteFaq() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("website_faqs").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["website_faqs"] }),
  });
}

// ── Promotions ──
export function useWebsitePromotions() {
  return useQuery({
    queryKey: ["website_promotions"],
    queryFn: async () => {
      const { data, error } = await supabase.from("website_promotions").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as any[];
    },
  });
}

export function useUpsertPromotion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: any) => {
      const { error } = row.id
        ? await supabase.from("website_promotions").update(row).eq("id", row.id)
        : await supabase.from("website_promotions").insert(row);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["website_promotions"] }),
  });
}

export function useDeletePromotion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("website_promotions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["website_promotions"] }),
  });
}

// ── Gallery ──
export function useWebsiteGallery() {
  return useQuery({
    queryKey: ["website_gallery"],
    queryFn: async () => {
      const { data, error } = await supabase.from("website_gallery").select("*").order("display_order");
      if (error) throw error;
      return data as any[];
    },
  });
}

export function useUpsertGalleryItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: any) => {
      const { error } = row.id
        ? await supabase.from("website_gallery").update(row).eq("id", row.id)
        : await supabase.from("website_gallery").insert(row);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["website_gallery"] }),
  });
}

export function useDeleteGalleryItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("website_gallery").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["website_gallery"] }),
  });
}

// ── Team Members ──
export function useWebsiteTeamMembers() {
  return useQuery({
    queryKey: ["website_team_members"],
    queryFn: async () => {
      const { data, error } = await supabase.from("website_team_members").select("*").order("display_order");
      if (error) throw error;
      return data as any[];
    },
  });
}

export function useUpsertTeamMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: any) => {
      const { error } = row.id
        ? await supabase.from("website_team_members").update(row).eq("id", row.id)
        : await supabase.from("website_team_members").insert(row);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["website_team_members"] }),
  });
}

export function useDeleteTeamMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("website_team_members").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["website_team_members"] }),
  });
}
