import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FlaskConical } from "lucide-react";
import { CreateLabOrderDialog } from "@/components/dashboard/CreateLabOrderDialog";
import { useLabOrders } from "@/hooks/useLabOrders";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const statusStyles: Record<string, string> = {
  pending: "bg-muted text-muted-foreground",
  sent: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  "in-progress": "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  completed: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
};

const statusDots: Record<string, string> = {
  pending: "bg-muted-foreground/50",
  sent: "bg-blue-500",
  "in-progress": "bg-amber-500",
  completed: "bg-emerald-500",
};

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } },
  item: { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } },
};

export default function LabWorkPage() {
  const [labOpen, setLabOpen] = useState(false);
  const { data: labOrders = [], isLoading } = useLabOrders();

  const statuses = ["pending", "sent", "in-progress", "completed"] as const;

  return (
    <div className="space-y-6">
      <PageHeader title="Lab Work" description="Track dental lab orders and results">
        <Button size="sm" className="bg-secondary hover:bg-secondary/90 shadow-lg shadow-secondary/20" onClick={() => setLabOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Lab Order
        </Button>
      </PageHeader>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="glass-card"><CardContent className="p-5 space-y-3"><Skeleton className="h-4 w-24" /><Skeleton className="h-20 w-full rounded-lg" /></CardContent></Card>
          ))}
        </div>
      ) : (
        <motion.div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" variants={stagger.container} initial="hidden" animate="visible">
          {statuses.map((status) => {
            const orders = labOrders.filter((o) => o.status === status);
            return (
              <motion.div key={status} variants={stagger.item}>
                <Card className="glass-card">
                  <CardHeader className="pb-2 border-b border-border/30">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm capitalize">{status.replace("-", " ")}</CardTitle>
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-medium ${statusStyles[status]}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${statusDots[status]}`} />
                        {orders.length}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-3">
                    {orders.map((order) => (
                      <div key={order.id} className="p-3 rounded-lg border border-border/30 bg-card/50 hover:shadow-md hover:border-secondary/20 transition-all duration-200 group cursor-pointer">
                        <p className="text-sm font-medium group-hover:text-secondary transition-colors">{order.lab_work_type}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {order.patients ? `${order.patients.first_name} ${order.patients.last_name}` : "Unknown"}
                        </p>
                        <div className="flex justify-between items-center mt-2 pt-1.5 border-t border-border/20">
                          <span className="text-[10px] text-muted-foreground font-mono">{order.lab_name}</span>
                          {order.due_date && <span className="text-[10px] text-muted-foreground font-mono">Due: {order.due_date}</span>}
                        </div>
                      </div>
                    ))}
                    {orders.length === 0 && (
                      <div className="flex flex-col items-center py-6">
                        <FlaskConical className="h-6 w-6 text-muted-foreground/30 mb-1.5" />
                        <p className="text-xs text-muted-foreground">No orders</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      )}
      <CreateLabOrderDialog open={labOpen} onOpenChange={setLabOpen} />
    </div>
  );
}