import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, UserPlus, Filter, MoreHorizontal, ArrowUpDown, Users, Phone, MessageCircle } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddPatientDialog } from "@/components/dashboard/AddPatientDialog";
import { BookAppointmentDialog } from "@/components/dashboard/BookAppointmentDialog";
import { usePatients } from "@/hooks/usePatients";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { TableSkeleton } from "@/components/dashboard/TableSkeleton";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { motion } from "framer-motion";

export default function PatientsPage() {
  const navigate = useNavigate();
  const { roles } = useAuth();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [addOpen, setAddOpen] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");

  const { data: patients = [], isLoading } = usePatients();

  // Dentists cannot see contact details or contact patients
  const isDentistOnly = roles.includes("dentist") && !roles.includes("admin") && !roles.includes("receptionist");
  // Only admin/receptionist can add patients
  const canAddPatient = !isDentistOnly;

  const filtered = patients
    .filter((p) => {
      const fullName = `${p.first_name} ${p.last_name}`.toLowerCase();
      const matchesSearch = fullName.includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase()) || (!isDentistOnly && p.phone.includes(search));
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "name") return `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`);
      if (sortBy === "registered") return b.registered_date.localeCompare(a.registered_date);
      return 0;
    });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Patients"
        description={`${patients.length} total patients`}
        badge={
          <Badge variant="outline" className="text-[10px] border-secondary/30 text-secondary">
            {patients.filter((p) => p.status === "active").length} active
          </Badge>
        }
      >
        {canAddPatient && (
          <Button size="sm" className="bg-secondary hover:bg-secondary/90 shadow-lg shadow-secondary/20" onClick={() => setAddOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Patient
          </Button>
        )}
      </PageHeader>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="glass-card overflow-hidden">
          <CardHeader className="pb-3 border-b border-border/30">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder={isDentistOnly ? "Search by name or ID..." : "Search by name, ID, or phone..."} className="pl-9 bg-muted/30 border-border/40" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px] bg-muted/30 border-border/40">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px] bg-muted/30 border-border/40">
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Sort by Name</SelectItem>
                  <SelectItem value="registered">Sort by Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              {isLoading ? (
                <TableSkeleton columns={6} rows={8} />
              ) : filtered.length === 0 ? (
                <EmptyState
                  icon={Users}
                  title="No patients found"
                  description="Try adjusting your search or filters, or add a new patient to get started."
                  actionLabel={canAddPatient ? "Add Patient" : undefined}
                  onAction={canAddPatient ? () => setAddOpen(true) : undefined}
                />
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/20">
                      <th className="py-3 px-4 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider">Patient</th>
                      {!isDentistOnly && (
                        <>
                          <th className="py-3 px-4 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider hidden md:table-cell">Phone</th>
                          <th className="py-3 px-4 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider hidden lg:table-cell">Email</th>
                        </>
                      )}
                      <th className="py-3 px-4 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider hidden lg:table-cell">Registered</th>
                      <th className="py-3 px-4 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider">Status</th>
                      <th className="py-3 px-4 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((p, i) => {
                      const initials = `${p.first_name[0]}${p.last_name[0]}`.toUpperCase();
                      return (
                        <motion.tr
                          key={p.id}
                          className="border-b border-border/30 last:border-0 hover:bg-accent/30 transition-all duration-200 cursor-pointer group"
                          onClick={() => navigate(`/dashboard/patients/${p.id}`)}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.02 }}
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8 ring-1 ring-border/30">
                                <AvatarFallback className="bg-secondary/10 text-secondary text-[10px] font-semibold">{initials}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-foreground group-hover:text-secondary transition-colors">{p.first_name} {p.last_name}</p>
                                {!isDentistOnly && <p className="text-[10px] text-muted-foreground md:hidden">{p.phone}</p>}
                              </div>
                            </div>
                          </td>
                          {!isDentistOnly && (
                            <>
                              <td className="py-3 px-4 hidden md:table-cell text-muted-foreground" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center gap-2">
                                  <span>{p.phone}</span>
                                  <a href={`tel:${p.phone}`} title="Call" className="text-secondary hover:text-secondary/80">
                                    <Phone className="h-3.5 w-3.5" />
                                  </a>
                                  <a href={`https://wa.me/${p.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" title="WhatsApp" className="text-emerald-600 hover:text-emerald-500">
                                    <MessageCircle className="h-3.5 w-3.5" />
                                  </a>
                                </div>
                              </td>
                              <td className="py-3 px-4 hidden lg:table-cell text-muted-foreground">{p.email}</td>
                            </>
                          )}
                          <td className="py-3 px-4 hidden lg:table-cell text-muted-foreground font-mono text-xs">{p.registered_date}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${p.status === "active" ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "bg-muted text-muted-foreground"}`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${p.status === "active" ? "bg-emerald-500" : "bg-muted-foreground/50"}`} />
                              {p.status}
                            </span>
                          </td>
                          <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="backdrop-blur-xl bg-popover/95">
                                <DropdownMenuItem onClick={() => navigate(`/dashboard/patients/${p.id}`)}>View Profile</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => { setSelectedPatientId(p.id); setBookOpen(true); }}>Book Appointment</DropdownMenuItem>
                                {!isDentistOnly && (
                                  <>
                                    <DropdownMenuItem asChild>
                                      <a href={`tel:${p.phone}`}><Phone className="mr-2 h-3.5 w-3.5" />Call Patient</a>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                      <a href={`https://wa.me/${p.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"><MessageCircle className="mr-2 h-3.5 w-3.5" />WhatsApp</a>
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <AddPatientDialog open={addOpen} onOpenChange={setAddOpen} />
      <BookAppointmentDialog open={bookOpen} onOpenChange={setBookOpen} preselectedPatientId={selectedPatientId} />
    </div>
  );
}
