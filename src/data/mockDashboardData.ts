// Mock data for dashboard - will be replaced with Supabase queries later

export const dashboardStats = {
  totalPatients: 1248,
  todayAppointments: 18,
  pendingPayments: 32,
  monthlyRevenue: 4850000, // in Naira
};

export const weeklyAppointments = [
  { day: "Mon", count: 14 },
  { day: "Tue", count: 18 },
  { day: "Wed", count: 12 },
  { day: "Thu", count: 22 },
  { day: "Fri", count: 16 },
  { day: "Sat", count: 8 },
  { day: "Sun", count: 0 },
];

export const revenueData = [
  { month: "Sep", revenue: 3200000 },
  { month: "Oct", revenue: 3800000 },
  { month: "Nov", revenue: 4100000 },
  { month: "Dec", revenue: 3600000 },
  { month: "Jan", revenue: 4500000 },
  { month: "Feb", revenue: 4850000 },
];

export interface Appointment {
  id: string;
  patientName: string;
  dentist: string;
  time: string;
  chair: string;
  treatment: string;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
}

export const todayAppointments: Appointment[] = [
  { id: "APT-001", patientName: "Adewale Johnson", dentist: "Dr. Okonkwo", time: "09:00 AM", chair: "Chair 1", treatment: "Root Canal", status: "completed" },
  { id: "APT-002", patientName: "Fatima Bello", dentist: "Dr. Adeyemi", time: "09:30 AM", chair: "Chair 2", treatment: "Teeth Cleaning", status: "completed" },
  { id: "APT-003", patientName: "Chinedu Obi", dentist: "Dr. Okonkwo", time: "10:00 AM", chair: "Chair 1", treatment: "Dental Filling", status: "in-progress" },
  { id: "APT-004", patientName: "Amina Yusuf", dentist: "Dr. Nwosu", time: "10:30 AM", chair: "Chair 3", treatment: "Orthodontic Check", status: "scheduled" },
  { id: "APT-005", patientName: "Oluwaseun Ade", dentist: "Dr. Adeyemi", time: "11:00 AM", chair: "Chair 2", treatment: "Tooth Extraction", status: "scheduled" },
  { id: "APT-006", patientName: "Grace Okafor", dentist: "Dr. Okonkwo", time: "11:30 AM", chair: "Chair 1", treatment: "Veneer Fitting", status: "scheduled" },
  { id: "APT-007", patientName: "Ibrahim Musa", dentist: "Dr. Nwosu", time: "12:00 PM", chair: "Chair 3", treatment: "Teeth Whitening", status: "scheduled" },
  { id: "APT-008", patientName: "Ngozi Eze", dentist: "Dr. Adeyemi", time: "01:00 PM", chair: "Chair 2", treatment: "Crown Placement", status: "scheduled" },
];

