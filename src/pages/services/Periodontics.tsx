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
  Heart,
  Stethoscope,
  Sparkles,
  Crown,
  Shield,
  Timer,
  CheckCircle,
  Activity,
  Zap,
  Droplets,
  AlertTriangle,
  HeartPulse,
} from "lucide-react";
import dentistPatientImage from "@/assets/dentist-patient.jpg";
import clinicImage from "@/assets/clinic-interior.jpg";

const processSteps = [
  {
    step: 1,
    title: "Thorough Examination",
    description: "We assess your gums, take X-rays if needed, and identify the extent of any disease or infection.",
    icon: Activity,
  },
  {
    step: 2,
    title: "Diagnosis & Planning",
    description: "We explain your condition and discuss treatment options tailored to your needs.",
    icon: AlertTriangle,
  },
  {
    step: 3,
    title: "Treatment Procedure",
    description: "Depending on your condition, this may include deep cleaning, root canal, or other interventions.",
    icon: Heart,
  },
  {
    step: 4,
    title: "Healing & Maintenance",
    description: "Follow-up care ensures proper healing and prevents recurrence of problems.",
    icon: HeartPulse,
  },
];

const benefits = [
  {
    icon: Shield,
    title: "Save Your Natural Teeth",
    description: "Root canal treatment can save severely infected teeth that would otherwise need extraction. Keep your natural smile intact.",
  },
  {
    icon: HeartPulse,
    title: "Stop Disease Progression",
    description: "Treating gum disease early prevents it from advancing to periodontitis, which can cause tooth loss and bone damage.",
  },
  {
    icon: Zap,
    title: "Eliminate Pain & Infection",
    description: "Both treatments address the source of pain and infection, providing lasting relief and preventing serious complications.",
  },
  {
    icon: Droplets,
    title: "Healthier Gums",
    description: "Periodontal treatment restores gum health, eliminating bleeding, swelling, and recession for a healthier mouth.",
  },
  {
    icon: Timer,
    title: "Protect Overall Health",
    description: "Gum disease is linked to heart disease, diabetes, and other conditions. Treating it protects your whole-body health.",
  },
  {
    icon: CheckCircle,
    title: "Prevent Tooth Loss",
    description: "Untreated gum disease is the leading cause of adult tooth loss. Timely treatment preserves your teeth for life.",
  },
];

const faqs = [
  {
    question: "What are the signs of gum disease?",
    answer: "Warning signs include red, swollen, or tender gums; bleeding when brushing or flossing; receding gums; persistent bad breath; loose teeth; and changes in your bite. If you notice any of these, schedule an appointment for evaluation.",
  },
  {
    question: "Is root canal treatment painful?",
    answer: "Modern root canal treatment is no more uncomfortable than getting a filling. We use effective local anesthesia to numb the area completely. Most patients are surprised at how painless the procedure is—and it relieves the pain from the infected tooth!",
  },
  {
    question: "How do I know if I need a root canal?",
    answer: "Signs include severe toothache, prolonged sensitivity to hot or cold, darkening of the tooth, swelling or tenderness in nearby gums, and a persistent pimple on the gums. Only a dental examination can confirm if you need a root canal.",
  },
  {
    question: "Can gum disease be cured?",
    answer: "Early-stage gum disease (gingivitis) is reversible with professional cleaning and improved oral hygiene. Advanced gum disease (periodontitis) can be managed and controlled but requires ongoing maintenance. The key is early treatment.",
  },
  {
    question: "What happens during a deep cleaning?",
    answer: "Deep cleaning (scaling and root planing) removes plaque and tartar from below the gum line and smooths the tooth roots to help gums reattach. It's done under local anesthesia and may require two visits. It's the primary treatment for gum disease.",
  },
  {
    question: "How can I prevent gum disease?",
    answer: "Brush twice daily with fluoride toothpaste, floss daily, use antiseptic mouthwash, visit the dentist regularly, don't smoke, eat a balanced diet, and manage conditions like diabetes that affect gum health.",
  },
];

