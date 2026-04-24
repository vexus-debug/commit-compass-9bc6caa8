import { motion } from "framer-motion";
import { useInView } from "@/hooks/use-in-view";
import { Building2, Users, Cpu, TrendingUp, Award, Heart } from "lucide-react";
import dentalTeam from "@/assets/dental-team.jpg";
import dentalTechnology from "@/assets/dental-technology.jpg";

const milestones = [
  {
    year: "2019",
    icon: Building2,
    title: "The Beginning",
    description: "Vista Dental Care opened its doors in Gaduwa, Abuja, with a vision to revolutionize dental care in Nigeria. Founded by passionate dental professionals, we started with a commitment to patient-first philosophy.",
  },
  {
    year: "2020",
    icon: Users,
    title: "Growing Family",
    description: "Within our first year, we welcomed over 200 patients into our care family. Word spread about our gentle approach and exceptional results, building a foundation of trust in the community.",
  },
  {
    year: "2021",
    icon: Cpu,
    title: "Tech Upgrade",
    description: "We invested in cutting-edge digital imaging technology, including advanced X-ray systems and intraoral cameras, allowing for more accurate diagnoses and treatment planning.",
  },
  {
    year: "2022",
    icon: TrendingUp,
    title: "Service Expansion",
    description: "Responding to patient needs, we expanded our service offerings to include cosmetic dentistry, orthodontics, and specialized periodontal treatments, becoming a comprehensive dental destination.",
  },
  {
    year: "2023",
    icon: Award,
    title: "Excellence Recognized",
    description: "Our commitment to quality earned recognition from dental associations and most importantly, the trust of over 500 satisfied patients who chose Vista as their dental home.",
  },
  {
    year: "2024",
    icon: Heart,
    title: "Community Focus",
    description: "Today, we continue our mission with renewed vigor, introducing community dental health programs and expanding our facilities to serve more families across Abuja.",
  },
];

const TimelineItem = ({ 
  milestone, 
  index 
}: { 
  milestone: typeof milestones[0]; 
  index: number;
}) => {
  const { ref, isInView } = useInView({ threshold: 0.3 });
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      className="relative flex items-center"
      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {/* Timeline line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2 hidden md:block" />
      
      {/* Content */}
      <div className={`w-full md:w-1/2 ${isEven ? "md:pr-12 md:text-right" : "md:pl-12 md:ml-auto"}`}>
        <motion.div
          className="bg-card rounded-2xl p-6 shadow-lg border border-border/50 hover:shadow-xl transition-shadow duration-300"
          whileHover={{ y: -5 }}
        >
          <div className={`flex items-center gap-4 mb-4 ${isEven ? "md:flex-row-reverse" : ""}`}>
            <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
              <milestone.icon className="h-7 w-7 text-secondary" />
            </div>
            <div>
              <span className="text-secondary font-bold text-lg">{milestone.year}</span>
              <h3 className="text-xl font-semibold text-primary">{milestone.title}</h3>
            </div>
          </div>
          <p className="text-muted-foreground leading-relaxed">{milestone.description}</p>
        </motion.div>
      </div>

      {/* Center dot */}
      <motion.div
        className="absolute left-1/2 w-5 h-5 bg-secondary rounded-full border-4 border-background -translate-x-1/2 hidden md:block z-10"
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ delay: 0.4 }}
      />
    </motion.div>
  );
};

export function StoryTimelineSection() {
  const { ref: headerRef, isInView: headerInView } = useInView();

  return (
    <section className="py-20 md:py-32 bg-background relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-secondary/5 to-transparent" />
        <div className="absolute bottom-0 right-0 w-1/3 h-1/2 bg-gradient-to-t from-primary/5 to-transparent" />
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
            Our Journey
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6">
            The Vista Dental{" "}
            <span className="text-secondary">Story</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            What began as a dream to provide world-class dental care in Abuja has grown into a 
            thriving practice serving hundreds of families. Our journey is marked by continuous 
            growth, unwavering commitment to excellence, and the smiles we've transformed along the way.
          </p>
        </motion.div>

        {/* Image Gallery */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <motion.div
            className="relative rounded-2xl overflow-hidden aspect-[4/3] group"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img
              src={dentalTeam}
              alt="Vista Dental Care professional team"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-white font-semibold text-lg">Our Dedicated Team</p>
              <p className="text-white/80 text-sm">Passionate professionals committed to your smile</p>
            </div>
          </motion.div>
          <motion.div
            className="relative rounded-2xl overflow-hidden aspect-[4/3] group"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <img
              src={dentalTechnology}
              alt="State-of-the-art dental technology"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-white font-semibold text-lg">Modern Technology</p>
              <p className="text-white/80 text-sm">Cutting-edge equipment for precise care</p>
            </div>
          </motion.div>
        </div>

        {/* Timeline */}
        <div className="space-y-8 md:space-y-12">
          {milestones.map((milestone, index) => (
            <TimelineItem key={milestone.year} milestone={milestone} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
