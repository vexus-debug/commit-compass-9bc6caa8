import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Bell, AlertTriangle, Clock, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useLdInventory } from "@/hooks/useLdInventory";

interface Notification {
  id: string;
  type: "overdue" | "due_soon" | "low_stock" | "completed";
  title: string;
  description: string;
  time?: string;
}

export default function LdNotificationsPage() {
  const { data: cases = [] } = useQuery({
    queryKey: ["ld_cases_notifications"],
    queryFn: async () => {
      const { data, error } = await supabase.from("ld_cases").select("*").in("status", ["pending", "in_progress"]);
      if (error) throw error;
      return data;
    },
  });

  const { data: inventory = [] } = useLdInventory();

  const today = new Date().toISOString().split("T")[0];
  const threeDaysFromNow = new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0];

  const notifications: Notification[] = [];

  // Overdue cases
  cases.forEach((c: any) => {
    if (c.due_date && c.due_date < today) {
      notifications.push({
        id: `overdue-${c.id}`,
        type: "overdue",
        title: `Case ${c.case_number} is overdue`,
        description: `${c.patient_name} — ${c.work_type_name} — Due: ${c.due_date}`,
        time: c.due_date,
      });
    } else if (c.due_date && c.due_date <= threeDaysFromNow) {
      notifications.push({
        id: `due-${c.id}`,
        type: "due_soon",
        title: `Case ${c.case_number} due soon`,
        description: `${c.patient_name} — ${c.work_type_name} — Due: ${c.due_date}`,
        time: c.due_date,
      });
    }
  });

  // Low stock
  inventory.forEach(item => {
    if (item.quantity <= item.min_stock) {
      notifications.push({
        id: `stock-${item.id}`,
        type: "low_stock",
        title: `Low stock: ${item.name}`,
        description: `${item.quantity} ${item.unit} remaining (min: ${item.min_stock})`,
      });
    }
  });

  notifications.sort((a, b) => {
    const order = { overdue: 0, low_stock: 1, due_soon: 2, completed: 3 };
    return order[a.type] - order[b.type];
  });

  const iconMap = {
    overdue: <AlertTriangle className="h-4 w-4 text-destructive" />,
    due_soon: <Clock className="h-4 w-4 text-amber-500" />,
    low_stock: <AlertTriangle className="h-4 w-4 text-amber-500" />,
    completed: <CheckCircle className="h-4 w-4 text-emerald-500" />,
  };

  const badgeMap = {
    overdue: "destructive" as const,
    due_soon: "secondary" as const,
    low_stock: "secondary" as const,
    completed: "outline" as const,
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Notifications" description="Case alerts, due dates, and stock warnings">
        <Badge variant="outline" className="gap-1"><Bell className="h-3 w-3" /> {notifications.length} alerts</Badge>
      </PageHeader>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="glass-card">
          <CardContent className="p-0">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center py-12 gap-2">
                <Bell className="h-10 w-10 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">No notifications — everything is on track!</p>
              </div>
            ) : (
              <div className="divide-y">
                {notifications.map(n => (
                  <div key={n.id} className="flex items-start gap-3 p-4 hover:bg-muted/20 transition-colors">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                      {iconMap[n.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Badge variant={badgeMap[n.type]} className="text-[10px] capitalize">{n.type.replace(/_/g, " ")}</Badge>
                      </div>
                      <p className="text-sm font-medium mt-1">{n.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{n.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
