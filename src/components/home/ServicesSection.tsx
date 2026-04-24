import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Stethoscope, Sparkles, Smile, Crown, Syringe, Heart, ArrowRight,
} from "lucide-react";
import { useInView } from "@/hooks/use-in-view";
import teethWhitening from "@/assets/teeth-whitening.jpg";
import orthodontics from "@/assets/orthodontics.jpg";
import dentistPatient from "@/assets/dentist-patient.jpg";
import clinicInterior from "@/assets/clinic-interior.jpg";
import dentalTechnology from "@/assets/dental-technology.jpg";
import heroSmile from "@/assets/hero-smile.jpg";
import { useWebsiteContent, getContent } from "@/hooks/useWebsiteContent";

const services = [
  { icon: Smile, title: "Braces & Routine Check-up", description: "Orthodontic braces, routine dental check-ups, and professional consultations", href: "/services/orthodontics", image: orthodontics },
  { icon: Syringe, title: "Dental Implants", description: "Permanent, natural-looking tooth replacements using advanced implant technology — designed to last a lifetime", href: "/services/implants", image: dentalTechnology },
  { icon: Heart, title: "Gum Treatment", description: "Comprehensive periodontal care for healthy gums, including deep cleaning and disease management", href: "/services/periodontics", image: heroSmile },
  { icon: Sparkles, title: "Tooth Whitening", description: "Professional teeth whitening for a brighter, more confident smile", href: "/services/cosmetic", image: teethWhitening },
  { icon: Crown, title: "Veneers", description: "Custom cosmetic veneers for a flawless, natural-looking smile", href: "/services/cosmetic", image: clinicInterior },
  { icon: Stethoscope, title: "Scaling & Polishing", description: "Deep cleaning and polishing to remove plaque and tartar buildup", href: "/services/general-preventive", image: dentistPatient },
];

export function ServicesSection() {
  const { ref, isInView } = useInView<HTMLDivElement>({ threshold: 0.1 });
  const { data: content } = useWebsiteContent("services");

  const heading = getContent(content, "services_heading", "Our Services");
  const description = getContent(content, "services_description", "We offer a comprehensive range of dental services to meet all your oral health needs. From preventive care to advanced cosmetic procedures.");

  return (
    <section ref={ref} className="py-20 md:py-28 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-secondary/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />

      <div className="container relative">
        <motion.div className="text-center max-w-3xl mx-auto mb-16" initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <h2 className="text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
            {heading.includes("Services") ? (<>Our <span className="text-secondary">Services</span></>) : heading}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-secondary to-primary mx-auto mt-4 rounded-full" />
          <p className="text-muted-foreground mt-6 text-lg">{description}</p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              className={`group relative bg-card rounded-2xl overflow-hidden shadow-lg card-hover ${index === 0 || index === 5 ? 'md:row-span-1' : ''}`}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="relative h-48 overflow-hidden">
                <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
                <div className="absolute top-4 left-4 w-12 h-12 rounded-xl bg-secondary/90 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <service.icon className="w-6 h-6 text-secondary-foreground" />
                </div>
              </div>
              <div className="p-6 relative">
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-secondary transition-colors">{service.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{service.description}</p>
                <Link to={service.href} className="inline-flex items-center text-secondary font-medium text-sm hover:underline group/link">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </motion.div>
          ))}
        </div>

        <motion.div className="text-center mt-12" initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.8 }}>
          <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 animate-pulse-glow group">
            <Link to="/services">
              View All Services
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}