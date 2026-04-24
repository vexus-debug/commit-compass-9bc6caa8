import { Layout } from "@/components/layout";
import {
  ServiceHero,
  ProcessTimeline,
  ServiceFAQ,
  ServiceTestimonial,
  BenefitsGrid,
  WhoIsThisFor,
  RelatedServices,
  ServiceCTA,
  TreatmentExplainer,
} from "@/components/services";
import {
  Crown,
  Sparkles,
  Smile,
  Syringe,
  Heart,
  Shield,
  Utensils,
  Timer,
  CheckCircle,
  Gem,
  Wrench,
  RefreshCw,
} from "lucide-react";
import dentistPatientImage from "@/assets/dentist-patient.jpg";
import dentalTechImage from "@/assets/dental-technology.jpg";

const processSteps = [
  {
    step: 1,
    title: "Assessment",
    description: "We examine your teeth, take X-rays, and discuss your restoration needs and goals.",
    icon: Shield,
  },
  {
    step: 2,
    title: "Treatment Planning",
    description: "We present your options, whether crowns, bridges, or dentures, with costs and timelines.",
    icon: Crown,
  },
  {
    step: 3,
    title: "Preparation & Fitting",
    description: "Teeth are prepared, impressions taken, and temporary restorations placed if needed.",
    icon: Wrench,
  },
  {
    step: 4,
    title: "Final Restoration",
    description: "Your custom restoration is fitted, adjusted, and polished for a perfect fit.",
    icon: CheckCircle,
  },
];

const benefits = [
  {
    icon: Utensils,
    title: "Restored Chewing Function",
    description: "Eat your favorite foods again with confidence. Restorations bring back full biting and chewing ability.",
  },
  {
    icon: Smile,
    title: "Natural Appearance",
    description: "Modern materials closely match your natural teeth, so restorations blend seamlessly with your smile.",
  },
  {
    icon: Shield,
    title: "Protected Remaining Teeth",
    description: "Crowns protect weak or damaged teeth from further breakdown. Bridges prevent adjacent teeth from shifting.",
  },
  {
    icon: Timer,
    title: "Long-Lasting Results",
    description: "With proper care, crowns can last 10-15 years, bridges 5-15 years, and quality dentures 5-10 years.",
  },
  {
    icon: Gem,
    title: "Material Choices",
    description: "Choose from gold, silver, or tooth-colored materials based on your preferences, needs, and budget.",
  },
  {
    icon: RefreshCw,
    title: "Improved Speech",
    description: "Missing teeth can affect speech. Restorations help you speak clearly and confidently again.",
  },
];

const faqs = [
  {
    question: "What's the difference between a crown and a bridge?",
    answer: "A crown is a cap that covers and protects a single damaged tooth. A bridge replaces one or more missing teeth by anchoring to adjacent teeth. Both restore function and appearance, but they solve different problems.",
  },
  {
    question: "How long do dental crowns last?",
    answer: "Dental crowns typically last 10-15 years or longer with proper care. Factors affecting longevity include the material used, your oral hygiene habits, and habits like teeth grinding. Gold crowns often last the longest.",
  },
  {
    question: "Are dentures comfortable?",
    answer: "Modern dentures are much more comfortable than older versions. There's an adjustment period as your mouth adapts, but most patients find them comfortable for daily wear. We ensure a precise fit for maximum comfort.",
  },
  {
    question: "Can I eat normally with a dental bridge?",
    answer: "Yes! After an adjustment period, you'll be able to eat most foods normally. We recommend starting with soft foods and gradually returning to your regular diet. Proper care ensures your bridge functions well for years.",
  },
  {
    question: "What material options are available for crowns?",
    answer: "We offer gold crowns (most durable), silver/metal alloy crowns (strong and affordable), and tooth-colored options like porcelain or ceramic (most natural-looking). We'll help you choose based on the tooth location and your preferences.",
  },
  {
    question: "How do I care for my dentures?",
    answer: "Remove and rinse dentures after eating. Brush them daily with a soft brush and denture cleaner (not regular toothpaste). Soak overnight in denture solution. Also, brush your gums and tongue daily for oral health.",
  },
];

