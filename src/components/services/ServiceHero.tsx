import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Shield, Award, CheckCircle2, Sparkles } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface ServiceHeroProps {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  icon: LucideIcon;
  iconColor: string;
  badges?: string[];
}

const FloatingElement = ({ className, delay = 0 }: { className?: string; delay?: number }) => (
  <motion.div
    className={className}
    initial={{ y: 0, opacity: 0.5 }}
    animate={{ y: [-15, 15, -15], opacity: [0.5, 1, 0.5] }}
    transition={{ duration: 5, repeat: Infinity, delay, ease: "easeInOut" }}
  >
    <Sparkles className="w-full h-full" />
  </motion.div>
);

export function ServiceHero({ 
  title, 
  subtitle,
  description, 
  image, 
  icon: Icon, 
  iconColor,
  badges = ["Safe & Certified", "Modern Equipment", "Expert Team"]
}: ServiceHeroProps) {
  return (
    <section className="relative min-h-[70vh] overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-transparent to-transparent" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <FloatingElement className="absolute top-20 right-20 w-6 h-6 text-secondary/30" delay={0} />
        <FloatingElement className="absolute bottom-40 right-1/4 w-8 h-8 text-white/20" delay={1} />
        <FloatingElement className="absolute top-1/3 left-20 w-5 h-5 text-secondary/25" delay={2} />
        <div className="absolute top-1/4 right-10 w-48 h-48 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative py-16 md:py-24 lg:py-32">
        {/* Back Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-white/80 hover:text-secondary transition-colors mb-8 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Services
          </Link>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2 items-center">
          {/* Content */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {/* Icon Badge */}
            <motion.div 
              className={`inline-flex items-center justify-center h-20 w-20 rounded-2xl ${iconColor} shadow-xl`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <Icon className="h-10 w-10 text-white" />
            </motion.div>

            {/* Subtitle Badge */}
            <motion.div
              className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-2 text-sm text-white/90 font-medium"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Sparkles className="h-4 w-4 text-secondary" />
              {subtitle}
            </motion.div>

            <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
              {title}
            </h1>

            <p className="text-lg text-white/80 max-w-xl leading-relaxed">
              {description}
            </p>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button 
                asChild 
                size="lg" 
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground group shadow-lg shadow-secondary/25"
              >
                <Link to="/book-appointment">
                  <Calendar className="mr-2 h-5 w-5" />
                  Book Appointment
                </Link>
              </Button>
              <Button 
                asChild 
                size="lg" 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10 hover:text-white"
              >
                <Link to="/contact">
                  Call Us Now
                </Link>
              </Button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div 
              className="flex flex-wrap gap-4 pt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {badges.map((badge, index) => (
                <motion.div 
                  key={badge}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  <CheckCircle2 className="h-4 w-4 text-secondary" />
                  <span className="text-sm text-white/90 font-medium">{badge}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Stats/Visual Side */}
          <motion.div 
            className="hidden lg:block"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            <div className="relative">
              {/* Decorative Cards */}
              <motion.div 
                className="absolute top-0 right-0 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-secondary/20 flex items-center justify-center">
                    <Shield className="h-7 w-7 text-secondary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">100%</p>
                    <p className="text-sm text-white/70">Safe Procedures</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="absolute bottom-20 left-0 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-secondary/20 flex items-center justify-center">
                    <Award className="h-7 w-7 text-secondary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">7+ Years</p>
                    <p className="text-sm text-white/70">Of Excellence</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
