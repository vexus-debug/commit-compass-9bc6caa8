import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertTriangle,
  Check,
  Clock,
  MessageCircle,
  Star,
  Sparkles,
  ShieldCheck,
  X,
} from "lucide-react";
import patientReviewsImg from "@/assets/yellow-teeth-reviews.jpg";
import whatsappReviewImg from "@/assets/yellow-teeth-whatsapp-review.jpg";
import beforeAfter1 from "@/assets/yellow-teeth-ba-1.jpg";
import beforeAfter2 from "@/assets/yellow-teeth-ba-2.jpg";
import beforeAfter3 from "@/assets/yellow-teeth-ba-3.jpg";
import beforeAfter4 from "@/assets/yellow-teeth-ba-4.jpg";
import whiteningImg from "@/assets/yellow-teeth-whitening.jpg";
import scalingImg from "@/assets/yellow-teeth-scaling.jpg";
import veneerBA1 from "@/assets/veneer-before-after-1.jpg";
import veneerBA2 from "@/assets/veneer-before-after-2.jpg";

const beforeAfterResults = [
  { src: beforeAfter1, alt: "Before and after scaling: heavy tartar buildup removed, healthy gums revealed" },
  { src: beforeAfter2, alt: "Before and after scaling: deep brown stains lifted, natural white restored" },
  { src: beforeAfter3, alt: "Before and after scaling: dark tartar cleared from gum line, gums healing" },
  { src: beforeAfter4, alt: "Before and after scaling: lower teeth fully cleaned of hardened tartar" },
];

const WHATSAPP_URL =
  "https://wa.me/2347088788880?text=Hi%20VistaDentalcare%2C%20I%20saw%20your%20page%20about%20yellow%20teeth%20and%20would%20like%20to%20chat.";

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.55, ease: "easeOut" as const },
};