const candidates = [
  "People with severely decayed or damaged teeth",
  "Those missing one or more teeth",
  "Individuals with cracked or fractured teeth",
  "Patients who've had root canal treatment",
  "Those with old, failing restorations",
  "Anyone wanting to restore their natural bite function",
];

const relatedServices = [
  {
    title: "Dental Implants",
    description: "Permanent replacement for missing teeth.",
    href: "/services/implants",
    icon: Syringe,
  },
  {
    title: "Cosmetic Dentistry",
    description: "Enhance appearance with whitening and veneers.",
    href: "/services/cosmetic",
    icon: Sparkles,
  },
  {
    title: "Gum Treatment",
    description: "Healthy gums support your restorations.",
    href: "/services/periodontics",
    icon: Heart,
  },
];

const Restorative = () => {
  return (
    <Layout>
      <ServiceHero
        title="Restorative & Prosthodontics"
        subtitle="Rebuild Your Smile"
        description="Looking for restorative dentistry in Abuja? Vista Dental Care's crowns, bridges, and dentures are designed to give you back your confident smile. Quality materials, precise techniques, and natural-looking results that last for years."
        image={dentistPatientImage}
        icon={Crown}
        iconColor="bg-amber-600"
        badges={["Custom Fit", "Quality Materials", "Natural Look"]}
      />

      <TreatmentExplainer
        title="Restoring Your Smile"
        subtitle="Understanding Restorative Dentistry"
        content={[
          "Restorative dentistry focuses on repairing and replacing damaged or missing teeth. The goal is to restore both the function and appearance of your smile, so you can eat, speak, and smile with confidence.",
          "At Vista Dental Care, we offer comprehensive restorative solutions including dental crowns (caps), bridges (fixed replacements for missing teeth), complete dentures, partial dentures, and denture repair services.",
          "We use quality materials like gold, silver alloys, and tooth-colored ceramics to create custom restorations that fit perfectly, function naturally, and enhance your smile's appearance.",
        ]}
        highlights={[
          { icon: Crown, text: "Dental crowns (gold & silver)" },
          { icon: RefreshCw, text: "Bridges for missing teeth" },
          { icon: Smile, text: "Complete & partial dentures" },
          { icon: Wrench, text: "Expert denture repairs" },
        ]}
        image={dentalTechImage}
      />

      <BenefitsGrid
        title="Benefits of Restorative Dentistry"
        subtitle="Transform Your Quality of Life"
        benefits={benefits}
      />

      <ProcessTimeline
        title="Your Restoration Journey"
        subtitle="Step-by-Step Process"
        steps={processSteps}
      />

      <WhoIsThisFor
        title="Is Restorative Treatment Right for You?"
        subtitle="Ideal Candidates"
        description="Restorative dentistry can help if you're dealing with tooth damage or loss. You may benefit from our services if:"
        candidates={candidates}
        image={dentistPatientImage}
      />

      <ServiceFAQ
        title="Restorative Dentistry FAQs"
        subtitle="Your Questions Answered"
        faqs={faqs}
      />

      <ServiceTestimonial
        quote="After years of struggling with missing teeth, my new bridge has changed my life. I can eat anything I want and smile without embarrassment. The Vista team was incredibly patient and skilled."
        author="Michael O."
        role="Dental Bridge Patient"
        rating={5}
        service="Restorative & Prosthodontics"
      />

      <RelatedServices
        currentService="Restorative & Prosthodontics"
        services={relatedServices}
      />

      <ServiceCTA
        title="Ready to Restore Your Smile in Abuja?"
        description="Don't let damaged or missing teeth hold you back. Start your treatment today — book a consultation at Vista Dental Care to explore your restoration options."
        primaryButtonText="Book Consultation"
      />
    </Layout>
  );
};

export default Restorative;
