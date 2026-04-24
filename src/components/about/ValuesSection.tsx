import { motion } from "framer-motion";
import { useInView } from "@/hooks/use-in-view";
import { 
  Heart, 
  Shield, 
  Lightbulb, 
  Users, 
  Sparkles,
  Clock
} from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Patient-Centered Care",
    description: "At the heart of everything we do is you—the patient. We listen attentively to your concerns, understand your unique dental needs, and craft personalized treatment plans that align with your goals and lifestyle. Every interaction is designed to make you feel valued, respected, and truly cared for.",
    featured: true,
  },
  {
    icon: Shield,
    title: "Safety & Hygiene",
    description: "Your safety is non-negotiable. We maintain rigorous sterilization protocols, use single-use instruments where appropriate, and ensure our facility exceeds international hygiene standards. Our infection control measures give you complete peace of mind.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "We embrace the latest dental technologies and techniques to provide you with more accurate diagnoses, less invasive treatments, and better outcomes. From digital imaging to advanced materials, innovation drives our practice forward.",
  },
  {
    icon: Users,
    title: "Expert Team",
    description: "Our carefully selected team combines years of training with genuine compassion. We invest continuously in professional development, ensuring you receive care from skilled practitioners who stay current with dental advancements.",
  },
  {
    icon: Sparkles,
    title: "Excellence",
    description: "We hold ourselves to the highest standards in every aspect of care—from the precision of our treatments to the cleanliness of our facility. Excellence isn't a goal; it's our baseline.",
  },
  {
    icon: Clock,
    title: "Respect for Time",
    description: "We value your time as much as you do. Our efficient scheduling, minimal wait times, and streamlined processes ensure your dental visits are convenient and respectful of your busy schedule.",
  },
];

const ValueCard = ({ 
  value, 
  index 
}: { 
  value: typeof values[0]; 
  index: number;
}) => {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  return (
    <motion.div
      ref={ref}
      className={`relative group ${value.featured ? "md:col-span-2 md:row-span-2" : ""}`}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div 
        className={`
          h-full bg-card rounded-2xl border border-border/50 overflow-hidden
          transition-all duration-500 group-hover:shadow-xl group-hover:border-secondary/30
          ${value.featured ? "p-8 md:p-10" : "p-6"}
        `}
      >
        {/* Hover gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
        
        <div className="relative z-10">
          {/* Icon */}
          <motion.div
            className={`
              rounded-xl bg-secondary/10 flex items-center justify-center mb-5
              group-hover:bg-secondary/20 transition-colors duration-300
              ${value.featured ? "w-20 h-20" : "w-14 h-14"}
            `}
            whileHover={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.5 }}
          >
            <value.icon className={`text-secondary ${value.featured ? "h-10 w-10" : "h-7 w-7"}`} />
          </motion.div>

          {/* Content */}
          <h3 className={`font-bold text-primary mb-3 ${value.featured ? "text-2xl md:text-3xl" : "text-xl"}`}>
            {value.title}
          </h3>
          <p className={`text-muted-foreground leading-relaxed ${value.featured ? "text-base md:text-lg" : "text-sm"}`}>
            {value.description}
          </p>

          {/* Featured badge */}
          {value.featured && (
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium">
              <Heart className="h-4 w-4" />
              Core Value
            </div>
          )}
        </div>

        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-secondary/10 to-transparent rounded-bl-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </motion.div>
  );
};

export function ValuesSection() {
  const { ref: headerRef, isInView: headerInView } = useInView();

  return (
    <section className="py-20 md:py-32 bg-muted relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-secondary/5 to-transparent" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-primary/5 to-transparent" />
      </div>

      <div className="container relative">
        {/* Header */}
        <motion.div
          ref={headerRef}
          className="max-w-3xl mx-auto text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
            What We Stand For
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6">
            Our Core{" "}
            <span className="text-secondary">Values</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            These guiding principles shape every decision we make, every treatment we perform, 
            and every interaction we have with our patients. They're not just words—they're 
            commitments we live by every day.
          </p>
        </motion.div>

        {/* Values Grid - Bento Style */}
        <div className="grid md:grid-cols-3 gap-6">
          {values.map((value, index) => (
            <ValueCard key={value.title} value={value} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
