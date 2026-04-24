import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Check, MessageCircle, Star, Sparkles } from "lucide-react";
import heroImg from "@/assets/restoration-hero.jpg";
import goldImg from "@/assets/restoration-gold-silver-upload.jpg";
import partialImg from "@/assets/restoration-partial-upload.jpg";
import fullVideo from "@/assets/restoration-full-upload.mp4";
import bridgeImg from "@/assets/restoration-bridge-upload.jpg";
import telescopicImg from "@/assets/restoration-telescopic-upload.jpg";
import edentulousBeforeImg from "@/assets/restoration-edentulous-before.jpg";
import edentulousAfterImg from "@/assets/restoration-edentulous-after.jpg";
import goldCaseBeforeImg from "@/assets/restoration-case-gold-before.jpg";
import goldCaseAfterImg from "@/assets/restoration-case-gold-after.jpg";
import partialCaseBeforeImg from "@/assets/restoration-case-partial-before.jpg";
import partialCaseAfterImg from "@/assets/restoration-case-partial-after.jpg";
import bridgeCaseBeforeImg from "@/assets/restoration-case-bridge-before.jpg";
import bridgeCaseAfterImg from "@/assets/restoration-case-bridge-after.jpg";
import grillsImg from "@/assets/restoration-grills.jpg";

const WHATSAPP_URL =
  "https://wa.me/2347088788880?text=Hi%20VistaDentalcare%2C%20I'd%20like%20to%20discuss%20tooth%20replacement%20options.";

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.55, ease: "easeOut" as const },
};

