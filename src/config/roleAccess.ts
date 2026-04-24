import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

// Maps each dashboard path to the roles that can access it
export const PAGE_ROLE_ACCESS: Record<string, AppRole[]> = {
  "/dashboard": ["admin", "dentist", "receptionist", "hygienist", "assistant", "accountant"],
  "/dashboard/patients": ["admin", "dentist", "receptionist", "hygienist", "assistant"],
  "/dashboard/appointments": ["admin", "dentist", "receptionist", "hygienist", "assistant"],
  "/dashboard/dental-charts": ["admin", "dentist", "hygienist"],
  "/dashboard/treatments": ["admin", "dentist"],
  "/dashboard/prescriptions": ["admin", "dentist"],
  "/dashboard/billing": ["admin", "dentist", "receptionist", "accountant"],
  "/dashboard/reports": ["admin", "accountant"],
  "/dashboard/revenue-allocation": ["admin"],
  "/dashboard/lab-work": ["admin", "dentist", "hygienist", "assistant", "receptionist"],
  "/dashboard/lab": ["admin", "lab_technician", "receptionist"],
  "/dashboard/lab/cases": ["admin", "lab_technician", "receptionist"],
  "/dashboard/lab/clients": ["admin", "lab_technician"],
  "/dashboard/lab/technicians": ["admin", "lab_technician"],
  "/dashboard/lab/billing": ["admin", "lab_technician"],
  "/dashboard/lab/settings": ["admin"],
  "/dashboard/staff": ["admin"],
  "/dashboard/inventory": ["admin", "accountant"],
  "/dashboard/notifications": ["admin", "dentist", "receptionist", "hygienist", "assistant", "accountant"],
  "/dashboard/settings": ["admin", "dentist", "receptionist", "hygienist", "assistant", "accountant"],
  "/dashboard/profile": ["admin", "dentist", "receptionist", "hygienist", "assistant", "accountant"],
  "/dashboard/tutorials": ["admin", "dentist", "receptionist", "hygienist", "assistant", "accountant"],
  "/dashboard/messages": ["admin", "dentist", "receptionist", "hygienist", "assistant", "accountant", "lab_technician"],
  // New feature pages
  "/dashboard/reviews": ["admin", "receptionist"],
  "/dashboard/expenses": ["admin", "accountant"],
  "/dashboard/audit-log": ["admin"],
  "/dashboard/consent-forms": ["admin", "dentist"],
  "/dashboard/documents": ["admin"],
  "/dashboard/shop/products": ["admin", "receptionist"],
  "/dashboard/shop/orders": ["admin", "receptionist"],
  "/dashboard/marketing/whatsapp": ["admin"],
  "/dashboard/marketing/email": ["admin"],
  // Website Editor
  "/dashboard/website/home": ["admin"],
  "/dashboard/website/about": ["admin"],
  "/dashboard/website/services": ["admin"],
  "/dashboard/website/contact": ["admin"],
  "/dashboard/website/promotions": ["admin"],
  "/dashboard/website/testimonials": ["admin"],
  "/dashboard/website/faqs": ["admin"],
  "/dashboard/website/gallery": ["admin"],
  "/dashboard/website/team": ["admin"],
  "/dashboard/website/header-footer": ["admin"],
  "/dashboard/website/seo": ["admin"],
  "/dashboard/website/content": ["admin"],
  // Lab Dashboard (standalone)
  "/lab-dashboard": ["admin", "lab_manager", "lab_technician", "lab_entry_clerk"],
  "/lab-dashboard/cases": ["admin", "lab_manager", "lab_technician", "lab_entry_clerk"],
  "/lab-dashboard/calendar": ["admin"],
  "/lab-dashboard/shades": ["admin", "lab_manager", "lab_technician", "lab_entry_clerk"],
  "/lab-dashboard/work-types": ["admin"],
  "/lab-dashboard/warranties": ["admin"],
  "/lab-dashboard/staff": ["admin"],
  "/lab-dashboard/skills": ["admin"],
  "/lab-dashboard/equipment": ["admin", "lab_manager", "lab_technician", "lab_entry_clerk"],
  "/lab-dashboard/expenses": ["admin"],
  "/lab-dashboard/prices": ["admin"],
  "/lab-dashboard/credit-notes": ["admin"],
  "/lab-dashboard/statements": ["admin"],
  "/lab-dashboard/analytics": ["admin"],
  "/lab-dashboard/reports": ["admin"],
  "/lab-dashboard/communications": ["admin"],
  "/lab-dashboard/notifications": ["admin", "lab_manager", "lab_technician", "lab_entry_clerk"],
  "/lab-dashboard/audit-log": ["admin"],
  "/lab-dashboard/settings": ["admin"],
  // Admin-only lab pages
  "/lab-dashboard/recurring": ["admin"],
  "/lab-dashboard/clients": ["admin"],
  "/lab-dashboard/external-labs": ["admin"],
  "/lab-dashboard/external-lab-payments": ["admin"],
  "/lab-dashboard/shipments": ["admin"],
  "/lab-dashboard/dispatch": ["admin", "lab_manager", "lab_technician", "lab_entry_clerk"],
  "/lab-dashboard/performance": ["admin", "lab_manager", "lab_technician", "lab_entry_clerk"],
  "/lab-dashboard/salary": ["admin"],
  "/lab-dashboard/create-account": ["admin"],
  "/lab-dashboard/inventory": ["admin", "lab_manager", "lab_technician", "lab_entry_clerk"],
  "/lab-dashboard/invoices": ["admin"],
  "/lab-dashboard/payments": ["admin"],
};

// Check if user has access to a given path
export function hasPageAccess(roles: string[], path: string): boolean {
  // Admin always has access
  if (roles.includes("admin")) return true;

  // For patient profile paths like /dashboard/patients/:id
  if (path.startsWith("/dashboard/patients/")) {
    return PAGE_ROLE_ACCESS["/dashboard/patients"]?.some((r) => roles.includes(r)) ?? false;
  }

  const allowed = PAGE_ROLE_ACCESS[path];
  if (!allowed) return true; // Unknown paths default to accessible
  return allowed.some((r) => roles.includes(r));
}

// Get display label for a role
export function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    admin: "Admin",
    dentist: "Dentist",
    receptionist: "Receptionist",
    hygienist: "Hygienist",
    assistant: "Assistant",
    accountant: "Accountant",
    lab_manager: "Lab Manager",
    lab_technician: "Lab Technician",
    lab_entry_clerk: "Lab Entry Clerk",
  };
  return labels[role] || role;
}
