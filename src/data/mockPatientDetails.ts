// Extended patient details for profile views

export interface PatientDetail {
  id: string;
  name: string;
  phone: string;
  email: string;
  gender: "Male" | "Female";
  age: number;
  dateOfBirth: string;
  address: string;
  bloodGroup: string;
  emergencyContact: { name: string; phone: string; relationship: string };
  medicalHistory: string;
  allergies: string[];
  referralSource: string;
  registeredDate: string;
  status: "active" | "inactive";
  balance: number;
}

export interface VisitRecord {
  id: string;
  date: string;
  treatment: string;
  dentist: string;
  notes: string;
  cost: number;
}

export interface TreatmentPlan {
  id: string;
  name: string;
  status: "active" | "completed" | "planned";
  procedures: { name: string; status: "done" | "pending"; date?: string }[];
  totalCost: number;
  paidAmount: number;
  startDate: string;
  estimatedEnd: string;
}

export interface PatientInvoice {
  id: string;
  date: string;
  treatment: string;
  amount: number;
  paid: number;
  status: "paid" | "pending" | "partial";
  paymentMethod?: string;
}

export interface PatientPrescription {
  id: string;
  date: string;
  dentist: string;
  medications: { name: string; dosage: string; duration: string }[];
}

// Detailed data for PAT-003 (Chinedu Obi) as example
export const patientDetails: Record<string, PatientDetail> = {
  "PAT-001": {
    id: "PAT-001", name: "Adewale Johnson", phone: "0801-234-5678", email: "adewale@email.com",
    gender: "Male", age: 34, dateOfBirth: "1992-03-15", address: "12 Adeniyi Jones Ave, Ikeja, Lagos",
    bloodGroup: "O+", emergencyContact: { name: "Bukola Johnson", phone: "0801-999-0000", relationship: "Wife" },
    medicalHistory: "No significant medical history", allergies: ["Penicillin"], referralSource: "Google Search",
    registeredDate: "2024-06-10", status: "active", balance: 0,
  },
  "PAT-002": {
    id: "PAT-002", name: "Fatima Bello", phone: "0802-345-6789", email: "fatima@email.com",
    gender: "Female", age: 28, dateOfBirth: "1998-07-22", address: "5 Bode Thomas St, Surulere, Lagos",
    bloodGroup: "A+", emergencyContact: { name: "Ahmed Bello", phone: "0802-888-1111", relationship: "Brother" },
    medicalHistory: "Asthma - uses inhaler", allergies: [], referralSource: "Friend Referral",
    registeredDate: "2025-01-05", status: "active", balance: 15000,
  },
  "PAT-003": {
    id: "PAT-003", name: "Chinedu Obi", phone: "0803-456-7890", email: "chinedu@email.com",
    gender: "Male", age: 45, dateOfBirth: "1981-11-03", address: "8 Allen Avenue, Ikeja, Lagos",
    bloodGroup: "B+", emergencyContact: { name: "Ngozi Obi", phone: "0803-777-2222", relationship: "Wife" },
    medicalHistory: "Hypertension - on Amlodipine 5mg. Type 2 Diabetes - on Metformin 500mg",
    allergies: ["Latex"], referralSource: "Walk-in",
    registeredDate: "2023-09-20", status: "active", balance: 85000,
  },
  "PAT-004": {
    id: "PAT-004", name: "Amina Yusuf", phone: "0804-567-8901", email: "amina@email.com",
    gender: "Female", age: 22, dateOfBirth: "2004-01-30", address: "15 Toyin St, Ikeja, Lagos",
    bloodGroup: "AB+", emergencyContact: { name: "Halima Yusuf", phone: "0804-666-3333", relationship: "Mother" },
    medicalHistory: "No significant medical history", allergies: [], referralSource: "Instagram",
    registeredDate: "2025-08-12", status: "active", balance: 0,
  },
  "PAT-005": {
    id: "PAT-005", name: "Oluwaseun Ade", phone: "0805-678-9012", email: "seun@email.com",
    gender: "Male", age: 38, dateOfBirth: "1988-05-18", address: "22 Opebi Rd, Ikeja, Lagos",
    bloodGroup: "O-", emergencyContact: { name: "Yemisi Ade", phone: "0805-555-4444", relationship: "Sister" },
    medicalHistory: "Epilepsy - on Carbamazepine", allergies: ["Aspirin", "Ibuprofen"], referralSource: "Referral from Dr. Okonkwo",
    registeredDate: "2024-11-01", status: "active", balance: 25000,
  },
};