// Multi-day appointment data for calendar navigation
export const appointmentsByDate: Record<string, Appointment[]> = {
  "2026-02-10": [
    { id: "APT-001", patientName: "Adewale Johnson", dentist: "Dr. Okonkwo", time: "09:00 AM", chair: "Chair 1", treatment: "Root Canal", status: "completed" },
    { id: "APT-002", patientName: "Fatima Bello", dentist: "Dr. Adeyemi", time: "09:30 AM", chair: "Chair 2", treatment: "Teeth Cleaning", status: "completed" },
    { id: "APT-003", patientName: "Chinedu Obi", dentist: "Dr. Okonkwo", time: "10:00 AM", chair: "Chair 1", treatment: "Dental Filling", status: "in-progress" },
    { id: "APT-004", patientName: "Amina Yusuf", dentist: "Dr. Nwosu", time: "10:30 AM", chair: "Chair 3", treatment: "Orthodontic Check", status: "scheduled" },
    { id: "APT-005", patientName: "Oluwaseun Ade", dentist: "Dr. Adeyemi", time: "11:00 AM", chair: "Chair 2", treatment: "Tooth Extraction", status: "scheduled" },
    { id: "APT-006", patientName: "Grace Okafor", dentist: "Dr. Okonkwo", time: "11:30 AM", chair: "Chair 1", treatment: "Veneer Fitting", status: "scheduled" },
    { id: "APT-007", patientName: "Ibrahim Musa", dentist: "Dr. Nwosu", time: "12:00 PM", chair: "Chair 3", treatment: "Teeth Whitening", status: "scheduled" },
    { id: "APT-008", patientName: "Ngozi Eze", dentist: "Dr. Adeyemi", time: "01:00 PM", chair: "Chair 2", treatment: "Crown Placement", status: "scheduled" },
  ],
  "2026-02-11": [
    { id: "APT-009", patientName: "Blessing Nnamdi", dentist: "Dr. Okonkwo", time: "09:00 AM", chair: "Chair 1", treatment: "Teeth Whitening", status: "scheduled" },
    { id: "APT-010", patientName: "Tunde Bakare", dentist: "Dr. Adeyemi", time: "10:00 AM", chair: "Chair 2", treatment: "Root Canal", status: "scheduled" },
    { id: "APT-011", patientName: "Fatima Bello", dentist: "Dr. Nwosu", time: "11:00 AM", chair: "Chair 3", treatment: "Orthodontic Check", status: "scheduled" },
    { id: "APT-012", patientName: "Adewale Johnson", dentist: "Dr. Okonkwo", time: "02:00 PM", chair: "Chair 1", treatment: "Follow-up", status: "scheduled" },
  ],
  "2026-02-12": [
    { id: "APT-013", patientName: "Grace Okafor", dentist: "Dr. Adeyemi", time: "09:30 AM", chair: "Chair 2", treatment: "Dental Filling", status: "scheduled" },
    { id: "APT-014", patientName: "Chinedu Obi", dentist: "Dr. Okonkwo", time: "10:30 AM", chair: "Chair 1", treatment: "Crown Fitting", status: "scheduled" },
    { id: "APT-015", patientName: "Ngozi Eze", dentist: "Dr. Nwosu", time: "01:30 PM", chair: "Chair 3", treatment: "Follow-up", status: "scheduled" },
  ],
  "2026-02-09": [
    { id: "APT-016", patientName: "Oluwaseun Ade", dentist: "Dr. Okonkwo", time: "09:00 AM", chair: "Chair 1", treatment: "Scaling & Polishing", status: "completed" },
    { id: "APT-017", patientName: "Amina Yusuf", dentist: "Dr. Adeyemi", time: "10:00 AM", chair: "Chair 2", treatment: "Consultation", status: "completed" },
    { id: "APT-018", patientName: "Ibrahim Musa", dentist: "Dr. Nwosu", time: "11:30 AM", chair: "Chair 3", treatment: "Denture Adjustment", status: "completed" },
  ],
};

export interface RecentActivity {
  id: string;
  action: string;
  subject: string;
  time: string;
  type: "appointment" | "payment" | "patient" | "lab" | "prescription";
}

export const recentActivities: RecentActivity[] = [
  { id: "1", action: "New appointment booked", subject: "Amina Yusuf - Orthodontic Check", time: "2 min ago", type: "appointment" },
  { id: "2", action: "Payment received", subject: "₦45,000 from Adewale Johnson", time: "15 min ago", type: "payment" },
  { id: "3", action: "New patient registered", subject: "Grace Okafor - Walk-in", time: "30 min ago", type: "patient" },
  { id: "4", action: "Lab result received", subject: "Crown for Ngozi Eze", time: "1 hour ago", type: "lab" },
  { id: "5", action: "Prescription created", subject: "Antibiotics for Chinedu Obi", time: "1.5 hours ago", type: "prescription" },
  { id: "6", action: "Appointment completed", subject: "Fatima Bello - Teeth Cleaning", time: "2 hours ago", type: "appointment" },
];

export interface Patient {
  id: string;
  name: string;
  phone: string;
  email: string;
  gender: "Male" | "Female";
  age: number;
  lastVisit: string;
  nextAppointment: string | null;
  status: "active" | "inactive";
  balance: number;
}