function WhatsAppButton({
  size = "lg",
  label = "Chat With Us on WhatsApp",
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
  "Covering your mouth when you laugh or smile",
  "Avoiding certain foods because of a missing or painful tooth",
  "Feeling self-conscious in photos or social situations",
  "Worrying that people notice the gap when you talk",
  "Putting off the dentist because you don't know where to start",
];

type RestorationOption = {
  icon: string;
  title: string;
  tagline: string;
  badges: string[];
  img?: string;
  mediaType?: "image" | "video";
  beforeAfter?: {
    before: string;
    after: string;
  };
  body: string[];
  best: string;
  inlineImage?: {
    src: string;
    alt: string;
    beforeParagraphIndex: number;
  };
};

const options: RestorationOption[] = [
  {
    icon: "🥇",
    title: "Gold & Silver Tooth Restoration",
    tagline: "A durable, time-tested single tooth fix",
    badges: ["Single Tooth", "Highly Durable", "Functional First"],
    img: goldImg,
    body: [
      "Gold and silver tooth restorations involve fitting a custom-made metal crown or cap over a damaged, decayed, or weakened tooth, or using it to restore the appearance of a tooth that has been badly affected. Gold restorations have been used in dentistry for over a century because of one simple reason: they last.",
      "Gold is biocompatible (safe inside your mouth), incredibly strong, and doesn't corrode. Silver restorations offer a similarly resilient option at a different price point. In many cultures, gold teeth are also a mark of style and confidence, bold, intentional, and unmistakably personal.",
      "Plain tooth grills are decorative gold or silver covers placed over the front teeth, a cosmetic option for those who want the aesthetic without a permanent procedure.",
    ],
    best: "People with a severely damaged or decayed tooth that still has a root; those who want a long-lasting, low-maintenance solution; and anyone drawn to the look of a gold or silver finish.",
    inlineImage: {
      src: grillsImg,
      alt: "Decorative tooth grills with crystal embellishments on front teeth",
      beforeParagraphIndex: 2,
    },
  },
  {
    icon: "🔧",
    title: "Removable Partial Dentures",
    tagline: "Replace several missing teeth, affordably",
    badges: ["Multiple Teeth", "Removable", "Most Affordable"],
    img: partialImg,
    body: [
      "A removable partial denture is a plate, usually made of acrylic, metal, or a combination, that holds one or more artificial teeth. It clips onto your remaining natural teeth using small metal clasps and can be taken out for cleaning at night.",
      "This is one of the most widely used and accessible tooth replacement options, especially when someone has lost several teeth in different areas but still has healthy teeth remaining. They restore your ability to chew, speak properly, and smile confidently, and they are custom-fitted to your mouth for comfort.",
      "Modern partial dentures are significantly more refined than older versions. Many patients are pleasantly surprised by how natural and comfortable they feel within the first few weeks.",
    ],
    best: "People missing multiple teeth who still have healthy natural teeth; those looking for an affordable, non-surgical solution; and patients who prefer something removable for easy cleaning.",
  },
  {
    icon: "🪥",
    title: "Edentulous Partial Dentures",
    tagline: "Before-and-after restoration for missing teeth",
    badges: ["Before & After", "Partial Denture", "Smile Restoration"],
    beforeAfter: {
      before: edentulousBeforeImg,
      after: edentulousAfterImg,
    },
    body: [
      "Edentulous partial dentures are used when a patient has multiple missing teeth and needs a custom removable appliance to restore appearance and chewing function. They are carefully designed to sit comfortably and blend with the remaining teeth.",
      "This option helps fill visible gaps, support the lips and cheeks better, and make speaking and smiling feel more natural again. Each denture is made to suit the patient's mouth and bite.",
      "The before-and-after result often shows a dramatic improvement in confidence, comfort, and everyday function, especially for patients who have been struggling with visible tooth loss.",
    ],
    best: "Patients with several missing teeth who want an affordable removable solution that restores smile appearance, basic chewing ability, and day-to-day confidence.",
  },
  {
    icon: "😊",
    title: "Full Dentures",
    tagline: "A complete set of replacement teeth",
    badges: ["Full Arch", "Removable", "Complete Restoration"],
    img: fullVideo,
    mediaType: "video",
    body: [
      "Full dentures, sometimes called complete dentures, replace an entire arch of teeth, either the upper jaw, the lower jaw, or both. They sit directly on the gum and are held in place by natural suction, sometimes assisted by a dental adhesive.",
      "Losing all your teeth can feel overwhelming. But full dentures restore more than just your ability to eat and speak, they restore your face's natural shape and give you back the confidence of a full smile. Many patients describe getting their dentures as one of the most meaningful moments of their adult lives.",
      "At VistaDentalcare, full dentures are custom-made to fit your specific gum shape and are matched to a natural-looking tooth shade and size that suits your face.",
    ],
    best: "People who have lost all or most of their natural teeth in one or both jaws, and are looking for a complete, comfortable, natural-looking replacement.",
  },
  {
    icon: "⚙️",
    title: "Telescopic Dentures",
    tagline: "The precision upgrade, stable, secure, refined",
    badges: ["Premium Option", "Removable But Secure", "Long-Lasting"],
    img: telescopicImg,
    body: [
      "Telescopic dentures are an advanced type of removable denture that uses a double-crown system for retention. A primary crown is cemented onto the remaining natural teeth, and the denture fits precisely over these, locking in like a telescope, to give a level of stability that standard dentures simply cannot match.",
      "The result is a denture that feels significantly more secure during eating, speaking, and laughing. There is no slipping, no adhesive paste, and no embarrassing moments. Telescopic dentures also protect the underlying teeth they attach to, which can slow further tooth loss.",
      "This is a particularly excellent option for patients who have had bad experiences with loose-fitting conventional dentures, or who simply want the most comfortable, premium removable solution available.",
    ],
    best: "Patients with some remaining teeth who want the security of a fixed feel with the convenience of removability; those who've been frustrated with loose conventional dentures; anyone wanting the most refined removable option.",
  },
  {
    icon: "🌉",
    title: "Crown & Bridge",
    tagline: "A fixed, non-removable restoration for missing teeth",
    badges: ["Fixed (Permanent)", "1–3 Teeth", "Natural-Looking"],
    img: bridgeImg,
    body: [
      "A dental bridge is a fixed (non-removable) solution for replacing one to three consecutive missing teeth. It works by placing crowns on the teeth on either side of the gap, known as abutment teeth, and suspending an artificial tooth (or teeth) between them, literally \"bridging\" the gap.",
      "A crown is a custom-made cap that covers an existing damaged tooth entirely, restoring its shape, strength, and appearance. Crowns can be made from porcelain, metal, or a combination, and they are matched to the colour of your surrounding teeth for a seamless look.",
      "Because a crown and bridge is cemented permanently into place, you care for it just like natural teeth, regular brushing, flossing, and dental visits. There's nothing to take out, no adhesive to apply. For many people, this feels like the most natural tooth replacement experience possible.",
    ],
    best: "People missing one to three consecutive teeth with healthy teeth on either side of the gap; anyone who prefers a permanent, fixed solution; patients who want something that feels and functions closest to natural teeth without surgery.",
  },
];

const guides = [
  { icon: "1️⃣", title: "Missing just one tooth?", desc: "A crown & bridge or gold/silver restoration may be your best fit, fixed, natural-feeling, and long-lasting. Perfect if the surrounding teeth are healthy." },
  { icon: "🦷", title: "Missing several teeth?", desc: "A removable partial denture gives you back a full smile affordably. If you want more stability, telescopic dentures offer a premium step up." },
  { icon: "😶", title: "Lost most or all your teeth?", desc: "Full dentures restore everything, your bite, your speech, your face shape, and your confidence. Custom-fitted for your mouth at VistaDentalcare." },
  { icon: "🔒", title: "Struggling with loose dentures?", desc: "Telescopic dentures are engineered specifically for this problem. They lock onto remaining teeth with precision, no slipping, no paste, no anxiety." },
  { icon: "✨", title: "Want style with function?", desc: "Gold tooth restorations or grills deliver exactly that. Strong, safe, and unmistakably bold, a deliberate choice, not a compromise." },
  { icon: "🤷", title: "Not sure at all?", desc: "That's what we're here for. A quick WhatsApp conversation or dental assessment at VistaDentalcare will give you a clear, honest recommendation." },
];

const testimonials = [
  { name: "Ngozi A.", role: "Crown & Bridge patient", quote: "I had been missing a front tooth for almost two years and barely smiled during that time. VistaDentalcare fitted me with a crown and bridge and I cried when I saw myself in the mirror. I forgot what my smile used to look like." },
  { name: "Chief Rotimi B.", role: "Telescopic Dentures patient", quote: "I was using old dentures from another clinic that kept sliding when I talked. It was so embarrassing. After getting telescopic dentures here, everything changed. They feel like my own teeth. I can laugh freely now." },
  { name: "Amaka J.", role: "Removable Partial Dentures patient", quote: "I didn't know partial dentures could look this natural. People don't even notice. The team at VistaDentalcare was very patient with me, they explained everything before doing anything. I felt safe." },
];

const beforeAfterCases = [
  {
    title: "Gold & Silver Restoration",
    before: goldCaseBeforeImg,
    after: goldCaseAfterImg,
    result: "A damaged front tooth restored into a bold, confident finish.",
  },
  {
    title: "Edentulous Partial Denture",
    before: partialCaseBeforeImg,
    after: partialCaseAfterImg,
    result: "Missing lower teeth replaced to restore smile balance and function.",
  },
  {
    title: "Crown & Bridge",
    before: bridgeCaseBeforeImg,
    after: bridgeCaseAfterImg,
    result: "A visible gap closed with a natural-looking fixed restoration.",
  },
];

const trustPoints = [
  "Qualified, experienced dental professionals",
  "Full range of replacement options under one roof",
  "Custom-fitted restorations, nothing generic",
  "Comfortable, judgement-free environment",
  "Clear cost guidance before any treatment begins",
];

const faqs = [
  { q: "Is tooth replacement painful?", a: "Most replacement procedures involve little to no pain. Fitting a crown, bridge, or denture is generally comfortable. For procedures that require any preparation of existing teeth, local anaesthesia is used. Our team will always explain what to expect before anything begins, and your comfort is our priority throughout." },
  { q: "How long will the replacement last?", a: "With proper care, crowns and bridges typically last 10–15 years or longer. Full and partial dentures usually last 5–8 years before they may need adjustment or replacement as the gum changes shape. Telescopic dentures, with good maintenance, can last well over a decade. Gold restorations are among the most durable options in all of dentistry." },
  { q: "Can I get a replacement even if it's been years since I lost the tooth?", a: "In most cases, yes. However, leaving a gap for a long time can cause the surrounding teeth to shift and the gum and bone to change. This is why it's always better not to delay, but it doesn't mean you've missed your chance. A dental assessment will show exactly what your current situation allows." },
  { q: "How do I know which option is within my budget?", a: "At VistaDentalcare, we believe cost should never be a conversation you're afraid to have. After a dental assessment, we'll clearly explain the cost of each recommended option so you can make an informed decision. We have solutions at a range of price points, from partial dentures to premium telescopic options, and we'll never push you toward something outside your means." },
  { q: "How do I get started?", a: "The simplest step is to send us a WhatsApp message. Tell us a little about your situation, how many teeth are affected, how long it's been, and what concerns you most, and we'll help you understand what the right next step looks like. There's no obligation and no judgement. We're here to help." },
];

export default function ToothRestoration() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sticky announcement bar */}
      <div className="sticky top-0 z-50 w-full border-b text-white" style={{ backgroundColor: "#0f766e" }}>
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between gap-3 py-2.5 text-xs sm:text-sm">
          <p className="truncate">
            <span className="font-semibold">VistaDentalcare</span>, You deserve a complete smile. We'll help you find the right way to get there.
          </p>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="hidden sm:inline-flex items-center gap-1.5 font-semibold underline-offset-4 hover:underline">
            <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
          </a>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-secondary/[0.08] via-background to-primary/[0.06]" />
        <div className="absolute -top-40 -right-32 -z-10 h-[520px] w-[520px] rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 -z-10 h-[460px] w-[460px] rounded-full bg-primary/12 blur-3xl" />

        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-16 md:py-24 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10 items-center">
            <motion.div {...fadeInUp} className="lg:col-span-6 space-y-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-4 py-1.5 text-xs sm:text-sm font-medium text-secondary">
                Artificial Teeth Replacement
              </div>
              <h1 className="font-bold leading-[1.02] tracking-tight text-primary text-[2.5rem] sm:text-5xl md:text-6xl lg:text-[4.5rem]">
                You shouldn't have to{" "}
                <span className="bg-gradient-to-r from-secondary via-primary to-secondary bg-clip-text text-transparent">
                  hide your smile
                </span>{" "}
                for the rest of your life.
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
                Whether you've lost a tooth, several teeth, or are living with one that needs replacing, there is a solution for you. At VistaDentalcare, we'll help you find it.
              </p>
              <div className="pt-2 space-y-4">
                <WhatsAppButton size="xl" />
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-secondary" strokeWidth={3} /> Free to message</span>
                  <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-secondary" strokeWidth={3} /> No pressure</span>
                  <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-secondary" strokeWidth={3} /> Personal guidance</span>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="lg:col-span-6 relative">
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                <div className="absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-secondary/25 via-primary/10 to-secondary/15 blur-3xl" />
                <div className="relative overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-border aspect-[4/4.2]">
                  <img src={heroImg} alt="Patient smiling confidently after tooth restoration" className="h-full w-full object-cover" loading="eager" />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 rounded-full bg-background/95 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary shadow-md">
                    Real confidence · Real results
                  </div>
                </div>
                <motion.div initial={{ opacity: 0, y: -12 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="absolute -top-4 -right-2 sm:-right-5 z-20 hidden sm:flex items-center gap-2.5 rounded-2xl border bg-card/95 px-4 py-3 shadow-2xl">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/15">
                    <Sparkles className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-primary leading-none">6+</p>
                    <p className="text-[11px] text-muted-foreground">Replacement options</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Empathy */}
      <section className="py-20 md:py-28">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="max-w-3xl mx-auto space-y-8">
            <motion.div {...fadeInUp} className="space-y-3 text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-secondary">You are not alone</p>
              <h2 className="text-3xl md:text-5xl font-bold text-primary leading-tight">Living with a missing or damaged tooth is hard</h2>
            </motion.div>
            <motion.div {...fadeInUp} className="space-y-5 text-lg text-muted-foreground leading-relaxed">
              <p>It's not just about how your teeth look. When you're missing a tooth, or living with one that's severely damaged, it changes how you move through the world. You become careful. You think twice before laughing openly. You position yourself so people don't notice.</p>
              <p>Some people have lived this way for years, assuming replacement is too expensive, too complicated, or not worth the trouble. But here's the truth: modern dentistry has more options than most people realise, including options that are affordable, comfortable, and life-changing.</p>
              <p>This page will walk you through every artificial teeth replacement option available at VistaDentalcare, clearly and honestly, so you can understand what's right for your situation.</p>
            </motion.div>

            <motion.div {...fadeInUp}>
              <Card className="border-secondary/20 bg-secondary/5">
                <CardContent className="p-6 md:p-8 space-y-4">
                  <p className="font-semibold text-primary">Does any of this sound familiar?</p>
                  <ul className="space-y-3">
                    {symptoms.map((s) => (
                      <li key={s} className="flex items-start gap-3 text-muted-foreground">
                        <Check className="h-5 w-5 text-secondary shrink-0 mt-0.5" strokeWidth={2.5} />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-muted-foreground pt-2 border-t">
                    At VistaDentalcare, we see patients every week who've been hiding their smile for months, sometimes years. The moment they leave with a solution in place, something shifts. It's not just their teeth that change. It's how they carry themselves.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Options */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto text-center space-y-3 mb-16">
            <p className="text-sm font-semibold uppercase tracking-wider text-secondary">Your options, explained simply</p>
            <h2 className="text-3xl md:text-5xl font-bold text-primary leading-tight">There is more than one way to restore your smile</h2>
            <p className="text-lg text-muted-foreground">Not every missing tooth situation is the same. Read through each option and see which one sounds like your situation.</p>
          </motion.div>

          <div className="space-y-12 lg:space-y-20">
            {options.map((opt, idx) => (
              <motion.div key={opt.title} {...fadeInUp} className={`grid gap-8 lg:gap-12 lg:grid-cols-2 items-center ${idx % 2 === 1 ? "lg:[&>div:first-child]:order-2" : ""}`}>
                <div className="relative">
                  <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-secondary/20 to-primary/10 blur-2xl" />
                  <div className="relative overflow-hidden rounded-2xl shadow-xl ring-1 ring-border aspect-[4/3]">
                    {opt.beforeAfter ? (
                      <div className="grid h-full grid-cols-2">
                        <div className="relative">
                          <img src={opt.beforeAfter.before} alt={`${opt.title} before`} className="h-full w-full object-cover" loading="lazy" />
                          <div className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground shadow-sm">
                            Before
                          </div>
                        </div>
                        <div className="relative">
                          <img src={opt.beforeAfter.after} alt={`${opt.title} after`} className="h-full w-full object-cover" loading="lazy" />
                          <div className="absolute right-3 top-3 rounded-full bg-secondary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-secondary-foreground shadow-sm">
                            After
                          </div>
                        </div>
                      </div>
                    ) : opt.mediaType === "video" ? (
                      <video
                        src={opt.img}
                        className="h-full w-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                        controls
                        preload="metadata"
                      />
                    ) : (
                      <img src={opt.img} alt={opt.title} className="h-full w-full object-cover" loading="lazy" />
                    )}
                  </div>
                </div>
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-primary leading-tight">{opt.title}</h3>
                      <p className="text-secondary font-medium">{opt.tagline}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {opt.badges.map((b) => (
                      <span key={b} className="rounded-full border border-secondary/30 bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary">{b}</span>
                    ))}
                  </div>
                  {opt.body.map((p, i) => (
                    <div key={i}>
                      {opt.inlineImage && opt.inlineImage.beforeParagraphIndex === i && (
                        <div className="my-5 overflow-hidden rounded-2xl shadow-lg ring-1 ring-border">
                          <img
                            src={opt.inlineImage.src}
                            alt={opt.inlineImage.alt}
                            className="w-full h-auto object-cover"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <p className="text-muted-foreground leading-relaxed">{p}</p>
                    </div>
                  ))}
                  <div className="rounded-xl border-l-4 border-secondary bg-secondary/5 p-4">
                    <p className="text-sm"><span className="font-semibold text-primary">Best suited for:</span> <span className="text-muted-foreground">{opt.best}</span></p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto text-center space-y-4 mb-14">
            <p className="text-sm font-semibold uppercase tracking-wider text-secondary">Before and after</p>
            <h2 className="text-3xl md:text-5xl font-bold text-primary leading-tight">See what is possible for your smile</h2>
            <p className="text-lg text-muted-foreground">
              Real treatment outcomes help you picture what the right procedure can do for confidence, comfort, and daily life.
            </p>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-3">
            {beforeAfterCases.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <Card className="h-full overflow-hidden border-secondary/10 shadow-sm">
                  <div className="grid grid-cols-2 border-b border-border/60">
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <img src={item.before} alt={`${item.title} before treatment`} className="h-full w-full object-cover" loading="lazy" />
                      <div className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground shadow-sm">
                        Before
                      </div>
                    </div>
                    <div className="relative aspect-[4/5] overflow-hidden border-l border-border/60">
                      <img src={item.after} alt={`${item.title} after treatment`} className="h-full w-full object-cover" loading="lazy" />
                      <div className="absolute right-3 top-3 rounded-full bg-secondary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-secondary-foreground shadow-sm">
                        After
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6 space-y-3">
                    <h3 className="text-xl font-bold text-primary">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.result}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Finding your fit */}
      <section className="py-20 md:py-28">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto text-center space-y-3 mb-12">
            <p className="text-sm font-semibold uppercase tracking-wider text-secondary">Finding your fit</p>
            <h2 className="text-3xl md:text-5xl font-bold text-primary leading-tight">Not sure which option is right for you?</h2>
            <p className="text-lg text-muted-foreground">That's completely normal. The right treatment depends on how many teeth are missing, the condition of your remaining teeth, your lifestyle, and your budget.</p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {guides.map((g) => (
              <motion.div key={g.title} {...fadeInUp}>
                <Card className="h-full hover:shadow-xl transition-shadow border-secondary/10">
                  <CardContent className="p-6 space-y-3">
                    <h3 className="font-bold text-primary text-lg">{g.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{g.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto text-center space-y-3 mb-12">
            <p className="text-sm font-semibold uppercase tracking-wider text-secondary">Real patients, real results</p>
            <h2 className="text-3xl md:text-5xl font-bold text-primary leading-tight">What people say after getting their smile back</h2>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <motion.div key={t.name} {...fadeInUp}>
                <Card className="h-full border-secondary/10">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-1 text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-muted-foreground leading-relaxed italic">"{t.quote}"</p>
                    <div className="pt-2 border-t">
                      <p className="font-semibold text-primary">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="py-20 md:py-28" style={{ backgroundColor: "hsl(184 70% 14%)" }}>
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <motion.div {...fadeInUp} className="space-y-6 text-white">
              <p className="text-sm font-semibold uppercase tracking-wider text-white/70">Why VistaDentalcare</p>
              <h2 className="text-3xl md:text-5xl font-bold leading-tight">We don't just restore teeth.<br />We restore confidence.</h2>
              <p className="text-white/80 leading-relaxed">At VistaDentalcare, we understand that choosing a tooth replacement is a deeply personal decision. It affects how you look, how you feel, and how you show up in your own life. We take that seriously.</p>
              <p className="text-white/80 leading-relaxed">Our approach is simple: we listen first, explain your options clearly, and only recommend what genuinely fits your situation and budget. No pressure. No confusing jargon. Just honest, caring dental guidance.</p>
            </motion.div>
            <motion.div {...fadeInUp} className="space-y-4">
              {trustPoints.map((point) => (
                <div key={point} className="flex items-start gap-3 rounded-xl bg-white/10 backdrop-blur p-4 border border-white/10">
                  <Check className="h-5 w-5 text-white shrink-0 mt-0.5" strokeWidth={3} />
                  <span className="text-white">{point}</span>
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="rounded-2xl bg-white/10 p-5 text-center text-white">
                  <div className="text-4xl font-bold">6+</div>
                  <div className="text-xs text-white/70 mt-1">Replacement options available</div>
                </div>
                <div className="rounded-2xl bg-white/10 p-5 text-center text-white">
                  <div className="text-4xl font-bold">1</div>
                  <div className="text-xs text-white/70 mt-1">Conversation to start</div>
                </div>
              </div>
              <div className="pt-4">
                <WhatsAppButton size="lg" label="Message Us on WhatsApp" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto text-center space-y-3 mb-12">
            <p className="text-sm font-semibold uppercase tracking-wider text-secondary">Common questions</p>
            <h2 className="text-3xl md:text-5xl font-bold text-primary leading-tight">Things people usually want to know first</h2>
          </motion.div>

          <motion.div {...fadeInUp} className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((f, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="rounded-xl border bg-card px-6">
                  <AccordionTrigger className="text-left font-semibold text-primary hover:no-underline">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-primary via-primary to-secondary text-white">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-4xl md:text-6xl font-bold leading-tight">Your smile deserves to be seen.</h2>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed">One conversation with VistaDentalcare is all it takes to understand your options and begin the journey back to a smile you're proud of.</p>
            <p className="text-white/80">Assessment slots fill up quickly, reach out today to secure yours.</p>
            <div className="pt-4">
              <WhatsAppButton size="xl" label="Chat With VistaDentalcare, It's Free" />
            </div>
            <p className="text-sm text-white/70">No commitment · No pressure · Just honest, caring guidance</p>
          </motion.div>
        </div>
      </section>

      <footer className="py-8 border-t bg-muted/20">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 text-center text-sm text-muted-foreground space-y-2">
          <p className="font-semibold text-primary">VistaDentalcare, Professional Dental Care</p>
          <p>This page is for educational purposes only and does not replace a professional dental consultation.</p>
        </div>
      </footer>
    </div>
  );
}
