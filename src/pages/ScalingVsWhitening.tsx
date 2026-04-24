import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  MessageCircle,
  ChevronDown,
  Shield,
  Sparkles,
  Activity,
  Heart,
  Wind,
  AlertTriangle,
  Check,
  X,
  Clock,
  Stethoscope,
  Brush,
  Droplets,
  Award,
  Microscope,
  HandshakeIcon,
  Smile,
  RefreshCw,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/yellow-teeth-whitening.jpg";
import scalingImg from "@/assets/yellow-teeth-scaling.jpg";

const WHATSAPP_URL =
  "https://wa.me/2347088788880?text=Hi%20VistaDentalcare%2C%20I%27d%20like%20to%20know%20whether%20I%20need%20scaling%20or%20whitening.";

const fade = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6 },
};

function WhatsAppButton({ label = "Chat with Us on WhatsApp", className = "" }: { label?: string; className?: string }) {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-7 py-4 text-base font-semibold text-white shadow-lg shadow-[#25D366]/30 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-[#25D366]/40 ${className}`}
    >
      <MessageCircle className="h-5 w-5" />
      {label}
    </a>
  );
}

const silentThreats = [
  { icon: Microscope, title: "Tartar Becomes a Fortress", body: "Plaque that isn't removed hardens into tartar within 24–72 hours. Once hardened, brushing and flossing cannot remove it — only a professional scaling can. Left untreated, it attacks your gums and bone." },
  { icon: Activity, title: "Gum Disease Sets In", body: "Untreated tartar leads to gingivitis, then periodontitis — a silent destroyer of the bone that anchors your teeth. By the time it hurts, significant damage has already occurred." },
  { icon: AlertTriangle, title: "Tooth Loss Becomes Real", body: "Gum disease is the #1 cause of adult tooth loss globally. Implants and dentures cost 10× more than a simple scaling session. Prevention is not just smart — it's financially wise." },
  { icon: Droplets, title: "Stains Become Permanent", body: "Surface stains from coffee, tea, and food are removable today. Wait long enough and they penetrate the enamel, requiring more aggressive — and expensive — treatment to reverse." },
  { icon: Smile, title: "Confidence Takes the Hit", body: "Studies show people with discoloured or unhealthy teeth are perceived as less confident and less professional. Your smile is part of your first impression — every single day." },
  { icon: Heart, title: "It's Linked to Your Heart", body: "Chronic gum inflammation releases bacteria into the bloodstream. Research directly links untreated periodontal disease to increased risk of heart disease, stroke, and diabetes." },
];

const scalingFacts = [
  "Removes hardened tartar (calculus) above and below the gumline — impossible to remove at home",
  "Eliminates bacteria colonies that cause bad breath, bleeding gums, and infection",
  "Polishes enamel surfaces to remove surface stains and create a smooth finish bacteria struggle to stick to",
  "Allows your dentist to detect early cavities, cracks, or gum disease before they become serious",
  "Reduces gum inflammation and bleeding — often within a week after treatment",
];

const whiteningFacts = [
  "Penetrates enamel to break apart pigment molecules causing deep-set discolouration",
  "Lifts stains from coffee, tea, red wine, tobacco, and ageing that toothpaste cannot touch",
  "Achieves multiple shades whiter in a single in-clinic session — results you can see immediately",
  "Uses clinically controlled concentrations — far safer and more effective than over-the-counter kits",
  "Results last 12–24 months with proper care and touch-ups",
];

const compareRows: Array<{ feature: string; scaling: string | boolean; whitening: string | boolean }> = [
  { feature: "Primary Goal", scaling: "Oral health & hygiene", whitening: "Cosmetic brightening" },
  { feature: "Removes Tartar", scaling: true, whitening: false },
  { feature: "Removes Stains", scaling: "Surface only", whitening: "Deep stains" },
  { feature: "Treats Gum Disease", scaling: true, whitening: false },
  { feature: "Freshens Breath", scaling: "Significantly", whitening: "Minimal" },
  { feature: "Boosts Smile Aesthetics", scaling: "Moderately", whitening: "Dramatically" },
  { feature: "Recommended Frequency", scaling: "Every 6 months", whitening: "Every 12–24 months" },
  { feature: "Required Before Whitening?", scaling: "Always recommended", whitening: "—" },
  { feature: "Duration", scaling: "30–60 minutes", whitening: "60–90 minutes" },
  { feature: "Medical Necessity", scaling: "Preventive health", whitening: "Elective / cosmetic" },
];