export const patients: Patient[] = [
  { id: "PAT-001", name: "Adewale Johnson", phone: "0801-234-5678", email: "adewale@email.com", gender: "Male", age: 34, lastVisit: "2026-02-10", nextAppointment: "2026-02-24", status: "active", balance: 0 },
  { id: "PAT-002", name: "Fatima Bello", phone: "0802-345-6789", email: "fatima@email.com", gender: "Female", age: 28, lastVisit: "2026-02-10", nextAppointment: null, status: "active", balance: 15000 },
  { id: "PAT-003", name: "Chinedu Obi", phone: "0803-456-7890", email: "chinedu@email.com", gender: "Male", age: 45, lastVisit: "2026-02-10", nextAppointment: "2026-02-17", status: "active", balance: 85000 },
  { id: "PAT-004", name: "Amina Yusuf", phone: "0804-567-8901", email: "amina@email.com", gender: "Female", age: 22, lastVisit: "2026-01-28", nextAppointment: "2026-02-10", status: "active", balance: 0 },
  { id: "PAT-005", name: "Oluwaseun Ade", phone: "0805-678-9012", email: "seun@email.com", gender: "Male", age: 38, lastVisit: "2026-02-05", nextAppointment: "2026-02-10", status: "active", balance: 25000 },
  { id: "PAT-006", name: "Grace Okafor", phone: "0806-789-0123", email: "grace@email.com", gender: "Female", age: 31, lastVisit: "2026-02-08", nextAppointment: "2026-02-15", status: "active", balance: 0 },
  { id: "PAT-007", name: "Ibrahim Musa", phone: "0807-890-1234", email: "ibrahim@email.com", gender: "Male", age: 52, lastVisit: "2026-01-15", nextAppointment: null, status: "inactive", balance: 120000 },
  { id: "PAT-008", name: "Ngozi Eze", phone: "0808-901-2345", email: "ngozi@email.com", gender: "Female", age: 29, lastVisit: "2026-02-09", nextAppointment: "2026-02-14", status: "active", balance: 45000 },
  { id: "PAT-009", name: "Tunde Bakare", phone: "0809-012-3456", email: "tunde@email.com", gender: "Male", age: 41, lastVisit: "2025-12-20", nextAppointment: null, status: "inactive", balance: 0 },
  { id: "PAT-010", name: "Blessing Nnamdi", phone: "0810-123-4567", email: "blessing@email.com", gender: "Female", age: 26, lastVisit: "2026-02-07", nextAppointment: "2026-02-21", status: "active", balance: 35000 },
];

export interface StaffMember {
  id: string;
  name: string;
  role: "dentist" | "assistant" | "hygienist" | "receptionist" | "accountant";
  specialty?: string;
  phone: string;
  email: string;
  status: "active" | "inactive";
  avatar?: string;
}

export const staff: StaffMember[] = [
  { id: "STF-001", name: "Dr. Emeka Okonkwo", role: "dentist", specialty: "General Dentistry", phone: "0701-111-2222", email: "okonkwo@vista.com", status: "active" },
  { id: "STF-002", name: "Dr. Funmi Adeyemi", role: "dentist", specialty: "Orthodontics", phone: "0702-222-3333", email: "adeyemi@vista.com", status: "active" },
  { id: "STF-003", name: "Dr. Chioma Nwosu", role: "dentist", specialty: "Periodontics", phone: "0703-333-4444", email: "nwosu@vista.com", status: "active" },
  { id: "STF-004", name: "Aisha Lawal", role: "assistant", phone: "0704-444-5555", email: "aisha@vista.com", status: "active" },
  { id: "STF-005", name: "Kemi Ogundimu", role: "hygienist", phone: "0705-555-6666", email: "kemi@vista.com", status: "active" },
  { id: "STF-006", name: "Mary Adebayo", role: "receptionist", phone: "0706-666-7777", email: "mary@vista.com", status: "active" },
  { id: "STF-007", name: "Femi Olatunde", role: "accountant", phone: "0707-777-8888", email: "femi@vista.com", status: "active" },
];

export interface Treatment {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: string;
  description: string;
}

