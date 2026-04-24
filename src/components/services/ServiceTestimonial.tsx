import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ServiceTestimonialProps {
  quote: string;
  author: string;
  role?: string;
  image?: string;
  rating?: number;
  service: string;
}

export function ServiceTestimonial({ 
  quote, 
  author, 
  role = "Patient",
  image,
  rating = 5,
  service
}: ServiceTestimonialProps) {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-primary via-primary to-dental-navy-light relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-48 h-48 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <motion.div 
          className="absolute top-20 right-20 opacity-10"
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        >
          <Quote className="w-64 h-64 text-white" />
        </motion.div>
      </div>

      <div className="container relative">
        <motion.div 
          className="max-w-4xl mx-auto text-center space-y-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {/* Service Badge */}
          <motion.div
            className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-2 text-sm text-white/90 font-medium"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            {service} Success Story
          </motion.div>

          {/* Quote Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <Quote className="h-16 w-16 text-secondary mx-auto" />
          </motion.div>

          {/* Quote Text */}
          <motion.blockquote 
            className="text-2xl md:text-3xl lg:text-4xl font-medium text-white leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            "{quote}"
          </motion.blockquote>

          {/* Rating */}
          <motion.div 
            className="flex justify-center gap-1"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            {[...Array(rating)].map((_, i) => (
              <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
            ))}
          </motion.div>

          {/* Author */}
          <motion.div 
            className="flex items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            {image ? (
              <img 
                src={image} 
                alt={author}
                className="w-14 h-14 rounded-full object-cover border-2 border-secondary"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-secondary/20 flex items-center justify-center">
                <span className="text-xl font-bold text-secondary">
                  {author.charAt(0)}
                </span>
              </div>
            )}
            <div className="text-left">
              <p className="font-semibold text-white text-lg">{author}</p>
              <p className="text-white/70 text-sm">{role}</p>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
            className="pt-4"
          >
            <Button asChild variant="secondary" className="bg-secondary hover:bg-secondary/90">
              <Link to="/testimonials">
                Read More Success Stories
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
