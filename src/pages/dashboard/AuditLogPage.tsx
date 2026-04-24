import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Shield, Clock, User } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useAuditLog } from "@/hooks/useAuditLog";
import { motion } from "framer-motion";

const eventTypeColors: Record<string, string> = {
  patient_registered: "bg-blue-100 text-blue-700",
  appointment_completed: "bg-emerald-100 text-emerald-700",
  payment_received: "bg-green-100 text-green-700",
  invoice_created: "bg-amber-100 text-amber-700",
};

export default function AuditLogPage() {
  const [eventType, setEventType] = useState("");
  const [search, setSearch] = useState("");
  const { data: logs = [] } = useAuditLog({ eventType: eventType || undefined });

  const filtered = logs.filter((l: any) =>
    l.description.toLowerCase().includes(search.toLowerCase()) ||
    l.event_type.toLowerCase().includes(search.toLowerCase())
  );

  const eventTypes = [...new Set(logs.map((l: any) => l.event_type))];

  return (
    <div className="space-y-6">
      <PageHeader title="Audit Log" description="Track all system activity and changes">
        <Badge variant="outline" className="gap-1">
          <Shield className="h-3 w-3" /> Admin Only
        </Badge>
      </PageHeader>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search logs..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={eventType} onValueChange={setEventType}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder="All Events" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            {eventTypes.map(et => <SelectItem key={et} value={et} className="capitalize">{et.replace(/_/g, " ")}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="glass-card">
          <CardContent className="p-0">
            {filtered.length === 0 ? (
              <p className="text-sm text-muted-foreground py-10 text-center">No audit logs found.</p>
            ) : (
              <div className="divide-y">
                {filtered.map((log: any) => (
                  <div key={log.id} className="flex items-start gap-3 p-4 hover:bg-muted/20 transition-colors">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className={`text-[10px] ${eventTypeColors[log.event_type] || ""}`}>
                          {log.event_type.replace(/_/g, " ")}
                        </Badge>
                        {log.entity_type && (
                          <Badge variant="secondary" className="text-[10px]">{log.entity_type}</Badge>
                        )}
                      </div>
                      <p className="text-sm mt-1">{log.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(log.created_at).toLocaleString()}
                      </p>
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
