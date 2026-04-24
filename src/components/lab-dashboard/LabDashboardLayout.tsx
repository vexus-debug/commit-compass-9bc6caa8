import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { LabDashboardSidebar } from "./LabDashboardSidebar";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

interface LabDashboardLayoutProps {
  children: ReactNode;
}

export function LabDashboardLayout({ children }: LabDashboardLayoutProps) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full dashboard-bg">
        <LabDashboardSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="h-14 flex items-center gap-3 border-b border-border/50 bg-card/80 backdrop-blur-xl px-4">
            <SidebarTrigger className="text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">Impression n Teeth</span>
          </header>
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