export const patientVisits: Record<string, VisitRecord[]> = {
  "PAT-003": [
    { id: "V-001", date: "2026-02-10", treatment: "Dental Filling (Composite)", dentist: "Dr. Okonkwo", notes: "Class II composite on #26", cost: 25000 },
    { id: "V-002", date: "2026-01-15", treatment: "Scaling & Polishing", dentist: "Dr. Adeyemi", notes: "Routine cleaning. Mild gingivitis noted", cost: 15000 },
    { id: "V-003", date: "2025-12-10", treatment: "PFM Crown (#16)", dentist: "Dr. Okonkwo", notes: "Crown cemented, good fit and bite", cost: 80000 },
    { id: "V-004", date: "2025-11-20", treatment: "Extraction (#36)", dentist: "Dr. Nwosu", notes: "Surgical extraction of impacted wisdom tooth", cost: 45000 },
    { id: "V-005", date: "2025-10-05", treatment: "Consultation", dentist: "Dr. Okonkwo", notes: "Full mouth examination, X-ray taken", cost: 10000 },
  ],
  "PAT-001": [
    { id: "V-006", date: "2026-02-10", treatment: "Root Canal", dentist: "Dr. Okonkwo", notes: "Completed RCT on #24", cost: 80000 },
    { id: "V-007", date: "2026-01-20", treatment: "Consultation", dentist: "Dr. Okonkwo", notes: "Toothache complaint, X-ray taken", cost: 10000 },
  ],
};

export const patientTreatmentPlans: Record<string, TreatmentPlan[]> = {
  "PAT-003": [
    {
      id: "TP-001", name: "Full Mouth Rehabilitation", status: "active",
      procedures: [
        { name: "Scaling & Polishing", status: "done", date: "2026-01-15" },
        { name: "Composite Filling #26", status: "done", date: "2026-02-10" },
        { name: "Root Canal #45", status: "pending" },
        { name: "Crown #45", status: "pending" },
      ],
      totalCost: 200000, paidAmount: 115000, startDate: "2025-10-05", estimatedEnd: "2026-04-30",
    },
  ],
};

export const patientInvoices: Record<string, PatientInvoice[]> = {
  "PAT-003": [
    { id: "INV-2026-041", date: "2026-02-10", treatment: "Dental Filling", amount: 25000, paid: 0, status: "pending" },
    { id: "INV-2026-030", date: "2026-01-15", treatment: "Scaling & Polishing", amount: 15000, paid: 15000, status: "paid", paymentMethod: "Card" },
    { id: "INV-2025-098", date: "2025-12-10", treatment: "PFM Crown #16", amount: 80000, paid: 80000, status: "paid", paymentMethod: "Transfer" },
    { id: "INV-2025-085", date: "2025-11-20", treatment: "Extraction #36", amount: 45000, paid: 20000, status: "partial", paymentMethod: "Cash" },
  ],
};

export const patientPrescriptions: Record<string, PatientPrescription[]> = {
  "PAT-003": [
    {
      id: "RX-001", date: "2026-02-10", dentist: "Dr. Okonkwo",
      medications: [
        { name: "Amoxicillin 500mg", dosage: "1 cap 3x daily", duration: "7 days" },
        { name: "Ibuprofen 400mg", dosage: "1 tab 2x daily after meals", duration: "5 days" },
      ],
    },
    {
      id: "RX-005", date: "2025-11-20", dentist: "Dr. Nwosu",
      medications: [
        { name: "Amoxicillin 500mg", dosage: "1 cap 3x daily", duration: "5 days" },
        { name: "Metronidazole 400mg", dosage: "1 tab 3x daily", duration: "5 days" },
        { name: "Paracetamol 500mg", dosage: "1-2 tabs as needed", duration: "3 days" },
      ],
    },
  ],
};
