import { motion } from "framer-motion";
import { Award, Users, Heart, Clock, Shield, Sparkles } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";
import technologyImage from "@/assets/dental-technology.jpg";
import teamImage from "@/assets/dental-team.jpg";
import careImage from "@/assets/dentist-patient.jpg";

const features = [
  {
    icon: Award,
    title: "Modern Technology",
    description: "State-of-the-art equipment for precise, comfortable treatments",
    image: technologyImage,
    color: "from-secondary to-secondary/70",
  },
  {
    icon: Users,
    title: "Expert Team",
    description: "Skilled, friendly professionals dedicated to your care",
    image: teamImage,
    color: "from-primary to-primary/70",
  },
  {
    icon: Heart,
    title: "Gentle Care",
    description: "Compassionate approach for a stress-free experience",
    image: careImage,
    color: "from-pink-500 to-pink-500/70",
  },
  {
    icon: Clock,
    title: "Flexible Hours",
    description: "Convenient scheduling including Saturday appointments",
    image: null,
    color: "from-amber-500 to-amber-500/70",
  },
];

const trustBadges = [
  { icon: Shield, label: "100% Safe & Hygienic" },
  { icon: Sparkles, label: "Latest Equipment" },
  { icon: Award, label: "Certified Professionals" },
];

export function WhyChooseUsSection() {
  const { ref, isInView } = useInView<HTMLDivElement>({ threshold: 0.1 });

  return (
    <section ref={ref} className="py-20 md:py-28 bg-muted relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'%3E%3Cpath fill='%23059669' d='M40 20c-5 0-9 3-10 8-1 5-2 10-2 15 0 4 2 8 4 12 2 4 4 6 8 6s6-2 8-6c2-4 4-8 4-12 0-5-1-10-2-15-1-5-5-8-10-8z'/%3E%3C/svg%3E")`,
          backgroundSize: '80px 80px',
        }} />
      </div>

      <div className="container relative">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
            Why Choose <span className="text-secondary">Vista Dental Care</span>?
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            We combine expertise, technology, and compassion to deliver exceptional dental care
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="group relative bg-card rounded-2xl overflow-hidden shadow-lg card-hover"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Image or gradient background */}
              <div className="relative h-48 overflow-hidden">
                {feature.image ? (
                  <>
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                  </>
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                    <feature.icon className="w-20 h-20 text-white/30" />
                  </div>
                )}

                {/* Icon Badge */}
                <div className={`absolute top-4 right-4 w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-secondary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </div>

              {/* Hover accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary to-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </motion.div>
          ))}
        </div>

        {/* Trust Badges Row */}
        <motion.div
          className="flex flex-wrap justify-center gap-6 mt-16"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
        >
          {trustBadges.map((badge, index) => (
            <motion.div
              key={badge.label}
              className="flex items-center gap-3 bg-card rounded-full px-6 py-3 shadow-md"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.7 + index * 0.1 }}
            >
              <badge.icon className="w-5 h-5 text-secondary" />
              <span className="text-sm font-medium">{badge.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
