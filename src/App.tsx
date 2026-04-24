import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop, FloatingBookButton } from "@/components/layout";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import BookAppointment from "./pages/BookAppointment";
import Contact from "./pages/Contact";
import Testimonials from "./pages/Testimonials";
import Gallery from "./pages/Gallery";
import Promotions from "./pages/Promotions";
import FAQ from "./pages/FAQ";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
// Signup removed — admin-only account creation
import YellowTeeth from "./pages/YellowTeeth";
import ToothRestoration from "./pages/ToothRestoration";
import ScalingPolishing from "./pages/ScalingPolishing";
import ScalingVsWhitening from "./pages/ScalingVsWhitening";

// Service Pages
import GeneralPreventive from "./pages/services/GeneralPreventive";
import CosmeticDentistry from "./pages/services/CosmeticDentistry";
import Orthodontics from "./pages/services/Orthodontics";
import Restorative from "./pages/services/Restorative";
import DentalImplants from "./pages/services/DentalImplants";
import OralSurgery from "./pages/services/OralSurgery";
import Periodontics from "./pages/services/Periodontics";

// Dashboard Pages
import { DashboardLayout } from "./components/dashboard/DashboardLayout";
// Lab Dashboard
import { LabDashboardLayout } from "./components/lab-dashboard/LabDashboardLayout";
import LdHomePage from "./pages/lab-dashboard/LdHomePage";
import LdCasesPage from "./pages/lab-dashboard/LdCasesPage";
import LdClientsPage from "./pages/lab-dashboard/LdClientsPage";
import LdStaffPage from "./pages/lab-dashboard/LdStaffPage";
import LdWorkTypesPage from "./pages/lab-dashboard/LdWorkTypesPage";
import LdInvoicesPage from "./pages/lab-dashboard/LdInvoicesPage";
import LdPaymentsPage from "./pages/lab-dashboard/LdPaymentsPage";
import LdSettingsPage from "./pages/lab-dashboard/LdSettingsPage";
import LdInventoryPage from "./pages/lab-dashboard/LdInventoryPage";
import LdAnalyticsPage from "./pages/lab-dashboard/LdAnalyticsPage";
import LdNotificationsPage from "./pages/lab-dashboard/LdNotificationsPage";
import LdAuditLogPage from "./pages/lab-dashboard/LdAuditLogPage";
import LdCaseDetailPage from "./pages/lab-dashboard/LdCaseDetailPage";
import LdClientStatementsPage from "./pages/lab-dashboard/LdClientStatementsPage";
import LdCreditNotesPage from "./pages/lab-dashboard/LdCreditNotesPage";
import LdTechPerformancePage from "./pages/lab-dashboard/LdTechPerformancePage";
import LdReportsPage from "./pages/lab-dashboard/LdReportsPage";
import LdRecurringOrdersPage from "./pages/lab-dashboard/LdRecurringOrdersPage";
import LdCalendarPage from "./pages/lab-dashboard/LdCalendarPage";
import LdExternalLabsPage from "./pages/lab-dashboard/LdExternalLabsPage";
import LdShipmentsPage from "./pages/lab-dashboard/LdShipmentsPage";
import LdEquipmentPage from "./pages/lab-dashboard/LdEquipmentPage";
import LdClientPricesPage from "./pages/lab-dashboard/LdClientPricesPage";
import LdWarrantiesPage from "./pages/lab-dashboard/LdWarrantiesPage";
import LdCommunicationsPage from "./pages/lab-dashboard/LdCommunicationsPage";
import LdShadeLibraryPage from "./pages/lab-dashboard/LdShadeLibraryPage";
import LdSkillsMatrixPage from "./pages/lab-dashboard/LdSkillsMatrixPage";
import LdDispatchPage from "./pages/lab-dashboard/LdDispatchPage";
import LdExpensesPage from "./pages/lab-dashboard/LdExpensesPage";
import LdExternalLabPaymentsPage from "./pages/lab-dashboard/LdExternalLabPaymentsPage";
import LdCreateAccountPage from "./pages/lab-dashboard/LdCreateAccountPage";
import LdSalaryAllocationPage from "./pages/lab-dashboard/LdSalaryAllocationPage";
import LabLogin from "./pages/lab-dashboard/LabLogin";
import DashboardHome from "./pages/dashboard/DashboardHome";
import PatientsPage from "./pages/dashboard/PatientsPage";
import AppointmentsPage from "./pages/dashboard/AppointmentsPage";
import DentalChartsPage from "./pages/dashboard/DentalChartsPage";
import TreatmentsPage from "./pages/dashboard/TreatmentsPage";
import PrescriptionsPage from "./pages/dashboard/PrescriptionsPage";
import BillingPage from "./pages/dashboard/BillingPage";
import ReportsPage from "./pages/dashboard/ReportsPage";
import LabWorkPage from "./pages/dashboard/LabWorkPage";
import LabDashboardPage from "./pages/dashboard/LabDashboardPage";
import LabCasesPage from "./pages/dashboard/LabCasesPage";
import LabClientsPage from "./pages/dashboard/LabClientsPage";
import LabTechniciansPage from "./pages/dashboard/LabTechniciansPage";
import LabBillingPage from "./pages/dashboard/LabBillingPage";
import LabSettingsPage from "./pages/dashboard/LabSettingsPage";
import StaffPage from "./pages/dashboard/StaffPage";
import InventoryPage from "./pages/dashboard/InventoryPage";
import NotificationsPage from "./pages/dashboard/NotificationsPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import PatientProfilePage from "./pages/dashboard/PatientProfilePage";
import MyProfilePage from "./pages/dashboard/MyProfilePage";
import TutorialsPage from "./pages/dashboard/TutorialsPage";
import RevenueAllocationPage from "./pages/dashboard/RevenueAllocationPage";
import MessagesPage from "./pages/dashboard/MessagesPage";
import ReviewsPage from "./pages/dashboard/ReviewsPage";
import ExpensesPage from "./pages/dashboard/ExpensesPage";
import AuditLogPage from "./pages/dashboard/AuditLogPage";
import ConsentFormsPage from "./pages/dashboard/ConsentFormsPage";
import DocumentsPage from "./pages/dashboard/DocumentsPage";
import ShopProductsPage from "./pages/dashboard/ShopProductsPage";
import ShopOrdersPage from "./pages/dashboard/ShopOrdersPage";
import WhatsAppMarketingPage from "./pages/dashboard/WhatsAppMarketingPage";
import EmailMarketingPage from "./pages/dashboard/EmailMarketingPage";
import WebsiteContentEditor from "./pages/dashboard/website/WebsiteContentEditor";
import WebsiteTestimonialsEditor from "./pages/dashboard/website/WebsiteTestimonialsEditor";
import WebsiteFaqsEditor from "./pages/dashboard/website/WebsiteFaqsEditor";
import WebsitePromotionsEditor from "./pages/dashboard/website/WebsitePromotionsEditor";
import WebsiteGalleryEditor from "./pages/dashboard/website/WebsiteGalleryEditor";
import WebsiteTeamEditor from "./pages/dashboard/website/WebsiteTeamEditor";
import WebsiteHomeEditor from "./pages/dashboard/website/WebsiteHomeEditor";
import WebsiteAboutEditor from "./pages/dashboard/website/WebsiteAboutEditor";
import WebsiteServicesEditor from "./pages/dashboard/website/WebsiteServicesEditor";
import WebsiteContactEditor from "./pages/dashboard/website/WebsiteContactEditor";
import WebsiteHeaderFooterEditor from "./pages/dashboard/website/WebsiteHeaderFooterEditor";
import WebsiteSeoEditor from "./pages/dashboard/website/WebsiteSeoEditor";