const stats = [
  { value: "47%", label: "of adults over 30 have some form of gum disease — most don't know it yet" },
  { value: "3.5B", label: "people globally suffer from oral diseases that are largely preventable with routine care" },
  { value: "10×", label: "more expensive to treat advanced gum disease than a routine scaling every 6 months" },
  { value: "72h", label: "is all it takes for soft plaque to harden into tartar that only a professional can remove" },
];

const scalingSigns = [
  "Your gums bleed when you brush or floss",
  "You notice persistent bad breath even after brushing",
  "Your gums look swollen, red, or feel tender",
  "You can see visible yellowish or brownish buildup near your gumline",
  "It's been more than 6 months since your last clean",
  "Your teeth feel rough or 'fuzzy' even right after brushing",
  "You have spaces forming between teeth and gums",
];

const whiteningSigns = [
  "Your teeth are yellow, grey, or dull despite good brushing",
  "You drink coffee, tea, or red wine regularly",
  "You're a smoker or former smoker",
  "You have a big event coming up (wedding, interview, photoshoot)",
  "You avoid smiling in photos because of your tooth colour",
  "Over-the-counter whitening strips haven't worked well enough",
  "You want a measurable, lasting confidence upgrade",
];

const journey = [
  { n: "01", title: "Send Us a WhatsApp Message", body: "Tell us what you're experiencing or what you're looking for — clean, bright, or both. We'll guide you to the right treatment within minutes. No pressure, no obligation." },
  { n: "02", title: "Book Your Appointment", body: "We'll confirm a convenient date and time. We run on schedule — your time is valued. Appointments typically last 30–90 minutes depending on treatment." },
  { n: "03", title: "Examination & Personalised Plan", body: "Our dentist conducts a thorough oral exam, explains exactly what's needed, and walks you through every step — before, during, and after. No surprises." },
  { n: "04", title: "Treatment — Gentle & Precise", body: "Using professional-grade equipment, we remove tartar, polish surfaces, or apply whitening agents. Most patients are surprised by how comfortable and quick it is." },
  { n: "05", title: "Aftercare & Follow-Up", body: "We provide personalised home-care instructions and schedule your next preventive visit. Your smile is a long-term relationship — and we're in it with you." },
];

const reasons = [
  { icon: Award, title: "Qualified Professionals", body: "Licensed dentists with years of clinical experience in preventive and cosmetic dentistry." },
  { icon: Microscope, title: "Modern Equipment", body: "Professional ultrasonic scalers and clinically approved whitening systems for safe, effective results." },
  { icon: HandshakeIcon, title: "Transparent Pricing", body: "No hidden fees, no pressure upsells. You'll always know what you're paying for before any treatment begins." },
  { icon: MessageCircle, title: "WhatsApp Access", body: "Book, ask questions, or get aftercare advice directly — real responses from real people, fast." },
  { icon: Heart, title: "Patient-Centred Care", body: "Anxious about dentists? We understand. We go at your pace and ensure you feel comfortable throughout." },
  { icon: RefreshCw, title: "Preventive Focus", body: "We'd rather help you stay healthy than treat emergencies. Our goal is your long-term oral wellness." },
];

const Cell = ({ value, accent, onDark = false }: { value: string | boolean; accent: "scaling" | "whitening"; onDark?: boolean }) => {
  if (value === true)
    return (
      <span className={`inline-flex items-center gap-1.5 font-semibold ${accent === "scaling" ? (onDark ? "text-emerald-300" : "text-emerald-600") : (onDark ? "text-fuchsia-300" : "text-fuchsia-600")}`}>
        <Check className="h-4 w-4" /> Yes
      </span>
    );
  if (value === false)
    return (
      <span className={`inline-flex items-center gap-1.5 ${onDark ? "text-white/50" : "text-muted-foreground"}`}>
        <X className="h-4 w-4" /> No
      </span>
    );
  return <span className={onDark ? "text-white" : "text-foreground"}>{value}</span>;
};

