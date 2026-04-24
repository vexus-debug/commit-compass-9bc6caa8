import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface ProcessStep {
  step: number;
  title: string;
  description: string;
  icon: LucideIcon;
}

interface ProcessTimelineProps {
  title?: string;
  subtitle?: string;
  steps: ProcessStep[];
}

export function ProcessTimeline({ 
  title = "Your Treatment Journey",
  subtitle = "Step by Step",
  steps 
}: ProcessTimelineProps) {
  return (
    <section className="py-20 md:py-28 bg-muted relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative">
        {/* Header */}
        <motion.div 
          className="text-center space-y-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium">
            {subtitle}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-primary">
            {title}
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Connecting Line - Desktop */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-secondary/20 via-secondary/40 to-secondary/20" />

          {/* Steps Grid */}
          <div className="grid gap-8 lg:grid-cols-4 lg:gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                {/* Mobile Connecting Line */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden absolute left-10 top-24 bottom-0 w-0.5 bg-gradient-to-b from-secondary/40 to-secondary/10 -mb-8" />
                )}

                <div className="flex flex-col items-center text-center lg:items-center">
                  {/* Step Number Circle */}
                  <motion.div 
                    className="relative mb-6"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="w-20 h-20 rounded-full bg-card shadow-lg flex items-center justify-center border-4 border-secondary/20 relative z-10">
                      <step.icon className="h-8 w-8 text-secondary" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-bold text-sm shadow-lg">
                      {step.step}
                    </div>
                  </motion.div>

                  {/* Content */}
                  <div className="space-y-3 max-w-xs">
                    <h3 className="text-lg font-semibold text-primary">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
