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
  Syringe,
  Sparkles,
  Crown,
  Heart,
  Shield,
  Timer,
  CheckCircle,
  Zap,
  Bone,
  Activity,
  CalendarCheck,
  ThumbsUp,
} from "lucide-react";
import dentalTechImage from "@/assets/dental-technology.jpg";
import clinicImage from "@/assets/clinic-interior.jpg";

const processSteps = [
  {
    step: 1,
    title: "Comprehensive Evaluation",
    description: "We assess your oral health, bone density, and overall suitability for implants.",
    icon: Activity,
  },
  {
    step: 2,
    title: "Implant Placement",
    description: "The titanium implant is surgically placed into your jawbone under local anesthesia.",
    icon: Syringe,
  },
  {
    step: 3,
    title: "Healing Period",
    description: "3-6 months for the implant to fuse with your bone (osseointegration).",
    icon: Timer,
  },
  {
    step: 4,
    title: "Crown Attachment",
    description: "A custom crown is attached to the implant for a natural-looking, permanent tooth.",
    icon: CalendarCheck,
  },
];

const benefits = [
  {
    icon: Bone,
    title: "Preserves Jawbone",
    description: "Implants stimulate the jawbone just like natural tooth roots, preventing bone loss that occurs with missing teeth.",
  },
  {
    icon: Shield,
    title: "Permanent Solution",
    description: "Unlike dentures or bridges, implants are designed to last a lifetime with proper care. They become part of you.",
  },
  {
    icon: Sparkles,
    title: "Natural Look & Feel",
    description: "Implants look, feel, and function just like your natural teeth. Most people can't tell the difference.",
  },
  {
    icon: Zap,
    title: "Full Chewing Power",
    description: "Enjoy all your favorite foods without restrictions. Implants restore 100% of your natural biting force.",
  },
  {
    icon: CheckCircle,
    title: "No Adjacent Tooth Damage",
    description: "Unlike bridges, implants don't require altering healthy neighboring teeth. Your natural teeth stay untouched.",
  },
  {
    icon: Heart,
    title: "Improved Confidence",
    description: "No slipping, clicking, or embarrassing moments. Implants stay firmly in place, letting you live confidently.",
  },
];

const faqs = [
  {
    question: "How long do dental implants last?",
    answer: "Dental implants are designed to be a permanent solution. The titanium implant itself can last a lifetime with proper care. The crown on top may need replacement after 10-15 years due to normal wear, but this is a simple procedure.",
  },
  {
    question: "Is the implant procedure painful?",
    answer: "The procedure is performed under local anesthesia, so you won't feel pain during surgery. Post-operative discomfort is typically mild and manageable with over-the-counter pain relievers. Most patients are surprised by how comfortable the recovery is.",
  },
  {
    question: "Am I a candidate for dental implants?",
    answer: "Most adults with missing teeth are candidates for implants. Key requirements include adequate jawbone density, healthy gums, and good overall health. We'll conduct a thorough evaluation to determine if implants are right for you.",
  },
  {
    question: "How long does the implant process take?",
    answer: "The complete process typically takes 3-6 months due to the healing period needed for osseointegration. The actual procedures (implant placement and crown attachment) are relatively quick. We'll provide a detailed timeline for your case.",
  },
  {
    question: "How do I care for my dental implant?",
    answer: "Care for your implant just like natural teeth: brush twice daily, floss regularly, and visit us for check-ups. While implants can't get cavities, the surrounding gum tissue needs to stay healthy. Avoid excessive force like biting ice or hard objects.",
  },
  {
    question: "What's the success rate of dental implants?",
    answer: "Dental implants have a success rate of 95-98% when performed by experienced professionals and properly maintained. Success depends on factors like bone quality, oral hygiene, and overall health. We'll discuss your individual prognosis during consultation.",
  },
];

const candidates = [
  "Adults with one or more missing teeth",
  "People with adequate jawbone density",
  "Non-smokers or those willing to quit",
  "Those in good general health",
  "People unhappy with dentures or bridges",
  "Individuals committed to good oral hygiene",
];

const relatedServices = [
  {
    title: "Restorative Dentistry",
    description: "Alternative options like crowns and bridges.",
    href: "/services/restorative",
    icon: Crown,
  },
  {
    title: "Oral Surgery",
    description: "Extractions before implant placement.",
    href: "/services/oral-surgery",
    icon: Activity,
  },
  {
    title: "Gum Treatment",
    description: "Healthy gums support successful implants.",
    href: "/services/periodontics",
    icon: Heart,
  },
];

const DentalImplants = () => {
  return (
    <Layout>
      <ServiceHero
        title="Dental Implants"
        subtitle="The Gold Standard for Missing Teeth"
        description="Looking for dental implants in Abuja? Vista Dental Care provides the most advanced, permanent tooth replacement solution. Implants look, feel, and function just like natural teeth — designed to last a lifetime with proper care."
        image={dentalTechImage}
        icon={Syringe}
        iconColor="bg-teal-600"
        badges={["95%+ Success Rate", "Lifetime Solution", "Natural Results"]}
      />

      <TreatmentExplainer
        title="What Are Dental Implants?"
        subtitle="The Modern Solution"
        content={[
          "A dental implant is a titanium post that's surgically placed into your jawbone, where it fuses with the bone through a process called osseointegration. This creates an incredibly strong foundation for a replacement tooth.",
          "Once healed, a custom-made crown is attached to the implant, giving you a tooth that looks, feels, and functions just like your natural teeth. Unlike dentures, implants don't slip or click—they're permanently anchored in place.",
          "Implants also preserve your jawbone by providing stimulation that prevents the bone loss that typically occurs with missing teeth. This maintains your facial structure and oral health for the long term.",
        ]}
        highlights={[
          { icon: Bone, text: "Preserves jawbone structure" },
          { icon: ThumbsUp, text: "95-98% success rate" },
          { icon: Timer, text: "Designed to last a lifetime" },
          { icon: Sparkles, text: "Indistinguishable from natural teeth" },
        ]}
        image={clinicImage}
      />

      <BenefitsGrid
        title="Why Choose Dental Implants?"
        subtitle="Unmatched Advantages"
        benefits={benefits}
      />

      <ProcessTimeline
        title="Your Implant Journey"
        subtitle="From Consultation to New Smile"
        steps={processSteps}
      />

      <WhoIsThisFor
        title="Are Dental Implants Right for You?"
        subtitle="Ideal Candidates"
        description="While implants are an excellent solution for most people with missing teeth, certain factors contribute to successful treatment:"
        candidates={candidates}
        image={dentalTechImage}
      />

      <ServiceFAQ
        title="Dental Implant FAQs"
        subtitle="Common Questions"
        faqs={faqs}
      />

      <ServiceTestimonial
        quote="My dental implant is amazing—I forget it's not my real tooth! The process was easier than I expected, and the result is worth every kobo. I can eat anything and smile with complete confidence."
        author="Grace N."
        role="Single Tooth Implant Patient"
        rating={5}
        service="Dental Implants"
      />

      <RelatedServices
        currentService="Dental Implants"
        services={relatedServices}
      />

      <ServiceCTA
        title="Ready for a Permanent Solution in Abuja?"
        description="Discover if dental implants are right for you. Schedule a consultation at Vista Dental Care for a comprehensive evaluation and personalized treatment plan."
        primaryButtonText="Book Implant Consultation"
      />
    </Layout>
  );
};

export default DentalImplants;
