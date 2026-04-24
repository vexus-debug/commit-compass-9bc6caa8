import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Star, ArrowRight, Shield, Users, Award } from "lucide-react";
import heroImage from "@/assets/hero-smile.jpg";
import { useWebsiteContent, getContent } from "@/hooks/useWebsiteContent";

const FloatingTooth = ({ className, delay = 0 }: { className?: string; delay?: number }) => (
  <motion.div
    className={className}
    initial={{ y: 0, rotate: 0 }}
    animate={{ y: [-10, 10, -10], rotate: [-5, 5, -5] }}
    transition={{ duration: 4, repeat: Infinity, delay, ease: "easeInOut" }}
  >
    <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
      <path d="M12 2C9.5 2 7.5 3.5 7 6C6.5 8.5 6 11 6 13C6 15 7 17 8 19C9 21 10 22 12 22C14 22 15 21 16 19C17 17 18 15 18 13C18 11 17.5 8.5 17 6C16.5 3.5 14.5 2 12 2Z" />
    </svg>
  </motion.div>
);

const FloatingSparkle = ({ className, delay = 0 }: { className?: string; delay?: number }) => (
  <motion.div
    className={className}
    initial={{ scale: 0.8, opacity: 0.5 }}
    animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
    transition={{ duration: 3, repeat: Infinity, delay, ease: "easeInOut" }}
  >
    <Sparkles className="w-full h-full" />
  </motion.div>
);

export function HeroSection() {
  const { data: content } = useWebsiteContent("hero");
  const [wordIndex, setWordIndex] = useState(0);

  const rotatingWordsStr = getContent(content, "hero_rotating_words", "Beautiful,Confident,Radiant,Perfect,Healthy");
  const rotatingWords = rotatingWordsStr.split(",").map((w) => w.trim());

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [rotatingWords.length]);

  const badge = getContent(content, "hero_badge", "Welcome to Vista Dental Care");
  const headingPrefix = getContent(content, "hero_heading_prefix", "Your Smile is");
  const description = getContent(content, "hero_description", "Experience world-class dental care in a comfortable, modern environment. We're committed to giving you a healthy, beautiful smile that lasts a lifetime.");
  const ctaPrimary = getContent(content, "hero_cta_primary", "Book Your Appointment");
  const ctaSecondary = getContent(content, "hero_cta_secondary", "Explore Our Services");
  const badge1 = getContent(content, "hero_badge_1", "5-Star Rated");
  const badge2 = getContent(content, "hero_badge_2", "500+ Happy Patients");
  const badge3 = getContent(content, "hero_badge_3", "7+ Years Experience");

  return (
    <section className="relative min-h-[90vh] overflow-hidden gradient-hero">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-64 h-64 bg-secondary/10 blob animate-float-slow" />
        <div className="absolute bottom-40 left-10 w-48 h-48 bg-primary/10 blob-2 animate-float" />
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-dental-teal/10 rounded-full blur-2xl animate-pulse-glow" />
        <FloatingTooth className="absolute top-32 right-20 w-8 h-8 text-secondary/20" delay={0} />
        <FloatingTooth className="absolute bottom-40 right-40 w-6 h-6 text-primary/15" delay={1} />
        <FloatingTooth className="absolute top-1/2 left-20 w-10 h-10 text-secondary/15" delay={2} />
        <FloatingSparkle className="absolute top-40 left-1/4 w-6 h-6 text-secondary/30" delay={0.5} />
        <FloatingSparkle className="absolute bottom-32 left-1/3 w-5 h-5 text-primary/25" delay={1.5} />
      </div>

      <div className="container relative py-16 md:py-24 lg:py-32">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div 
              className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 text-sm text-secondary font-medium backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="h-4 w-4" />
              {badge}
            </motion.div>

            <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl xl:text-7xl">
              {headingPrefix}{" "}
              <span className="relative block mt-2">
                <span className="text-secondary relative">
                  {rotatingWords.map((word, index) => (
                    <motion.span
                      key={word}
                      className="absolute left-0"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: index === wordIndex ? 1 : 0,
                        y: index === wordIndex ? 0 : -20,
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      {word}
                    </motion.span>
                  ))}
                  <span className="invisible">{rotatingWords[0]}</span>
                </span>
              </span>
            </h1>

            <motion.p 
              className="text-lg text-muted-foreground max-w-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {description}
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 group animate-pulse-glow">
                <Link to="/book-appointment">
                  {ctaPrimary}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="group">
                <Link to="/services">
                  {ctaSecondary}
                  <Sparkles className="ml-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                </Link>
              </Button>
            </motion.div>

            <motion.div 
              className="flex flex-wrap items-center gap-6 pt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm font-medium">{badge1}</span>
              </div>
              <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
                <Users className="h-4 w-4 text-secondary" />
                <span className="text-sm font-medium">{badge2}</span>
              </div>
              <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
                <Award className="h-4 w-4 text-secondary" />
                <span className="text-sm font-medium">{badge3}</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            className="relative lg:pl-8"
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-secondary/20 via-transparent to-primary/20 rounded-3xl blur-sm" />
              <div className="absolute -inset-2 bg-gradient-to-br from-secondary/10 to-primary/10 rounded-3xl" />
              <div className="relative aspect-square max-w-lg mx-auto rounded-3xl overflow-hidden shadow-2xl">
                <img src={heroImage} alt="Happy patient with beautiful smile at Vista Dental Care" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent" />
              </div>
              <motion.div 
                className="absolute -bottom-4 -left-4 bg-card rounded-2xl shadow-xl p-4 border border-border"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">100% Safe</p>
                    <p className="text-xs text-muted-foreground">Modern Equipment</p>
                  </div>
                </div>
              </motion.div>
            </div>
            <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-secondary/10 blur-2xl" />
            <div className="absolute -bottom-4 left-8 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}