import { ReactNode, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { AIChatPanel } from "./AIChatPanel";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { LayoutDashboard, Bot } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const [showAI, setShowAI] = useState(false);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full dashboard-bg">
        <DashboardSidebar />
        <div className="flex flex-1 flex-col overflow-hidden relative">
          <DashboardHeader />

          {/* Main content area with AI panel */}
          <div className="flex-1 flex overflow-hidden relative">
            {/* Dashboard content */}
            <main
              className={`flex-1 overflow-y-auto p-4 lg:p-6 transition-all duration-300 ${
                showAI ? "hidden lg:block lg:flex-1" : ""
              }`}
            >
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

            {/* AI Chat Panel - slide in from right on desktop, full screen on mobile */}
            <AnimatePresence>
              {showAI && (
                <motion.div
                  className="w-full lg:w-[380px] xl:w-[420px] border-l border-border/50 bg-background flex-shrink-0 absolute inset-0 lg:relative lg:inset-auto"
                  initial={{ x: "100%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: "100%", opacity: 0 }}
                  transition={{ type: "spring", damping: 28, stiffness: 300 }}
                >
                  <AIChatPanel onClose={() => setShowAI(false)} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile bottom tab bar */}
          <div className="lg:hidden flex items-center border-t border-border/50 bg-card/95 backdrop-blur-xl sticky bottom-0 z-40">
            <button
              onClick={() => setShowAI(false)}
              className={`flex-1 flex flex-col items-center gap-1 py-2.5 transition-colors ${
                !showAI ? "text-secondary" : "text-muted-foreground"
              }`}
            >
              <LayoutDashboard className="h-5 w-5" />
              <span className="text-[11px] font-medium">Dashboard</span>
            </button>
            <button
              onClick={() => setShowAI(true)}
              className={`flex-1 flex flex-col items-center gap-1 py-2.5 transition-colors relative ${
                showAI ? "text-secondary" : "text-muted-foreground"
              }`}
            >
              <Bot className="h-5 w-5" />
              <span className="text-[11px] font-medium">AI Chat</span>
              {!showAI && (
                <span className="absolute top-2 right-[calc(50%-8px)] translate-x-4 h-1.5 w-1.5 rounded-full bg-secondary" />
              )}
            </button>
          </div>

          {/* Desktop "Try AI" toggle button - centered bottom like screenshot */}
          <AnimatePresence>
            {!showAI && (
              <motion.button
                onClick={() => setShowAI(true)}
                className="hidden lg:flex sticky bottom-6 left-1/2 -translate-x-1/2 z-40 items-center gap-2 px-5 py-2.5 rounded-full bg-secondary text-secondary-foreground shadow-lg shadow-secondary/25 hover:shadow-xl hover:shadow-secondary/30 hover:scale-105 transition-all duration-200 mx-auto mb-4"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bot className="h-4 w-4" />
                <span className="text-sm font-medium">Try AI</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </SidebarProvider>
  );
}