export default function ScalingVsWhitening() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sticky announcement bar */}
      <div className="sticky top-0 z-50 w-full border-b text-white" style={{ backgroundColor: "hsl(var(--primary))" }}>
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between gap-3 py-2.5 text-xs sm:text-sm">
          <p className="truncate inline-flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 shrink-0" />{" "}
            <span className="font-semibold">VistaDentalcare</span> — Professional dental care, honest guidance.
          </p>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="hidden sm:inline-flex items-center gap-1.5 font-semibold underline-offset-4 hover:underline whitespace-nowrap">
            <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
          </a>
        </div>
      </div>
      {/* HERO ─ deep gradient with grid + spotlight */}
      <section className="relative overflow-hidden bg-[hsl(var(--primary))] text-primary-foreground">
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
        <div className="absolute -top-32 -right-32 h-[520px] w-[520px] rounded-full bg-secondary/30 blur-[120px]" />
        <div className="absolute -bottom-40 -left-32 h-[460px] w-[460px] rounded-full bg-fuchsia-500/20 blur-[120px]" />

        <div className="container relative py-20 md:py-28 lg:py-36">
          <motion.div {...fade} className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse" />
              VistaDentalcare — Your Smile, Our Mission
            </div>
            <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
              Is Your Smile Healthy
              <span className="mt-2 block bg-gradient-to-r from-secondary via-fuchsia-300 to-secondary bg-clip-text text-transparent">
                or Just Surviving?
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-white/80 md:text-xl">
              There's a difference between teeth that look okay and teeth that <em>are</em> okay. Discover the two essential treatments your mouth may be silently asking for — before it's too late.
            </p>
            <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <WhatsAppButton />
              <p className="text-sm text-white/70">Free consultation • No pressure • Respond in minutes</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.6 }} className="mt-16 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
            <span>Scroll</span>
            <ChevronDown className="h-4 w-4 animate-bounce" />
          </motion.div>
        </div>
      </section>

      {/* SILENT THREAT ─ light, asymmetric grid with ribbon header */}
      <section className="relative bg-background py-24 md:py-32">
        <div className="container">
          <motion.div {...fade} className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-secondary">The Silent Threat</p>
              <h2 className="mt-3 text-4xl font-bold leading-tight text-primary md:text-5xl">
                What Happens<br /> When You Do Nothing
              </h2>
            </div>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Most dental problems don't hurt — until they become expensive emergencies. Ignoring routine care today is a costly gamble with your health, confidence, and wallet.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {silentThreats.map((t, i) => (
              <motion.article
                key={t.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-secondary via-fuchsia-400 to-secondary opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                  <t.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-primary">{t.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t.body}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* TWO TREATMENTS ─ split full-bleed dual cards */}
      <section className="relative bg-muted/40 py-24 md:py-32">
        <div className="container">
          <motion.div {...fade} className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-secondary">Know Your Treatment</p>
            <h2 className="mt-3 text-4xl font-bold leading-tight text-primary md:text-5xl">
              Two Treatments. One Healthy, Radiant Smile.
            </h2>
            <p className="mt-5 text-lg text-muted-foreground">
              Understanding what each treatment does puts you in control. Both are simple, safe, and transformative — yet many people confuse them or don't know which one they need.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-8 lg:grid-cols-2">
            {/* Scaling card */}
            <motion.div {...fade} className="group relative overflow-hidden rounded-3xl bg-card shadow-xl ring-1 ring-border">
              <div className="relative h-56 overflow-hidden">
                <img src={scalingImg} alt="Scaling and polishing treatment" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 via-emerald-900/30 to-transparent" />
                <div className="absolute bottom-5 left-6 flex items-center gap-3 text-white">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
                    <Stethoscope className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-white/70">Health Reset</p>
                    <h3 className="text-2xl font-bold">Scaling & Polishing</h3>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <p className="text-base leading-relaxed text-muted-foreground">
                  The essential health reset every mouth needs — whether or not you have visible problems.
                </p>
                <h4 className="mt-7 text-xs font-semibold uppercase tracking-widest text-emerald-700">What it does</h4>
                <ul className="mt-4 space-y-3">
                  {scalingFacts.map((f) => (
                    <li key={f} className="flex gap-3 text-sm leading-relaxed text-foreground">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-7 flex flex-wrap gap-2">
                  {["Everyone (6-monthly)", "Bleeding gums", "Bad breath", "Heavy tartar", "Gum sensitivity"].map((t) => (
                    <span key={t} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">{t}</span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Whitening card */}
            <motion.div {...fade} className="group relative overflow-hidden rounded-3xl bg-card shadow-xl ring-1 ring-border">
              <div className="relative h-56 overflow-hidden">
                <img src={heroImg} alt="Teeth whitening treatment" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-fuchsia-900/80 via-fuchsia-900/30 to-transparent" />
                <div className="absolute bottom-5 left-6 flex items-center gap-3 text-white">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-white/70">Confidence Upgrade</p>
                    <h3 className="text-2xl font-bold">Teeth Whitening</h3>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <p className="text-base leading-relaxed text-muted-foreground">
                  A confidence upgrade — safe, professional brightening that actually works and lasts.
                </p>
                <h4 className="mt-7 text-xs font-semibold uppercase tracking-widest text-fuchsia-700">What it does</h4>
                <ul className="mt-4 space-y-3">
                  {whiteningFacts.map((f) => (
                    <li key={f} className="flex gap-3 text-sm leading-relaxed text-foreground">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-fuchsia-600" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-7 flex flex-wrap gap-2">
                  {["Discolouration", "Wedding / Events", "Confidence boost", "Coffee/tea stains", "Professional image"].map((t) => (
                    <span key={t} className="rounded-full bg-fuchsia-50 px-3 py-1 text-xs font-medium text-fuchsia-700">{t}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* COMPARISON TABLE ─ dark band */}
      <section className="relative bg-[hsl(var(--primary))] py-24 text-primary-foreground md:py-32">
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, hsl(0 0% 100%) 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        <div className="container relative">
          <motion.div {...fade} className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-secondary">Side by Side</p>
            <h2 className="mt-3 text-4xl font-bold leading-tight md:text-5xl">
              Scaling & Polishing vs Whitening — At a Glance
            </h2>
            <p className="mt-5 text-lg text-white/75">
              Not sure which one you need? Here's the full picture. Many patients benefit from both — scaling first, whitening after.
            </p>
          </motion.div>

          <motion.div {...fade} className="mx-auto mt-14 max-w-5xl overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur">
            <div className="grid grid-cols-3 border-b border-white/10 bg-white/5 px-6 py-4 text-xs font-semibold uppercase tracking-widest text-white/70">
              <div>Feature</div>
              <div className="text-center text-emerald-300">Scaling & Polishing</div>
              <div className="text-center text-fuchsia-300">Teeth Whitening</div>
            </div>
            {compareRows.map((row, i) => (
              <div key={row.feature} className={`grid grid-cols-3 items-center px-6 py-4 text-sm ${i % 2 === 0 ? "bg-white/[0.02]" : ""}`}>
                <div className="font-medium text-white/90">{row.feature}</div>
                <div className="text-center text-white/90"><Cell value={row.scaling} accent="scaling" onDark /></div>
                <div className="text-center text-white/90"><Cell value={row.whitening} accent="whitening" onDark /></div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* STATS ─ oversized numerals */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-background to-rose-50 py-24 md:py-32">
        <div className="container">
          <motion.div {...fade} className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/50 bg-amber-100/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-amber-800">
              <AlertTriangle className="h-3.5 w-3.5" /> The Numbers Don't Lie
            </div>
            <h2 className="mt-5 text-4xl font-bold leading-tight text-primary md:text-5xl">
              Every Day You Wait Costs More
            </h2>
            <p className="mt-5 text-lg text-muted-foreground">
              Dental disease progresses silently and exponentially. What costs little to fix today becomes a major procedure tomorrow. These numbers represent real consequences of inaction.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.value}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="rounded-2xl border border-border bg-card/80 p-7 backdrop-blur transition-transform hover:-translate-y-1"
              >
                <div className="bg-gradient-to-br from-primary to-fuchsia-600 bg-clip-text text-5xl font-bold text-transparent md:text-6xl">{s.value}</div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{s.label}</p>
              </motion.div>
            ))}
          </div>

          <motion.div {...fade} className="mt-14 text-center">
            <WhatsAppButton label="Don't Wait — Book Your Visit Today" />
          </motion.div>
        </div>
      </section>

      {/* IS THIS YOU ─ split list */}
      <section className="relative bg-background py-24 md:py-32">
        <div className="container">
          <motion.div {...fade} className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-secondary">Is This You?</p>
            <h2 className="mt-3 text-4xl font-bold leading-tight text-primary md:text-5xl">
              Signs You Need This Right Now
            </h2>
            <p className="mt-5 text-lg text-muted-foreground">
              Your body gives you signals. Here's how to read them and know which treatment to ask for when you contact us.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-8 lg:grid-cols-2">
            <motion.div {...fade} className="rounded-3xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-8 md:p-10">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white">
                  <Stethoscope className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold text-primary">You Need Scaling & Polishing If…</h3>
              </div>
              <ul className="mt-7 space-y-4">
                {scalingSigns.map((s) => (
                  <li key={s} className="flex gap-3 text-base text-foreground">
                    <Check className="mt-1 h-5 w-5 flex-shrink-0 text-emerald-600" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div {...fade} className="rounded-3xl border-2 border-fuchsia-200 bg-gradient-to-br from-fuchsia-50 to-white p-8 md:p-10">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-fuchsia-600 text-white">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold text-primary">You Need Whitening If…</h3>
              </div>
              <ul className="mt-7 space-y-4">
                {whiteningSigns.map((s) => (
                  <li key={s} className="flex gap-3 text-base text-foreground">
                    <Check className="mt-1 h-5 w-5 flex-shrink-0 text-fuchsia-600" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* JOURNEY ─ vertical timeline on dark muted */}
      <section className="relative bg-muted/40 py-24 md:py-32">
        <div className="container">
          <motion.div {...fade} className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-secondary">What to Expect</p>
            <h2 className="mt-3 text-4xl font-bold leading-tight text-primary md:text-5xl">
              Your Journey at VistaDentalcare
            </h2>
            <p className="mt-5 text-lg text-muted-foreground">
              Simple, comfortable, and transparent — from the moment you message us to the moment you leave with a healthier smile.
            </p>
          </motion.div>

          <div className="relative mx-auto mt-16 max-w-3xl">
            <div className="absolute left-6 top-2 bottom-2 w-px bg-gradient-to-b from-secondary via-fuchsia-400 to-secondary md:left-1/2 md:-translate-x-1/2" />
            {journey.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className={`relative mb-10 flex gap-6 md:mb-14 md:w-1/2 ${i % 2 === 0 ? "md:pr-12" : "md:ml-auto md:flex-row-reverse md:pl-12"}`}
              >
                <div className="relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-secondary bg-card font-bold text-secondary md:absolute md:left-1/2 md:-translate-x-1/2">
                  {step.n}
                </div>
                <div className={`flex-1 rounded-2xl border border-border bg-card p-6 shadow-sm ${i % 2 === 0 ? "md:text-right" : ""}`}>
                  <h3 className="text-lg font-bold text-primary">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="relative bg-background py-24 md:py-32">
        <div className="container">
          <motion.div {...fade} className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-secondary">Why VistaDentalcare</p>
            <h2 className="mt-3 text-4xl font-bold leading-tight text-primary md:text-5xl">
              The Clinic That Puts You First
            </h2>
          </motion.div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reasons.map((r, i) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-7 transition-all hover:border-secondary/50 hover:shadow-xl"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-secondary to-fuchsia-500 text-white shadow-md">
                  <r.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-primary">{r.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{r.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA ─ dramatic dark gradient */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-fuchsia-900 py-28 text-primary-foreground md:py-36">
        <div className="absolute inset-0">
          <div className="absolute -top-20 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-secondary/20 blur-[120px]" />
          <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-fuchsia-500/20 blur-[120px]" />
        </div>
        <div className="container relative text-center">
          <motion.div {...fade} className="mx-auto max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-secondary">Your Move</p>
            <h2 className="mt-4 text-4xl font-bold leading-[1.1] md:text-6xl">
              Your Smile Won't Fix Itself.
              <span className="mt-2 block bg-gradient-to-r from-secondary via-fuchsia-300 to-secondary bg-clip-text text-transparent">
                Let's Change That Today.
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">
              Whether you need a deep clean, a brighter smile, or both — VistaDentalcare is ready for you. One message is all it takes to start.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4">
              <WhatsAppButton label="Book on WhatsApp — It's Free to Ask" />
              <p className="text-sm text-white/70">Tartar forms within 72 hours. Don't give it a head start.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t bg-background py-10">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 text-center space-y-2">
          <p className="text-sm font-semibold text-primary">VistaDentalcare — Professional Dental Care</p>
          <p className="text-xs text-muted-foreground">This page is for educational purposes and does not replace a personalised dental consultation.</p>
        </div>
      </footer>
    </div>
  );
}