const candidates = [
  "Those with bleeding or swollen gums",
  "People with persistent bad breath",
  "Patients with loose or shifting teeth",
  "Those experiencing severe tooth pain",
  "People with deep tooth decay or infection",
  "Anyone with prolonged sensitivity to hot/cold",
];

const relatedServices = [
  {
    title: "General Dentistry",
    description: "Preventive care to maintain healthy gums.",
    href: "/services/general-preventive",
    icon: Stethoscope,
  },
  {
    title: "Restorative Dentistry",
    description: "Crowns to protect root canal-treated teeth.",
    href: "/services/restorative",
    icon: Crown,
  },
  {
    title: "Cosmetic Dentistry",
    description: "Enhance your smile after treatment.",
    href: "/services/cosmetic",
    icon: Sparkles,
  },
];

const Periodontics = () => {
  return (
    <Layout>
      <ServiceHero
        title="Gum Treatment & Root Canal"
        subtitle="Saving Teeth & Restoring Health"
        description="Looking for gum treatment or root canal therapy in Abuja? Vista Dental Care's specialized treatments address problems at their source — eliminating infection, restoring gum health, and saving teeth that might otherwise be lost."
        image={dentistPatientImage}
        icon={Heart}
        iconColor="bg-green-600"
        badges={["Pain Relief", "Save Natural Teeth", "Advanced Care"]}
      />

      <TreatmentExplainer
        title="Protecting Your Gums & Teeth"
        subtitle="Understanding These Treatments"
        content={[
          "Gum disease (periodontal disease) is an infection of the tissues that hold your teeth in place. It starts with plaque buildup and can progress from gingivitis (mild) to periodontitis (severe), potentially causing tooth loss if untreated.",
          "Root canal treatment (endodontics) saves teeth that are badly decayed or infected. The procedure removes infected pulp from inside the tooth, cleans and disinfects the canal, then seals it to prevent further infection.",
          "Both treatments share a common goal: preserving your natural teeth and oral health. Our gentle, modern approach ensures these procedures are comfortable and effective, giving you lasting relief and protection.",
        ]}
        highlights={[
          { icon: Droplets, text: "Deep cleaning for gum disease" },
          { icon: Heart, text: "Periodontal disease management" },
          { icon: Zap, text: "Pain-free root canal treatment" },
          { icon: Shield, text: "Infection elimination" },
        ]}
        image={clinicImage}
      />

      <BenefitsGrid
        title="Benefits of Gum & Root Canal Treatment"
        subtitle="Why Treatment Matters"
        benefits={benefits}
      />

      <ProcessTimeline
        title="Your Treatment Journey"
        subtitle="What to Expect"
        steps={processSteps}
      />

      <WhoIsThisFor
        title="Do You Need Gum or Root Canal Treatment?"
        subtitle="Warning Signs"
        description="These treatments may be necessary if you're experiencing any of the following symptoms:"
        candidates={candidates}
        image={dentistPatientImage}
      />

      <ServiceFAQ
        title="Gum Treatment & Root Canal FAQs"
        subtitle="Your Questions Answered"
        faqs={faqs}
      />

      <ServiceTestimonial
        quote="I thought I was going to lose my tooth, but the root canal saved it. The procedure was nothing like the horror stories I'd heard—it was actually comfortable! My tooth is healthy and strong now."
        author="Fatima A."
        role="Root Canal Patient"
        rating={5}
        service="Gum Treatment & Root Canal"
      />

      <RelatedServices
        currentService="Gum Treatment & Root Canal"
        services={relatedServices}
      />

      <ServiceCTA
        title="Concerned About Gum Disease or Tooth Pain in Abuja?"
        description="Don't wait for problems to worsen. Schedule an evaluation at Vista Dental Care and let us help you find relief and protect your natural teeth."
        primaryButtonText="Book Evaluation"
      />
    </Layout>
  );
};

export default Periodontics;
