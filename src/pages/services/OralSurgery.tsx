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
  Scissors,
  Syringe,
  Crown,
  Heart,
  Shield,
  Timer,
  CheckCircle,
  Activity,
  Pill,
  HeartPulse,
  Stethoscope,
  AlertCircle,
} from "lucide-react";
import clinicImage from "@/assets/clinic-interior.jpg";
import dentalTeamImage from "@/assets/dental-team.jpg";

const processSteps = [
  {
    step: 1,
    title: "Consultation & X-rays",
    description: "We examine the area, take X-rays, and discuss the procedure and anesthesia options.",
    icon: Stethoscope,
  },
  {
    step: 2,
    title: "Anesthesia",
    description: "We administer local anesthesia to ensure you're completely comfortable during the procedure.",
    icon: Pill,
  },
  {
    step: 3,
    title: "Surgical Procedure",
    description: "The surgery is performed carefully with your comfort as our priority.",
    icon: Scissors,
  },
  {
    step: 4,
    title: "Recovery Care",
    description: "We provide detailed aftercare instructions and schedule a follow-up appointment.",
    icon: HeartPulse,
  },
];

const benefits = [
  {
    icon: Shield,
    title: "Pain Relief",
    description: "Oral surgery resolves painful conditions like impacted wisdom teeth, infections, and damaged teeth, giving you relief.",
  },
  {
    icon: HeartPulse,
    title: "Prevent Complications",
    description: "Timely extraction of problematic teeth prevents infections, damage to adjacent teeth, and other serious issues.",
  },
  {
    icon: Activity,
    title: "Modern Techniques",
    description: "We use advanced surgical techniques that minimize trauma, reduce recovery time, and improve outcomes.",
  },
  {
    icon: Pill,
    title: "Comfort Focused",
    description: "Various anesthesia options ensure you're comfortable throughout the procedure. Many patients feel nothing at all.",
  },
  {
    icon: Timer,
    title: "Quick Recovery",
    description: "With proper care, most patients recover within a few days to a week, depending on the procedure complexity.",
  },
  {
    icon: CheckCircle,
    title: "Expert Care",
    description: "Our experienced team handles simple to complex surgical cases with precision and patient-centered attention.",
  },
];

const faqs = [
  {
    question: "How long does wisdom tooth removal take?",
    answer: "A single wisdom tooth extraction typically takes 20-40 minutes. If all four wisdom teeth are removed at once, the procedure may take 1-2 hours. The time depends on the tooth's position and complexity of the extraction.",
  },
  {
    question: "Is tooth extraction painful?",
    answer: "You won't feel pain during the extraction because we use effective local anesthesia. You may feel pressure or movement, but no pain. After the anesthesia wears off, some discomfort is normal but manageable with prescribed or over-the-counter pain relievers.",
  },
  {
    question: "What should I do after an extraction?",
    answer: "Bite on gauze for 30-45 minutes to control bleeding. Avoid spitting, using straws, or smoking for 24-48 hours. Eat soft foods, avoid the extraction site when eating. Take prescribed medications as directed and use ice packs to reduce swelling.",
  },
  {
    question: "When should wisdom teeth be removed?",
    answer: "Wisdom teeth should be removed if they're impacted, causing pain, growing at an angle, causing crowding, or showing signs of decay or infection. We'll evaluate your wisdom teeth and recommend extraction if necessary.",
  },
  {
    question: "What is a surgical extraction vs. simple extraction?",
    answer: "Simple extractions are for visible teeth that can be loosened and removed with forceps. Surgical extractions are needed for teeth that are broken, impacted, or haven't fully erupted—requiring an incision and sometimes bone removal.",
  },
  {
    question: "How long is the recovery period?",
    answer: "Most patients feel significantly better within 3-4 days. Complete healing of the extraction site takes 1-2 weeks. Bone and gum tissue fully heal in 3-4 weeks. We'll provide specific recovery guidelines based on your procedure.",
  },
];

