import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, FlaskConical } from "lucide-react";

export default function LabLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    } else if (data.user) {
      const { data: rolesData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id);

      const roles = (rolesData ?? []).map((r: any) => r.role);
      const hasLabAccess = roles.includes("lab_manager") || roles.includes("lab_technician") || roles.includes("lab_entry_clerk") || roles.includes("admin");

      if (!hasLabAccess) {
        await supabase.auth.signOut();
        toast({
          title: "Access denied",
          description: "You don't have lab dashboard access. Contact your administrator to get a lab account.",
          variant: "destructive",
        });
      } else {
        navigate("/lab-dashboard");
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background px-4">
      <Card className="w-full max-w-md border-primary/20">
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <FlaskConical className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl text-primary">Impression n Teeth</CardTitle>
          <CardDescription>Sign in to the Lab Management System</CardDescription>
          <p className="text-xs text-muted-foreground">Lab staff accounts are created by your administrator. Use your assigned lab credentials to sign in.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="lab-email">Email</Label>
              <Input
                id="lab-email"
                type="email"
                placeholder="you@lab.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lab-password">Password</Label>
              <div className="relative">
                <Input
                  id="lab-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In to Lab"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Lab accounts are created by your administrator.<br />
            Each staff member gets their own login credentials.
          </div>
          <div className="mt-2 text-center">
            <Link to="/login" className="text-xs text-muted-foreground hover:text-foreground">
              ← Clinic staff login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
