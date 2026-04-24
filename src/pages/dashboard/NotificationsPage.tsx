import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, CalendarDays, CreditCard, FlaskConical, CheckCircle2 } from "lucide-react";
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

const typeIcons: Record<string, typeof Bell> = {
  appointment: CalendarDays,
  payment: CreditCard,
  lab: FlaskConical,
};

const typeColors: Record<string, string> = {
  appointment: "bg-blue-500/10 text-blue-600",
  payment: "bg-emerald-500/10 text-emerald-600",
  lab: "bg-amber-500/10 text-amber-600",
};

export default function NotificationsPage() {
  const { data: notifications = [], isLoading } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description={`${unread} unread notifications`}
        badge={unread > 0 ? (
          <Badge variant="outline" className="text-[10px] border-destructive/30 text-destructive bg-destructive/5">
            {unread} new
          </Badge>
        ) : undefined}
      >
        <Button variant="outline" size="sm" onClick={() => markAllRead.mutate()} disabled={markAllRead.isPending || unread === 0} className="border-border/50">
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Mark All Read
        </Button>
      </PageHeader>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="glass-card overflow-hidden">
          <CardContent className="p-0 divide-y divide-border/30">
            {isLoading ? (
              <div className="space-y-0">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex gap-3 p-4">
                    <Skeleton className="h-9 w-9 rounded-full shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3 w-48" />
                      <Skeleton className="h-3 w-64" />
                      <Skeleton className="h-2 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <EmptyState icon={Bell} title="All caught up!" description="No notifications yet. You'll see updates about appointments, payments, and lab work here." />
            ) : (
              notifications.map((notif, i) => {
                const Icon = typeIcons[notif.type] || Bell;
                const colorClass = typeColors[notif.type] || "bg-muted text-muted-foreground";
                return (
                  <motion.div
                    key={notif.id}
                    className={`flex gap-3 p-4 hover:bg-accent/20 transition-all duration-200 cursor-pointer ${!notif.read ? "bg-secondary/5 border-l-2 border-l-secondary" : "border-l-2 border-l-transparent"}`}
                    onClick={() => !notif.read && markRead.mutate(notif.id)}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${!notif.read ? colorClass : "bg-muted/50"}`}>
                      <Icon className={`h-4 w-4 ${!notif.read ? "" : "text-muted-foreground"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm ${!notif.read ? "font-semibold text-foreground" : "font-medium text-muted-foreground"}`}>{notif.title}</p>
                        {!notif.read && (
                          <span className="h-2 w-2 rounded-full bg-secondary shrink-0 mt-1.5 animate-pulse" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{notif.message}</p>
                      <p className="text-[10px] text-muted-foreground/60 mt-1 font-mono">
                        {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </motion.div>
                );
              })
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}