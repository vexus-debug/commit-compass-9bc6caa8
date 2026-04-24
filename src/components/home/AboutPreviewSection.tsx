import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, Quote } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";
import { useCounter } from "@/hooks/use-counter";
import clinicImage from "@/assets/clinic-interior.jpg";
import teamImage from "@/assets/dental-team.jpg";
import { useWebsiteContent, getContent } from "@/hooks/useWebsiteContent";

interface StatCardProps {
  value: number;
  suffix: string;
  label: string;
  delay: number;
  isInView: boolean;
}

function StatCard({ value, suffix, label, delay, isInView }: StatCardProps) {
  const count = useCounter({ end: value, enabled: isInView, duration: 2000 });

  return (
    <motion.div
      className="bg-gradient-to-br from-dental-teal-pale to-dental-mint p-6 rounded-2xl text-center card-hover"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
    >
      <div className="text-4xl font-bold text-secondary">
        {count}
        <span className="text-2xl">{suffix}</span>
      </div>
      <div className="text-sm text-muted-foreground mt-1">{label}</div>
    </motion.div>
  );
}

export function AboutPreviewSection() {
  const { ref, isInView } = useInView<HTMLDivElement>({ threshold: 0.2 });
  const { data: content } = useWebsiteContent("about_preview");

  const heading = getContent(content, "about_heading", "Your Trusted Partner for Dental Excellence");
  const description = getContent(content, "about_description", "Vista Dental Care is a modern, patient-focused dental clinic in Gaduwa, Abuja, Nigeria. We offer comprehensive dental services for individuals and families, using advanced technology in a comfortable and welcoming environment.");
  const missionQuote = getContent(content, "about_mission_quote", "Our mission is to provide personalized, high-quality dental care using modern techniques and technology, while ensuring patient comfort, safety, and satisfaction.");
  const statPatients = parseInt(getContent(content, "about_stat_patients", "500")) || 500;
  const statServices = parseInt(getContent(content, "about_stat_services", "7")) || 7;
  const statYears = parseInt(getContent(content, "about_stat_years", "5")) || 5;
  const statSatisfaction = parseInt(getContent(content, "about_stat_satisfaction", "100")) || 100;

  return (
    <section ref={ref} className="py-20 md:py-28 bg-card relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-dental-teal-pale/50 to-transparent pointer-events-none" />

      <div className="container relative">
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-primary sm:text-4xl lg:text-5xl leading-tight">
                {heading.includes("Dental Excellence") ? (
                  <>
                    Your Trusted Partner for{" "}
                    <span className="text-secondary">Dental Excellence</span>
                  </>
                ) : heading}
              </h2>
            </motion.div>

            <motion.p
              className="text-muted-foreground text-lg"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.2 }}
            >
              {description}
            </motion.p>

            <motion.div
              className="relative bg-muted rounded-2xl p-6 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
            >
              <Quote className="absolute -top-3 -left-3 w-8 h-8 text-secondary fill-secondary/20" />
              <p className="text-foreground italic">"{missionQuote}"</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.4 }}
            >
              <Button asChild variant="outline" className="group">
                <Link to="/about">
                  Learn More About Us
                  <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>
          </div>

          <div className="lg:col-span-4 relative">
            <motion.div
              className="relative z-10"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img src={clinicImage} alt="Modern dental clinic interior" className="w-full h-[400px] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-dental-navy/40 to-transparent" />
              </div>
              <motion.div
                className="absolute -bottom-10 -right-10 w-48 h-48 rounded-2xl overflow-hidden shadow-xl border-4 border-background z-20"
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.5 }}
              >
                <img src={teamImage} alt="Our dental team" className="w-full h-full object-cover" />
              </motion.div>
              <motion.div
                className="absolute -bottom-4 left-4 bg-secondary text-secondary-foreground px-4 py-2 rounded-full text-sm font-medium shadow-lg z-30"
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6 }}
              >
                Meet Our Expert Team →
              </motion.div>
            </motion.div>
            <div className="absolute -top-8 -left-8 w-full h-full bg-secondary/10 rounded-2xl -z-10" />
          </div>

          <div className="lg:col-span-3">
            <div className="grid grid-cols-2 gap-4">
              <StatCard value={statPatients} suffix="+" label="Happy Patients" delay={0.3} isInView={isInView} />
              <div className="pt-8">
                <StatCard value={statServices} suffix="+" label="Services Offered" delay={0.4} isInView={isInView} />
              </div>
              <StatCard value={statYears} suffix="+" label="Years Experience" delay={0.5} isInView={isInView} />
              <div className="pt-8">
                <StatCard value={statSatisfaction} suffix="%" label="Patient Satisfaction" delay={0.6} isInView={isInView} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}