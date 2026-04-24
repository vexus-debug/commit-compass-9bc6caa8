import { motion } from "framer-motion";
import { useInView } from "@/hooks/use-in-view";
import { Target, Eye, Quote } from "lucide-react";

export function MissionVisionSection() {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  return (
    <section ref={ref} className="relative overflow-hidden">
      <div className="grid md:grid-cols-2">
        {/* Mission Side */}
        <motion.div
          className="relative min-h-[600px] lg:min-h-[700px] flex items-center bg-primary p-8 md:p-12 lg:p-16"
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          {/* Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute -top-20 -left-20 w-64 h-64 bg-secondary/10 rounded-full blur-3xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            <Quote className="absolute top-8 right-8 w-24 h-24 text-white/5" />
          </div>

          <div className="relative z-10 max-w-lg">
            <motion.div
              className="w-20 h-20 rounded-2xl bg-secondary/20 backdrop-blur-sm flex items-center justify-center mb-8"
              initial={{ scale: 0, rotate: -20 }}
              animate={isInView ? { scale: 1, rotate: 0 } : {}}
              transition={{ delay: 0.3, type: "spring" }}
            >
              <Target className="h-10 w-10 text-secondary" />
            </motion.div>

            <motion.h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
            >
              Our Mission
            </motion.h2>

            <motion.div
              className="space-y-4 text-white/85"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
            >
              <p className="text-lg leading-relaxed">
                At Vista Dental Care, our mission extends beyond treating teeth—we're committed to 
                transforming lives through exceptional oral healthcare.
              </p>
              <p className="leading-relaxed">
                We provide personalized, high-quality dental care using modern techniques and 
                state-of-the-art technology, while ensuring patient comfort, safety, and satisfaction 
                at every stage of treatment.
              </p>
              <p className="leading-relaxed">
                Every patient who walks through our doors receives individualized attention, 
                comprehensive treatment planning, and the gentle care they deserve. We believe 
                that everyone deserves access to world-class dental services, delivered with 
                compassion and expertise.
              </p>
            </motion.div>

            {/* Decorative Quote */}
            <motion.div
              className="mt-8 pl-6 border-l-4 border-secondary"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.7 }}
            >
              <p className="text-white/90 italic text-lg">
                "Your smile is our passion, your health is our priority."
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Vision Side */}
        <motion.div
          className="relative min-h-[600px] lg:min-h-[700px] flex items-center bg-gradient-to-br from-secondary via-secondary to-secondary/90 p-8 md:p-12 lg:p-16"
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {/* Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"
              animate={{ scale: [1.2, 1, 1.2] }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            <Quote className="absolute bottom-8 left-8 w-24 h-24 text-white/5 rotate-180" />
          </div>

          <div className="relative z-10 max-w-lg">
            <motion.div
              className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-8"
              initial={{ scale: 0, rotate: 20 }}
              animate={isInView ? { scale: 1, rotate: 0 } : {}}
              transition={{ delay: 0.5, type: "spring" }}
            >
              <Eye className="h-10 w-10 text-white" />
            </motion.div>

            <motion.h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 }}
            >
              Our Vision
            </motion.h2>

            <motion.div
              className="space-y-4 text-white/90"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.7 }}
            >
              <p className="text-lg leading-relaxed">
                We envision Vista Dental Care as Abuja's premier destination for comprehensive 
                dental excellence—a place where cutting-edge innovation meets heartfelt care.
              </p>
              <p className="leading-relaxed">
                Our vision is to become a leading dental healthcare provider in Nigeria, recognized 
                not only for our clinical excellence and innovation but for the lasting relationships 
                we build with every patient and family we serve.
              </p>
              <p className="leading-relaxed">
                We aspire to set new standards in patient experience, continuously advancing our 
                skills, technology, and facilities to deliver long-term oral health solutions 
                that empower our patients to smile with confidence throughout their lives.
              </p>
            </motion.div>

            {/* Decorative Quote */}
            <motion.div
              className="mt-8 pl-6 border-l-4 border-white/50"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.9 }}
            >
              <p className="text-white italic text-lg">
                "Building a future where every smile tells a story of health and happiness."
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
