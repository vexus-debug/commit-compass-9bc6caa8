import { motion } from "framer-motion";
import { useInView } from "@/hooks/use-in-view";
import { GraduationCap, Award, Quote } from "lucide-react";
import patientFemale from "@/assets/patient-female.jpg";
import patientMale from "@/assets/patient-male.jpg";
import dentistPatient from "@/assets/dentist-patient.jpg";

const teamMembers = [
  {
    name: "Dr. Adaeze Okonkwo",
    role: "Lead Dentist & Founder",
    image: patientFemale,
    credentials: "BDS, FMCDS",
    experience: "8+ Years Experience",
    specializations: ["General Dentistry", "Cosmetic Procedures", "Oral Surgery"],
    quote: "Every smile we perfect is a life we touch. That's what drives me every single day.",
  },
  {
    name: "Dr. Chukwuemeka Eze",
    role: "Orthodontist",
    image: patientMale,
    credentials: "BDS, MSc Orthodontics",
    experience: "6+ Years Experience",
    specializations: ["Braces & Aligners", "Jaw Correction", "Pediatric Orthodontics"],
    quote: "The journey to a perfect smile should be as comfortable as the result is beautiful.",
  },
  {
    name: "Dr. Fatima Ibrahim",
    role: "Periodontal Specialist",
    image: dentistPatient,
    credentials: "BDS, MSc Periodontics",
    experience: "5+ Years Experience",
    specializations: ["Gum Treatment", "Dental Implants", "Bone Grafting"],
    quote: "Healthy gums are the foundation of a lasting smile. Prevention is always better than cure.",
  },
];

const TeamMemberCard = ({ 
  member, 
  index 
}: { 
  member: typeof teamMembers[0]; 
  index: number;
}) => {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  return (
    <motion.div
      ref={ref}
      className="group relative"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
    >
      <div className="relative bg-card rounded-3xl overflow-hidden border border-border/50 hover:border-secondary/30 transition-all duration-500 hover:shadow-2xl">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
          
          {/* Quote Reveal on Hover */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            initial={false}
          >
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 max-w-[90%]">
              <Quote className="h-8 w-8 text-secondary mb-3" />
              <p className="text-white text-sm md:text-base italic leading-relaxed">
                "{member.quote}"
              </p>
            </div>
          </motion.div>

          {/* Credentials Badge */}
          <div className="absolute top-4 left-4">
            <div className="flex items-center gap-2 bg-secondary/90 backdrop-blur-sm rounded-full px-3 py-1.5 text-sm font-medium text-white">
              <GraduationCap className="h-4 w-4" />
              {member.credentials}
            </div>
          </div>

          {/* Experience Badge */}
          <div className="absolute top-4 right-4">
            <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 text-sm font-medium text-primary">
              <Award className="h-4 w-4 text-secondary" />
              {member.experience}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-primary mb-1">{member.name}</h3>
          <p className="text-secondary font-medium mb-4">{member.role}</p>
          
          {/* Specializations */}
          <div className="flex flex-wrap gap-2">
            {member.specializations.map((spec) => (
              <span
                key={spec}
                className="px-3 py-1 bg-muted rounded-full text-xs text-muted-foreground"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export function TeamSection() {
  const { ref: headerRef, isInView: headerInView } = useInView();

  return (
    <section className="py-20 md:py-32 bg-muted relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
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
            The Experts Behind Your Smile
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6">
            Meet Our{" "}
            <span className="text-secondary">Team</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Our team of dedicated dental professionals brings together years of specialized 
            training, genuine compassion, and a shared commitment to transforming smiles. 
            Each member is handpicked not just for their expertise, but for their ability 
            to make you feel at home.
          </p>
        </motion.div>

        {/* Team Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <TeamMemberCard key={member.name} member={member} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-muted-foreground mb-4">
            Want to join our growing team of dental professionals?
          </p>
          <a
            href="/contact"
            className="text-secondary font-medium hover:underline inline-flex items-center gap-2"
          >
            View Career Opportunities
            <span>→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
