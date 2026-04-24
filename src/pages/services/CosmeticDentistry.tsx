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
  Sparkles,
  Smile,
  Crown,
  Syringe,
  Heart,
  Palette,
  Sun,
  Eye,
  Timer,
  CheckCircle,
  Gem,
  Camera,
  Star,
} from "lucide-react";
import teethWhiteningImage from "@/assets/teeth-whitening.jpg";
import coupleImage from "@/assets/couple-smiling.jpg";

const processSteps = [
  {
    step: 1,
    title: "Smile Consultation",
    description: "We discuss your goals and assess your teeth to determine the best cosmetic options for you.",
    icon: Camera,
  },
  {
    step: 2,
    title: "Treatment Planning",
    description: "Together we create a customized treatment plan to achieve your dream smile.",
    icon: Palette,
  },
  {
    step: 3,
    title: "Transformation",
    description: "We perform your chosen treatments using the latest techniques for stunning results.",
    icon: Sparkles,
  },
  {
    step: 4,
    title: "Reveal Your Smile",
    description: "Walk out with a beautiful, confident smile that you'll be proud to show off.",
    icon: Star,
  },
];

const benefits = [
  {
    icon: Sun,
    title: "Brighter, Whiter Smile",
    description: "Professional teeth whitening removes years of stains and discoloration, giving you a radiant smile that lights up the room.",
  },
  {
    icon: Eye,
    title: "Enhanced Appearance",
    description: "Cosmetic treatments fix chips, gaps, and uneven teeth, creating a more harmonious and attractive smile.",
  },
  {
    icon: Gem,
    title: "Boost Self-Confidence",
    description: "When you love your smile, it shows. Feel more confident in social situations, photos, and professional settings.",
  },
  {
    icon: Timer,
    title: "Quick Results",
    description: "Many cosmetic treatments offer dramatic results in just one visit. See the transformation in hours, not months.",
  },
  {
    icon: CheckCircle,
    title: "Long-Lasting Effects",
    description: "With proper care, cosmetic dental work like veneers can last 10-15 years, making it a worthwhile investment.",
  },
  {
    icon: Heart,
    title: "Improved Oral Health",
    description: "Many cosmetic treatments also strengthen and protect your teeth, improving overall oral health alongside aesthetics.",
  },
];

const faqs = [
  {
    question: "How long does professional teeth whitening last?",
    answer: "Professional teeth whitening results typically last 1-3 years, depending on your lifestyle and oral hygiene habits. Avoiding staining foods and drinks like coffee, tea, and red wine will help maintain your results. We can also provide touch-up treatments to keep your smile bright.",
  },
  {
    question: "Are veneers permanent?",
    answer: "Veneers are considered a permanent treatment because a thin layer of enamel is removed to place them. However, individual veneers typically last 10-15 years before needing replacement. With proper care, some patients enjoy their veneers for even longer.",
  },
  {
    question: "Is teeth whitening safe?",
    answer: "Yes, professional teeth whitening performed by a dentist is completely safe. We use controlled concentrations of whitening agents and protect your gums during the procedure. Some patients experience temporary sensitivity, which resolves quickly after treatment.",
  },
  {
    question: "What's the difference between in-office and take-home whitening?",
    answer: "In-office whitening uses stronger whitening agents and special lights for dramatic results in about an hour. Take-home kits use custom trays with a gentler formula, whitening gradually over 1-2 weeks. Both are effective – the choice depends on your preference and timeline.",
  },
  {
    question: "Can cosmetic dentistry fix gaps between teeth?",
    answer: "Absolutely! We offer several options for closing gaps: veneers can cover gaps while improving tooth color and shape, dental bonding is a quick and affordable solution, and orthodontic treatments can close gaps by moving teeth into proper alignment.",
  },
  {
    question: "How do I know which cosmetic treatment is right for me?",
    answer: "During your consultation, we'll discuss your smile goals, examine your teeth, and explain all suitable options. We consider factors like your budget, timeline, and desired results to recommend the best treatment plan for your unique needs.",
  },
];

