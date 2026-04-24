import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  useConversations,
  useMessageThread,
  useSendMessage,
  useMarkMessagesRead,
  useUnreadMessageCount,
  useRealtimeMessages,
  getAllowedRecipientRoles,
  type ConversationPartner,
} from "@/hooks/useMessages";
import { useAllUsersWithRoles } from "@/hooks/useUserRoles";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageSquarePlus, Send, Paperclip, Search } from "lucide-react";
import { getRoleLabel } from "@/config/roleAccess";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function MessagesPage() {
  const { user, roles } = useAuth();
  const { data: conversations = [], isLoading: convsLoading } = useConversations();
  const { data: allUsers = [] } = useAllUsersWithRoles();
  const sendMessage = useSendMessage();
  const markRead = useMarkMessagesRead();
  const { toast } = useToast();
  useRealtimeMessages();

  const [selectedPartner, setSelectedPartner] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [newMsgOpen, setNewMsgOpen] = useState(false);
  const [newMsgRecipient, setNewMsgRecipient] = useState("");
  const [newMsgText, setNewMsgText] = useState("");
  const [attachmentSearch, setAttachmentSearch] = useState("");
  const [attachments, setAttachments] = useState<{ entity_type: string; entity_id: string; entity_label: string }[]>([]);
  const [attachmentResults, setAttachmentResults] = useState<{ entity_type: string; entity_id: string; entity_label: string }[]>([]);

  const { data: thread = [], isLoading: threadLoading } = useMessageThread(selectedPartner);
  const scrollRef = useRef<HTMLDivElement>(null);

  const allowedRoles = getAllowedRecipientRoles(roles);

  // Filter users the current user can message
  const availableRecipients = allUsers.filter(
    (u) => u.user_id !== user?.id && u.roles.some((r) => allowedRoles.includes(r))
  );

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [thread]);

  // Mark messages as read when viewing thread
  useEffect(() => {
    if (!user || !thread.length || !selectedPartner) return;
    const unreadIds = thread
      .filter((m) => m.sender_id !== user.id)
      .map((m) => m.id);
    if (unreadIds.length > 0) {
      markRead.mutate(unreadIds);
    }
  }, [thread, selectedPartner, user]);

  const handleSend = async () => {
    if (!messageText.trim() || !selectedPartner || !user) return;
    try {
      await sendMessage.mutateAsync({
        content: messageText.trim(),
        recipientIds: [selectedPartner],
        attachments,
      });
      setMessageText("");
      setAttachments([]);
    } catch (err: any) {
      toast({ title: "Error sending message", description: err.message, variant: "destructive" });
    }
  };

  const handleNewMessage = async () => {
    if (!newMsgText.trim() || !newMsgRecipient) return;

    let recipientIds: string[] = [];
    let isBroadcast = false;
    let broadcastRole: string | null = null;

    if (newMsgRecipient.startsWith("role-")) {
      const role = newMsgRecipient.replace("role-", "");
      broadcastRole = role;
      isBroadcast = true;
      recipientIds = allUsers
        .filter((u) => u.user_id !== user?.id && u.roles.includes(role))
        .map((u) => u.user_id);
    } else {
      recipientIds = [newMsgRecipient];
    }

    if (recipientIds.length === 0) {
      toast({ title: "No recipients found", variant: "destructive" });
      return;
    }

    try {
      await sendMessage.mutateAsync({
        content: newMsgText.trim(),
        recipientIds,
        isBroadcast,
        broadcastRole,
      });
      setNewMsgOpen(false);
      setNewMsgText("");
      setNewMsgRecipient("");
      if (!isBroadcast) setSelectedPartner(recipientIds[0]);
      toast({ title: "Message sent" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  // Search for records to attach
  const searchAttachments = async (query: string) => {
    setAttachmentSearch(query);
    if (query.length < 2) { setAttachmentResults([]); return; }
    const results: typeof attachmentResults = [];

    const { data: patients } = await supabase
      .from("patients")
      .select("id, first_name, last_name")
      .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%`)
      .limit(5);
    (patients || []).forEach((p) =>
      results.push({ entity_type: "patient", entity_id: p.id, entity_label: `Patient: ${p.first_name} ${p.last_name}` })
    );

    const { data: invoices } = await supabase
      .from("invoices")
      .select("id, invoice_number")
      .ilike("invoice_number", `%${query}%`)
      .limit(5);
    (invoices || []).forEach((i) =>
      results.push({ entity_type: "invoice", entity_id: i.id, entity_label: `Invoice: ${i.invoice_number}` })
    );

    const { data: treatments } = await supabase
      .from("treatments")
      .select("id, name")
      .ilike("name", `%${query}%`)
      .limit(5);
    (treatments || []).forEach((t) =>
      results.push({ entity_type: "treatment", entity_id: t.id, entity_label: `Treatment: ${t.name}` })
    );

    setAttachmentResults(results);
  };

  const filteredConversations = conversations.filter((c) =>
    c.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      <PageHeader title="Messages" description="Inter-role messaging and data sharing" />

      <div className="flex flex-1 overflow-hidden border-t border-border/40">
        {/* Conversations List */}
        <div className="w-80 border-r border-border/40 flex flex-col bg-card/30">
          <div className="p-3 border-b border-border/40 space-y-2">
            <Dialog open={newMsgOpen} onOpenChange={setNewMsgOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="w-full gap-2">
                  <MessageSquarePlus className="h-4 w-4" />
                  New Message
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>New Message</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Select value={newMsgRecipient} onValueChange={setNewMsgRecipient}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipient..." />
                    </SelectTrigger>
                    <SelectContent>
                      {allowedRoles.map((role) => (
                        <SelectItem key={`role-${role}`} value={`role-${role}`}>
                          📢 All {getRoleLabel(role)}s
                        </SelectItem>
                      ))}
                      {availableRecipients.map((u) => (
                        <SelectItem key={u.user_id} value={u.user_id}>
                          {u.full_name} ({u.roles.map(getRoleLabel).join(", ")})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Textarea
                    placeholder="Type your message..."
                    value={newMsgText}
                    onChange={(e) => setNewMsgText(e.target.value)}
                    rows={4}
                  />
                  <Button onClick={handleNewMessage} disabled={!newMsgRecipient || !newMsgText.trim()}>
                    Send Message
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 text-sm"
              />
            </div>
          </div>

          <ScrollArea className="flex-1">
            {convsLoading ? (
              <div className="p-4 text-center text-sm text-muted-foreground">Loading...</div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">No conversations yet</div>
            ) : (
              filteredConversations.map((conv) => (
                <button
                  key={conv.user_id}
                  onClick={() => setSelectedPartner(conv.user_id)}
                  className={cn(
                    "w-full text-left p-3 flex items-center gap-3 hover:bg-accent/40 transition-colors border-b border-border/20",
                    selectedPartner === conv.user_id && "bg-accent/60"
                  )}
                >
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarFallback className="bg-secondary/20 text-secondary text-xs">
                      {getInitials(conv.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium truncate">{conv.full_name}</span>
                      {conv.unread_count > 0 && (
                        <Badge variant="destructive" className="h-5 min-w-5 text-[10px] px-1.5 shrink-0">
                          {conv.unread_count}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-[9px] px-1 py-0">
                        {getRoleLabel(conv.role)}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">
                        {format(new Date(conv.last_message_at), "MMM d")}
                      </span>
                    </div>
                  </div>
                </button>
              ))
            )}
          </ScrollArea>
        </div>

        {/* Message Thread */}
        <div className="flex-1 flex flex-col">
          {!selectedPartner ? (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center space-y-2">
                <MessageSquarePlus className="h-12 w-12 mx-auto opacity-30" />
                <p className="text-sm">Select a conversation or start a new one</p>
              </div>
            </div>
          ) : (
            <>
              {/* Thread header */}
              <div className="p-3 border-b border-border/40 bg-card/30">
                {(() => {
                  const partner = conversations.find((c) => c.user_id === selectedPartner);
                  return (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-secondary/20 text-secondary text-xs">
                          {getInitials(partner?.full_name || "?")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{partner?.full_name || "Unknown"}</p>
                        <Badge variant="outline" className="text-[9px] px-1 py-0">
                          {getRoleLabel(partner?.role || "")}
                        </Badge>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                {threadLoading ? (
                  <div className="text-center text-sm text-muted-foreground">Loading messages...</div>
                ) : thread.length === 0 ? (
                  <div className="text-center text-sm text-muted-foreground">No messages yet. Start the conversation!</div>
                ) : (
                  <div className="space-y-3">
                    {thread.map((msg) => {
                      const isMe = msg.sender_id === user?.id;
                      return (
                        <div key={msg.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                          <div className={cn(
                            "max-w-[70%] rounded-2xl px-4 py-2.5 space-y-1",
                            isMe
                              ? "bg-secondary text-secondary-foreground rounded-br-md"
                              : "bg-muted rounded-bl-md"
                          )}>
                            {!isMe && (
                              <p className="text-[10px] font-medium opacity-70">
                                {msg.sender_name} · {getRoleLabel(msg.sender_role || "")}
                              </p>
                            )}
                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                            {msg.attachments && msg.attachments.length > 0 && (
                              <div className="flex flex-wrap gap-1 pt-1">
                                {msg.attachments.map((a) => (
                                  <Badge key={a.id} variant="outline" className="text-[10px] gap-1">
                                    <Paperclip className="h-2.5 w-2.5" />
                                    {a.entity_label}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            <p className={cn("text-[10px]", isMe ? "text-secondary-foreground/60" : "text-muted-foreground")}>
                              {format(new Date(msg.created_at), "h:mm a")}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>

              {/* Attachments */}
              {attachments.length > 0 && (
                <div className="px-4 py-1 flex flex-wrap gap-1 border-t border-border/20">
                  {attachments.map((a, i) => (
                    <Badge key={i} variant="secondary" className="text-[10px] gap-1">
                      <Paperclip className="h-2.5 w-2.5" />
                      {a.entity_label}
                      <button onClick={() => setAttachments((prev) => prev.filter((_, idx) => idx !== i))} className="ml-1 hover:text-destructive">×</button>
                    </Badge>
                  ))}
                </div>
              )}

              {/* Input */}
              <div className="p-3 border-t border-border/40 bg-card/30">
                {/* Attachment search */}
                <div className="relative mb-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Paperclip className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        placeholder="Attach record (search patients, invoices, treatments...)"
                        value={attachmentSearch}
                        onChange={(e) => searchAttachments(e.target.value)}
                        className="pl-8 h-8 text-xs"
                      />
                    </div>
                  </div>
                  {attachmentResults.length > 0 && (
                    <div className="absolute bottom-full left-0 right-0 bg-popover border border-border rounded-lg shadow-lg mb-1 z-10 max-h-40 overflow-y-auto">
                      {attachmentResults.map((r) => (
                        <button
                          key={`${r.entity_type}-${r.entity_id}`}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-accent/40 transition-colors"
                          onClick={() => {
                            setAttachments((prev) => [...prev, r]);
                            setAttachmentSearch("");
                            setAttachmentResults([]);
                          }}
                        >
                          {r.entity_label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Textarea
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="min-h-[40px] max-h-[120px] resize-none"
                    rows={1}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                  />
                  <Button
                    size="icon"
                    onClick={handleSend}
                    disabled={!messageText.trim() || sendMessage.isPending}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
