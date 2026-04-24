import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLdStaff } from "@/hooks/useLabDashboard";
import { toast } from "sonner";
import { UserPlus, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const LAB_ROLES = [
  { value: "lab_manager", label: "Lab Manager" },
  { value: "lab_technician", label: "Lab Technician" },
  { value: "lab_entry_clerk", label: "Lab Entry Clerk" },
];

export default function LdCreateAccountPage() {
  const { roles } = useAuth();
  const isAdmin = roles.includes("admin") || roles.includes("lab_manager");
  const { data: staff = [] } = useLdStaff();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("lab_technician");
  const [ldStaffId, setLdStaffId] = useState("");
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState<{ email: string; role: string } | null>(null);

  const unlinkedStaff = staff.filter((s: any) => !s.user_id && s.status === "active");

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Only admins can create staff accounts.</p>
      </div>
    );
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName) {
      toast.error("Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);

    try {
      // Find matching clinic staff ID by email
      const { data: clinicStaff } = await supabase
        .from("staff")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      const { data, error } = await supabase.functions.invoke("manage-staff-account", {
        body: {
          action: "create",
          email,
          password,
          fullName,
          role,
          ldStaffId: ldStaffId && ldStaffId !== "none" ? ldStaffId : undefined,
          clinicStaffId: clinicStaff?.id || undefined,
        },
      });

      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || "Failed to create account");

      setCreated({ email, role });
      setEmail("");
      setPassword("");
      setFullName("");
      setLdStaffId("");
      toast.success(`Staff account created for ${email}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  const handleStaffSelect = (staffId: string) => {
    setLdStaffId(staffId);
    if (staffId && staffId !== "none") {
      const s = staff.find((st: any) => st.id === staffId);
      if (s) {
        setFullName(s.full_name);
        if (s.email) setEmail(s.email);
      }
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Create Staff Account" description="Create login credentials for lab staff members" />

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" />
                New Staff Account
              </CardTitle>
              <CardDescription>Staff will be able to login immediately with these credentials</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="space-y-4">
                {unlinkedStaff.length > 0 && (
                  <div>
                    <Label>Link to Existing Staff (Optional)</Label>
                    <Select value={ldStaffId} onValueChange={handleStaffSelect}>
                      <SelectTrigger><SelectValue placeholder="Select staff member..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">— Don't link —</SelectItem>
                        {unlinkedStaff.map((s: any) => (
                          <SelectItem key={s.id} value={s.id}>{s.full_name} ({s.role})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Links this login to their staff profile for performance/salary tracking</p>
                  </div>
                )}
                <div>
                  <Label>Full Name *</Label>
                  <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g. John Doe" required />
                </div>
                <div>
                  <Label>Email *</Label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="staff@lab.com" required />
                </div>
                <div>
                  <Label>Password *</Label>
                  <Input type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters" required minLength={6} />
                  <p className="text-[10px] text-muted-foreground mt-0.5">Password is visible so you can share it with the staff member</p>
                </div>
                <div>
                  <Label>Role</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {LAB_ROLES.map((r) => (
                        <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating..." : "Create Account"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {created && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="border-emerald-500/30 bg-emerald-500/5">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                  <h3 className="font-semibold text-emerald-700">Account Created!</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium">{created.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Role:</span>
                    <Badge variant="outline">{created.role.replace("_", " ")}</Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  The staff member can now sign in at the Lab Login page using these credentials.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