export const treatments: Treatment[] = [
  { id: "TRT-001", name: "Teeth Cleaning (Scaling & Polishing)", category: "Preventive", price: 15000, duration: "30 min", description: "Professional cleaning to remove plaque and tartar" },
  { id: "TRT-002", name: "Dental Filling (Composite)", category: "Restorative", price: 25000, duration: "45 min", description: "Tooth-colored filling for cavities" },
  { id: "TRT-003", name: "Root Canal Treatment", category: "Endodontics", price: 80000, duration: "90 min", description: "Treatment of infected tooth pulp" },
  { id: "TRT-004", name: "Tooth Extraction (Simple)", category: "Surgery", price: 15000, duration: "30 min", description: "Simple tooth removal" },
  { id: "TRT-005", name: "Tooth Extraction (Surgical)", category: "Surgery", price: 45000, duration: "60 min", description: "Surgical removal of impacted teeth" },
  { id: "TRT-006", name: "Teeth Whitening", category: "Cosmetic", price: 50000, duration: "60 min", description: "Professional teeth whitening treatment" },
  { id: "TRT-007", name: "Dental Crown (PFM)", category: "Prosthodontics", price: 80000, duration: "2 visits", description: "Porcelain-fused-to-metal crown" },
  { id: "TRT-008", name: "Dental Bridge (3-unit)", category: "Prosthodontics", price: 200000, duration: "2 visits", description: "Fixed bridge to replace missing teeth" },
  { id: "TRT-009", name: "Braces (Metal)", category: "Orthodontics", price: 350000, duration: "18-24 months", description: "Traditional metal braces for alignment" },
  { id: "TRT-010", name: "Dental Implant (Single)", category: "Implantology", price: 500000, duration: "3-6 months", description: "Titanium implant with crown" },
  { id: "TRT-011", name: "Veneer (Porcelain)", category: "Cosmetic", price: 120000, duration: "2 visits", description: "Custom porcelain veneer" },
  { id: "TRT-012", name: "Complete Denture", category: "Prosthodontics", price: 150000, duration: "3-4 visits", description: "Full upper or lower denture" },
];

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minStock: number;
  unit: string;
  supplier: string;
  lastRestocked: string;
}

export const inventory: InventoryItem[] = [
  { id: "INV-001", name: "Latex Gloves (Box)", category: "Consumables", quantity: 45, minStock: 20, unit: "boxes", supplier: "MedSupply NG", lastRestocked: "2026-02-01" },
  { id: "INV-002", name: "Composite Resin (A2)", category: "Materials", quantity: 8, minStock: 5, unit: "syringes", supplier: "DentMart", lastRestocked: "2026-01-28" },
  { id: "INV-003", name: "Anesthetic Cartridges", category: "Medication", quantity: 3, minStock: 10, unit: "boxes", supplier: "PharmaDent", lastRestocked: "2026-01-15" },
  { id: "INV-004", name: "Disposable Masks", category: "Consumables", quantity: 60, minStock: 30, unit: "boxes", supplier: "MedSupply NG", lastRestocked: "2026-02-05" },
  { id: "INV-005", name: "Scaling Tips", category: "Instruments", quantity: 12, minStock: 6, unit: "pcs", supplier: "DentMart", lastRestocked: "2026-01-20" },
  { id: "INV-006", name: "Impression Material", category: "Materials", quantity: 4, minStock: 3, unit: "kits", supplier: "DentMart", lastRestocked: "2026-02-03" },
  { id: "INV-007", name: "Sterilization Pouches", category: "Consumables", quantity: 25, minStock: 15, unit: "boxes", supplier: "MedSupply NG", lastRestocked: "2026-01-30" },
  { id: "INV-008", name: "Dental Cement (GIC)", category: "Materials", quantity: 2, minStock: 4, unit: "bottles", supplier: "PharmaDent", lastRestocked: "2026-01-10" },
];

export interface LabOrder {
  id: string;
  patientName: string;
  type: string;
  lab: string;
  dentist: string;
  sentDate: string;
  dueDate: string;
  status: "sent" | "in-progress" | "received";
}

export const labOrders: LabOrder[] = [
  { id: "LAB-001", patientName: "Ngozi Eze", type: "PFM Crown (#14)", lab: "Lagos Dental Lab", dentist: "Dr. Okonkwo", sentDate: "2026-02-05", dueDate: "2026-02-12", status: "received" },
  { id: "LAB-002", patientName: "Adewale Johnson", type: "3-Unit Bridge (#35-37)", lab: "Precision Dental", dentist: "Dr. Adeyemi", sentDate: "2026-02-07", dueDate: "2026-02-14", status: "in-progress" },
  { id: "LAB-003", patientName: "Ibrahim Musa", type: "Complete Upper Denture", lab: "Lagos Dental Lab", dentist: "Dr. Nwosu", sentDate: "2026-02-08", dueDate: "2026-02-18", status: "in-progress" },
  { id: "LAB-004", patientName: "Blessing Nnamdi", type: "Porcelain Veneer x4", lab: "Precision Dental", dentist: "Dr. Okonkwo", sentDate: "2026-02-09", dueDate: "2026-02-16", status: "sent" },
];
