import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, Phone, Calendar, Sparkles, Smile, Clock, Facebook, Instagram, Twitter,
} from "lucide-react";
import { useInView } from "@/hooks/use-in-view";
import { useWebsiteContent, getContent } from "@/hooks/useWebsiteContent";

const FloatingElement = ({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => (
  <motion.div
    className={className}
    animate={{ y: [-15, 15, -15], rotate: [-3, 3, -3] }}
    transition={{ duration: 6, repeat: Infinity, delay, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
);

export function CTASection() {
  const { ref, isInView } = useInView<HTMLDivElement>({ threshold: 0.2 });
  const { data: ctaContent } = useWebsiteContent("cta");
  const { data: contactContent } = useWebsiteContent("contact");

  const heading = getContent(ctaContent, "cta_heading", "Ready for Your Best Smile?");
  const description = getContent(ctaContent, "cta_description", "Don't wait another day to achieve the smile you deserve. Book your appointment now and let our expert team take care of you.");
  const urgencyBadge = getContent(ctaContent, "cta_urgency_badge", "Limited slots available this week!");
  const phone1 = getContent(contactContent, "clinic_phone_1", "070 8878 8880");

  return (
    <section ref={ref} className="py-20 md:py-28 relative overflow-hidden">
      <div className="absolute inset-0 gradient-animated" />
      <div className="absolute inset-0 bg-gradient-to-t from-dental-navy/90 to-transparent" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <FloatingElement className="absolute top-20 left-[10%] text-white/10" delay={0}>
          <Sparkles className="w-12 h-12" />
        </FloatingElement>
        <FloatingElement className="absolute top-1/3 right-[15%] text-white/10" delay={1}>
          <Smile className="w-16 h-16" />
        </FloatingElement>
        <FloatingElement className="absolute bottom-20 left-[20%] text-white/10" delay={2}>
          <svg viewBox="0 0 24 24" className="w-10 h-10 fill-current">
            <path d="M12 2C9.5 2 7.5 3.5 7 6C6.5 8.5 6 11 6 13C6 15 7 17 8 19C9 21 10 22 12 22C14 22 15 21 16 19C17 17 18 15 18 13C18 11 17.5 8.5 17 6C16.5 3.5 14.5 2 12 2Z" />
          </svg>
        </FloatingElement>
        <FloatingElement className="absolute bottom-1/3 right-[8%] text-white/10" delay={0.5}>
          <Sparkles className="w-8 h-8" />
        </FloatingElement>
      </div>

      <div className="container relative">
        <div className="max-w-4xl mx-auto text-center text-white">
          <motion.div className="space-y-8" initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }}>
            <motion.div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm" initial={{ opacity: 0, scale: 0.9 }} animate={isInView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 0.2 }}>
              <Clock className="w-4 h-4" />
              <span>{urgencyBadge}</span>
            </motion.div>

            <motion.h2 className="text-4xl font-bold sm:text-5xl lg:text-6xl" initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 }}>
              {heading.includes("Best Smile") ? (
                <>Ready for Your <br /><span className="text-dental-teal-light">Best Smile?</span></>
              ) : heading}
            </motion.h2>

            <motion.p className="text-lg text-white/80 max-w-2xl mx-auto" initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.4 }}>
              {description}
            </motion.p>

            <motion.div className="flex flex-col sm:flex-row justify-center gap-4 pt-4" initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.5 }}>
              <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground animate-pulse-glow group">
                <Link to="/book-appointment">
                  <Calendar className="mr-2 h-5 w-5" />
                  Book Appointment
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
                <a href={`tel:${phone1.replace(/\s/g, "")}`}>
                  <Phone className="mr-2 h-5 w-5" />
                  Call Now
                </a>
              </Button>
            </motion.div>

            <motion.div className="pt-8 border-t border-white/20 mt-8" initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.6 }}>
              <div className="flex flex-wrap justify-center gap-8 text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {phone1}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Mon - Sat: 9AM - 6PM
                </div>
              </div>
              <div className="flex justify-center gap-4 mt-6">
                {[
                  { icon: Facebook, href: "#", label: "Facebook" },
                  { icon: Instagram, href: "#", label: "Instagram" },
                  { icon: Twitter, href: "#", label: "Twitter" },
                ].map((social) => (
                  <motion.a key={social.label} href={social.href} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors" whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.95 }} aria-label={social.label}>
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}