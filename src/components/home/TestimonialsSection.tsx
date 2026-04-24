import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Star, ChevronLeft, ChevronRight, Quote, Play } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";
import { useWebsiteTestimonials } from "@/hooks/useWebsiteContent";
import patientMale from "@/assets/patient-male.jpg";
import patientFemale from "@/assets/patient-female.jpg";
import heroSmile from "@/assets/hero-smile.jpg";

const fallbackImages = [patientFemale, patientMale, heroSmile, patientMale, patientFemale];

const fallbackTestimonials = [
  { id: "1", name: "Amina O.", role: "Teeth Whitening", rating: 5, text: "Vista Dental Care transformed my smile!", image_url: "" },
  { id: "2", name: "Chukwudi E.", role: "Dental Implants", rating: 5, text: "Best dental experience I've ever had.", image_url: "" },
  { id: "3", name: "Fatima M.", role: "Root Canal", rating: 5, text: "Dr. Vista made it painless.", image_url: "" },
];

export function TestimonialsSection() {
  const { ref, isInView } = useInView<HTMLDivElement>({ threshold: 0.1 });
  const { data: dbTestimonials } = useWebsiteTestimonials();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials = (dbTestimonials && dbTestimonials.length > 0)
    ? dbTestimonials.map((t: any, i: number) => ({
        ...t,
        image: t.image_url || fallbackImages[i % fallbackImages.length],
      }))
    : fallbackTestimonials.map((t, i) => ({ ...t, image: fallbackImages[i % fallbackImages.length] }));

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  // Reset index if testimonials change
  useEffect(() => {
    setCurrentIndex(0);
  }, [testimonials.length]);

  const current = testimonials[currentIndex];
  if (!current) return null;

  return (
    <section ref={ref} className="py-20 md:py-28 bg-card relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'%3E%3Cpath fill='%23059669' d='M40 20c-5 0-9 3-10 8-1 5-2 10-2 15 0 4 2 8 4 12 2 4 4 6 8 6s6-2 8-6c2-4 4-8 4-12 0-5-1-10-2-15-1-5-5-8-10-8z'/%3E%3C/svg%3E")`,
          backgroundSize: '80px 80px',
        }} />
      </div>

      <div className="container relative">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
            What Our <span className="text-secondary">Patients Say</span>
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            Don't just take our word for it. Here's what our patients have to say about their experience.
          </p>
        </motion.div>

        <div 
          className="relative max-w-5xl mx-auto"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div className="relative overflow-hidden rounded-3xl bg-muted shadow-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="grid md:grid-cols-2"
              >
                <div className="relative h-64 md:h-auto">
                  <img 
                    src={current.image} 
                    alt={current.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-muted md:bg-gradient-to-t md:from-muted/50 md:to-transparent" />
                  <motion.button
                    className="absolute bottom-4 left-4 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-16 h-16 bg-secondary rounded-full flex items-center justify-center shadow-lg"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Play className="w-6 h-6 text-secondary-foreground ml-1" />
                  </motion.button>
                </div>

                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <Quote className="w-12 h-12 text-secondary/20 mb-4" />
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: current.rating || 5 }).map((_, i) => (
                      <motion.div key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-lg text-foreground mb-6 leading-relaxed">"{current.text}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-secondary">
                      <img src={current.image} alt={current.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{current.name}</p>
                      <p className="text-sm text-muted-foreground">{current.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <button onClick={prevSlide} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 w-12 h-12 bg-card rounded-full shadow-lg flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-colors z-10" aria-label="Previous testimonial">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={nextSlide} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 w-12 h-12 bg-card rounded-full shadow-lg flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-colors z-10" aria-label="Next testimonial">
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_: any, index: number) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-secondary w-8' : 'bg-secondary/30 hover:bg-secondary/50'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
        >
          <Button asChild variant="outline" className="group">
            <Link to="/testimonials">
              Read More Reviews
              <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}