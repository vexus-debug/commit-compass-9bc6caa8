import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface RelatedService {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

interface RelatedServicesProps {
  title?: string;
  subtitle?: string;
  services: RelatedService[];
  currentService: string;
}

export function RelatedServices({ 
  title = "You Might Also Be Interested In",
  subtitle = "Related Services",
  services,
  currentService
}: RelatedServicesProps) {
  const filteredServices = services.filter(s => s.title !== currentService).slice(0, 3);

  return (
    <section className="py-20 md:py-28 bg-background relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative">
        {/* Header */}
        <motion.div 
          className="text-center space-y-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium">
            <Sparkles className="h-4 w-4 inline mr-2" />
            {subtitle}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-primary">
            {title}
          </h2>
        </motion.div>

        {/* Services Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {filteredServices.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link 
                to={service.href}
                className="group block h-full bg-card rounded-2xl p-8 border border-border shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center mb-6 group-hover:bg-secondary group-hover:scale-110 transition-all duration-300">
                  <service.icon className="h-7 w-7 text-secondary group-hover:text-secondary-foreground transition-colors" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-primary mb-3 group-hover:text-secondary transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-6 line-clamp-2">
                  {service.description}
                </p>

                {/* Link */}
                <div className="flex items-center text-secondary font-medium text-sm">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
