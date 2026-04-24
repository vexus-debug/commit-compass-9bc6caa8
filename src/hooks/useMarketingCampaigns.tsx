import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface MarketingCampaign {
  id: string;
  name: string;
  channel: string;
  status: string;
  subject: string | null;
  message_body: string;
  media_urls: string[];
  template_name: string | null;
  scheduled_at: string | null;
  sent_at: string | null;
  total_recipients: number;
  delivered_count: number;
  failed_count: number;
  read_count: number;
  target_filter: Record<string, any>;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface MarketingMessage {
  id: string;
  campaign_id: string;
  patient_id: string;
  channel: string;
  recipient_phone: string | null;
  recipient_email: string | null;
  status: string;
  error_message: string | null;
  sent_at: string | null;
  delivered_at: string | null;
  read_at: string | null;
  created_at: string;
}

export interface MarketingTemplate {
  id: string;
  name: string;
  channel: string;
  subject: string | null;
  body: string;
  media_urls: string[];
  category: string;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export function useCampaigns(channel: "whatsapp" | "email") {
  return useQuery({
    queryKey: ["marketing-campaigns", channel],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("marketing_campaigns")
        .select("*")
        .eq("channel", channel)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as MarketingCampaign[];
    },
  });
}

export function useCampaignMessages(campaignId: string | null) {
  return useQuery({
    queryKey: ["marketing-messages", campaignId],
    enabled: !!campaignId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("marketing_messages")
        .select("*, patients(first_name, last_name, phone, email)")
        .eq("campaign_id", campaignId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useMarketingTemplates(channel: "whatsapp" | "email") {
  return useQuery({
    queryKey: ["marketing-templates", channel],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("marketing_templates")
        .select("*")
        .eq("channel", channel)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as MarketingTemplate[];
    },
  });
}

export function useCreateCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (campaign: Partial<MarketingCampaign>) => {
      const { data, error } = await supabase
        .from("marketing_campaigns")
        .insert(campaign as any)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["marketing-campaigns"] });
      toast({ title: "Campaign created", description: `"${data.name}" has been created.` });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<MarketingCampaign> & { id: string }) => {
      const { data, error } = await supabase
        .from("marketing_campaigns")
        .update(updates as any)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketing-campaigns"] });
      toast({ title: "Campaign updated" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("marketing_campaigns").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketing-campaigns"] });
      toast({ title: "Campaign deleted" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useCreateBulkMessages() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      campaignId,
      patients,
      channel,
    }: {
      campaignId: string;
      patients: { id: string; phone: string; email: string | null }[];
      channel: "whatsapp" | "email";
    }) => {
      const messages = patients.map((p) => ({
        campaign_id: campaignId,
        patient_id: p.id,
        channel,
        recipient_phone: channel === "whatsapp" ? p.phone : null,
        recipient_email: channel === "email" ? p.email : null,
        status: "pending",
      }));
      const { data, error } = await supabase.from("marketing_messages").insert(messages as any).select();
      if (error) throw error;

      // Update campaign total_recipients
      await supabase
        .from("marketing_campaigns")
        .update({ total_recipients: patients.length, status: "sending" } as any)
        .eq("id", campaignId);

      return data;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["marketing-campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["marketing-messages", vars.campaignId] });
      toast({ title: "Messages queued", description: `${vars.patients.length} messages queued for delivery.` });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useCreateTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (template: Partial<MarketingTemplate>) => {
      const { data, error } = await supabase
        .from("marketing_templates")
        .insert(template as any)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketing-templates"] });
      toast({ title: "Template saved" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("marketing_templates").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketing-templates"] });
      toast({ title: "Template deleted" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}
