import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useRef } from "react";

// Role-based send permissions
const ROLE_SEND_PERMISSIONS: Record<string, string[]> = {
  admin: ["admin", "dentist", "receptionist", "accountant", "hygienist", "assistant", "lab_technician"],
  dentist: ["admin", "receptionist"],
  receptionist: ["admin", "dentist", "accountant"],
  accountant: ["admin"],
  hygienist: ["admin", "dentist"],
  assistant: ["admin", "dentist"],
  lab_technician: ["admin", "dentist"],
};

export function getAllowedRecipientRoles(senderRoles: string[]): string[] {
  const allowed = new Set<string>();
  senderRoles.forEach((role) => {
    (ROLE_SEND_PERMISSIONS[role] || []).forEach((r) => allowed.add(r));
  });
  return Array.from(allowed);
}

export interface MessageWithDetails {
  id: string;
  sender_id: string;
  content: string;
  is_broadcast: boolean;
  broadcast_role: string | null;
  created_at: string;
  sender_name?: string;
  sender_role?: string;
  attachments?: MessageAttachment[];
  recipients?: { recipient_id: string; read: boolean }[];
}

export interface MessageAttachment {
  id: string;
  entity_type: string;
  entity_id: string;
  entity_label: string;
}

export interface ConversationPartner {
  user_id: string;
  full_name: string;
  role: string;
  last_message_at: string;
  unread_count: number;
}

// Get conversations list
export function useConversations() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["conversations", user?.id],
    enabled: !!user,
    queryFn: async () => {
      // Get all messages where user is sender or recipient
      const { data: recipientRows, error: rErr } = await supabase
        .from("message_recipients")
        .select("message_id, read, recipient_id")
        .eq("recipient_id", user!.id)
        .order("created_at", { ascending: false });
      if (rErr) throw rErr;

      const messageIds = (recipientRows || []).map((r) => r.message_id);
      
      // Also get messages user sent
      const { data: sentMessages, error: sErr } = await supabase
        .from("messages")
        .select("id, sender_id, content, created_at, is_broadcast, broadcast_role")
        .eq("sender_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(100);
      if (sErr) throw sErr;

      const allMessageIds = [...new Set([...messageIds, ...(sentMessages || []).map(m => m.id)])];
      if (allMessageIds.length === 0) return [];

      // Get all these messages with details
      const { data: messages, error: mErr } = await supabase
        .from("messages")
        .select("id, sender_id, content, created_at, is_broadcast, broadcast_role")
        .in("id", allMessageIds)
        .order("created_at", { ascending: false });
      if (mErr) throw mErr;

      // Get all recipients for these messages
      const { data: allRecipients, error: arErr } = await supabase
        .from("message_recipients")
        .select("message_id, recipient_id, read")
        .in("message_id", allMessageIds);
      if (arErr) throw arErr;

      // Get profiles for all involved users
      const userIds = new Set<string>();
      (messages || []).forEach(m => userIds.add(m.sender_id));
      (allRecipients || []).forEach(r => userIds.add(r.recipient_id));

      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name");

      const { data: roles } = await supabase
        .from("user_roles")
        .select("user_id, role");

      const profileMap = new Map<string, string>();
      (profiles || []).forEach(p => profileMap.set(p.user_id, p.full_name));
      const roleMap = new Map<string, string>();
      (roles || []).forEach(r => roleMap.set(r.user_id, r.role));

      // Group conversations by partner
      const partnerMap = new Map<string, ConversationPartner>();
      const readStatusMap = new Map<string, boolean>();
      (recipientRows || []).forEach(r => readStatusMap.set(r.message_id, r.read));

      (messages || []).forEach(msg => {
        // Find the "other" user
        let partnerId: string;
        if (msg.sender_id === user!.id) {
          // I sent this - find recipient
          const recs = (allRecipients || []).filter(r => r.message_id === msg.id && r.recipient_id !== user!.id);
          if (recs.length === 0) return;
          partnerId = recs[0].recipient_id;
        } else {
          partnerId = msg.sender_id;
        }

        if (msg.is_broadcast) {
          partnerId = `broadcast-${msg.broadcast_role || 'all'}`;
        }

        if (!partnerMap.has(partnerId)) {
          const isUnread = msg.sender_id !== user!.id && readStatusMap.get(msg.id) === false;
          partnerMap.set(partnerId, {
            user_id: partnerId,
            full_name: msg.is_broadcast 
              ? `📢 ${(msg.broadcast_role || 'All').charAt(0).toUpperCase() + (msg.broadcast_role || 'all').slice(1)}s`
              : (profileMap.get(partnerId) || "Unknown"),
            role: roleMap.get(partnerId) || "",
            last_message_at: msg.created_at,
            unread_count: isUnread ? 1 : 0,
          });
        } else {
          const existing = partnerMap.get(partnerId)!;
          if (msg.sender_id !== user!.id && readStatusMap.get(msg.id) === false) {
            existing.unread_count += 1;
          }
        }
      });

      return Array.from(partnerMap.values()).sort(
        (a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()
      );
    },
  });
}

