import { motion } from "framer-motion";
import { LucideIcon, BookOpen, Sparkles } from "lucide-react";

interface HighlightPoint {
  icon: LucideIcon;
  text: string;
}

interface TreatmentExplainerProps {
  title?: string;
  subtitle?: string;
  content: string[];
  highlights: HighlightPoint[];
  image?: string;
}

export function TreatmentExplainer({ 
  title = "What is This Treatment?",
  subtitle = "Understanding the Procedure",
  content,
  highlights,
  image
}: TreatmentExplainerProps) {
  return (
    <section className="py-20 md:py-28 bg-card relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-0 w-72 h-72 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          {/* Image Side */}
          <motion.div
            className="relative order-2 lg:order-1"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {image ? (
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-secondary/20 to-primary/10 rounded-3xl blur-sm" />
                <img 
                  src={image} 
                  alt="Treatment illustration"
                  className="relative rounded-2xl shadow-xl w-full object-cover aspect-[4/3]"
                />
                {/* Floating Badge */}
                <motion.div 
                  className="absolute -bottom-6 -right-6 bg-card rounded-2xl shadow-xl p-4 border border-border"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Modern</p>
                      <p className="text-xs text-muted-foreground">Techniques</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            ) : (
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-secondary/10 via-muted to-primary/10 flex items-center justify-center">
                <BookOpen className="h-24 w-24 text-secondary/30" />
              </div>
            )}
          </motion.div>

          {/* Content Side */}
          <motion.div 
            className="space-y-6 order-1 lg:order-2"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 text-sm text-secondary font-medium">
                <BookOpen className="h-4 w-4" />
                {subtitle}
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-primary">
                {title}
              </h2>
            </div>

            {/* Content Paragraphs */}
            <div className="space-y-4">
              {content.map((paragraph, index) => (
                <motion.p 
                  key={index}
                  className="text-muted-foreground leading-relaxed"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>

            {/* Highlights */}
            <div className="grid gap-4 sm:grid-cols-2 pt-4">
              {highlights.map((highlight, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-3 bg-muted rounded-xl p-4"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                    <highlight.icon className="h-5 w-5 text-secondary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{highlight.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
