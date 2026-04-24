import { motion } from "framer-motion";
import { Sparkles, Award, Users, Calendar } from "lucide-react";
import clinicInterior from "@/assets/clinic-interior.jpg";
import { useInView } from "@/hooks/use-in-view";
import { useCounter } from "@/hooks/use-counter";

const StatBadge = ({ 
  icon: Icon, 
  value, 
  suffix, 
  label, 
  delay 
}: { 
  icon: React.ElementType; 
  value: number; 
  suffix: string; 
  label: string; 
  delay: number;
}) => {
  const { ref, isInView } = useInView({ threshold: 0.5 });
  const count = useCounter({ end: value, duration: 2000, enabled: isInView });

  return (
    <motion.div
      ref={ref}
      className="flex items-center gap-3 bg-card/95 backdrop-blur-sm rounded-2xl px-5 py-4 shadow-lg border border-border/50"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
    >
      <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
        <Icon className="h-6 w-6 text-secondary" />
      </div>
      <div>
        <p className="text-2xl font-bold text-primary">
          {count}{suffix}
        </p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </motion.div>
  );
};

export function AboutHeroSection() {
  return (
    <section className="relative min-h-[85vh] overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={clinicInterior}
          alt="Vista Dental Care modern clinic interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-transparent to-transparent" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 left-10 w-64 h-64 bg-secondary/20 rounded-full blur-2xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </div>

      {/* Content */}
      <div className="container relative z-10 py-24 md:py-32 lg:py-40">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full bg-secondary/20 backdrop-blur-sm px-4 py-2 text-sm text-secondary-foreground border border-secondary/30 mb-6"
          >
            <Sparkles className="h-4 w-4 text-secondary" />
            <span className="text-white/90">About Vista Dental Care</span>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            Where Modern Dentistry
            <span className="block mt-2">
              Meets{" "}
              <span className="text-secondary relative">
                Compassionate Care
                <motion.div
                  className="absolute -bottom-2 left-0 h-1 bg-secondary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 1, duration: 0.8 }}
                />
              </span>
            </span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-white/80 max-w-2xl mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            For over five years, we've been Abuja's trusted destination for exceptional dental care. 
            Our state-of-the-art facility combines cutting-edge technology with a warm, patient-centered 
            approach to transform smiles and build lasting confidence.
          </motion.p>

          {/* Trust Indicators */}
          <div className="flex flex-wrap gap-4">
            <StatBadge icon={Calendar} value={5} suffix="+" label="Years of Excellence" delay={0.6} />
            <StatBadge icon={Users} value={500} suffix="+" label="Happy Patients" delay={0.8} />
            <StatBadge icon={Award} value={7} suffix="+" label="Specialized Services" delay={1} />
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            fill="hsl(var(--background))"
            d="M0,64L60,69.3C120,75,240,85,360,80C480,75,600,53,720,48C840,43,960,53,1080,58.7C1200,64,1320,64,1380,64L1440,64L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"
          />
        </svg>
      </div>
    </section>
  );
}