// Get messages with a specific user
export function useMessageThread(partnerId: string | null) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["message-thread", user?.id, partnerId],
    enabled: !!user && !!partnerId,
    queryFn: async () => {
      if (!partnerId) return [];

      // Get messages sent by me to this partner or by partner to me
      const { data: sentByMe, error: e1 } = await supabase
        .from("messages")
        .select("id, sender_id, content, created_at, is_broadcast, broadcast_role")
        .eq("sender_id", user!.id)
        .order("created_at", { ascending: true });
      if (e1) throw e1;

      const { data: sentToMe, error: e2 } = await supabase
        .from("messages")
        .select("id, sender_id, content, created_at, is_broadcast, broadcast_role")
        .eq("sender_id", partnerId)
        .order("created_at", { ascending: true });
      if (e2) throw e2;

      // Filter sent by me: only those with this partner as recipient
      const sentByMeIds = (sentByMe || []).map(m => m.id);
      let filteredSentByMe: typeof sentByMe = [];
      if (sentByMeIds.length > 0) {
        const { data: myRecipients } = await supabase
          .from("message_recipients")
          .select("message_id")
          .in("message_id", sentByMeIds)
          .eq("recipient_id", partnerId);
        const validIds = new Set((myRecipients || []).map(r => r.message_id));
        filteredSentByMe = (sentByMe || []).filter(m => validIds.has(m.id));
      }

      // Filter sent to me: only those where I'm a recipient
      const sentToMeIds = (sentToMe || []).map(m => m.id);
      let filteredSentToMe: typeof sentToMe = [];
      if (sentToMeIds.length > 0) {
        const { data: theirRecipients } = await supabase
          .from("message_recipients")
          .select("message_id")
          .in("message_id", sentToMeIds)
          .eq("recipient_id", user!.id);
        const validIds = new Set((theirRecipients || []).map(r => r.message_id));
        filteredSentToMe = (sentToMe || []).filter(m => validIds.has(m.id));
      }

      const allMessages = [...(filteredSentByMe || []), ...(filteredSentToMe || [])].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );

      // Get attachments
      const msgIds = allMessages.map(m => m.id);
      let attachmentsMap = new Map<string, MessageAttachment[]>();
      if (msgIds.length > 0) {
        const { data: attachments } = await supabase
          .from("message_attachments")
          .select("id, message_id, entity_type, entity_id, entity_label")
          .in("message_id", msgIds);
        (attachments || []).forEach(a => {
          const existing = attachmentsMap.get(a.message_id) || [];
          existing.push({ id: a.id, entity_type: a.entity_type, entity_id: a.entity_id, entity_label: a.entity_label });
          attachmentsMap.set(a.message_id, existing);
        });
      }

      // Get sender profiles
      const { data: profiles } = await supabase.from("profiles").select("user_id, full_name");
      const { data: roles } = await supabase.from("user_roles").select("user_id, role");
      const profileMap = new Map<string, string>();
      (profiles || []).forEach(p => profileMap.set(p.user_id, p.full_name));
      const roleMap = new Map<string, string>();
      (roles || []).forEach(r => roleMap.set(r.user_id, r.role));

      return allMessages.map(m => ({
        ...m,
        sender_name: profileMap.get(m.sender_id) || "Unknown",
        sender_role: roleMap.get(m.sender_id) || "",
        attachments: attachmentsMap.get(m.id) || [],
      })) as MessageWithDetails[];
    },
  });
}

