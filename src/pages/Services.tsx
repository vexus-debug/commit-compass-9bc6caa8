import { useState } from "react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Stethoscope,
  Sparkles,
  Smile,
  Crown,
  Syringe,
  Scissors,
  Heart,
  ChevronRight,
  Star,
  Users,
  Award,
  Shield,
  Calendar,
  Phone,
  ArrowRight,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { useCounter } from "@/hooks/use-counter";
import { useInView } from "@/hooks/use-in-view";
import clinicImage from "@/assets/clinic-interior.jpg";
import dentalTeamImage from "@/assets/dental-team.jpg";
import patientFemaleImage from "@/assets/patient-female.jpg";
import patientMaleImage from "@/assets/patient-male.jpg";

const services = [
  {
    icon: Smile,
    title: "Braces, Routine Check-up & Consultation",
    shortTitle: "Braces & Check-up",
    description: "Orthodontic braces, routine dental check-ups, and professional consultations to maintain and improve your oral health.",
    href: "/services/orthodontics",
    color: "from-purple-500 to-violet-500",
    bgColor: "bg-purple-500/10",
    textColor: "text-purple-600",
    category: "preventive",
  },
  {
    icon: Syringe,
    title: "Dental Implants",
    shortTitle: "Implants",
    description: "Durable, natural-looking replacements for missing teeth using advanced implant technology, improving both function and aesthetics.",
    href: "/services/implants",
    color: "from-teal-500 to-cyan-500",
    bgColor: "bg-teal-500/10",
    textColor: "text-teal-600",
    category: "restorative",
  },
  {
    icon: Heart,
    title: "Gum Treatment",
    shortTitle: "Gum Care",
    description: "Treatment and management of gum-related diseases. Includes periodontal care for healthy gums and oral wellness.",
    href: "/services/periodontics",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-500/10",
    textColor: "text-green-600",
    category: "preventive",
  },
  {
    icon: Sparkles,
    title: "Tooth Whitening",
    shortTitle: "Whitening",
    description: "Professional teeth whitening treatments for a brighter, more confident smile using safe and effective techniques.",
    href: "/services/cosmetic",
    color: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-500/10",
    textColor: "text-pink-600",
    category: "cosmetic",
  },
  {
    icon: Crown,
    title: "Veneers (Cosmetic Dentistry)",
    shortTitle: "Veneers",
    description: "Custom cosmetic veneers to enhance the appearance of your teeth for a flawless, natural-looking smile.",
    href: "/services/cosmetic",
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-500/10",
    textColor: "text-amber-600",
    category: "cosmetic",
  },
  {
    icon: Stethoscope,
    title: "Scaling & Polishing",
    shortTitle: "Scaling",
    description: "Deep cleaning and polishing to remove plaque and tartar buildup, keeping your teeth and gums healthy.",
    href: "/services/general-preventive",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-600",
    category: "preventive",
  },
  {
    icon: Scissors,
    title: "Oral Surgery & Extractions",
    shortTitle: "Oral Surgery",
    description: "Expert extractions and wisdom tooth removal. Gentle surgical care to relieve pain and restore oral health.",
    href: "/services/oral-surgery",
    color: "from-red-500 to-rose-600",
    bgColor: "bg-red-500/10",
    textColor: "text-red-600",
    category: "surgical",
  },
];

const categories = [
  { id: "all", label: "All Services" },
  { id: "preventive", label: "Preventive" },
  { id: "cosmetic", label: "Cosmetic" },
  { id: "restorative", label: "Restorative" },
  { id: "surgical", label: "Surgical" },
];

const testimonials = [
  {
    quote: "The team at Vista Dental made me feel so comfortable. My teeth have never looked better!",
    author: "Sarah M.",
    service: "Teeth Whitening",
    rating: 5,
    image: patientFemaleImage,
  },
  {
    quote: "Professional, caring, and truly skilled. I finally have the smile I've always wanted.",
    author: "James K.",
    service: "Dental Implants",
    rating: 5,
    image: patientMaleImage,
  },
];

const FloatingElement = ({ className, delay = 0 }: { className?: string; delay?: number }) => (
  <motion.div
    className={className}
    initial={{ y: 0, opacity: 0.3 }}
    animate={{ y: [-20, 20, -20], opacity: [0.3, 0.6, 0.3] }}
    transition={{ duration: 6, repeat: Infinity, delay, ease: "easeInOut" }}
  >
    <Sparkles className="w-full h-full" />
  </motion.div>
);

