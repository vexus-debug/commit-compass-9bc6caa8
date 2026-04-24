import { motion } from "framer-motion";
import { Calendar, Building2, Stethoscope, Smile, CheckCircle } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";
import clinicImage from "@/assets/clinic-interior.jpg";
import dentistPatient from "@/assets/dentist-patient.jpg";
import heroSmile from "@/assets/hero-smile.jpg";

const steps = [
  {
    number: 1,
    icon: Calendar,
    title: "Book Appointment",
    description: "Schedule your visit online or call us directly",
    color: "from-blue-500 to-blue-600",
    image: null,
  },
  {
    number: 2,
    icon: Building2,
    title: "Visit Clinic",
    description: "Experience our modern, comfortable facility",
    color: "from-secondary to-teal-600",
    image: clinicImage,
  },
  {
    number: 3,
    icon: Stethoscope,
    title: "Consultation",
    description: "Get expert diagnosis and treatment plan",
    color: "from-purple-500 to-purple-600",
    image: dentistPatient,
  },
  {
    number: 4,
    icon: Smile,
    title: "Beautiful Smile",
    description: "Leave with the smile you've always wanted",
    color: "from-pink-500 to-rose-500",
    image: heroSmile,
  },
];

export function TreatmentProcessSection() {
  const { ref, isInView } = useInView<HTMLDivElement>({ threshold: 0.1 });

  return (
    <section ref={ref} className="py-20 md:py-28 bg-gradient-to-br from-dental-teal-pale via-background to-dental-mint relative overflow-hidden">
      {/* Floating decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-20 left-10 w-16 h-16 text-secondary/10"
          animate={{ y: [-10, 10, -10], rotate: [-5, 5, -5] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          <Smile className="w-full h-full" />
        </motion.div>
        <motion.div 
          className="absolute bottom-20 right-10 w-12 h-12 text-primary/10"
          animate={{ y: [10, -10, 10], rotate: [5, -5, 5] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        >
          <CheckCircle className="w-full h-full" />
        </motion.div>
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
            Your Journey to a <span className="text-secondary">Perfect Smile</span>
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            Simple, comfortable process from consultation to transformation
          </p>
        </motion.div>

        {/* Timeline - Desktop */}
        <div className="hidden lg:block relative">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-secondary/30 to-transparent transform -translate-y-1/2" />
          <motion.div
            className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-secondary via-primary to-secondary transform -translate-y-1/2"
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ transformOrigin: "left" }}
          />

          <div className="grid grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                className="relative flex flex-col items-center"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.2 }}
              >
                {/* Step Circle */}
                <motion.div
                  className={`relative w-20 h-20 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg z-10`}
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.2, type: "spring" }}
                >
                  <step.icon className="w-10 h-10 text-white" />
                  
                  {/* Pulsing ring */}
                  <motion.div
                    className={`absolute inset-0 rounded-full bg-gradient-to-br ${step.color} opacity-30`}
                    animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                  />
                  
                  {/* Step number */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-card border-2 border-secondary rounded-full flex items-center justify-center text-sm font-bold text-secondary shadow">
                    {step.number}
                  </div>
                </motion.div>

                {/* Content Card */}
                <motion.div
                  className="mt-8 text-center bg-card rounded-2xl p-6 shadow-lg card-hover w-full"
                  whileHover={{ y: -5 }}
                >
                  {step.image && (
                    <div className="w-full h-32 rounded-xl overflow-hidden mb-4 -mt-12">
                      <img 
                        src={step.image} 
                        alt={step.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Timeline - Mobile (Vertical) */}
        <div className="lg:hidden relative">
          {/* Vertical Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-secondary via-primary to-secondary" />

          <div className="space-y-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                className="relative flex gap-6"
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.15 }}
              >
                {/* Step Circle */}
                <div className={`relative w-16 h-16 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg shrink-0 z-10`}>
                  <step.icon className="w-8 h-8 text-white" />
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-card border-2 border-secondary rounded-full flex items-center justify-center text-xs font-bold text-secondary">
                    {step.number}
                  </div>
                </div>

                {/* Content Card */}
                <div className="flex-1 bg-card rounded-2xl p-4 shadow-lg">
                  {step.image && (
                    <div className="w-full h-24 rounded-lg overflow-hidden mb-3">
                      <img 
                        src={step.image} 
                        alt={step.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-foreground mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
