import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "@/hooks/use-in-view";
import { useCounter } from "@/hooks/use-counter";
import { 
  ChevronLeft, 
  ChevronRight, 
  Monitor, 
  ShieldCheck, 
  Armchair,
  Scan,
  Sparkles,
  ThermometerSun
} from "lucide-react";
import { Button } from "@/components/ui/button";
import clinicInterior from "@/assets/clinic-interior.jpg";
import dentalTechnology from "@/assets/dental-technology.jpg";
import dentistPatient from "@/assets/dentist-patient.jpg";

const facilityImages = [
  {
    src: clinicInterior,
    title: "Modern Reception Area",
    description: "A welcoming, comfortable space designed to put you at ease from the moment you arrive.",
  },
  {
    src: dentalTechnology,
    title: "Advanced Treatment Rooms",
    description: "State-of-the-art equipment in pristine, climate-controlled treatment environments.",
  },
  {
    src: dentistPatient,
    title: "Patient Consultation",
    description: "Private consultation spaces for thorough discussions about your dental health.",
  },
];

const features = [
  {
    icon: Scan,
    title: "Digital Imaging",
    description: "High-resolution digital X-rays with 90% less radiation than traditional systems.",
  },
  {
    icon: ShieldCheck,
    title: "Sterilization Center",
    description: "Hospital-grade autoclaves and strict protocols ensuring complete instrument sterility.",
  },
  {
    icon: Armchair,
    title: "Comfort Amenities",
    description: "Ergonomic chairs, entertainment systems, and relaxation options for stress-free visits.",
  },
  {
    icon: Monitor,
    title: "Intraoral Cameras",
    description: "See what we see—high-definition cameras for transparent diagnosis discussions.",
  },
  {
    icon: ThermometerSun,
    title: "Climate Control",
    description: "Temperature-regulated rooms ensuring your comfort throughout every procedure.",
  },
  {
    icon: Sparkles,
    title: "HEPA Filtration",
    description: "Medical-grade air purification systems maintaining the cleanest possible environment.",
  },
];

const stats = [
  { value: 100, suffix: "%", label: "Hygiene Standard" },
  { value: 6, suffix: "+", label: "Treatment Rooms" },
  { value: 2024, suffix: "", label: "Equipment Year" },
  { value: 24, suffix: "/7", label: "Air Purification" },
];

const StatItem = ({ stat, delay }: { stat: typeof stats[0]; delay: number }) => {
  const { ref, isInView } = useInView({ threshold: 0.5 });
  const count = useCounter({ end: stat.value, duration: 2000, enabled: isInView });

  return (
    <motion.div
      ref={ref}
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay }}
    >
      <p className="text-4xl md:text-5xl font-bold text-secondary">
        {count}{stat.suffix}
      </p>
      <p className="text-muted-foreground mt-1">{stat.label}</p>
    </motion.div>
  );
};

export function FacilitiesSection() {
  const [currentImage, setCurrentImage] = useState(0);
  const { ref: headerRef, isInView: headerInView } = useInView();

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % facilityImages.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + facilityImages.length) % facilityImages.length);
  };

  return (
    <section className="py-20 md:py-32 bg-background relative overflow-hidden">
      <div className="container">
        {/* Header */}
        <motion.div
          ref={headerRef}
          className="max-w-3xl mx-auto text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
            Our Facilities
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6">
            State-of-the-Art{" "}
            <span className="text-secondary">Environment</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Step into a world where comfort meets cutting-edge technology. Our facilities are 
            designed with your well-being in mind, featuring the latest dental innovations 
            in a serene, welcoming atmosphere.
          </p>
        </motion.div>

        {/* Image Carousel */}
        <motion.div
          className="relative mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImage}
                src={facilityImages[currentImage].src}
                alt={facilityImages[currentImage].title}
                className="w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              />
            </AnimatePresence>
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
            
            {/* Caption */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImage}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    {facilityImages[currentImage].title}
                  </h3>
                  <p className="text-white/80 max-w-xl">
                    {facilityImages[currentImage].description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Arrows */}
            <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 flex justify-between pointer-events-none">
              <Button
                variant="secondary"
                size="icon"
                onClick={prevImage}
                className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 pointer-events-auto"
              >
                <ChevronLeft className="h-5 w-5 text-white" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={nextImage}
                className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 pointer-events-auto"
              >
                <ChevronRight className="h-5 w-5 text-white" />
              </Button>
            </div>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {facilityImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    index === currentImage 
                      ? "bg-white w-8" 
                      : "bg-white/50 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 py-8 border-y border-border">
          {stats.map((stat, index) => (
            <StatItem key={stat.label} stat={stat} delay={index * 0.1} />
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="group p-6 bg-card rounded-2xl border border-border/50 hover:border-secondary/30 hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                <feature.icon className="h-7 w-7 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold text-primary mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