const StatCounter = ({ end, label, suffix = "" }: { end: number; label: string; suffix?: string }) => {
  const { ref, isInView } = useInView({ threshold: 0.5 });
  const count = useCounter({ end, duration: 2000, enabled: isInView });

  return (
    <motion.div
      ref={ref}
      className="text-center p-8 bg-card rounded-2xl shadow-lg border border-border hover:shadow-xl transition-shadow"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-4xl md:text-5xl font-bold text-secondary mb-2">
        {count}{suffix}
      </div>
      <div className="text-muted-foreground font-medium">{label}</div>
    </motion.div>
  );
};

const Services = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const filteredServices = activeCategory === "all" 
    ? services 
    : services.filter(s => s.category === activeCategory);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[70vh] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={clinicImage} 
            alt="Vista Dental Care Clinic"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/70" />
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <FloatingElement className="absolute top-20 right-20 w-8 h-8 text-secondary/30" delay={0} />
          <FloatingElement className="absolute bottom-40 left-20 w-6 h-6 text-white/20" delay={1.5} />
          <FloatingElement className="absolute top-1/2 right-1/4 w-5 h-5 text-secondary/25" delay={3} />
          <div className="absolute top-1/4 right-10 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-10 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
        </div>

        <div className="container relative py-20 md:py-28 lg:py-36">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="space-y-6"
            >
              <motion.div 
                className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-2 text-sm text-white/90 font-medium"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Sparkles className="h-4 w-4 text-secondary" />
                Comprehensive Dental Care
              </motion.div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                Expert Dental Services in{" "}
                <span className="text-secondary">Abuja, Nigeria</span>
              </h1>

              <p className="text-lg text-white/80 max-w-xl">
                Looking for a trusted dental clinic in Abuja? Vista Dental Care offers a full range
                of dental services tailored to your unique needs — from preventive care to advanced
                cosmetic procedures, delivered with compassionate, professional care.
              </p>

              <motion.div 
                className="flex flex-col sm:flex-row gap-4 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground group shadow-lg"
                >
                  <Link to="/book-appointment">
                    <Calendar className="mr-2 h-5 w-5" />
                    Book Consultation
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button 
                  asChild 
                  size="lg" 
                  variant="outline" 
                  className="border-white/30 text-white hover:bg-white/10 hover:text-white"
                >
                  <Link to="/contact">
                    <Phone className="mr-2 h-5 w-5" />
                    Call Us Now
                  </Link>
                </Button>
              </motion.div>

              {/* Trust Badges */}
              <motion.div 
                className="flex flex-wrap gap-4 pt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                {[
                  { icon: Star, text: "5-Star Rated" },
                  { icon: Users, text: "500+ Patients" },
                  { icon: Award, text: "7+ Years" },
                ].map((badge, index) => (
                  <motion.div 
                    key={badge.text}
                    className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                  >
                    <badge.icon className="h-4 w-4 text-secondary" />
                    <span className="text-sm text-white/90 font-medium">{badge.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Category Tabs + Services Grid */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container">
          {/* Section Header */}
          <motion.div 
            className="text-center space-y-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium">
              Our Expertise
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              Explore Our Services
            </h2>
          </motion.div>

          {/* Category Tabs */}
          <motion.div 
            className="flex flex-wrap justify-center gap-3 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === category.id
                    ? "bg-secondary text-secondary-foreground shadow-lg shadow-secondary/25"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {category.label}
              </button>
            ))}
          </motion.div>

          {/* Services Grid */}
          <motion.div 
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            layout
          >
            <AnimatePresence mode="popLayout">
              {filteredServices.map((service, index) => (
                <motion.div
                  key={service.title}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <Link
                    to={service.href}
                    className="group block h-full bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                  >
                    {/* Gradient Top Bar */}
                    <div className={`h-2 bg-gradient-to-r ${service.color}`} />
                    
                    <div className="p-8">
                      {/* Icon */}
                      <div className={`h-16 w-16 rounded-2xl ${service.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <service.icon className={`h-8 w-8 ${service.textColor}`} />
                      </div>

                      {/* Content */}
                      <h3 className="text-xl font-semibold text-primary mb-3 group-hover:text-secondary transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-6 line-clamp-3">
                        {service.description}
                      </p>

                      {/* Link */}
                      <div className="flex items-center text-secondary font-medium text-sm">
                        Learn More
                        <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 md:py-28 bg-muted relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-secondary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="container relative">
          <motion.div 
            className="text-center space-y-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium">
              Why Trust Us
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              Numbers That Speak for Themselves
            </h2>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-4">
            <StatCounter end={500} suffix="+" label="Happy Patients" />
            <StatCounter end={7} suffix="+" label="Years Experience" />
            <StatCounter end={1000} suffix="+" label="Procedures Done" />
            <StatCounter end={98} suffix="%" label="Success Rate" />
          </div>
        </div>
      </section>

      {/* Why Choose Us with Image */}
      <section className="py-20 md:py-28 bg-card">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            {/* Image */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="absolute -inset-4 bg-gradient-to-br from-secondary/20 to-primary/10 rounded-3xl blur-sm" />
              <img 
                src={dentalTeamImage} 
                alt="Vista Dental Team"
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
                    <Shield className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Certified</p>
                    <p className="text-xs text-muted-foreground">Professionals</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Content */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium">
                Why Choose Vista
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-primary">
                Excellence in Every Smile We Create
              </h2>
              <p className="text-muted-foreground text-lg">
                At Vista Dental Care, we combine advanced technology with compassionate care 
                to deliver exceptional dental services. Our team is committed to making your 
                visit comfortable and your results outstanding.
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { icon: Shield, text: "Safe & Sterile Environment" },
                  { icon: Clock, text: "Flexible Appointment Times" },
                  { icon: Award, text: "Experienced Professionals" },
                  { icon: Heart, text: "Patient-Centered Care" },
                ].map((item, index) => (
                  <motion.div
                    key={item.text}
                    className="flex items-center gap-3 bg-muted rounded-xl p-4"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                      <item.icon className="h-5 w-5 text-secondary" />
                    </div>
                    <span className="text-sm font-medium">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-primary via-primary to-dental-navy-light relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div 
            className="absolute top-20 right-20 opacity-10"
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-48 h-48 text-white" />
          </motion.div>
        </div>

        <div className="container relative">
          <motion.div 
            className="text-center space-y-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium">
              <Star className="h-4 w-4 inline mr-2 text-yellow-400" />
              Patient Stories
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              What Our Patients Say
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonialIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/10"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonials[testimonialIndex].rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-xl md:text-2xl text-white font-medium mb-8">
                  "{testimonials[testimonialIndex].quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <img 
                    src={testimonials[testimonialIndex].image}
                    alt={testimonials[testimonialIndex].author}
                    className="w-14 h-14 rounded-full object-cover border-2 border-secondary"
                  />
                  <div>
                    <p className="font-semibold text-white">{testimonials[testimonialIndex].author}</p>
                    <p className="text-white/70 text-sm">{testimonials[testimonialIndex].service}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setTestimonialIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === testimonialIndex 
                      ? "bg-secondary w-8" 
                      : "bg-white/30 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary/90 to-dental-teal-light animate-gradient" />
        
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute top-10 left-10 w-32 h-32 rounded-full border-2 border-white/10"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute bottom-10 right-10 w-48 h-48 rounded-full border-2 border-white/10"
            animate={{ scale: [1.2, 1, 1.2] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="container relative">
          <motion.div 
            className="max-w-3xl mx-auto text-center space-y-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              Not Sure Which Service You Need?
            </h2>
            <p className="text-lg text-white/90">
              Book a consultation with our dental experts. We'll assess your needs and 
              recommend the best treatment plan personalized just for you.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild 
                size="lg" 
                className="bg-white text-secondary hover:bg-white/90 group shadow-xl"
              >
                <Link to="/book-appointment">
                  <Calendar className="mr-2 h-5 w-5" />
                  Book Free Consultation
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button 
                asChild 
                size="lg" 
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 hover:text-white"
              >
                <Link to="/contact">
                  <Phone className="mr-2 h-5 w-5" />
                  Call Us Now
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-6 pt-4">
              {["Free Consultation", "No Obligations", "Expert Advice"].map((item) => (
                <div key={item} className="flex items-center gap-2 text-white/90">
                  <CheckCircle2 className="h-5 w-5 text-white" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