// Unread message count
export function useUnreadMessageCount() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["unread-message-count", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { count, error } = await supabase
        .from("message_recipients")
        .select("*", { count: "exact", head: true })
        .eq("recipient_id", user!.id)
        .eq("read", false);
      if (error) throw error;
      return count || 0;
    },
  });
}

// Send message mutation
export function useSendMessage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      content,
      recipientIds,
      isBroadcast = false,
      broadcastRole = null,
      attachments = [],
    }: {
      content: string;
      recipientIds: string[];
      isBroadcast?: boolean;
      broadcastRole?: string | null;
      attachments?: { entity_type: string; entity_id: string; entity_label: string }[];
    }) => {
      if (!user) throw new Error("Not authenticated");

      const { data: msg, error: msgErr } = await supabase
        .from("messages")
        .insert({ sender_id: user.id, content, is_broadcast: isBroadcast, broadcast_role: broadcastRole })
        .select("id")
        .single();
      if (msgErr) throw msgErr;

      // Insert recipients
      const recipientRows = recipientIds.map((rid) => ({
        message_id: msg.id,
        recipient_id: rid,
      }));
      if (recipientRows.length > 0) {
        const { error: rErr } = await supabase.from("message_recipients").insert(recipientRows);
        if (rErr) throw rErr;
      }

      // Insert attachments
      if (attachments.length > 0) {
        const attachmentRows = attachments.map((a) => ({
          message_id: msg.id,
          entity_type: a.entity_type,
          entity_id: a.entity_id,
          entity_label: a.entity_label,
        }));
        const { error: aErr } = await supabase.from("message_attachments").insert(attachmentRows);
        if (aErr) throw aErr;
      }

      return msg;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["message-thread"] });
      queryClient.invalidateQueries({ queryKey: ["unread-message-count"] });
    },
  });
}

// Mark messages as read
export function useMarkMessagesRead() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (messageIds: string[]) => {
      if (!user || messageIds.length === 0) return;
      const { error } = await supabase
        .from("message_recipients")
        .update({ read: true, read_at: new Date().toISOString() })
        .eq("recipient_id", user.id)
        .in("message_id", messageIds);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["unread-message-count"] });
    },
  });
}

// Realtime messages subscription
export function useRealtimeMessages() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const initialLoadDone = useRef(false);

  useEffect(() => {
    if (!user) return;
    const timer = setTimeout(() => { initialLoadDone.current = true; }, 2000);

    const channel = supabase
      .channel("messages-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "message_recipients", filter: `recipient_id=eq.${user.id}` },
        () => {
          queryClient.invalidateQueries({ queryKey: ["conversations"] });
          queryClient.invalidateQueries({ queryKey: ["message-thread"] });
          queryClient.invalidateQueries({ queryKey: ["unread-message-count"] });
          if (initialLoadDone.current) {
            // Play sound
            try {
              const ctx = new AudioContext();
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.frequency.value = 660;
              gain.gain.value = 0.12;
              osc.start();
              osc.stop(ctx.currentTime + 0.12);
            } catch { /* ignore */ }
          }
        }
      )
      .subscribe();

    return () => {
      clearTimeout(timer);
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);
}
