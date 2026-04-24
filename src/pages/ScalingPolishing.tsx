import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertTriangle,
  Check,
  Clock,
  MessageCircle,
  Star,
  Sparkles,
  ShieldCheck,
  X,
  Heart,
  Activity,
  Calendar,
  Wind,
  Droplets,
  Stethoscope,
  Smile,
  ArrowDown,
} from "lucide-react";
import beforeAfter1 from "@/assets/yellow-teeth-ba-1.jpg";
import beforeAfter2 from "@/assets/yellow-teeth-ba-2.jpg";
import beforeAfter3 from "@/assets/yellow-teeth-ba-3.jpg";
import beforeAfter4 from "@/assets/yellow-teeth-ba-4.jpg";
import scalingImg from "@/assets/yellow-teeth-scaling.jpg";

const WHATSAPP_URL =
  "https://wa.me/2347088788880?text=Hi%20VistaDentalcare%2C%20I'd%20like%20to%20book%20a%20scaling%20%26%20polishing%20appointment.";

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.55, ease: "easeOut" as const },
};

function WhatsAppButton({
  size = "lg",
  label = "Book Your Clean at VistaDentalcare",
  className = "",
  variant = "green",
}: {
  size?: "lg" | "xl";
  label?: string;
  className?: string;
  variant?: "green" | "white";
}) {
  const sizing =
    size === "xl"
      ? "px-8 py-5 text-base md:text-lg"
      : "px-6 py-3.5 text-sm md:text-base";
  const colour =
    variant === "white"
      ? "bg-white text-[#0f766e] hover:bg-white/95"
      : "text-white";
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex items-center justify-center gap-2.5 rounded-full font-semibold shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl active:scale-[0.99] ${sizing} ${colour} ${className}`}
      style={
        variant === "green"
          ? {
              backgroundColor: "#25D366",
              boxShadow: "0 18px 40px -12px rgba(37, 211, 102, 0.55)",
            }
          : { boxShadow: "0 18px 40px -12px rgba(255,255,255,0.4)" }
      }
    >
      <MessageCircle
        className="h-5 w-5 transition-transform group-hover:rotate-[-8deg]"
        strokeWidth={2.5}
      />
      {label}
    </a>
  );
}

const signs = [
  { num: "01", title: "Yellow or dull teeth", desc: "Especially near the gum line, despite regular brushing" },
  { num: "02", title: "Bad breath that returns quickly", desc: "Even after brushing or using mouthwash" },
  { num: "03", title: "Gums that bleed", desc: "When you brush, even slightly" },
  { num: "04", title: "Teeth that feel rough or coated", desc: "Like they never feel fully clean" },
  { num: "05", title: "Sensitivity to hot or cold", desc: "That wasn't there before" },
];

const decayStages = [
  { icon: ShieldCheck, title: "Clean Tooth", desc: "Smooth enamel surface", colour: "from-emerald-400/20 to-emerald-500/5", iconColour: "text-emerald-600" },
  { icon: Droplets, title: "Plaque Forms", desc: "Within hours, soft, removable by brushing", colour: "from-amber-400/20 to-amber-500/5", iconColour: "text-amber-600" },
  { icon: AlertTriangle, title: "Tartar Builds", desc: "24–72 hrs, hardens, brushing no longer removes it", colour: "from-orange-400/25 to-orange-500/5", iconColour: "text-orange-600" },
  { icon: Activity, title: "Damage Begins", desc: "Gum inflammation, decay, and worse over time", colour: "from-rose-400/25 to-rose-500/5", iconColour: "text-rose-600" },
];

const consequences = [
  { icon: Droplets, title: "Gum Disease (Gingivitis)", desc: "Tartar at the gum line triggers inflammation. Gums become red, swollen, and bleed easily. Left untreated, this progresses." },
  { icon: Activity, title: "Periodontitis", desc: "Advanced gum disease that destroys the bone supporting your teeth. One of the leading causes of tooth loss in adults." },
  { icon: AlertTriangle, title: "Tooth Decay", desc: "Bacteria in tartar produce acids that erode enamel, leading to cavities that require more complex (and costly) treatment." },
  { icon: Wind, title: "Chronic Bad Breath", desc: "Tartar harbours odour-producing bacteria. Brushing masks it temporarily, but the source remains until professionally removed." },
];

const visitSteps = [
  {
    n: 1,
    title: "Your dentist takes a look first",
    desc: "Before anything happens, your dentist will examine your teeth and gums, checking for the level of tartar buildup, the condition of your gums, and anything else that needs attention. This takes just a few minutes and makes the cleaning more targeted and effective.",
  },
  {
    n: 2,
    title: "Scaling, removing what brushing left behind",
    desc: "Using specialised dental instruments, often an ultrasonic scaler that uses gentle vibration and water, tartar is carefully removed from all surfaces of the teeth, including just beneath the gum line where it most commonly builds up. You'll feel vibration and water. Most patients are surprised by how comfortable this actually is.",
  },
  {
    n: 3,
    title: "Polishing, the part that makes the difference you'll see",
    desc: "After scaling, your teeth are polished using a professional-grade paste and a rotating brush. This removes surface stains from tea, coffee, and food, and leaves the tooth surface smooth and slick. A smooth surface is harder for new plaque and bacteria to grip onto.",
  },
  {
    n: 4,
    title: "A rinse, a review, and you're done",
    desc: "Your mouth is rinsed clean. Your dentist may briefly share any observations, areas to watch, home care tips, or whether anything else needs attention. The whole appointment typically takes 30 to 60 minutes. Most people leave wondering why they waited so long.",
  },
];

const audience = [
  { icon: Calendar, title: "It's been over 6 months since your last clean", desc: "Dentists worldwide recommend a professional clean every 6 months. If it's been longer, tartar has had time to build up." },
  { icon: Smile, title: "You brush well but your smile still looks dull", desc: "If your teeth look yellow or dull despite consistent brushing, it's almost certainly tartar or surface staining, not your natural tooth colour." },
  { icon: Droplets, title: "Your gums bleed when you brush", desc: "This is the earliest warning sign of gum disease. A professional clean removes the tartar causing the inflammation, and bleeding usually stops within days." },
  { icon: Wind, title: "Bad breath that doesn't go away", desc: "When the bacteria in tartar cause the smell, no amount of minting or rinsing will fix it at the source. A clean will." },
  { icon: Stethoscope, title: "You've never had a professional clean before", desc: "If you've never had one, there's definitely some level of buildup present, regardless of how well you brush. This is the most important visit you can make." },
  { icon: Sparkles, title: "You're considering whitening", desc: "Whitening on teeth covered in tartar is like painting over dirt. A clean first ensures the treatment works properly, and you may not need whitening after at all." },
];

const myths = [
  {
    myth: "If my teeth don't hurt, nothing is wrong.",
    truth: "Tartar builds up silently. Gum disease progresses painlessly in its early stages. Most people only feel something when the problem has become significant, and by then, treatment is more complex. The whole point of a regular clean is to catch and reverse issues before they become painful or costly.",
  },
  {
    myth: "Scaling damages the enamel or makes your teeth weaker.",
    truth: "This is one of the most widespread dental myths. Professional scaling instruments are designed to remove tartar, not enamel. Done by a qualified dental professional, scaling is entirely safe and does not weaken or thin your teeth. What it does is reveal the clean, healthy tooth surface underneath.",
  },
  {
    myth: "It will be painful, so I keep putting it off.",
    truth: "Most patients with regular cleanings find the procedure entirely comfortable. People who have delayed for a long time may experience more sensitivity during the appointment, but this is temporary, and our team works at your pace. The brief discomfort of a clean is far less than the long-term discomfort of gum disease or tooth loss.",
  },
  {
    myth: "I brush and floss well, so I don't need a professional clean.",
    truth: "Excellent home care reduces plaque significantly, but it cannot remove tartar once it has formed. Tartar forms in places your brush and floss cannot reliably reach: between teeth, under the gum line, and at the back of molars. Good home care and professional cleaning work together. One does not replace the other.",
  },
];

const testimonials = [
  {
    name: "Chisom E.",
    role: "First-time patient",
    quote:
      "I was embarrassed to smile for the longest time because my teeth always looked yellow no matter what I did. After my scaling and polishing at VistaDentalcare, I genuinely could not believe it was the same teeth. Nobody told me it could make such a difference.",
  },
  {
    name: "Tunde A.",
    role: "Returning patient",
    quote:
      "My gums had been bleeding every morning for months and I just thought that was normal for me. The dentist explained it was early gum disease caused by tartar. After one cleaning session the bleeding stopped within a week. I wish I had come sooner.",
  },
  {
    name: "Blessing O.",
    role: "Anxious first-time patient",
    quote:
      "I was scared of the dentist honestly. But the team made me feel so at ease. The cleaning was not painful at all, I kept waiting for it to hurt and it never did. My teeth felt cleaner than they had in years when I left. Already booked my next one.",
  },
];

const healthLinks = [
  { icon: Heart, title: "Heart Health", desc: "Bacteria from gum disease have been linked to increased risk of cardiovascular inflammation and heart disease." },
  { icon: Activity, title: "Diabetes", desc: "Gum disease and blood sugar control interact, each can worsen the other. Managing one helps manage both." },
  { icon: Sparkles, title: "Pregnancy", desc: "Untreated gum disease during pregnancy has been associated with preterm birth and low birth weight." },
  { icon: AlertTriangle, title: "Tooth Loss", desc: "The most direct consequence. Advanced gum disease is the leading cause of adult tooth loss, and it is largely preventable." },
];

const faqs = [
  {
    q: "Will my teeth be more sensitive after the cleaning?",
    a: "Some patients experience mild sensitivity for 24–48 hours after scaling, particularly those with heavier tartar buildup or inflamed gums. This is normal and temporary. As gum health improves with regular cleaning, sensitivity after appointments typically reduces. We'll advise you on what to eat and avoid in the day following your visit.",
  },
  {
    q: "Will my teeth look whiter after scaling and polishing?",
    a: "Very often, yes, noticeably so. The polishing step removes surface stains from food, drinks, and general accumulation. Many patients are surprised to discover their teeth are significantly brighter without any whitening treatment at all. That said, scaling and polishing restores your natural tooth colour, if you'd like teeth lighter than your natural shade, whitening is a separate additional treatment.",
  },
  {
    q: "I haven't been to the dentist in years. Will I be judged?",
    a: "Absolutely not. At VistaDentalcare, we see patients at every stage, including those who've avoided the dentist for years out of anxiety, cost concerns, or simply never making time. Our only focus is on helping you get to a healthier place from wherever you're starting. You don't need to explain or apologise. You just need to come in.",
  },
  {
    q: "Is there anything I should do before my appointment?",
    a: "Brush and floss as normal, there's no need to do anything special beforehand. Some patients feel self-conscious, but your dentist has seen everything. Just arrive, and let us take care of the rest.",
  },
  {
    q: "How do I book an appointment?",
    a: "The quickest way is to message us directly on WhatsApp. Just tap the button below and send us a brief message, tell us your name, what you'd like to come in for, and we'll confirm a time that works for you. No online forms, no waiting on hold.",
  },
];

export default function ScalingPolishing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sticky announcement bar */}
      <div
        className="sticky top-0 z-50 w-full border-b text-white"
        style={{ backgroundColor: "#0f766e" }}
      >
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between gap-3 py-2.5 text-xs sm:text-sm">
          <p className="truncate inline-flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 shrink-0" /> <span className="font-semibold">VistaDentalcare</span>, Professional dental care, honest guidance.
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 font-semibold underline-offset-4 hover:underline whitespace-nowrap"
          >
            <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
          </a>
        </div>
      </div>

      {/* ============== HERO ============== */}
      <section className="relative overflow-hidden">
        {/* Layered background */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#0f766e]/[0.06] via-background to-secondary/[0.08]" />
        <div className="absolute -top-40 -right-32 -z-10 h-[560px] w-[560px] rounded-full bg-[#0f766e]/15 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 -z-10 h-[480px] w-[480px] rounded-full bg-secondary/15 blur-3xl" />
        <div
          className="absolute inset-0 -z-10 opacity-[0.035]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-16 md:py-24 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-12 items-center">
            <motion.div {...fadeInUp} className="lg:col-span-7 space-y-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#0f766e]/30 bg-[#0f766e]/10 px-4 py-1.5 text-xs sm:text-sm font-medium text-[#0f766e] backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0f766e] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#0f766e]" />
                </span>
                VistaDentalcare · Scaling & Polishing
              </div>
              <h1 className="font-bold leading-[1.02] tracking-tight text-primary text-[2.5rem] sm:text-5xl md:text-6xl lg:text-[4.75rem]">
                Your Teeth Are Trying
                <br />
                <span className="bg-gradient-to-r from-[#0f766e] via-secondary to-[#0f766e] bg-clip-text text-transparent">
                  to Tell You Something.
                </span>
                <br />
                <span className="relative inline-block">
                  <span className="relative z-10">Are You Listening?</span>
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
                      className="text-[#0f766e]/60"
                    />
                  </svg>
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
                That dull yellow colour. That persistent bad breath. Those gums that bleed
                a little when you brush. These aren't random. They're signs. And there's
                one simple professional treatment that addresses all of them.
              </p>
              <div className="pt-2 space-y-4">
                <WhatsAppButton size="xl" />
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-[#0f766e]" strokeWidth={3} /> Free to message
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-[#0f766e]" strokeWidth={3} /> No obligation
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-[#0f766e]" strokeWidth={3} /> Quick response
                  </span>
                </div>
              </div>
              <a
                href="#read-on"
                className="group inline-flex items-center gap-2 pt-4 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Read on
                <ArrowDown className="h-4 w-4 group-hover:translate-y-0.5 transition-transform" />
              </a>
            </motion.div>

            {/* Hero image collage */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="lg:col-span-5 relative"
            >
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-[#0f766e]/25 via-secondary/15 to-[#0f766e]/15 blur-3xl" />

                <div className="relative grid grid-cols-12 grid-rows-6 gap-3 sm:gap-4 aspect-[4/4.4]">
                  <div className="col-span-12 row-span-4 relative overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-border">
                    <img
                      src={beforeAfter1}
                      alt="Real before-and-after of professional scaling and polishing at VistaDentalcare"
                      className="h-full w-full object-cover"
                      loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 rounded-full bg-background/95 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary shadow-md backdrop-blur">
                      Real result · 1 visit
                    </div>
                  </div>
                  <div className="col-span-7 row-span-2 relative overflow-hidden rounded-2xl shadow-xl ring-1 ring-border">
                    <img src={beforeAfter3} alt="Tartar removal close-up" className="h-full w-full object-cover" loading="eager" />
                  </div>
                  <div className="col-span-5 row-span-2 relative overflow-hidden rounded-2xl shadow-xl ring-1 ring-border">
                    <img src={scalingImg} alt="Scaling and polishing result" className="h-full w-full object-cover" loading="eager" />
                  </div>
                </div>

                {/* Floating stats card */}
                <motion.div
                  initial={{ opacity: 0, y: -12, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.55, ease: "easeOut" }}
                  className="absolute -top-4 -right-3 sm:-right-6 z-20 hidden sm:flex items-center gap-2.5 rounded-2xl border bg-card/95 px-4 py-3 shadow-2xl backdrop-blur"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0f766e]/15">
                    <Clock className="h-5 w-5 text-[#0f766e]" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-primary leading-none">30–60 min</p>
                    <p className="text-[11px] text-muted-foreground">One appointment</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============== EMPATHY ============== */}
      <section id="read-on" className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-card" />
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="max-w-3xl mx-auto">
            <motion.div {...fadeInUp} className="space-y-7">
              <p className="text-xs uppercase tracking-[0.2em] text-[#0f766e] font-semibold">
                You might recognise this
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary leading-[1.1] tracking-tight">
                The Moment You Notice
                <br />
                <span className="text-muted-foreground/80">Something Isn't Right</span>
              </h2>
              <div className="space-y-5 text-base md:text-lg text-muted-foreground leading-relaxed">
                <p>
                  You're brushing your teeth and you catch yourself in the mirror. They
                  don't look the way you'd like. Maybe they're a little yellow near the
                  gum line. Maybe your breath isn't quite fresh even right after brushing.
                  Maybe when you spit, there's a faint tinge of pink.
                </p>
                <p>
                  You brush more thoroughly. You switch toothpastes. You rinse more. But
                  the feeling stays, that something isn't quite clean, no matter what you
                  do at home.
                </p>
                <p className="text-foreground font-medium">
                  That feeling isn't wrong. Your instincts are correct. And the solution
                  isn't a better toothbrush. It's one professional appointment.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Signs grid */}
          <motion.div {...fadeInUp} className="mt-16 max-w-5xl mx-auto">
            <p className="text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-8">
              Signs your teeth are asking for a professional clean
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {signs.map((sign, i) => (
                <motion.div
                  key={sign.num}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.06 }}
                  className="group relative overflow-hidden rounded-2xl border bg-background p-6 transition-all hover:shadow-lg hover:-translate-y-0.5"
                >
                  <div className="absolute -top-4 -right-4 text-7xl font-bold text-[#0f766e]/[0.08] select-none">
                    {sign.num}
                  </div>
                  <div className="relative">
                    <div className="text-xs font-bold text-[#0f766e] mb-2">{sign.num}</div>
                    <h3 className="text-base md:text-lg font-bold text-primary mb-1.5">
                      {sign.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{sign.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============== THE PROBLEM ============== */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-secondary/[0.04] to-background" />
        <div className="absolute top-1/2 left-0 -z-10 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-[#0f766e]/8 blur-3xl" />

        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto text-center mb-14">
            <p className="text-xs uppercase tracking-[0.2em] text-[#0f766e] font-semibold mb-4">
              What's actually happening
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary leading-[1.1] tracking-tight">
              The Quiet Problem That
              <br />
              <span className="bg-gradient-to-r from-[#0f766e] to-secondary bg-clip-text text-transparent">
                No Toothbrush Can Fix
              </span>
            </h2>
          </motion.div>

          <motion.div {...fadeInUp} className="max-w-3xl mx-auto space-y-5 text-base md:text-lg text-muted-foreground leading-relaxed mb-16">
            <p>
              Here's something your toothpaste brand will never tell you on the packet:
              there's a natural limit to what brushing and rinsing at home can do. And
              millions of people, including people with excellent oral hygiene habits -
              hit that limit every single day.
            </p>
            <p>
              It starts with <strong className="text-foreground">plaque</strong>, the
              soft, sticky film of bacteria that forms on your teeth throughout the day.
              Brushing removes most of it. But it cannot reach everywhere. And any plaque
              that isn't removed within 24–72 hours begins to mineralise. It hardens into{" "}
              <strong className="text-foreground">tartar</strong>, also called calculus.
            </p>
          </motion.div>

          {/* Decay stage flow */}
          <motion.div {...fadeInUp} className="max-w-6xl mx-auto mb-16">
            <div className="grid gap-4 md:grid-cols-4">
              {decayStages.map((stage, i) => (
                <motion.div
                  key={stage.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.1 }}
                  className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br ${stage.colour} p-6 text-center`}
                >
                  <div className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-background/80 text-xs font-bold text-primary backdrop-blur">
                    {i + 1}
                  </div>
                  <div className="mb-3 flex justify-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-background/80 backdrop-blur shadow-sm">
                      <stage.icon className={`h-7 w-7 ${stage.iconColour}`} strokeWidth={2} />
                    </div>
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-primary mb-1.5">
                    {stage.title}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                    {stage.desc}
                  </p>
                  {i < decayStages.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-2 z-10 -translate-y-1/2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-background border shadow-sm">
                        <ArrowDown className="h-3.5 w-3.5 -rotate-90 text-muted-foreground" />
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Warning callout */}
          <motion.div
            {...fadeInUp}
            className="max-w-3xl mx-auto mb-16 rounded-3xl border-2 border-amber-400/40 bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-amber-950/30 dark:to-orange-950/20 p-6 md:p-8"
          >
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-400/20">
                <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-base md:text-lg text-foreground leading-relaxed">
                  Once tartar forms, no toothbrush, no floss, no whitening toothpaste, and no
                  mouthwash can remove it. It bonds to the tooth surface like hardened cement.{" "}
                  <strong>
                    The only way to remove tartar safely and completely is through professional
                    dental scaling.
                  </strong>
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div {...fadeInUp} className="max-w-3xl mx-auto space-y-5 text-base md:text-lg text-muted-foreground leading-relaxed mb-16">
            <p>
              Tartar is yellowish and porous, it absorbs stains from food, tea, coffee,
              and anything else you consume. This is why teeth look progressively duller
              over time even when someone brushes diligently. The discolouration you're
              seeing isn't always the natural colour of your teeth, it's the buildup
              sitting on top of them.
            </p>
            <p>And beyond appearance, tartar that remains on the teeth causes something more serious over time:</p>
          </motion.div>

          {/* Consequences cards */}
          <motion.div {...fadeInUp} className="max-w-6xl mx-auto grid gap-5 sm:grid-cols-2">
            {consequences.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="group relative overflow-hidden rounded-3xl border bg-card p-7 transition-all hover:shadow-xl"
              >
                <div className="absolute top-0 right-0 h-32 w-32 -translate-y-12 translate-x-12 rounded-full bg-rose-400/10 blur-2xl transition-all group-hover:bg-rose-400/20" />
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 mb-4">
                    <c.icon className="h-6 w-6 text-rose-600 dark:text-rose-400" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-primary mb-2">{c.title}</h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{c.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Reassurance */}
          <motion.div {...fadeInUp} className="mt-16 max-w-3xl mx-auto rounded-3xl bg-[#0f766e] p-8 md:p-10 text-white shadow-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-white/70 font-semibold mb-3">
              The thing worth knowing
            </p>
            <p className="text-base md:text-lg leading-relaxed">
              None of this is your fault. Tartar is a natural biological process that
              happens to every person with teeth. The difference between healthy teeth
              and damaged teeth, over time, often comes down to one thing:{" "}
              <strong>whether or not you remove it regularly.</strong>
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============== WHAT HAPPENS DURING A VISIT ============== */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-card" />
        <div
          className="absolute inset-0 -z-10 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-xs uppercase tracking-[0.2em] text-[#0f766e] font-semibold mb-4">
              Your visit, demystified
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary leading-[1.1] tracking-tight mb-5">
              What Actually Happens During
              <br />
              <span className="bg-gradient-to-r from-[#0f766e] to-secondary bg-clip-text text-transparent">
                a Scaling & Polishing Session
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              A lot of people put off dental visits because they don't know what to
              expect. The unknown is uncomfortable. So let's walk through exactly what a
              scaling and polishing session at VistaDentalcare looks like, step by step.
            </p>
          </motion.div>

          {/* Steps timeline */}
          <div className="max-w-4xl mx-auto space-y-6">
            {visitSteps.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative flex gap-5 md:gap-7 rounded-3xl border bg-background p-6 md:p-8 transition-all hover:shadow-xl hover:border-[#0f766e]/30"
              >
                <div className="shrink-0">
                  <div className="flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0f766e] to-[#0f766e]/70 text-white text-xl md:text-2xl font-bold shadow-lg">
                    {step.n}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-bold text-primary mb-2">{step.title}</h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quote callout */}
          <motion.div
            {...fadeInUp}
            className="mt-14 max-w-3xl mx-auto relative rounded-3xl bg-gradient-to-br from-[#0f766e]/10 via-secondary/5 to-[#0f766e]/5 border border-[#0f766e]/20 p-8 md:p-10"
          >
            <div className="absolute top-4 left-6 text-7xl font-serif text-[#0f766e]/20 select-none leading-none">
              "
            </div>
            <p className="relative text-lg md:text-xl text-foreground leading-relaxed italic font-medium pl-6">
              Many patients see a noticeable difference the moment they look in the
              mirror, brighter, cleaner teeth they didn't realise were possible without
              whitening.
            </p>
          </motion.div>

          {/* Quick facts */}
          <motion.div {...fadeInUp} className="mt-10 flex flex-wrap justify-center gap-3 md:gap-4">
            {[
              { icon: Clock, label: "30–60 minutes" },
              { icon: ShieldCheck, label: "Minimal discomfort" },
              { icon: Sparkles, label: "Immediate results" },
              { icon: Check, label: "No recovery needed" },
            ].map((f) => (
              <div
                key={f.label}
                className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm"
              >
                <f.icon className="h-4 w-4 text-[#0f766e]" strokeWidth={2.5} />
                {f.label}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============== IS THIS FOR YOU? ============== */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-background via-[#0f766e]/[0.04] to-secondary/[0.06]" />

        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto text-center mb-14">
            <p className="text-xs uppercase tracking-[0.2em] text-[#0f766e] font-semibold mb-4">
              Is this for you?
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary leading-[1.1] tracking-tight mb-5">
              You Probably Need a Clean
              <br />
              <span className="text-muted-foreground/80">More Than You Realise</span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Scaling and polishing is not a luxury treatment or something only people
              with "bad teeth" need. It's a foundational piece of oral health care, the
              way a car service is a foundational part of keeping a vehicle running well.
              Here's who should be booking:
            </p>
          </motion.div>

          <motion.div {...fadeInUp} className="max-w-6xl mx-auto grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {audience.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.07 }}
                className="group relative overflow-hidden rounded-3xl border bg-card p-6 md:p-7 transition-all hover:shadow-xl hover:-translate-y-1"
              >
                <div className="absolute top-0 right-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full bg-[#0f766e]/10 blur-2xl transition-all group-hover:bg-[#0f766e]/20" />
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0f766e]/12 mb-4">
                    <item.icon className="h-6 w-6 text-[#0f766e]" />
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-primary mb-2 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-12 text-center">
            <WhatsAppButton size="lg" />
          </div>
        </div>
      </section>

      {/* ============== MYTHS ============== */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-muted/40">
        <div
          className="absolute inset-0 -z-10 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute -top-32 -right-32 -z-10 h-[420px] w-[420px] rounded-full bg-[#0f766e]/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 -z-10 h-[420px] w-[420px] rounded-full bg-rose-300/15 blur-3xl" />

        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto text-center mb-14">
            <p className="text-xs uppercase tracking-[0.2em] text-[#0f766e] font-semibold mb-4">
              Setting the record straight
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary leading-[1.1] tracking-tight mb-5">
              Things People Believe That
              <br />
              <span className="bg-gradient-to-r from-[#0f766e] to-secondary bg-clip-text text-transparent">
                Keep Them From Coming In
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              These are the most common reasons people delay getting a professional
              clean. Let's put each one to rest.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-5">
            {myths.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="overflow-hidden rounded-3xl border bg-card shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="grid md:grid-cols-[auto_1fr] divide-y md:divide-y-0 md:divide-x divide-border">
                  <div className="flex items-start gap-4 p-6 md:p-7 md:max-w-md bg-rose-50/60">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100">
                      <X className="h-5 w-5 text-rose-600" strokeWidth={3} />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-rose-600 font-bold mb-2">
                        Myth
                      </p>
                      <p className="text-base md:text-lg text-primary font-medium leading-snug">
                        "{m.myth}"
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-6 md:p-7 bg-emerald-50/40">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
                      <Check className="h-5 w-5 text-emerald-700" strokeWidth={3} />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-emerald-700 font-bold mb-2">
                        Truth
                      </p>
                      <p className="text-sm md:text-base text-foreground/85 leading-relaxed">
                        {m.truth}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== TESTIMONIALS ============== */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-card" />

        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto text-center mb-14">
            <p className="text-xs uppercase tracking-[0.2em] text-[#0f766e] font-semibold mb-4">
              In their own words
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary leading-[1.1] tracking-tight">
              What Patients Say After
              <br />
              <span className="bg-gradient-to-r from-[#0f766e] to-secondary bg-clip-text text-transparent">
                Their First Professional Clean
              </span>
            </h2>
          </motion.div>

          <div className="max-w-6xl mx-auto grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative flex flex-col rounded-3xl border bg-background p-7 shadow-sm transition-all hover:shadow-2xl hover:-translate-y-1"
              >
                <div className="absolute top-5 right-6 text-6xl font-serif text-[#0f766e]/15 select-none leading-none">
                  "
                </div>
                <div className="flex items-center gap-1 text-amber-500 mb-4">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <Star key={k} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm md:text-base text-foreground leading-relaxed mb-6 flex-1">
                  {t.quote}
                </p>
                <div className="flex items-center gap-3 pt-4 border-t">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#0f766e] to-secondary text-white font-bold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-primary">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== HEALTH CONNECTION ============== */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-rose-50/20 to-background dark:via-rose-950/10" />

        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto text-center mb-14">
            <p className="text-xs uppercase tracking-[0.2em] text-[#0f766e] font-semibold mb-4">
              The part worth taking seriously
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary leading-[1.1] tracking-tight mb-5">
              Your Mouth Is Connected to
              <br />
              <span className="text-muted-foreground/80">Everything Else</span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              A clean smile matters for confidence. But gum health matters for something
              bigger. Research continues to find connections between the state of your
              gums and conditions that affect the rest of your body. Chronic gum
              inflammation isn't just a dental issue, it's a health issue.
            </p>
          </motion.div>

          <motion.div {...fadeInUp} className="max-w-6xl mx-auto grid gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-14">
            {healthLinks.map((h, i) => (
              <motion.div
                key={h.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="rounded-3xl border bg-card p-6 text-center"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500/15 to-rose-500/5 mb-4">
                  <h.icon className="h-7 w-7 text-rose-600 dark:text-rose-400" />
                </div>
                <h3 className="text-base md:text-lg font-bold text-primary mb-2">{h.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{h.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div {...fadeInUp} className="max-w-3xl mx-auto rounded-3xl border bg-card p-7 md:p-8 mb-10">
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              None of this is meant to alarm you. It's meant to put into perspective
              something that is genuinely simple to manage:{" "}
              <strong className="text-foreground">
                a professional clean every six months is one of the highest-return
                investments you can make in your overall health.
              </strong>
            </p>
          </motion.div>

          <motion.div
            {...fadeInUp}
            className="max-w-3xl mx-auto rounded-3xl bg-gradient-to-br from-[#0f766e] to-[#0f766e]/80 p-8 md:p-10 text-white shadow-2xl"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                <Calendar className="h-6 w-6 text-white" strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-bold mb-3">
                  How often should you get a professional clean?
                </h3>
                <p className="text-sm md:text-base text-white/90 leading-relaxed">
                  The global dental standard is every six months for most people. Those
                  with a history of gum disease or heavy tartar buildup may benefit from
                  every 3–4 months. Your dentist at VistaDentalcare will advise what's
                  right for your specific situation after your first visit.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============== FAQ ============== */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-card" />

        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-xs uppercase tracking-[0.2em] text-[#0f766e] font-semibold mb-4">
              Good questions
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary leading-[1.1] tracking-tight">
              Things You Might Want to
              <br />
              <span className="text-muted-foreground/80">Know Before You Come In</span>
            </h2>
          </motion.div>

          <motion.div {...fadeInUp} className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((f, i) => (
                <AccordionItem
                  key={i}
                  value={`q-${i}`}
                  className="rounded-2xl border bg-background px-6 data-[state=open]:border-[#0f766e]/40 data-[state=open]:shadow-lg transition-all"
                >
                  <AccordionTrigger className="text-left text-base md:text-lg font-semibold text-primary hover:no-underline py-5">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm md:text-base text-muted-foreground leading-relaxed pb-5">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* ============== FINAL CTA ============== */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #064e4a 0%, #0f766e 45%, #115e59 100%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.9) 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-cyan-300/15 blur-3xl" />

        <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto text-center text-white space-y-7">
            <p className="text-xs uppercase tracking-[0.25em] text-emerald-200 font-semibold">
              Take the first step
            </p>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight text-white">
              One Appointment.
              <br />
              <span className="text-white/95">A Noticeably Cleaner,</span>
              <br />
              <span className="text-emerald-200">Healthier Smile.</span>
            </h2>
            <p className="text-base md:text-lg text-white/90 leading-relaxed max-w-2xl mx-auto">
              You've read this far because something resonated. That's usually the sign.
              Don't let another six months pass. Message VistaDentalcare today and let's
              get you booked in.
            </p>

            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur border border-white/30 px-5 py-2.5 text-sm text-white">
              <Calendar className="h-4 w-4" strokeWidth={2.5} />
              Appointment slots are limited each week, early bookings are encouraged.
            </div>

            <div className="pt-3">
              <WhatsAppButton size="xl" label="Book My Scaling & Polishing, WhatsApp" />
            </div>

            <p className="text-sm text-white/80">
              No commitment · No pressure · Honest, caring dental guidance
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============== FOOTER ============== */}
      <footer className="border-t bg-background py-10">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 text-center space-y-2">
          <p className="text-sm font-semibold text-primary">
            VistaDentalcare, Professional Dental Care
          </p>
          <p className="text-xs text-muted-foreground">
            This page is for educational purposes and does not replace a personalised
            dental consultation.
          </p>
        </div>
      </footer>
    </div>
  );
}
