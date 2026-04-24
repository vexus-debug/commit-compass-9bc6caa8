import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Phone, Sparkles, ArrowRight } from "lucide-react";

interface ServiceCTAProps {
  title?: string;
  description?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
}

export function ServiceCTA({ 
  title = "Ready to Get Started?",
  description = "Book a consultation with our dental experts today. We'll assess your needs and create a personalized treatment plan just for you.",
  primaryButtonText = "Book Appointment",
  secondaryButtonText = "Call Us Now"
}: ServiceCTAProps) {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary/90 to-dental-teal-light animate-gradient" />
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-10 left-10 w-32 h-32 rounded-full border-2 border-white/10"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-10 right-10 w-48 h-48 rounded-full border-2 border-white/10"
          animate={{ scale: [1.2, 1, 1.2], rotate: [90, 0, 90] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/4 w-24 h-24 rounded-full bg-white/5"
          animate={{ y: [-20, 20, -20] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <Sparkles className="absolute top-20 right-1/4 w-8 h-8 text-white/20" />
        <Sparkles className="absolute bottom-20 left-1/3 w-6 h-6 text-white/15" />
      </div>

      <div className="container relative">
        <motion.div 
          className="max-w-3xl mx-auto text-center space-y-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {/* Title */}
          <motion.h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {title}
          </motion.h2>

          {/* Description */}
          <motion.p 
            className="text-lg text-white/90 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            {description}
          </motion.p>

          {/* Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Button 
              asChild 
              size="lg" 
              className="bg-white text-secondary hover:bg-white/90 group shadow-xl"
            >
              <Link to="/book-appointment">
                <Calendar className="mr-2 h-5 w-5" />
                {primaryButtonText}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button 
              asChild 
              size="lg" 
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 hover:text-white"
            >
              <Link to="/contact">
                <Phone className="mr-2 h-5 w-5" />
                {secondaryButtonText}
              </Link>
            </Button>
          </motion.div>

          {/* Trust Note */}
          <motion.p 
            className="text-sm text-white/70"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            ✓ No obligations &nbsp;&nbsp; ✓ Free consultation available &nbsp;&nbsp; ✓ Flexible payment options
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