const candidates = [
  "People with stained or discolored teeth",
  "Those with chipped, cracked, or worn teeth",
  "Individuals with gaps between their teeth",
  "Anyone wanting a complete smile makeover",
  "People with minor alignment issues",
  "Those preparing for a special event (wedding, photos)",
];

const relatedServices = [
  {
    title: "Orthodontics",
    description: "Straighten your teeth with braces or aligners.",
    href: "/services/orthodontics",
    icon: Smile,
  },
  {
    title: "Dental Implants",
    description: "Replace missing teeth with natural-looking implants.",
    href: "/services/implants",
    icon: Syringe,
  },
  {
    title: "Restorative Dentistry",
    description: "Crowns and bridges to restore your smile.",
    href: "/services/restorative",
    icon: Crown,
  },
];

const CosmeticDentistry = () => {
  return (
    <Layout>
      <ServiceHero
        title="Cosmetic Dentistry"
        subtitle="Smile Transformation Experts"
        description="Looking for cosmetic dentistry in Abuja? Vista Dental Care combines artistry with advanced techniques to deliver stunning, natural-looking results. From professional teeth whitening to complete smile makeovers — your confident smile is one appointment away."
        image={teethWhiteningImage}
        icon={Sparkles}
        iconColor="bg-pink-600"
        badges={["Dramatic Results", "Pain-Free Options", "Same-Day Treatments"]}
      />

      <TreatmentExplainer
        title="Transform Your Smile"
        subtitle="The Art of Cosmetic Dentistry"
        content={[
          "Cosmetic dentistry focuses on improving the appearance of your teeth, gums, and overall smile. It combines science with artistry to create beautiful, natural-looking results that enhance your confidence.",
          "At Vista Dental Care, we offer a range of cosmetic treatments including professional teeth whitening, porcelain veneers, dental bonding, and fashion braces. Each treatment is customized to your unique needs and goals.",
          "Whether you want to brighten stained teeth, fix chips and gaps, or completely transform your smile, our experienced team will guide you through the options and create a personalized treatment plan.",
        ]}
        highlights={[
          { icon: Sun, text: "Professional teeth whitening" },
          { icon: Gem, text: "Premium porcelain veneers" },
          { icon: Palette, text: "Natural-looking results" },
          { icon: Star, text: "Fashion braces available" },
        ]}
        image={coupleImage}
      />

      <BenefitsGrid
        title="Why Choose Cosmetic Dentistry?"
        subtitle="Life-Changing Benefits"
        benefits={benefits}
      />

      <ProcessTimeline
        title="Your Smile Transformation Journey"
        subtitle="From Consultation to Confidence"
        steps={processSteps}
      />

      <WhoIsThisFor
        title="Is Cosmetic Dentistry Right for You?"
        subtitle="Perfect Candidates"
        description="Cosmetic dentistry can benefit almost anyone who wants to improve their smile. You might be a great candidate if you relate to any of these:"
        candidates={candidates}
        image={teethWhiteningImage}
      />

      <ServiceFAQ
        title="Cosmetic Dentistry Questions Answered"
        subtitle="Your Questions"
        faqs={faqs}
      />

      <ServiceTestimonial
        quote="I got my teeth whitened before my wedding and the results were incredible! My smile looked absolutely perfect in all our photos. The team at Vista made the whole experience so easy and comfortable."
        author="Chioma E."
        role="Teeth Whitening Patient"
        rating={5}
        service="Cosmetic Dentistry"
      />

      <RelatedServices
        currentService="Cosmetic Dentistry"
        services={relatedServices}
      />

      <ServiceCTA
        title="Ready for Your Smile Transformation in Abuja?"
        description="Book a smile consultation at Vista Dental Care and discover how cosmetic dentistry can change your life. Your radiant smile is just one visit away."
        primaryButtonText="Book Consultation"
      />
    </Layout>
  );
};

export default CosmeticDentistry;
