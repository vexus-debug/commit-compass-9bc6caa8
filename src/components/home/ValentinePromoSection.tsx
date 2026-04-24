import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, Gift, Clock } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";
import coupleImage from "@/assets/couple-smiling.jpg";

// Valentine's Day promo end date
const PROMO_END_DATE = new Date("2026-02-21T23:59:59");

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function useCountdown(endDate: Date) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = endDate.getTime() - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  return timeLeft;
}

const FloatingHeart = ({ className, delay = 0, size = "w-6 h-6" }: { className?: string; delay?: number; size?: string }) => (
  <motion.div
    className={className}
    initial={{ y: 0, opacity: 0.6 }}
    animate={{ 
      y: [-20, 20, -20], 
      opacity: [0.6, 1, 0.6],
      scale: [1, 1.1, 1],
    }}
    transition={{ duration: 4, repeat: Infinity, delay, ease: "easeInOut" }}
  >
    <Heart className={`${size} fill-current`} />
  </motion.div>
);

export function ValentinePromoSection() {
  const { ref, isInView } = useInView<HTMLDivElement>({ threshold: 0.2 });
  const timeLeft = useCountdown(PROMO_END_DATE);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section 
      ref={ref} 
      className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-r from-pink-500 via-rose-500 to-red-500"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-rose-500 to-red-500 animate-gradient opacity-80" />

      {/* Floating hearts decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <FloatingHeart className="absolute top-10 left-[10%] text-white/30" delay={0} size="w-8 h-8" />
        <FloatingHeart className="absolute top-20 right-[15%] text-pink-200/40" delay={0.5} size="w-6 h-6" />
        <FloatingHeart className="absolute bottom-20 left-[20%] text-white/20" delay={1} size="w-10 h-10" />
        <FloatingHeart className="absolute top-1/3 right-[8%] text-rose-200/30" delay={1.5} size="w-5 h-5" />
        <FloatingHeart className="absolute bottom-10 right-[25%] text-white/25" delay={2} size="w-7 h-7" />
        <FloatingHeart className="absolute top-1/2 left-[5%] text-pink-200/30" delay={0.8} size="w-4 h-4" />
        
        {/* Sparkle decorations */}
        <motion.div 
          className="absolute top-16 left-1/4 text-white/40"
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        >
          <Sparkles className="w-6 h-6" />
        </motion.div>
        <motion.div 
          className="absolute bottom-16 right-1/3 text-white/30"
          animate={{ rotate: -360, scale: [1, 1.3, 1] }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        >
          <Sparkles className="w-8 h-8" />
        </motion.div>
      </div>

      <div className="container relative">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          {/* Left Content */}
          <motion.div
            className="space-y-8 text-white"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            {/* Badge */}
            <motion.div 
              className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-4 py-2 text-sm font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
            >
              <Gift className="h-4 w-4" />
              Limited Time Offer
            </motion.div>

            <h2 className="text-4xl font-bold sm:text-5xl lg:text-6xl">
              Valentine's Day<br />
              <span className="text-pink-200">Special Offer</span>
            </h2>

            <p className="text-lg text-white/90 max-w-lg">
              Show your smile some love! Enjoy <strong>25% OFF</strong> on all dental services 
              from February 1-21, 2026. Perfect time to get that smile makeover you've been dreaming of.
            </p>

            {/* Countdown Timer */}
            <motion.div
              className="flex gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
            >
              {[
                { value: timeLeft.days, label: "Days" },
                { value: timeLeft.hours, label: "Hours" },
                { value: timeLeft.minutes, label: "Mins" },
                { value: timeLeft.seconds, label: "Secs" },
              ].map((item) => (
                <div 
                  key={item.label}
                  className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center min-w-[70px]"
                >
                  <div className="text-3xl font-bold">{String(item.value).padStart(2, '0')}</div>
                  <div className="text-xs text-white/80 uppercase tracking-wide">{item.label}</div>
                </div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <Button 
                asChild 
                size="lg" 
                className="bg-white text-rose-500 hover:bg-white/90 group relative overflow-hidden"
              >
                <Link to="/book-appointment">
                  <span className="relative z-10 flex items-center">
                    <Heart className="mr-2 h-4 w-4 fill-rose-500" />
                    Book Now & Save
                  </span>
                  
                  {/* Confetti effect on hover */}
                  {isHovered && (
                    <>
                      {[...Array(6)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: ['#ff6b6b', '#ff8787', '#ffa8a8', '#ffb3b3', '#ffc9c9', '#ffe3e3'][i],
                            left: `${Math.random() * 100}%`,
                            bottom: 0,
                          }}
                          initial={{ y: 0, opacity: 1 }}
                          animate={{ y: -100, opacity: 0 }}
                          transition={{ duration: 0.8, delay: i * 0.1 }}
                        />
                      ))}
                    </>
                  )}
                </Link>
              </Button>
              <Button 
                asChild 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10 bg-transparent"
              >
                <Link to="/promotions">Learn More</Link>
              </Button>
            </motion.div>

            {/* Small print */}
            <p className="text-sm text-white/60 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Valid February 1-21, 2026. Terms apply.
            </p>
          </motion.div>

          {/* Right - Image with 25% Badge */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {/* Image container */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src={coupleImage} 
                alt="Happy couple with beautiful smiles"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-rose-500/30 via-transparent to-transparent" />
            </div>

            {/* 25% OFF Badge */}
            <motion.div
              className="absolute -top-6 -right-6 w-32 h-32"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <div className="w-full h-full rounded-full bg-white shadow-2xl flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-rose-500">25%</span>
                <span className="text-lg font-bold text-rose-500">OFF</span>
              </div>
            </motion.div>

            {/* Decorative hearts around image */}
            <motion.div 
              className="absolute -bottom-4 -left-4 w-16 h-16 bg-pink-400/80 rounded-full flex items-center justify-center shadow-lg"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Heart className="w-8 h-8 text-white fill-white" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