function WhatsAppButton({
  size = "lg",
  label = "Chat With VistaDentalcare on WhatsApp",
  className = "",
}: {
  size?: "lg" | "xl";
  label?: string;
  className?: string;
}) {
  const sizing =
    size === "xl"
      ? "px-8 py-5 text-base md:text-lg"
      : "px-6 py-3.5 text-sm md:text-base";
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex items-center justify-center gap-2.5 rounded-full font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl active:scale-[0.99] ${sizing} ${className}`}
      style={{
        backgroundColor: "#25D366",
        boxShadow: "0 18px 40px -12px rgba(37, 211, 102, 0.55)",
      }}
    >
      <MessageCircle className="h-5 w-5 transition-transform group-hover:rotate-[-8deg]" strokeWidth={2.5} />
      {label}
    </a>
  );
}

const symptoms = [
  {
    title: "Yellow or dull teeth",
    desc: "Even after brushing — often worse near the gum line",
  },
  {
    title: "Persistent bad breath",
    desc: "That returns quickly even after brushing",
  },
  {
    title: "Gums that bleed",
    desc: "When you brush or touch them",
  },
  {
    title: 'Teeth that feel "rough"',
    desc: "Or like they never feel truly clean",
  },
];

const tableRows = [
  {
    label: "Purpose",
    a: "Health + Aesthetics — removes plaque, tartar & surface stains",
    b: "Cosmetic — lightens the natural colour of the tooth",
  },
  {
    label: "Who needs it",
    a: "Almost everyone — recommended every 6 months",
    b: "People wanting a brighter shade beyond clean teeth",
  },
  {
    label: "Fixes yellow from buildup?",
    a: "✅ Yes — this is exactly what it's designed for",
    b: "❌ No — whitening doesn't remove tartar or plaque",
  },
  {
    label: "Protects gum health?",
    a: "✅ Yes — reduces risk of gum disease",
    b: "❌ No — purely cosmetic",
  },
  {
    label: "Best used",
    a: "First — as a foundation for oral health",
    b: "After scaling & polishing, if still desired",
  },
];

const testimonials = [
  {
    name: "Adaeze O.",
    role: "First-time patient",
    quote:
      "I was embarrassed to smile in photos for years. I thought I needed expensive whitening. After my first cleaning at VistaDentalcare, my teeth looked completely different. I wish I'd come sooner.",
  },
  {
    name: "Emeka T.",
    role: "Returning patient",
    quote:
      "The doctor took time to actually explain what was causing my bad breath and yellow teeth. Nobody had ever done that before. The cleaning made such a big difference in just one session.",
  },
  {
    name: "Blessing A.",
    role: "New patient",
    quote:
      "I was scared to go to the dentist but the team here made it so comfortable. My teeth feel cleaner than they have in years. Already booked my next appointment before I left.",
  },
];

const trustPoints = [
  "Qualified Dental Professionals",
  "Modern Equipment",
  "Comfortable Environment",
  "Honest Recommendations",
];

const faqs = [
  {
    q: "Is scaling and polishing painful?",
    a: "Most patients find it completely comfortable. You may feel some vibration or mild sensitivity, especially if tartar has built up significantly — but it's nothing like the dental experiences people fear. Our team works gently and will always check in with you throughout.",
  },
  {
    q: "How do I know if I need cleaning or whitening?",
    a: "That's exactly what a dental assessment is for. A dentist will examine your teeth and gums and tell you clearly what's causing the discolouration and what will actually fix it. Guessing without an assessment often means spending money on the wrong treatment.",
  },
  {
    q: "How long does a professional clean take?",
    a: "Usually between 30 to 60 minutes depending on the level of buildup. Many patients are surprised by how much difference they see in a single session.",
  },
  {
    q: "How do I book?",
    a: "The easiest way is to message us directly on WhatsApp. Just tap the button below, send us a message, and our team will confirm a time that works for you — no complicated forms.",
  },
];

export default function YellowTeeth() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sticky announcement bar */}
      <div
        className="sticky top-0 z-50 w-full border-b text-white"
        style={{ backgroundColor: "#0f766e" }}
      >
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between gap-3 py-2.5 text-xs sm:text-sm">
            <p className="truncate">
              <span className="font-semibold">VistaDentalcare</span> — Professional dental care you can trust.
            </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 font-semibold underline-offset-4 hover:underline"
          >
            <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
          </a>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-secondary/[0.08] via-background to-primary/[0.06]" />
        <div className="absolute -top-40 -right-32 -z-10 h-[520px] w-[520px] rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 -z-10 h-[460px] w-[460px] rounded-full bg-primary/12 blur-3xl" />
        <div
          className="absolute inset-0 -z-10 opacity-[0.025]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-16 md:py-24 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10 items-center">
            <motion.div {...fadeInUp} className="lg:col-span-6 space-y-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-4 py-1.5 text-xs sm:text-sm font-medium text-secondary backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-secondary" />
                </span>
                A message for people who care about their smile
              </div>
              <h1 className="font-bold leading-[1.02] tracking-tight text-primary text-[2.5rem] sm:text-5xl md:text-6xl lg:text-[4.5rem]">
                You brush every day.
                <br />
                <span className="bg-gradient-to-r from-secondary via-primary to-secondary bg-clip-text text-transparent">
                  So why are your teeth
                </span>
                <br />
                <span className="relative inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-secondary via-primary to-secondary bg-clip-text text-transparent">
                    still yellow?
                  </span>
                  <svg
                    className="absolute -bottom-3 left-0 right-0 w-full"
                    viewBox="0 0 300 12"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M2,6 Q75,2 150,6 T298,6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className="text-secondary/60"
                    />
                  </svg>
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
                The real answer might surprise you — and the fix is simpler, faster,
                and more affordable than you think.
              </p>
              <div className="pt-2 space-y-4">
                <WhatsAppButton size="xl" />
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-secondary" strokeWidth={3} /> Free to message
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-secondary" strokeWidth={3} /> No obligation
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-secondary" strokeWidth={3} /> Quick response
                  </span>
                </div>

                {/* Trust strip */}
                <div className="mt-6 flex items-center gap-4 rounded-2xl border bg-card/60 p-3 pr-5 backdrop-blur w-fit">
                  <div className="flex -space-x-2">
                    {[
                      "from-amber-400 to-orange-500",
                      "from-rose-400 to-pink-500",
                      "from-cyan-400 to-blue-500",
                      "from-emerald-400 to-teal-500",
                    ].map((g, i) => (
                      <div
                        key={i}
                        className={`h-9 w-9 rounded-full ring-2 ring-background bg-gradient-to-br ${g}`}
                      />
                    ))}
                  </div>
                  <div className="text-xs sm:text-sm">
                    <div className="flex items-center gap-1 text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-current" />
                      ))}
                      <span className="ml-1 font-semibold text-primary">4.9</span>
                    </div>
                    <p className="text-muted-foreground">From 1,200+ happy patients</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="lg:col-span-6 relative"
            >
              {/* Asymmetric collage */}
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                {/* Glow */}
                <div className="absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-secondary/25 via-primary/10 to-secondary/15 blur-3xl" />

                <div className="relative grid grid-cols-12 grid-rows-6 gap-3 sm:gap-4 aspect-[4/4.2]">
                  {/* Main hero image — actual result */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                    className="col-span-8 row-span-6 relative overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-border"
                  >
                    <img
                      src={beforeAfter1}
                      alt="Real before-and-after of professional scaling and polishing"
                      className="h-full w-full object-cover"
                      loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 rounded-full bg-background/95 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary shadow-md backdrop-blur">
                      Real result · 1 visit
                    </div>
                  </motion.div>

                  {/* Top right — second BA */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
                    className="col-span-4 row-span-3 relative overflow-hidden rounded-2xl shadow-xl ring-1 ring-border"
                  >
                    <img
                      src={beforeAfter2}
                      alt="Tartar removal close-up"
                      className="h-full w-full object-cover"
                      loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
                  </motion.div>

                  {/* Bottom right — whitening */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.45, ease: "easeOut" }}
                    className="col-span-4 row-span-3 relative overflow-hidden rounded-2xl shadow-xl ring-1 ring-border"
                  >
                    <img
                      src={whiteningImg}
                      alt="Tooth whitening result"
                      className="h-full w-full object-cover"
                      loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
                  </motion.div>
                </div>

                {/* Floating WhatsApp chat bubble */}
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
                  className="absolute -bottom-5 -left-3 sm:-left-6 z-20 hidden sm:flex items-center gap-3 rounded-2xl border bg-card/95 px-4 py-3 shadow-2xl backdrop-blur max-w-[260px]"
                >
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white shadow-md"
                    style={{ backgroundColor: "#25D366" }}
                  >
                    <MessageCircle className="h-5 w-5" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-muted-foreground">New on WhatsApp</p>
                    <p className="text-sm font-semibold text-primary leading-tight">
                      "Booked in 2 mins — so easy!"
                    </p>
                  </div>
                </motion.div>

                {/* Floating stats card */}
                <motion.div
                  initial={{ opacity: 0, y: -12, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.55, ease: "easeOut" }}
                  className="absolute -top-4 -right-2 sm:-right-5 z-20 hidden sm:flex items-center gap-2.5 rounded-2xl border bg-card/95 px-4 py-3 shadow-2xl backdrop-blur"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/15">
                    <Sparkles className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-primary leading-none">30 min</p>
                    <p className="text-[11px] text-muted-foreground">Average session</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Empathy */}
      <section className="py-20 md:py-28">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 max-w-3xl">
          <motion.div {...fadeInUp} className="space-y-7">
            <div className="flex items-center gap-3 text-sm font-medium uppercase tracking-[0.2em] text-secondary">
              <span className="h-px w-10 bg-secondary/60" />
              The honest truth
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary leading-[1.15] tracking-tight">
              You're doing everything right.
              <br />
              <span className="text-muted-foreground/80">So why doesn't it show?</span>
            </h2>
            <div className="space-y-5 text-lg md:text-xl leading-relaxed text-muted-foreground">
              <p>
                You brush morning and night. Maybe you use whitening toothpaste. You rinse. You try.
                But when you look in the mirror or smile for a photo, your teeth still look dull,
                yellow, or stained — and it's honestly demoralising.
              </p>
              <p className="text-foreground">
                If that sounds familiar, here's something important:{" "}
                <strong className="text-primary">it's probably not your fault.</strong>
              </p>
              <p>
                Most people in this situation assume they need tooth whitening. But in the majority
                of cases, the real culprit is something much more common — and much more fixable.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pull quote */}
      <section className="pb-20 md:pb-28">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 max-w-4xl">
          <motion.blockquote
            {...fadeInUp}
            className="relative overflow-hidden rounded-[2rem] border bg-gradient-to-br from-secondary/10 via-background to-primary/5 p-10 md:p-14 shadow-sm"
          >
            <div className="absolute -top-12 -left-6 text-[10rem] font-serif leading-none text-secondary/15 select-none">
              "
            </div>
            <div className="relative">
              <p className="text-2xl md:text-3xl font-medium text-primary leading-[1.4] tracking-tight">
                The #1 reason teeth look yellow despite good brushing isn't the tooth colour itself.
                It's <span className="relative whitespace-nowrap">
                  <span className="relative z-10 text-secondary font-semibold">tartar buildup</span>
                  <span className="absolute bottom-0.5 left-0 right-0 h-2 bg-secondary/20 -z-0" />
                </span> — and no toothbrush in the world can remove it once it hardens.
              </p>
              <footer className="mt-7 flex items-center gap-3 text-sm text-muted-foreground">
                <span className="h-px w-8 bg-muted-foreground/40" />
                A reality most people are never told by their toothpaste brand
              </footer>
            </div>
          </motion.blockquote>
        </div>
      </section>

      {/* The Real Reason */}
      <section className="relative py-20 md:py-28 bg-card overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-20 items-center">
            <motion.div {...fadeInUp} className="space-y-7">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  01
                </span>
                <span className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
                  The real reason
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary leading-[1.1] tracking-tight">
                What's actually causing your teeth to look that way.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Plaque forms on your teeth naturally — every single day. When it isn't completely
                removed, it hardens into a substance called <strong className="text-primary">tartar (calculus)</strong>.
                Tartar is porous, stain-absorbing, and yellowish — and it clings to the tooth
                surface no matter how hard you brush.
              </p>
              <div className="relative overflow-hidden rounded-2xl border-l-4 border-amber-500 bg-amber-50/80 p-6 dark:bg-amber-950/20">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500/15">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
                      Here's the catch.
                    </p>
                    <p className="text-sm md:text-base text-amber-900/90 dark:text-amber-100/90 leading-relaxed">
                      Once plaque becomes tartar, <strong>it cannot be removed at home.</strong> No
                      toothpaste, no mouthwash, no electric toothbrush can touch it. Only a professional
                      dental clean can.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div {...fadeInUp} className="order-first lg:order-last">
              <div className="relative mx-auto max-w-md">
                <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-secondary/20 to-primary/10 blur-2xl" />
                <div className="relative grid grid-cols-2 gap-3">
                  <div className="space-y-3">
                    <div className="relative overflow-hidden rounded-2xl shadow-xl ring-1 ring-border">
                      <img
                        src={beforeAfter3}
                        alt="Tartar buildup along the gum line — before cleaning"
                        className="h-full w-full object-cover aspect-[4/5]"
                        loading="lazy"
                      />
                      <div className="absolute top-2 left-2 rounded-full bg-amber-500/95 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow">
                        Before
                      </div>
                    </div>
                    <div className="rounded-2xl border bg-card/80 p-4 backdrop-blur">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tartar</p>
                      <p className="text-sm font-medium text-primary leading-snug mt-1">
                        Hardened, porous, traps stains
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3 mt-8">
                    <div className="rounded-2xl border bg-card/80 p-4 backdrop-blur">
                      <p className="text-xs font-semibold uppercase tracking-wider text-secondary">After clean</p>
                      <p className="text-sm font-medium text-primary leading-snug mt-1">
                        Bright, smooth, healthy gums
                      </p>
                    </div>
                    <div className="relative overflow-hidden rounded-2xl shadow-xl ring-1 ring-border">
                      <img
                        src={beforeAfter4}
                        alt="Same teeth after professional scaling — clean and bright"
                        className="h-full w-full object-cover aspect-[4/5]"
                        loading="lazy"
                      />
                      <div className="absolute top-2 left-2 rounded-full bg-secondary/95 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-secondary-foreground shadow">
                        After
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Symptom checklist */}
      <section className="py-20 md:py-28">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <motion.div {...fadeInUp} className="max-w-2xl mb-14">
            <div className="flex items-center gap-3 mb-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                02
              </span>
              <span className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
                Self-check
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary leading-[1.1] tracking-tight">
              Here's how you know tartar might be the issue for you.
            </h2>
          </motion.div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {symptoms.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
              >
                <Card className="group relative h-full overflow-hidden border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-secondary/50 hover:shadow-2xl">
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-secondary to-primary opacity-0 transition-opacity group-hover:opacity-100" />
                  <CardContent className="p-7 space-y-4">
                    <h3 className="font-semibold text-primary text-lg leading-snug">{s.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <motion.div
            {...fadeInUp}
            className="mt-12 mx-auto max-w-2xl rounded-2xl bg-secondary/5 border border-secondary/20 p-6 text-center"
          >
            <p className="text-base md:text-lg text-foreground leading-relaxed">
              <span className="font-semibold text-primary">Two or more sound like you?</span>{" "}
              A professional cleaning is almost certainly what your smile needs first — before any
              whitening treatment.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Comparison */}
      <section className="relative py-20 md:py-28 bg-card overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 max-w-6xl">
          <motion.div {...fadeInUp} className="mb-14 space-y-5 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                03
              </span>
              <span className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
                Your options
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary leading-[1.1] tracking-tight">
              Scaling & polishing
              <br />
              <span className="text-muted-foreground/70">vs.</span> tooth whitening
            </h2>
            <p className="text-lg text-muted-foreground">
              Both can brighten your smile — but they do very different things. Choosing the wrong
              one is how people waste money and don't get the result they hoped for.
            </p>
          </motion.div>

          {/* Card-based comparison (mobile + desktop) */}
          <motion.div {...fadeInUp} className="grid gap-6 md:grid-cols-2">
            {/* Scaling card */}
            <div className="relative rounded-3xl border-2 border-secondary/40 bg-background p-8 shadow-xl">
              <div className="absolute -top-3 left-8 rounded-full bg-secondary px-3 py-1 text-xs font-bold uppercase tracking-wider text-secondary-foreground">
                Recommended first
              </div>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/15">
                  <ShieldCheck className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-primary">Scaling & Polishing</h3>
              </div>
              <div className="mb-6 overflow-hidden rounded-2xl border ring-1 ring-secondary/30">
                <img
                  src={scalingImg}
                  alt="Before and after scaling and polishing — heavy tartar removed revealing clean healthy teeth"
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>
              <ul className="space-y-4">
                {tableRows.map((row) => (
                  <li key={row.label} className="flex gap-3 border-b border-border/60 pb-4 last:border-0 last:pb-0">
                    <Check className="h-5 w-5 shrink-0 mt-0.5 text-secondary" strokeWidth={3} />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                        {row.label}
                      </p>
                      <p className="text-sm md:text-base text-foreground leading-relaxed">{row.a}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-6 border-t border-secondary/20">
                <a
                  href="/yellow-teeth/scaling-polishing"
                  className="group inline-flex items-center gap-2 text-sm md:text-base font-semibold text-secondary hover:text-secondary/80 transition-colors"
                >
                  Learn more about scaling &amp; polishing
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </a>
              </div>
            </div>

            {/* Whitening card */}
            <div className="relative rounded-3xl border bg-background p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
                  <Sparkles className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-primary">Tooth Whitening</h3>
              </div>
              <div className="mb-6 overflow-hidden rounded-2xl border ring-1 ring-border">
                <img
                  src={whiteningImg}
                  alt="Before and after tooth whitening showing dramatic shade improvement"
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>
              <ul className="space-y-4">
                {tableRows.map((row) => {
                  const isNegative = row.b.startsWith("❌");
                  const cleanText = row.b.replace(/^[✅❌]\s*/, "");
                  return (
                    <li key={row.label} className="flex gap-3 border-b border-border/60 pb-4 last:border-0 last:pb-0">
                      {isNegative ? (
                        <X className="h-5 w-5 shrink-0 mt-0.5 text-muted-foreground/60" strokeWidth={3} />
                      ) : (
                        <Check className="h-5 w-5 shrink-0 mt-0.5 text-muted-foreground" strokeWidth={3} />
                      )}
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                          {row.label}
                        </p>
                        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                          {cleanText}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </motion.div>

          <motion.div
            {...fadeInUp}
            className="mt-12 max-w-3xl mx-auto rounded-2xl border bg-background/60 p-6 md:p-8"
          >
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              <strong className="text-primary">Bottom line:</strong> Many patients who come in asking
              for whitening discover after a professional clean that their teeth are already several
              shades brighter — and they don't need whitening at all. The right treatment starts with
              an honest assessment.
            </p>
          </motion.div>

          <div className="mt-10 text-center">
            <WhatsAppButton />
          </div>
        </div>
      </section>

      {/* Before & After gallery — actual scaling results */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-secondary/[0.03] to-background" />
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <motion.div {...fadeInUp} className="text-center mb-14 max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-secondary">
              <Sparkles className="h-3.5 w-3.5" />
              See it for yourself
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary leading-[1.1] tracking-tight">
              Real before &amp; after — one cleaning session.
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              These are unedited photos of actual scaling &amp; polishing results. No whitening,
              no veneers — just the tartar and stains being properly removed.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 max-w-5xl mx-auto">
            {beforeAfterResults.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group relative"
              >
                <div className="absolute -inset-2 rounded-[1.75rem] bg-gradient-to-br from-secondary/20 to-primary/10 blur-xl opacity-50 group-hover:opacity-80 transition-opacity" />
                <div className="relative overflow-hidden rounded-2xl border bg-card shadow-xl ring-1 ring-border">
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-auto transition-transform duration-500 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 rounded-full bg-background/90 backdrop-blur px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary shadow-sm">
                    Before / After
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeInUp} className="mt-12 max-w-2xl mx-auto rounded-2xl border bg-card/60 p-6 text-center">
            <p className="text-sm md:text-base text-muted-foreground italic leading-relaxed">
              Note: These photos may look intense, but the tartar removal itself is comfortable —
              and the difference is immediate.
            </p>
          </motion.div>

          <div className="mt-10 text-center">
            <WhatsAppButton label="Book Your Cleaning on WhatsApp" />
          </div>
        </div>
      </section>

      {/* For those who want more — Veneers section */}
      <section
        className="relative py-20 md:py-28 overflow-hidden text-white"
        style={{ backgroundColor: "hsl(184 70% 14%)" }}
      >
        <div
          className="absolute inset-0 -z-0"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, hsl(184 75% 12%), hsl(184 70% 16%) 50%, hsl(184 70% 14%))",
          }}
        />
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
          <motion.div {...fadeInUp} className="text-center mb-14 max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              For those who want more
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.1] tracking-tight">
              Want to Go Beyond Clean?
            </h2>
            <p className="text-xl md:text-2xl font-medium text-white/90">
              Dental Veneers Can Transform Your Entire Smile.
            </p>
            <p className="text-base md:text-lg text-white/80 leading-relaxed">
              Scaling, polishing, and whitening are excellent treatments — but they work with the
              teeth you already have. If your concern goes deeper than colour — if you have
              chipped, cracked, uneven, gapped, or worn teeth — dental veneers offer something
              more powerful: a complete smile redesign.
            </p>
          </motion.div>

          <motion.div {...fadeInUp} className="max-w-3xl mx-auto mb-14 rounded-2xl border border-white/20 bg-white/5 p-6 md:p-8 text-center">
            <p className="text-base md:text-lg text-white/90 leading-relaxed">
              A veneer is a thin, custom-made shell — typically porcelain or composite — bonded
              to the front surface of the tooth. The result looks and feels completely natural,
              while giving you a level of control over your smile that no cleaning or whitening
              can achieve.
            </p>
          </motion.div>

          {/* Veneer before/after gallery */}
          <div className="grid gap-6 sm:grid-cols-2 max-w-5xl mx-auto mb-16">
            {[
              { src: veneerBA1, alt: "Before and after: damaged teeth restored with natural-looking veneers" },
              { src: veneerBA2, alt: "Before and after: stained, gapped teeth transformed into a bright, even smile with veneers" },
            ].map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group relative"
              >
                <div className="absolute -inset-2 rounded-[1.75rem] bg-white/10 blur-xl opacity-60 group-hover:opacity-90 transition-opacity" />
                <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-card shadow-xl">
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-auto transition-transform duration-500 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 rounded-full bg-background/90 backdrop-blur px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary shadow-sm">
                    Veneer Result
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto mb-16">
              {[
                { title: "Chips & Cracks", desc: "Restore broken or chipped teeth to look perfect and whole again" },
                { title: "Uneven Shape or Size", desc: "Reshape teeth that are too short, too long, or inconsistent in size" },
                { title: "Deep Discolouration", desc: "Cover stains that whitening cannot remove — including fluorosis or tetracycline staining" },
                { title: "Gaps Between Teeth", desc: "Close small spaces without orthodontic treatment in many cases" },
              ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur p-6 text-center hover:bg-white/15 transition-colors"
              >
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-white/80 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeInUp} className="max-w-3xl mx-auto rounded-2xl border border-white/20 bg-white/5 p-6 md:p-8 mb-10">
            <h3 className="text-xl md:text-2xl font-bold mb-5">Veneers may be right for you if:</h3>
            <ul className="space-y-3">
              {[
                "You've whitened your teeth but still aren't happy with the result",
                "You have teeth that are visibly chipped, worn down, or misshapen",
                "You avoid smiling widely because of how your teeth look",
                "You want a long-lasting, low-maintenance smile upgrade",
                "You have gaps or mild alignment issues you'd like to address without braces",
              ].map((point, i) => (
                <li key={i} className="flex gap-3 text-base text-white/90 leading-relaxed">
                  <span className="mt-1 flex-shrink-0 h-2 w-2 rounded-full bg-white/70" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div {...fadeInUp} className="max-w-3xl mx-auto space-y-6">
            <p className="text-base md:text-lg text-white/85 leading-relaxed text-center">
              Porcelain veneers are highly durable and stain-resistant, often lasting 10–15 years
              with proper care. Composite veneers are a more affordable option that can be
              completed in a single visit. At VistaDentalcare, a dentist will assess your teeth
              and help you understand which option fits your goals and budget.
            </p>

            <div className="rounded-2xl border border-white/30 bg-white/10 p-5 md:p-6">
              <p className="text-sm md:text-base text-white/90 leading-relaxed">
                <span className="font-semibold">Important:</span> Veneers always work best on
                clean, healthy teeth. Most patients complete a scaling and polishing first — it
                ensures your gums are in the best condition before any veneer work begins.
              </p>
            </div>
          </motion.div>

          {/* Veneer consultation CTA */}
          <motion.div {...fadeInUp} className="mt-12 flex flex-col items-center gap-3">
            <a
              href="https://wa.me/2348000000000?text=Hi%20VistaDentalcare%2C%20I%27d%20like%20to%20book%20a%20veneer%20consultation."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-background text-primary px-8 py-4 text-base md:text-lg font-bold shadow-xl ring-1 ring-white/20 hover:scale-[1.03] hover:shadow-2xl transition-all duration-200"
            >
              <MessageCircle className="h-5 w-5" />
              Book a Veneer Consultation
            </a>
            <p className="text-xs md:text-sm text-white/80">
              Free, no-pressure assessment — chat with a dentist on WhatsApp.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <motion.div {...fadeInUp} className="text-center mb-14 max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-secondary">
              <Star className="h-3.5 w-3.5 fill-current" />
              Real patients
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary leading-[1.1] tracking-tight">
              What patients say after their first visit.
            </h2>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="group h-full border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                  <CardContent className="p-7 space-y-5">
                    <div className="flex gap-0.5 text-amber-500">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star key={idx} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-base text-foreground/85 leading-relaxed">
                      "{t.quote}"
                    </p>
                    <div className="flex items-center gap-3 pt-3 border-t">
                      <div
                        className="h-11 w-11 rounded-full flex items-center justify-center font-semibold text-primary-foreground text-sm bg-gradient-to-br from-primary to-secondary"
                      >
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-primary text-sm">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Real reviews — actual screenshots */}
      <section className="relative py-20 md:py-28 bg-gradient-to-b from-background via-secondary/[0.04] to-background overflow-hidden">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <motion.div {...fadeInUp} className="text-center mb-14 max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-secondary">
              <ShieldCheck className="h-3.5 w-3.5" />
              Unedited screenshots
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary leading-[1.1] tracking-tight">
              Real reviews from real patients.
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              Straight from Google and WhatsApp — no edits, no filters.
            </p>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-2 items-start max-w-5xl mx-auto">
            {/* Google reviews collage */}
            <motion.div {...fadeInUp} className="space-y-4">
              <div className="relative group">
                <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-secondary/25 to-primary/15 blur-2xl opacity-60 group-hover:opacity-90 transition-opacity" />
                <div className="relative overflow-hidden rounded-2xl border bg-card shadow-2xl ring-1 ring-border">
                  <img
                    src={patientReviewsImg}
                    alt="Five-star Google reviews from VistaDentalcare patients"
                    className="w-full h-auto"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <div className="flex gap-0.5 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span>Verified Google reviews</span>
              </div>
            </motion.div>

            {/* WhatsApp before/after */}
            <motion.div {...fadeInUp} className="space-y-4">
              <div className="relative group">
                <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-[#25D366]/25 to-primary/15 blur-2xl opacity-60 group-hover:opacity-90 transition-opacity" />
                <div className="relative overflow-hidden rounded-2xl border bg-card shadow-2xl ring-1 ring-border">
                  <img
                    src={whatsappReviewImg}
                    alt="WhatsApp message from a patient sharing before and after photos of dental treatment"
                    className="w-full h-auto"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <MessageCircle className="h-4 w-4" style={{ color: "#25D366" }} />
                <span>Patient feedback via WhatsApp</span>
              </div>
            </motion.div>
          </div>

          <motion.div {...fadeInUp} className="mt-14 text-center">
            <p className="mb-6 text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
              Thousands of smiles transformed. Yours could be next — start with a simple message.
            </p>
            <WhatsAppButton />
          </motion.div>
        </div>
      </section>

      {/* Why VistaDentalcare */}
      <section className="relative py-20 md:py-28 bg-card overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid gap-14 lg:grid-cols-3 lg:gap-16 items-center">
            <motion.div {...fadeInUp} className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  04
                </span>
                <span className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
                  Why VistaDentalcare
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary leading-[1.1] tracking-tight">
                Trusted dental care, without the intimidation.
              </h2>
              <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed">
                <p>
                  At VistaDentalcare, we believe every patient deserves a clear explanation of what
                  their teeth actually need — not just a treatment plan handed to them without
                  context.
                </p>
                <p>
                  Our approach starts with a proper dental assessment. We look at the real state of
                  your teeth and gums, then recommend the treatment that will make the most
                  difference for your specific situation.
                </p>
                <p>
                  Whether you need a professional clean, a whitening treatment, or simply some
                  guidance on home care — we'll give you an honest answer.
                </p>
              </div>
              <ul className="grid sm:grid-cols-2 gap-3 pt-4">
                {trustPoints.map((point) => (
                  <li key={point} className="flex items-center gap-3 rounded-xl border bg-background/60 px-4 py-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary/15">
                      <Check className="h-4 w-4 text-secondary" strokeWidth={3} />
                    </span>
                    <span className="text-primary font-medium text-sm md:text-base">{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div {...fadeInUp}>
              <div className="relative rounded-3xl border-2 border-secondary/30 bg-gradient-to-br from-secondary/15 via-card to-primary/10 p-8 text-center shadow-xl">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-secondary px-3 py-1 text-xs font-bold uppercase tracking-wider text-secondary-foreground">
                  Pro tip
                </div>
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/20">
                  <Clock className="h-7 w-7 text-secondary" />
                </div>
                <div className="text-6xl md:text-7xl font-bold leading-none bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent">
                  6mo
                </div>
                <p className="mt-4 text-sm md:text-base text-muted-foreground leading-relaxed">
                  Recommended cleaning interval for keeping teeth bright and gums healthy.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 max-w-3xl">
          <motion.div {...fadeInUp} className="text-center mb-12 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              FAQ
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary leading-[1.1] tracking-tight">
              Questions people usually ask.
            </h2>
          </motion.div>
          <motion.div {...fadeInUp}>
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((f, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="rounded-2xl border bg-card px-6 transition-colors data-[state=open]:border-secondary/50 data-[state=open]:shadow-md"
                >
                  <AccordionTrigger className="text-left font-semibold text-primary hover:no-underline py-5 text-base md:text-lg">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-5 text-base">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section
        className="relative py-24 md:py-32 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(220 60% 14%) 50%, hsl(var(--secondary)) 100%)",
        }}
      >
        {/* Decorative blobs */}
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-secondary/30 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 max-w-3xl text-center text-white relative">
          <motion.div {...fadeInUp} className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              The next step
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight">
              Ready to finally see
              <br />
              the difference?
            </h2>
            <p className="text-xl md:text-2xl font-medium text-white/90">
              It starts with one conversation.
            </p>
            <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              Message VistaDentalcare on WhatsApp. Tell us what you're experiencing and we'll help
              you figure out exactly what your smile needs.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm backdrop-blur">
              <Clock className="h-4 w-4" />
              Appointments are limited each week — early bookings encouraged.
            </div>
            <div className="pt-4">
              <WhatsAppButton size="xl" label="Chat With Us on WhatsApp — It's Free" />
              <p className="mt-5 text-sm text-white/80">
                No commitment. No pressure. Just honest dental advice.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-10">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 text-center space-y-3">
          <p className="font-semibold text-primary">
            VistaDentalcare — Professional Dental Care
          </p>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} VistaDentalcare. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
