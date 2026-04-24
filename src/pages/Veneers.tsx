import { Layout } from "@/components/layout";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Sparkles,
  Check,
  Clock,
  AlertTriangle,
  ShieldCheck,
  Star,
  Crown,
  Gem,
  Diamond,
  Award,
  Heart,
  Zap,
  ArrowRight,
  Smile,
  Layers,
  Move,
  Ruler,
  RefreshCw,
  Minus,
  Building2,
  Microscope,
  Target,
  Wallet,
  GraduationCap,
} from "lucide-react";
import veneerBA1 from "@/assets/veneers-before-after-1.jpg";
import veneerBA2 from "@/assets/veneers-before-after-2.jpg";

const WHATSAPP_URL =
  "https://wa.me/2348000000000?text=Hi%20VistaDentalcare%2C%20I%20saw%20your%20veneers%20page%20and%20would%20like%20a%20free%20consultation.";

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

function WhatsAppButton({
  size = "lg",
  label = "Enquire on WhatsApp",
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

const veneerOptions = [
  {
    num: "01",
    title: "Porcelain Veneers",
    badge: "Premium · Long-lasting",
    icon: Crown,
    desc: "The gold standard. Hand-crafted in dental ceramics, porcelain veneers replicate the light-reflecting properties of natural enamel. Nearly invisible, highly durable, and beautifully precise.",
    points: [
      "Most natural appearance of all options",
      "Highly resistant to staining — coffee, tea, wine",
      "Lifespan of 10–15+ years with proper care",
      "Custom-shaded to perfection in every case",
    ],
  },
  {
    num: "02",
    title: "Composite Veneers",
    badge: "Accessible · Reversible",
    icon: Sparkles,
    desc: "Sculpted chair-side in a single visit using tooth-coloured resin. A superb entry point into veneers — affordable, reversible, and beautifully effective for minor corrections.",
    points: [
      "Completed in a single appointment",
      "No tooth reduction required in many cases",
      "Easily repaired if chipped",
      "Budget-friendly with excellent aesthetics",
    ],
  },
  {
    num: "03",
    title: "Zirconia Veneers",
    badge: "Ultra-strong · Modern",
    icon: Diamond,
    desc: "For patients who need maximum strength alongside exceptional aesthetics. Zirconia veneers are virtually indestructible and ideal for those with bruxism or heavy bite forces.",
    points: [
      "Strongest material available for veneers",
      "Excellent for grinding or clenching patients",
      "Outstanding durability — 15+ years",
      "Highly biocompatible — no gum sensitivity",
    ],
  },
];

const corrections = [
  { icon: "🟡", title: "Deep Discolouration", desc: "Intrinsic staining from tetracycline, fluorosis, or ageing that whitening cannot touch. Veneers cover it completely.", status: "Fully Corrected" },
  { icon: "🔹", title: "Chipped & Cracked Teeth", desc: "Minor chips and cracks are concealed permanently beneath a flawless porcelain surface. No more hiding your smile.", status: "Fully Corrected" },
  { icon: "↔️", title: "Gaps Between Teeth", desc: "Small to moderate diastemas can be closed with wider-profile veneers — no braces required, no years of waiting.", status: "Fully Corrected" },
  { icon: "📐", title: "Uneven or Misshapen Teeth", desc: "Teeth that are too short, too small, or poorly shaped are rebuilt to the ideal size and form for your face.", status: "Fully Corrected" },
  { icon: "🔄", title: "Mildly Crooked Teeth", desc: "Minor alignment issues can be corrected with veneers in weeks, not years — the 'instant orthodontics' effect.", status: "Often Corrected" },
  { icon: "📏", title: "Worn-Down Enamel", desc: "Teeth worn down by grinding or acid erosion can be restored to their original length and shape with durable veneers.", status: "Fully Corrected" },
];

const costsOfWaiting = [
  { num: "01", title: "Chipped Teeth Propagate", desc: "A hairline crack in enamel expands with every bite, every temperature change. What is a cosmetic issue today becomes structural damage requiring crowns, root canals, or extraction if left unaddressed. Veneers seal the damage permanently." },
  { num: "02", title: "Confidence Compounds Silently", desc: "Every time you hold back a smile, cover your mouth, or hesitate in a photo — you're paying an invisible social tax. Research confirms that smile confidence directly impacts career advancement, social connection, and mental wellbeing." },
  { num: "03", title: "Deeper Stains Require More Work", desc: "Intrinsic discolouration deepens over time. The earlier you act, the thinner the veneer needed, and the less enamel preparation required. Waiting doesn't make the problem smaller — it makes the solution more involved." },
  { num: "04", title: "Gaps Affect Bite Alignment", desc: "Untreated tooth gaps cause neighbouring teeth to drift over time, disrupting your bite and potentially triggering jaw discomfort, wear, and TMJ issues. Closing gaps with veneers today prevents a cascade of complications." },
];

const stats = [
  { value: "15+", label: "Years of wear from a quality porcelain veneer with proper maintenance" },
  { value: "1–2", label: "Visits to complete a full veneer smile transformation at VistaDentalcare" },
  { value: "98%", label: "Patient satisfaction rate globally for veneer procedures in clinical studies" },
  { value: "6+", label: "Smile issues corrected simultaneously in a single veneer treatment session" },
];

const idealCandidates = [
  "Adults with healthy gums and overall good oral health",
  "Those with stained teeth that don't respond to whitening",
  "Patients with chipped, cracked, or worn-down front teeth",
  "Anyone with noticeable gaps or slight spacing issues",
  "People looking for a complete, long-lasting smile makeover",
  "Those preparing for a major life event — wedding, graduation, promotion",
  "Patients who want results faster than orthodontics can deliver",
];

const requiresAssessment = [
  "Patients with active gum disease (must be treated first)",
  "Severe teeth grinding (bruxism) — protective options available",
  "Significant tooth decay — decay must be resolved first",
  "Very severe misalignment — may need orthodontics first",
  "Insufficient enamel thickness — alternative solutions explored",
  "Children and teenagers — jaw development must be complete",
];

const journeySteps = [
  { step: "Step 01", title: "WhatsApp Enquiry", desc: "Send us a message describing your smile concerns or what you'd like to change. Our team responds promptly, answers your questions honestly, and helps you decide if veneers are right for you — with zero pressure.", time: "Immediate response" },
  { step: "Step 02", title: "In-Clinic Consultation & Smile Assessment", desc: "At your appointment, we examine your teeth, gums, and bite. We discuss your desired outcome, show you examples, and present a personalised treatment plan with transparent pricing. You decide — at your own pace.", time: "30–45 minutes" },
  { step: "Step 03", title: "Tooth Preparation (if required)", desc: "For porcelain veneers, a thin layer of enamel (typically 0.5mm — less than a contact lens) is gently removed to create space. Composite veneers often require no removal at all. Local anaesthetic ensures comfort throughout.", time: "30–60 minutes" },
  { step: "Step 04", title: "Fabrication or Sculpting", desc: "For porcelain: impressions are taken and veneers are crafted in a dental laboratory to precise specifications. For composite: veneers are sculpted directly on your teeth in the same appointment using artistic layering techniques.", time: "Same visit (composite) or 1–2 weeks (porcelain)" },
  { step: "Step 05", title: "Bonding & Final Reveal", desc: "Your veneers are carefully bonded with dental adhesive, shaped, polished, and checked for perfect fit and bite. You'll see the final result in the mirror before you leave. The reveal moment is unforgettable.", time: "60–90 minutes" },
  { step: "Step 06", title: "Aftercare & Lifetime Support", desc: "We provide comprehensive aftercare guidance, schedule a follow-up check, and remain available via WhatsApp for any questions post-treatment. Your investment is protected with ongoing professional support.", time: "Ongoing" },
];

const whyVista = [
  { icon: "🏛️", title: "Qualified & Experienced", desc: "Our dentists specialise in cosmetic and restorative procedures, with hands-on experience across hundreds of veneer cases." },
  { icon: "🔬", title: "Premium Materials Only", desc: "We use only clinically tested, internationally certified porcelain and composite materials — no compromises on quality." },
  { icon: "🎯", title: "Personalised Design", desc: "Every veneer smile is designed around your face, skin tone, personality, and goals. This is not a template — it is bespoke artistry." },
  { icon: "💬", title: "WhatsApp-First Access", desc: "Questions at 9pm? We're accessible. Get real answers fast — no automated bots, no long waits, no call queues." },
  { icon: "💰", title: "Honest, Transparent Pricing", desc: "We quote fully before we begin. No hidden costs, no surprise additions. You stay in control of your investment at every step." },
  { icon: "🔄", title: "Aftercare Guarantee", desc: "We follow up after every procedure and remain your dental partner for the life of your veneers — not just the day of treatment." },
];

const Veneers = () => {
  return (
    <Layout>
      {/* HERO — Editorial dark luxury */}
      <section className="relative overflow-hidden bg-[hsl(220_45%_8%)] text-white">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-amber-400/30 to-transparent blur-3xl" />
          <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-tl from-rose-400/20 to-transparent blur-3xl" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.08),transparent_60%)]" />
        
        <div className="container relative py-20 md:py-32">
          <motion.div {...fadeInUp} className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-1.5 text-xs font-medium text-amber-200 backdrop-blur mb-8 tracking-widest uppercase">
              <Sparkles className="h-3.5 w-3.5" />
              VistaDentalcare — Smile Artistry
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-light leading-[1.05] tracking-tight mb-6">
              Your Smile<br />
              Is Your Most<br />
              <span className="italic bg-gradient-to-r from-amber-200 via-amber-100 to-rose-200 bg-clip-text text-transparent">
                Valuable Asset
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto mb-4 font-light">
              Dental Veneers — The Art of the Perfect Smile
            </p>
            
            <p className="text-base md:text-lg text-white/60 max-w-3xl mx-auto mb-10 leading-relaxed">
              In the space of one appointment, veneers can transform chipped, stained, gapped, or misshapen teeth into a flawless, natural-looking smile that lasts over a decade. This is not cosmetic dentistry. This is craftsmanship.
            </p>

            <div className="flex flex-col items-center gap-6">
              <WhatsAppButton size="xl" label="Enquire on WhatsApp" />
              
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs md:text-sm text-white/50">
                <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-amber-300" /> Free Consultation</span>
                <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-amber-300" /> Responds in Minutes</span>
                <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-amber-300" /> No Obligation</span>
                <span className="flex items-center gap-1.5"><Award className="h-3.5 w-3.5 text-amber-300" /> Expert Guidance</span>
              </div>
            </div>
          </motion.div>

          <motion.div {...fadeInUp} transition={{ duration: 0.6, delay: 0.3 }} className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 max-w-4xl mx-auto">
            {[
              { icon: "🦷", text: "Ultra-thin" },
              { icon: "✨", text: "Ultra-natural" },
              { icon: "💎", text: "Porcelain · Composite · Zirconia" },
              { icon: "⏱️", text: "1–2 visits" },
            ].map((item) => (
              <div key={item.text} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-4 py-5 text-center">
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="text-xs md:text-sm text-white/70 font-medium">{item.text}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* WHAT ARE VENEERS — Cream / editorial */}
      <section className="relative bg-[hsl(38_50%_96%)] py-20 md:py-32 overflow-hidden">
        <div className="absolute top-10 right-10 text-[200px] font-serif text-[hsl(220_45%_8%)]/[0.03] leading-none select-none hidden md:block">01</div>
        
        <div className="container relative">
          <motion.div {...fadeInUp} className="max-w-4xl">
            <div className="text-xs font-bold tracking-[0.3em] text-amber-700 uppercase mb-4">What Are Veneers?</div>
            <h2 className="text-4xl md:text-6xl font-serif font-light text-[hsl(220_45%_8%)] leading-[1.1] mb-10">
              A Shell of <span className="italic">Perfection</span><br />
              Bonded to Your Tooth
            </h2>

            <blockquote className="border-l-4 border-amber-400 pl-6 md:pl-8 my-10 text-lg md:text-2xl font-serif italic text-[hsl(220_45%_20%)] leading-relaxed">
              "A veneer is a wafer-thin layer of porcelain or composite resin, custom-crafted to bond permanently to the front surface of your tooth — masking imperfections and creating a flawlessly natural result."
            </blockquote>

            <div className="space-y-5 text-base md:text-lg text-[hsl(220_45%_25%)] leading-relaxed">
              <p>
                Veneers don't just cover problems — they eliminate them. Crafted in precise shades that match or brighten your natural teeth, they are virtually indistinguishable from real enamel and are incredibly durable. Think of them as a permanent upgrade to your smile.
              </p>
              <p>
                At VistaDentalcare, every veneer is precision-fitted to your facial structure, skin tone, and personal preference. No two smiles are the same, and neither are our solutions.
              </p>
            </div>

            <div className="mt-12 flex flex-wrap gap-3">
              {["Tooth-coloured", "Stain-resistant", "10–15 yr lifespan", "Minimally invasive", "Same-day results"].map((tag) => (
                <span key={tag} className="px-4 py-2 rounded-full bg-[hsl(220_45%_8%)] text-white text-sm font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* THREE OPTIONS — Deep teal */}
      <section className="relative bg-gradient-to-br from-[hsl(190_60%_18%)] via-[hsl(200_55%_12%)] to-[hsl(220_50%_10%)] text-white py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        
        <div className="container relative">
          <motion.div {...fadeInUp} className="max-w-3xl mb-16">
            <div className="text-xs font-bold tracking-[0.3em] text-cyan-300 uppercase mb-4">Your Options</div>
            <h2 className="text-4xl md:text-6xl font-serif font-light leading-[1.1]">
              Three Paths to Your<br />
              <span className="italic text-cyan-200">Perfect Smile</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {veneerOptions.map((opt, i) => (
              <motion.div
                key={opt.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-sm p-8 hover:border-cyan-300/40 transition-all duration-500 hover:-translate-y-2"
              >
                <div className="flex items-start justify-between mb-6">
                  <span className="text-5xl font-serif font-light text-cyan-200/40">{opt.num}</span>
                  <div className="w-12 h-12 rounded-2xl bg-cyan-300/10 border border-cyan-300/20 flex items-center justify-center">
                    <opt.icon className="h-6 w-6 text-cyan-200" />
                  </div>
                </div>
                <h3 className="text-2xl font-serif font-medium mb-2">{opt.title}</h3>
                <div className="text-xs uppercase tracking-widest text-cyan-300/80 mb-5 font-semibold">{opt.badge}</div>
                <p className="text-white/70 text-sm leading-relaxed mb-6">{opt.desc}</p>
                <ul className="space-y-3">
                  {opt.points.map((p) => (
                    <li key={p} className="flex items-start gap-3 text-sm text-white/80">
                      <Check className="h-4 w-4 text-cyan-300 mt-0.5 shrink-0" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BEFORE & AFTER */}
      <section className="relative bg-white py-20 md:py-32 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
        <div className="container">
          <motion.div {...fadeInUp} className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-xs font-bold tracking-[0.3em] text-amber-700 uppercase mb-4">Real Transformations</div>
            <h2 className="text-4xl md:text-6xl font-serif font-light text-[hsl(220_45%_8%)] leading-[1.1]">
              Before & <span className="italic">After</span>
            </h2>
            <p className="mt-6 text-muted-foreground text-base md:text-lg">Actual VistaDentalcare patients. Real results. Lasting confidence.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {[veneerBA1, veneerBA2].map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="group relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/5"
              >
                <img src={src} alt={`Veneer transformation case ${i + 1}`} className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur text-white text-xs font-semibold tracking-wider">
                  Case {i + 1}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CORRECTIONS — Soft purple */}
      <section className="relative bg-gradient-to-br from-[hsl(270_40%_96%)] via-[hsl(280_35%_94%)] to-[hsl(260_40%_95%)] py-20 md:py-32 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-purple-300/20 to-transparent blur-3xl" />
        
        <div className="container relative">
          <motion.div {...fadeInUp} className="max-w-3xl mb-16">
            <div className="text-xs font-bold tracking-[0.3em] text-purple-700 uppercase mb-4">What Veneers Correct</div>
            <h2 className="text-4xl md:text-6xl font-serif font-light text-[hsl(270_45%_15%)] leading-[1.1]">
              Every Flaw.<br />
              <span className="italic text-purple-700">Eliminated.</span>
            </h2>
            <p className="mt-6 text-base md:text-lg text-[hsl(270_30%_25%)] leading-relaxed">
              Veneers are remarkably versatile. One treatment can address multiple aesthetic concerns simultaneously — in a way no whitening, bonding, or orthodontics alone can achieve.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {corrections.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group rounded-3xl bg-white p-7 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-purple-100"
              >
                <div className="text-4xl mb-4">{c.icon}</div>
                <h3 className="text-lg font-semibold text-[hsl(270_45%_15%)] mb-2">{c.title}</h3>
                <p className="text-sm text-[hsl(270_20%_35%)] leading-relaxed mb-4">{c.desc}</p>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                  <Check className="h-3 w-3" /> {c.status}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* COST OF WAITING — Warning amber/red */}
      <section className="relative bg-gradient-to-b from-[hsl(20_90%_15%)] via-[hsl(15_85%_12%)] to-[hsl(10_80%_10%)] text-white py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-40" style={{ background: "radial-gradient(ellipse at top, rgba(251,146,60,0.15), transparent 60%)" }} />
        
        <div className="container relative">
          <motion.div {...fadeInUp} className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.3em] text-amber-300 uppercase mb-4">
              <AlertTriangle className="h-4 w-4" />
              The Cost of Waiting
            </div>
            <h2 className="text-4xl md:text-6xl font-serif font-light leading-[1.1]">
              Your Smile Is <span className="italic text-amber-200">Declining</span><br />
              Right Now
            </h2>
          </motion.div>

          <motion.blockquote {...fadeInUp} className="border-l-4 border-amber-400 pl-6 md:pl-8 mb-16 text-lg md:text-xl font-serif italic text-amber-100/90 max-w-4xl leading-relaxed">
            "The longer a tooth stays chipped, cracked, or structurally compromised, the more vulnerable it becomes to further breakage, sensitivity, and bacterial infiltration. What a veneer solves today could require a crown — or worse — tomorrow."
          </motion.blockquote>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {costsOfWaiting.map((c, i) => (
              <motion.div
                key={c.num}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-3xl border border-amber-300/20 bg-gradient-to-br from-white/[0.06] to-transparent backdrop-blur p-8"
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-3xl font-serif font-light text-amber-300/60">{c.num}</span>
                  <h3 className="text-xl md:text-2xl font-serif font-medium">{c.title}</h3>
                </div>
                <p className="text-white/75 leading-relaxed text-sm md:text-base">{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS — Light luxury */}
      <section className="relative bg-[hsl(45_55%_94%)] py-20 md:py-28 overflow-hidden">
        <div className="container">
          <motion.div {...fadeInUp} className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-xs font-bold tracking-[0.3em] text-amber-700 uppercase mb-4">The Case for Veneers</div>
            <h2 className="text-4xl md:text-6xl font-serif font-light text-[hsl(220_45%_8%)] leading-[1.1]">
              Why Millions <span className="italic">Choose Veneers</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl md:text-7xl font-serif font-light text-[hsl(220_45%_8%)] mb-3 bg-gradient-to-br from-amber-700 to-amber-500 bg-clip-text text-transparent">
                  {s.value}
                </div>
                <p className="text-sm md:text-base text-[hsl(220_30%_30%)] leading-relaxed max-w-[220px] mx-auto">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CANDIDACY — Split background */}
      <section className="relative bg-white py-20 md:py-32 overflow-hidden">
        <div className="container">
          <motion.div {...fadeInUp} className="max-w-3xl mb-16">
            <div className="text-xs font-bold tracking-[0.3em] text-emerald-700 uppercase mb-4">Candidacy</div>
            <h2 className="text-4xl md:text-6xl font-serif font-light text-[hsl(220_45%_8%)] leading-[1.1]">
              Are You a <span className="italic">Veneer Candidate?</span>
            </h2>
            <p className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed">
              Veneers are ideal for a wide range of patients but are not suitable for everyone. Our WhatsApp consultation will confirm your eligibility in minutes.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            <motion.div {...fadeInUp} className="rounded-3xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200 p-8 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white">
                  <Check className="h-5 w-5" strokeWidth={3} />
                </div>
                <h3 className="text-2xl font-serif font-medium text-emerald-900">Ideal Candidates</h3>
              </div>
              <ul className="space-y-4">
                {idealCandidates.map((c) => (
                  <li key={c} className="flex items-start gap-3 text-sm md:text-base text-emerald-950/80">
                    <Check className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" strokeWidth={2.5} />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div {...fadeInUp} transition={{ duration: 0.6, delay: 0.15 }} className="rounded-3xl bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200 p-8 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center text-white">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <h3 className="text-2xl font-serif font-medium text-amber-900">Requires Assessment First</h3>
              </div>
              <ul className="space-y-4">
                {requiresAssessment.map((c) => (
                  <li key={c} className="flex items-start gap-3 text-sm md:text-base text-amber-950/80">
                    <span className="text-amber-600 mt-0.5 shrink-0 font-bold">△</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* JOURNEY — Dark navy with timeline */}
      <section className="relative bg-gradient-to-b from-[hsl(220_45%_10%)] to-[hsl(225_50%_6%)] text-white py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-blue-400/20 to-transparent blur-3xl" />
        </div>
        
        <div className="container relative">
          <motion.div {...fadeInUp} className="max-w-3xl mb-16">
            <div className="text-xs font-bold tracking-[0.3em] text-blue-300 uppercase mb-4">Your Journey</div>
            <h2 className="text-4xl md:text-6xl font-serif font-light leading-[1.1]">
              From First Message<br />
              to <span className="italic text-blue-200">Dream Smile</span>
            </h2>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            <div className="absolute left-6 md:left-8 top-2 bottom-2 w-px bg-gradient-to-b from-blue-400/50 via-blue-400/30 to-transparent" />
            
            <div className="space-y-8">
              {journeySteps.map((s, i) => (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="relative pl-16 md:pl-24"
                >
                  <div className="absolute left-0 top-0 w-12 md:w-16 h-12 md:h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 border border-blue-300/40 flex items-center justify-center font-serif text-lg md:text-xl font-medium shadow-xl shadow-blue-500/20">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur p-6 md:p-7">
                    <div className="text-xs uppercase tracking-widest text-blue-300/80 mb-1 font-semibold">{s.step}</div>
                    <h3 className="text-xl md:text-2xl font-serif font-medium mb-3">{s.title}</h3>
                    <p className="text-white/70 text-sm md:text-base leading-relaxed mb-4">{s.desc}</p>
                    <div className="inline-flex items-center gap-1.5 text-xs text-blue-200/90 bg-blue-500/10 border border-blue-300/20 px-3 py-1 rounded-full">
                      <Clock className="h-3 w-3" /> {s.time}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WHY VISTA — Warm cream */}
      <section className="relative bg-[hsl(35_40%_95%)] py-20 md:py-32 overflow-hidden">
        <div className="container">
          <motion.div {...fadeInUp} className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-xs font-bold tracking-[0.3em] text-amber-700 uppercase mb-4">Why VistaDentalcare</div>
            <h2 className="text-4xl md:text-6xl font-serif font-light text-[hsl(220_45%_8%)] leading-[1.1]">
              Craftsmanship You<br />
              Can <span className="italic">Trust</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyVista.map((w, i) => (
              <motion.div
                key={w.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group rounded-3xl bg-white p-8 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-amber-100"
              >
                <div className="text-4xl mb-5 transition-transform duration-300 group-hover:scale-110">{w.icon}</div>
                <h3 className="text-xl font-serif font-medium text-[hsl(220_45%_8%)] mb-3">{w.title}</h3>
                <p className="text-sm text-[hsl(220_25%_35%)] leading-relaxed">{w.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA — Bold gradient */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[hsl(220_45%_8%)] via-[hsl(225_55%_12%)] to-[hsl(200_70%_18%)] text-white py-24 md:py-36">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-amber-400/30 to-transparent blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-cyan-400/20 to-transparent blur-3xl" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent_70%)]" />

        <div className="container relative">
          <motion.div {...fadeInUp} className="max-w-4xl mx-auto text-center">
            <div className="text-xs font-bold tracking-[0.3em] text-amber-300 uppercase mb-6">Begin Your Transformation</div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif font-light leading-[1.1] mb-8">
              The Smile You've Always<br />
              Wanted Is{" "}
              <span className="italic bg-gradient-to-r from-amber-200 via-amber-100 to-rose-200 bg-clip-text text-transparent">
                One Message Away
              </span>
            </h2>
            <p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
              You've read this far because your smile matters to you. Now take one small step. Chat with us on WhatsApp — no commitment, no pressure, just honest answers from a team that genuinely cares about your outcome.
            </p>

            <WhatsAppButton size="xl" label="Start Your Smile Journey on WhatsApp" />

            <div className="mt-10 flex items-center justify-center gap-2 text-sm text-amber-200/80">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-300 animate-pulse" />
              <span className="italic">Every day of delay is another day of hiding your smile</span>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Veneers;
