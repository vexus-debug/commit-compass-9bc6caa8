import { Link, useLocation } from "react-router-dom";
import { Calendar, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const FloatingBookButton = () => {
  const location = useLocation();

  // Hide on dashboard/admin routes
  if (location.pathname.startsWith("/dashboard") || location.pathname.startsWith("/lab-dashboard")) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 100, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 1, duration: 0.5, type: "spring", stiffness: 200 }}
      className="fixed bottom-6 left-6 z-50"
    >
      <Link
        to="/book-appointment"
        className="group relative flex items-center gap-2 bg-gradient-to-r from-secondary via-secondary to-primary text-secondary-foreground px-6 py-3 rounded-full shadow-2xl hover:shadow-secondary/40 transition-all duration-300 hover:scale-105"
      >
        <span className="absolute inset-0 rounded-full bg-secondary/30 animate-ping" />
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="relative"
        >
          <Sparkles className="h-5 w-5" />
        </motion.span>
        <span className="relative font-bold text-sm sm:text-base">Book Now</span>
        <Calendar className="h-5 w-5 relative group-hover:animate-bounce" />
      </Link>
    </motion.div>
  );
};

export default FloatingBookButton;