const queryClient = new QueryClient();

const ProtectedDashboard = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>
    <DashboardLayout>{children}</DashboardLayout>
  </ProtectedRoute>
);

const ProtectedLabDashboard = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>
    <LabDashboardLayout>{children}</LabDashboardLayout>
  </ProtectedRoute>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ScrollToTop />
          <FloatingBookButton />
          <Routes>
            {/* Core Pages */}
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/book-appointment" element={<BookAppointment />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/:productId" element={<ProductDetail />} />

            {/* Marketing Funnel Pages */}
            <Route path="/yellow-teeth" element={<YellowTeeth />} />
            <Route path="/yellow-teeth/scaling-polishing" element={<ScalingPolishing />} />
            <Route path="/scaling-polishing" element={<ScalingPolishing />} />
            <Route path="/yellow-teeth/scaling-vs-whitening" element={<ScalingVsWhitening />} />
            <Route path="/scaling-vs-whitening" element={<ScalingVsWhitening />} />
            <Route path="/tooth-restoration" element={<ToothRestoration />} />
            
            {/* Service Sub-Pages */}
            <Route path="/services/general-preventive" element={<GeneralPreventive />} />
            <Route path="/services/cosmetic" element={<CosmeticDentistry />} />
            <Route path="/services/orthodontics" element={<Orthodontics />} />
            <Route path="/services/restorative" element={<Restorative />} />
            <Route path="/services/implants" element={<DentalImplants />} />
            <Route path="/services/oral-surgery" element={<OralSurgery />} />
            <Route path="/services/periodontics" element={<Periodontics />} />
            
            {/* Trust & Conversion Pages */}
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/promotions" element={<Promotions />} />
            
            {/* Utility Pages */}
            <Route path="/faq" element={<FAQ />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />

            {/* Dashboard Routes - Protected */}
            <Route path="/dashboard" element={<ProtectedDashboard><DashboardHome /></ProtectedDashboard>} />
            <Route path="/dashboard/patients" element={<ProtectedDashboard><PatientsPage /></ProtectedDashboard>} />
            <Route path="/dashboard/patients/:patientId" element={<ProtectedDashboard><PatientProfilePage /></ProtectedDashboard>} />
            <Route path="/dashboard/appointments" element={<ProtectedDashboard><AppointmentsPage /></ProtectedDashboard>} />
            <Route path="/dashboard/dental-charts" element={<ProtectedDashboard><DentalChartsPage /></ProtectedDashboard>} />
            <Route path="/dashboard/treatments" element={<ProtectedDashboard><TreatmentsPage /></ProtectedDashboard>} />
            <Route path="/dashboard/prescriptions" element={<ProtectedDashboard><PrescriptionsPage /></ProtectedDashboard>} />
            <Route path="/dashboard/billing" element={<ProtectedDashboard><BillingPage /></ProtectedDashboard>} />
            <Route path="/dashboard/reports" element={<ProtectedDashboard><ReportsPage /></ProtectedDashboard>} />
            <Route path="/dashboard/lab-work" element={<ProtectedDashboard><LabWorkPage /></ProtectedDashboard>} />
            <Route path="/dashboard/lab" element={<ProtectedDashboard><LabDashboardPage /></ProtectedDashboard>} />
            <Route path="/dashboard/lab/cases" element={<ProtectedDashboard><LabCasesPage /></ProtectedDashboard>} />
            <Route path="/dashboard/lab/clients" element={<ProtectedDashboard><LabClientsPage /></ProtectedDashboard>} />
            <Route path="/dashboard/lab/technicians" element={<ProtectedDashboard><LabTechniciansPage /></ProtectedDashboard>} />
            <Route path="/dashboard/lab/billing" element={<ProtectedDashboard><LabBillingPage /></ProtectedDashboard>} />
            <Route path="/dashboard/lab/settings" element={<ProtectedDashboard><LabSettingsPage /></ProtectedDashboard>} />
            <Route path="/dashboard/staff" element={<ProtectedDashboard><StaffPage /></ProtectedDashboard>} />
            <Route path="/dashboard/inventory" element={<ProtectedDashboard><InventoryPage /></ProtectedDashboard>} />
            <Route path="/dashboard/notifications" element={<ProtectedDashboard><NotificationsPage /></ProtectedDashboard>} />
            <Route path="/dashboard/settings" element={<ProtectedDashboard><SettingsPage /></ProtectedDashboard>} />
            <Route path="/dashboard/profile" element={<ProtectedDashboard><MyProfilePage /></ProtectedDashboard>} />
            <Route path="/dashboard/tutorials" element={<ProtectedDashboard><TutorialsPage /></ProtectedDashboard>} />
            <Route path="/dashboard/revenue-allocation" element={<ProtectedDashboard><RevenueAllocationPage /></ProtectedDashboard>} />
            <Route path="/dashboard/messages" element={<ProtectedDashboard><MessagesPage /></ProtectedDashboard>} />
            <Route path="/dashboard/reviews" element={<ProtectedDashboard><ReviewsPage /></ProtectedDashboard>} />
            <Route path="/dashboard/expenses" element={<ProtectedDashboard><ExpensesPage /></ProtectedDashboard>} />
            <Route path="/dashboard/audit-log" element={<ProtectedDashboard><AuditLogPage /></ProtectedDashboard>} />
            <Route path="/dashboard/consent-forms" element={<ProtectedDashboard><ConsentFormsPage /></ProtectedDashboard>} />
            <Route path="/dashboard/documents" element={<ProtectedDashboard><DocumentsPage /></ProtectedDashboard>} />
            <Route path="/dashboard/shop/products" element={<ProtectedDashboard><ShopProductsPage /></ProtectedDashboard>} />
            <Route path="/dashboard/shop/orders" element={<ProtectedDashboard><ShopOrdersPage /></ProtectedDashboard>} />
            <Route path="/dashboard/marketing/whatsapp" element={<ProtectedDashboard><WhatsAppMarketingPage /></ProtectedDashboard>} />
            <Route path="/dashboard/marketing/email" element={<ProtectedDashboard><EmailMarketingPage /></ProtectedDashboard>} />
            <Route path="/dashboard/website/content" element={<ProtectedDashboard><WebsiteContentEditor /></ProtectedDashboard>} />
            <Route path="/dashboard/website/home" element={<ProtectedDashboard><WebsiteHomeEditor /></ProtectedDashboard>} />
            <Route path="/dashboard/website/about" element={<ProtectedDashboard><WebsiteAboutEditor /></ProtectedDashboard>} />
            <Route path="/dashboard/website/services" element={<ProtectedDashboard><WebsiteServicesEditor /></ProtectedDashboard>} />
            <Route path="/dashboard/website/contact" element={<ProtectedDashboard><WebsiteContactEditor /></ProtectedDashboard>} />
            <Route path="/dashboard/website/header-footer" element={<ProtectedDashboard><WebsiteHeaderFooterEditor /></ProtectedDashboard>} />
            <Route path="/dashboard/website/seo" element={<ProtectedDashboard><WebsiteSeoEditor /></ProtectedDashboard>} />
            <Route path="/dashboard/website/testimonials" element={<ProtectedDashboard><WebsiteTestimonialsEditor /></ProtectedDashboard>} />
            <Route path="/dashboard/website/faqs" element={<ProtectedDashboard><WebsiteFaqsEditor /></ProtectedDashboard>} />
            <Route path="/dashboard/website/promotions" element={<ProtectedDashboard><WebsitePromotionsEditor /></ProtectedDashboard>} />
            <Route path="/dashboard/website/gallery" element={<ProtectedDashboard><WebsiteGalleryEditor /></ProtectedDashboard>} />
            <Route path="/dashboard/website/team" element={<ProtectedDashboard><WebsiteTeamEditor /></ProtectedDashboard>} />

            {/* Lab Login */}
            <Route path="/lab-login" element={<LabLogin />} />

            {/* Lab Dashboard Routes - Independent */}
            <Route path="/lab-dashboard" element={<ProtectedLabDashboard><LdHomePage /></ProtectedLabDashboard>} />
            <Route path="/lab-dashboard/cases" element={<ProtectedLabDashboard><LdCasesPage /></ProtectedLabDashboard>} />
            <Route path="/lab-dashboard/clients" element={<ProtectedLabDashboard><LdClientsPage /></ProtectedLabDashboard>} />
            <Route path="/lab-dashboard/staff" element={<ProtectedLabDashboard><LdStaffPage /></ProtectedLabDashboard>} />
            <Route path="/lab-dashboard/work-types" element={<ProtectedLabDashboard><LdWorkTypesPage /></ProtectedLabDashboard>} />
            <Route path="/lab-dashboard/invoices" element={<ProtectedLabDashboard><LdInvoicesPage /></ProtectedLabDashboard>} />
            <Route path="/lab-dashboard/payments" element={<ProtectedLabDashboard><LdPaymentsPage /></ProtectedLabDashboard>} />
            <Route path="/lab-dashboard/settings" element={<ProtectedLabDashboard><LdSettingsPage /></ProtectedLabDashboard>} />
            <Route path="/lab-dashboard/inventory" element={<ProtectedLabDashboard><LdInventoryPage /></ProtectedLabDashboard>} />
            <Route path="/lab-dashboard/analytics" element={<ProtectedLabDashboard><LdAnalyticsPage /></ProtectedLabDashboard>} />
            <Route path="/lab-dashboard/notifications" element={<ProtectedLabDashboard><LdNotificationsPage /></ProtectedLabDashboard>} />
            <Route path="/lab-dashboard/audit-log" element={<ProtectedLabDashboard><LdAuditLogPage /></ProtectedLabDashboard>} />
            <Route path="/lab-dashboard/cases/:caseId" element={<ProtectedLabDashboard><LdCaseDetailPage /></ProtectedLabDashboard>} />
            <Route path="/lab-dashboard/statements" element={<ProtectedLabDashboard><LdClientStatementsPage /></ProtectedLabDashboard>} />
            <Route path="/lab-dashboard/credit-notes" element={<ProtectedLabDashboard><LdCreditNotesPage /></ProtectedLabDashboard>} />
            <Route path="/lab-dashboard/performance" element={<ProtectedLabDashboard><LdTechPerformancePage /></ProtectedLabDashboard>} />
            <Route path="/lab-dashboard/reports" element={<ProtectedLabDashboard><LdReportsPage /></ProtectedLabDashboard>} />
            <Route path="/lab-dashboard/recurring" element={<ProtectedLabDashboard><LdRecurringOrdersPage /></ProtectedLabDashboard>} />
            <Route path="/lab-dashboard/calendar" element={<ProtectedLabDashboard><LdCalendarPage /></ProtectedLabDashboard>} />
            <Route path="/lab-dashboard/external-labs" element={<ProtectedLabDashboard><LdExternalLabsPage /></ProtectedLabDashboard>} />
            <Route path="/lab-dashboard/shipments" element={<ProtectedLabDashboard><LdShipmentsPage /></ProtectedLabDashboard>} />
            <Route path="/lab-dashboard/equipment" element={<ProtectedLabDashboard><LdEquipmentPage /></ProtectedLabDashboard>} />
            <Route path="/lab-dashboard/prices" element={<ProtectedLabDashboard><LdClientPricesPage /></ProtectedLabDashboard>} />
            <Route path="/lab-dashboard/warranties" element={<ProtectedLabDashboard><LdWarrantiesPage /></ProtectedLabDashboard>} />
            <Route path="/lab-dashboard/communications" element={<ProtectedLabDashboard><LdCommunicationsPage /></ProtectedLabDashboard>} />
            <Route path="/lab-dashboard/shades" element={<ProtectedLabDashboard><LdShadeLibraryPage /></ProtectedLabDashboard>} />
            <Route path="/lab-dashboard/skills" element={<ProtectedLabDashboard><LdSkillsMatrixPage /></ProtectedLabDashboard>} />
            <Route path="/lab-dashboard/dispatch" element={<ProtectedLabDashboard><LdDispatchPage /></ProtectedLabDashboard>} />
            <Route path="/lab-dashboard/expenses" element={<ProtectedLabDashboard><LdExpensesPage /></ProtectedLabDashboard>} />
            <Route path="/lab-dashboard/external-lab-payments" element={<ProtectedLabDashboard><LdExternalLabPaymentsPage /></ProtectedLabDashboard>} />
            <Route path="/lab-dashboard/create-account" element={<ProtectedLabDashboard><LdCreateAccountPage /></ProtectedLabDashboard>} />
            <Route path="/lab-dashboard/salary" element={<ProtectedLabDashboard><LdSalaryAllocationPage /></ProtectedLabDashboard>} />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
