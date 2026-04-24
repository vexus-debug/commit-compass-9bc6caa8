export interface TutorialStep {
  title: string;
  description: string;
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  icon: string;
  steps: TutorialStep[];
  roles: string[];
  pageLink?: string;
}

export const tutorials: Tutorial[] = [
  // === GENERAL (all roles) ===
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Learn the basics of navigating the clinic management system.",
    icon: "rocket",
    roles: ["admin", "dentist", "receptionist", "hygienist", "assistant", "accountant"],
    steps: [
      { title: "Log in to your account", description: "Use your email and password to sign in at the login page. If you don't have an account, ask an admin to create one for you." },
      { title: "Explore the sidebar", description: "The left sidebar contains all the pages you have access to based on your role. Click any item to navigate." },
      { title: "Update your profile", description: "Click your avatar at the bottom of the sidebar to access your profile. Add your photo and update your details." },
      { title: "Check notifications", description: "The bell icon shows unread notifications. Stay on top of new appointments, lab results, and more." },
    ],
  },
  {
    id: "my-profile",
    title: "Managing Your Profile",
    description: "Keep your personal information and preferences up to date.",
    icon: "user",
    roles: ["admin", "dentist", "receptionist", "hygienist", "assistant", "accountant"],
    pageLink: "/dashboard/profile",
    steps: [
      { title: "Navigate to your profile", description: "Click your avatar at the bottom-left of the sidebar, or go to the Profile page." },
      { title: "Edit your details", description: "Update your full name, phone number, and other personal information." },
      { title: "Upload a profile photo", description: "Click the avatar area to upload a professional photo that will appear across the system." },
      { title: "Save changes", description: "Always click 'Save' after making changes to ensure they persist." },
    ],
  },
  {
    id: "register-patient",
    title: "Registering a New Patient",
    description: "Step-by-step guide to adding a new patient to the system.",
    icon: "user-plus",
    roles: ["admin", "receptionist"],
    pageLink: "/dashboard/patients",
    steps: [
      { title: "Go to Patients page", description: "Navigate to the Patients page from the sidebar under 'General'." },
      { title: "Click 'Add Patient'", description: "Click the 'Add Patient' button at the top-right of the page." },
      { title: "Fill in patient details", description: "Enter the patient's full name, phone number, email, date of birth, gender, and address." },
      { title: "Add medical history (optional)", description: "Note any allergies, existing conditions, or medications the patient is currently on." },
      { title: "Save the record", description: "Click 'Save' to create the patient record. They'll now appear in the patient list." },
    ],
  },
  {
    id: "book-appointment",
    title: "Booking an Appointment",
    description: "How to schedule appointments for patients.",
    icon: "calendar-plus",
    roles: ["admin", "receptionist", "dentist"],
    pageLink: "/dashboard/appointments",
    steps: [
      { title: "Go to Appointments", description: "Navigate to the Appointments page from the sidebar." },
      { title: "Click 'Book Appointment'", description: "Click the booking button to open the appointment form." },
      { title: "Select a patient", description: "Search for and select the patient from the dropdown list." },
      { title: "Choose date, time & dentist", description: "Pick an available date and time slot, and assign the appropriate dentist." },
      { title: "Select treatment type", description: "Choose the type of treatment or reason for the visit." },
      { title: "Confirm the booking", description: "Review the details and click 'Book' to confirm. The patient and dentist will be notified." },
    ],
  },
  {
    id: "walk-in-patients",
    title: "Handling Walk-In Patients",
    description: "Quick-register walk-in patients and slot them into the schedule.",
    icon: "footprints",
    roles: ["admin", "receptionist"],
    pageLink: "/dashboard/appointments",
    steps: [
      { title: "Open Walk-In dialog", description: "On the Appointments page, click the 'Walk-In' button." },
      { title: "Register or select patient", description: "If the patient is new, quickly register them. Otherwise, search for the existing patient." },
      { title: "Assign to next available slot", description: "The system suggests the next available time slot and chair." },
      { title: "Confirm walk-in", description: "Confirm the entry. The appointment appears immediately on the schedule." },
    ],
  },
  {
    id: "dental-charting",
    title: "Using Dental Charts",
    description: "Record dental findings and treatment plans on the interactive chart.",
    icon: "stethoscope",
    roles: ["admin", "dentist", "hygienist"],
    pageLink: "/dashboard/dental-charts",
    steps: [
      { title: "Open Dental Charts", description: "Navigate to 'Dental Charts' in the Clinical section of the sidebar." },
      { title: "Select a patient", description: "Search and select the patient whose chart you want to view or update." },
      { title: "Record findings", description: "Click on individual teeth to add conditions like cavities, crowns, missing teeth, etc." },
      { title: "Add treatment notes", description: "Document treatment performed and any notes for future reference." },
      { title: "Save the chart", description: "Click 'Save' to store the updated chart. It becomes part of the patient's permanent record." },
    ],
  },
  {
    id: "treatments",
    title: "Managing Treatments",
    description: "Track and document all treatments performed on patients.",
    icon: "activity",
    roles: ["admin", "dentist"],
    pageLink: "/dashboard/treatments",
    steps: [
      { title: "Go to Treatments", description: "Navigate to the Treatments page under 'Clinical' in the sidebar." },
      { title: "Add a new treatment", description: "Click 'Add Treatment' and select the patient, type of treatment, and tooth/area." },
      { title: "Document the procedure", description: "Add detailed notes about the procedure, materials used, and outcome." },
      { title: "Set follow-up", description: "If a follow-up is needed, schedule it directly from the treatment form." },
      { title: "Complete the record", description: "Save the treatment. It will appear in the patient's treatment history." },
    ],
  },
  {
    id: "prescriptions",
    title: "Writing Prescriptions",
    description: "Create and manage digital prescriptions for patients.",
    icon: "file-text",
    roles: ["admin", "dentist"],
    pageLink: "/dashboard/prescriptions",
    steps: [
      { title: "Go to Prescriptions", description: "Navigate to the Prescriptions page in the Clinical section." },
      { title: "Create new prescription", description: "Click 'New Prescription' and select the patient." },
      { title: "Add medications", description: "Search and add medications with dosage, frequency, and duration." },
      { title: "Add special instructions", description: "Include any specific instructions like 'take with food' or precautions." },
      { title: "Issue the prescription", description: "Review and save. The prescription is linked to the patient's record." },
    ],
  },
  {
    id: "billing",
    title: "Managing Billing & Invoices",
    description: "Create invoices, track payments, and manage patient billing.",
    icon: "credit-card",
    roles: ["admin", "accountant", "receptionist", "dentist"],
    pageLink: "/dashboard/billing",
    steps: [
      { title: "Go to Billing", description: "Navigate to the Billing page under 'Finance' in the sidebar." },
      { title: "Create an invoice", description: "Click 'Create Invoice', select the patient, and add line items for treatments performed." },
      { title: "Apply discounts (if any)", description: "Add percentage or flat-rate discounts as needed." },
      { title: "Record a payment", description: "When the patient pays, record the payment method (cash, card, transfer) and amount." },
      { title: "Track outstanding balances", description: "Use the filters to view unpaid or partially paid invoices." },
    ],
  },
  {
    id: "reports",
    title: "Generating Reports",
    description: "View financial and operational reports to track clinic performance.",
    icon: "bar-chart",
    roles: ["admin", "accountant"],
    pageLink: "/dashboard/reports",
    steps: [
      { title: "Go to Reports", description: "Navigate to the Reports page under 'Finance'." },
      { title: "Select report type", description: "Choose from revenue reports, appointment summaries, patient stats, and more." },
      { title: "Set date range", description: "Pick a date range to focus your report on a specific period." },
      { title: "View & analyze", description: "Review charts and tables showing key metrics and trends." },
      { title: "Export if needed", description: "Use the export option to download reports as needed for record-keeping." },
    ],
  },
  {
    id: "inventory",
    title: "Managing Inventory",
    description: "Track dental supplies, materials, and equipment stock levels.",
    icon: "package",
    roles: ["admin", "accountant"],
    pageLink: "/dashboard/inventory",
    steps: [
      { title: "Go to Inventory", description: "Navigate to the Inventory page under 'Admin' in the sidebar." },
      { title: "View stock levels", description: "See all items with current quantities, reorder levels, and categories." },
      { title: "Add new items", description: "Click 'Add Item' to register new supplies with name, category, quantity, and unit cost." },
      { title: "Update quantities", description: "When stock is received or used, update the quantities to keep records accurate." },
      { title: "Monitor low stock alerts", description: "Items below their reorder level are highlighted so you can restock in time." },
    ],
  },
  {
    id: "staff-management",
    title: "Managing Staff",
    description: "Add, edit, and manage staff members and their roles.",
    icon: "users-cog",
    roles: ["admin"],
    pageLink: "/dashboard/staff",
    steps: [
      { title: "Go to Staff page", description: "Navigate to the Staff page under 'Admin' in the sidebar." },
      { title: "Add a staff member", description: "Click 'Add Staff' and enter their name, email, phone, and role." },
      { title: "Assign roles carefully", description: "Each role determines what pages and actions the staff member can access. Choose wisely." },
      { title: "Edit staff details", description: "Click on any staff member to update their information or change their role." },
      { title: "Deactivate if needed", description: "Instead of deleting, deactivate staff members who leave to preserve historical records." },
    ],
  },
  {
    id: "clinic-settings",
    title: "Configuring Clinic Settings",
    description: "Customize clinic details, working hours, and system preferences.",
    icon: "settings",
    roles: ["admin"],
    pageLink: "/dashboard/settings",
    steps: [
      { title: "Go to Settings", description: "Navigate to the Settings page from the sidebar." },
      { title: "Update clinic information", description: "Set the clinic name, address, phone number, and email." },
      { title: "Configure working hours", description: "Set your clinic's operating hours for each day of the week." },
      { title: "Manage notification preferences", description: "Choose which events trigger notifications and who receives them." },
      { title: "Save all changes", description: "Make sure to save after making any configuration changes." },
    ],
  },
  {
    id: "lab-orders",
    title: "Managing Lab Orders",
    description: "Create and track lab work orders for dental prosthetics and more.",
    icon: "flask",
    roles: ["admin", "dentist", "hygienist", "assistant"],
    pageLink: "/dashboard/lab-work",
    steps: [
      { title: "Go to Lab Work", description: "Navigate to the Lab Work page under 'Admin' in the sidebar." },
      { title: "Create a new order", description: "Click 'New Lab Order' and select the patient and type of work needed." },
      { title: "Specify details", description: "Add shade, material preferences, and any special instructions for the lab." },
      { title: "Track order status", description: "Monitor orders as they move through statuses: Sent → In Progress → Completed." },
      { title: "Receive completed work", description: "When the lab work arrives, mark it as received and schedule the patient's next visit." },
    ],
  },
];

export function getTutorialsForRole(role: string): Tutorial[] {
  return tutorials.filter((t) => t.roles.includes(role));
}