const candidates = [
  "Those with painful or impacted wisdom teeth",
  "Patients with severely decayed teeth beyond repair",
  "People with teeth broken at the gum line",
  "Those with crowded teeth needing extraction for orthodontics",
  "Patients with infected teeth requiring removal",
  "Anyone preparing for dentures or implants",
];

const relatedServices = [
  {
    title: "Dental Implants",
    description: "Replace extracted teeth with permanent implants.",
    href: "/services/implants",
    icon: Syringe,
  },
  {
    title: "Restorative Dentistry",
    description: "Replace missing teeth with bridges or dentures.",
    href: "/services/restorative",
    icon: Crown,
  },
  {
    title: "Gum Treatment",
    description: "Maintain healthy gums before and after surgery.",
    href: "/services/periodontics",
    icon: Heart,
  },
];

const OralSurgery = () => {
  return (
    <Layout>
      <ServiceHero
        title="Oral Surgery"
        subtitle="Expert Surgical Care"
        description="Looking for a reliable oral surgeon in Abuja? Vista Dental Care's skilled team performs extractions and dental surgeries with precision and compassion, prioritizing your comfort and quick recovery — from simple extractions to wisdom tooth removal."
        image={clinicImage}
        icon={Scissors}
        iconColor="bg-red-600"
        badges={["Gentle Approach", "Quick Recovery", "Expert Team"]}
      />

      <TreatmentExplainer
        title="Understanding Oral Surgery"
        subtitle="What to Expect"
        content={[
          "Oral surgery encompasses various procedures from tooth extractions to more complex dental surgeries. Sometimes teeth need to be removed due to severe decay, damage, infection, or impaction (like wisdom teeth).",
          "At Vista Dental Care, we prioritize your comfort throughout any surgical procedure. We use effective anesthesia, modern techniques that minimize trauma, and provide comprehensive aftercare guidance for quick recovery.",
          "Our team handles both simple extractions (for visible teeth) and surgical extractions (for impacted, broken, or complex cases). We also perform pre-prosthetic surgery to prepare your mouth for dentures or implants.",
        ]}
        highlights={[
          { icon: AlertCircle, text: "Wisdom tooth removal" },
          { icon: Scissors, text: "Simple & surgical extractions" },
          { icon: Activity, text: "Pre-prosthetic surgery" },
          { icon: Shield, text: "Gentle, modern techniques" },
        ]}
        image={dentalTeamImage}
      />

      <BenefitsGrid
        title="Why Choose Our Surgical Care?"
        subtitle="Expert & Compassionate"
        benefits={benefits}
      />

      <ProcessTimeline
        title="Your Surgical Journey"
        subtitle="What Happens During Your Visit"
        steps={processSteps}
      />

      <WhoIsThisFor
        title="When is Oral Surgery Needed?"
        subtitle="Common Situations"
        description="Oral surgery may be recommended if you're experiencing any of these situations:"
        candidates={candidates}
        image={clinicImage}
      />

      <ServiceFAQ
        title="Oral Surgery FAQs"
        subtitle="Your Concerns Addressed"
        faqs={faqs}
      />

      <ServiceTestimonial
        quote="I was terrified of getting my wisdom teeth removed, but the team at Vista made it so much easier than I expected. The procedure was quick, and I recovered faster than I thought I would. Highly recommend!"
        author="Tunde B."
        role="Wisdom Tooth Extraction Patient"
        rating={5}
        service="Oral Surgery"
      />

      <RelatedServices
        currentService="Oral Surgery"
        services={relatedServices}
      />

      <ServiceCTA
        title="Need a Tooth Extraction in Abuja?"
        description="Don't suffer with painful teeth. Schedule a consultation at Vista Dental Care to discuss your options — we'll ensure your comfort and guide you through every step."
        primaryButtonText="Book Surgical Consultation"
      />
    </Layout>
  );
};

export default OralSurgery;
