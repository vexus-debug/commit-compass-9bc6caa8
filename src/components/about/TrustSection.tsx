import { motion } from "framer-motion";
import { useInView } from "@/hooks/use-in-view";
import { useCounter } from "@/hooks/use-counter";
import { Star, Users, ShieldCheck, Award, Heart, Quote } from "lucide-react";
import { Link } from "react-router-dom";

const trustStats = [
  { icon: Users, value: 500, suffix: "+", label: "Happy Patients" },
  { icon: Star, value: 5, suffix: ".0", label: "Star Rating" },
  { icon: ShieldCheck, value: 100, suffix: "%", label: "Hygiene Standard" },
  { icon: Award, value: 7, suffix: "+", label: "Years of Excellence" },
  { icon: Heart, value: 98, suffix: "%", label: "Patient Satisfaction" },
];

const StatItem = ({ 
  stat, 
  index 
}: { 
  stat: typeof trustStats[0]; 
  index: number;
}) => {
  const { ref, isInView } = useInView({ threshold: 0.5 });
  const count = useCounter({ end: stat.value, duration: 2000, enabled: isInView });

  return (
    <motion.div
      ref={ref}
      className="flex flex-col items-center text-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay: index * 0.1, type: "spring" }}
    >
      <motion.div
        className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-4"
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.5 }}
      >
        <stat.icon className="h-8 w-8 text-secondary" />
      </motion.div>
      <p className="text-4xl md:text-5xl font-bold text-white mb-1">
        {count}{stat.suffix}
      </p>
      <p className="text-white/70 text-sm">{stat.label}</p>
    </motion.div>
  );
};

export function TrustSection() {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  return (
    <section 
      ref={ref}
      className="relative py-20 md:py-28 overflow-hidden"
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/90" />
      
      {/* Animated Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Floating Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-10 left-10 w-32 h-32 bg-secondary/20 rounded-full blur-2xl"
          animate={{ y: [0, 30, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-48 h-48 bg-secondary/10 rounded-full blur-3xl"
          animate={{ y: [0, -20, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <div className="container relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/20 text-secondary text-sm font-medium mb-4">
            Trusted by Hundreds
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Why Patients Trust Us
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Our numbers speak for themselves. Join the growing family of patients 
            who've experienced the Vista Dental difference.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-6 mb-14">
          {trustStats.map((stat, index) => (
            <StatItem key={stat.label} stat={stat} index={index} />
          ))}
        </div>

        {/* Testimonial Snippet */}
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-10 border border-white/10">
            <Quote className="absolute top-6 left-6 h-12 w-12 text-secondary/30" />
            
            <div className="relative z-10">
              <p className="text-white text-lg md:text-xl leading-relaxed mb-6 italic">
                "From my first visit, I knew Vista Dental was different. The team's attention to detail, 
                the modern equipment, and most importantly, how they made me feel completely at ease—it's 
                rare to find a dental practice that truly cares this much. My smile has never looked better!"
              </p>
              
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-secondary/20 flex items-center justify-center">
                    <span className="text-xl font-bold text-secondary">CN</span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">Chioma N.</p>
                    <p className="text-white/60 text-sm">Patient since 2022</p>
                  </div>
                </div>
                
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 fill-secondary text-secondary" />
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Link to Testimonials */}
          <div className="text-center mt-8">
            <Link 
              to="/testimonials"
              className="inline-flex items-center gap-2 text-secondary hover:text-secondary/80 font-medium transition-colors"
            >
              Read More Patient Stories
              <span>→</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
