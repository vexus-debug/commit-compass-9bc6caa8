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
  Stethoscope,
  Sparkles,
  Smile,
  Crown,
  Syringe,
  Scissors,
  Heart,
  Search,
  ShieldCheck,
  Brush,
  Droplets,
  FileCheck,
  CheckCircle,
  Clock,
  ThumbsUp,
  Leaf,
} from "lucide-react";
import clinicImage from "@/assets/clinic-interior.jpg";
import dentalTeamImage from "@/assets/dental-team.jpg";

const processSteps = [
  {
    step: 1,
    title: "Book Appointment",
    description: "Schedule your visit online or call us. We offer flexible timing to suit your schedule.",
    icon: Clock,
  },
  {
    step: 2,
    title: "Comprehensive Exam",
    description: "Our dentist will thoroughly examine your teeth, gums, and oral health.",
    icon: Search,
  },
  {
    step: 3,
    title: "Treatment Plan",
    description: "We'll discuss findings and create a personalized treatment plan for you.",
    icon: FileCheck,
  },
  {
    step: 4,
    title: "Ongoing Care",
    description: "Regular check-ups ensure your oral health stays in top condition.",
    icon: ThumbsUp,
  },
];

const benefits = [
  {
    icon: ShieldCheck,
    title: "Early Problem Detection",
    description: "Regular check-ups help identify cavities, gum disease, and other issues before they become serious and costly to treat.",
  },
  {
    icon: Sparkles,
    title: "Professional Cleaning",
    description: "Remove plaque and tartar buildup that regular brushing can't handle, keeping your teeth sparkling clean.",
  },
  {
    icon: Brush,
    title: "Fresher Breath",
    description: "Professional cleaning and proper oral hygiene guidance help eliminate bad breath and boost your confidence.",
  },
  {
    icon: Droplets,
    title: "Fluoride Protection",
    description: "Strengthen your tooth enamel with professional fluoride treatments that help prevent cavities.",
  },
  {
    icon: Heart,
    title: "Overall Health Connection",
    description: "Oral health is linked to heart disease, diabetes, and other conditions. Prevention protects your whole body.",
  },
  {
    icon: Leaf,
    title: "Cost-Effective Care",
    description: "Preventive care is more affordable than treating problems. Regular visits save money in the long run.",
  },
];

const faqs = [
  {
    question: "How often should I visit the dentist for check-ups?",
    answer: "We recommend visiting every 6 months for routine check-ups and professional cleaning. However, some patients may need more frequent visits based on their oral health needs. During your visit, we'll advise on the best schedule for you.",
  },
  {
    question: "Does teeth scaling and polishing hurt?",
    answer: "Scaling and polishing is generally painless. You may experience some mild sensitivity during the procedure, especially if you have sensitive teeth or gum issues. We use gentle techniques and can apply numbing gel if needed to ensure your comfort.",
  },
  {
    question: "What is fluoride treatment and who needs it?",
    answer: "Fluoride treatment strengthens tooth enamel and helps prevent cavities. It's beneficial for everyone, especially children, those with a history of cavities, patients with dry mouth, or those with braces. The treatment is quick, painless, and highly effective.",
  },
  {
    question: "What are dental sealants?",
    answer: "Dental sealants are thin protective coatings applied to the chewing surfaces of back teeth (molars). They fill in the grooves where food and bacteria can get trapped, providing excellent cavity protection. They're especially recommended for children but can benefit adults too.",
  },
  {
    question: "Is preventive care covered by insurance?",
    answer: "Most dental insurance plans cover preventive care including check-ups, cleanings, X-rays, and fluoride treatments. We recommend checking with your insurance provider for specific coverage details. We also offer affordable payment options for uninsured patients.",
  },
  {
    question: "What happens during a routine dental check-up?",
    answer: "During a check-up, we examine your teeth, gums, tongue, and mouth for any issues. We may take X-rays to see below the surface. We'll check for cavities, gum disease, oral cancer, and other concerns. The visit also includes professional cleaning and personalized oral hygiene advice.",
  },
];

const candidates = [
  "Anyone who wants to maintain good oral health",
  "People who haven't visited a dentist in over 6 months",
  "Those experiencing tooth sensitivity or gum bleeding",
  "Individuals who want whiter, cleaner teeth",
  "Parents looking for family dental care",
  "Anyone concerned about bad breath",
];

const relatedServices = [
  {
    title: "Cosmetic Dentistry",
    description: "Enhance your smile with teeth whitening and veneers.",
    href: "/services/cosmetic",
    icon: Sparkles,
  },
  {
    title: "Gum Treatment",
    description: "Treatment for gum disease and periodontal issues.",
    href: "/services/periodontics",
    icon: Heart,
  },
  {
    title: "Restorative Dentistry",
    description: "Restore damaged teeth with crowns and bridges.",
    href: "/services/restorative",
    icon: Crown,
  },
];

const GeneralPreventive = () => {
  return (
    <Layout>
      <ServiceHero
        title="General & Preventive Dentistry"
        subtitle="Foundation of Oral Health"
        description="Looking for a trusted dental clinic in Abuja for routine check-ups? Vista Dental Care's comprehensive preventive care helps you maintain optimal oral health, catch problems early, and avoid costly treatments. Regular check-ups are your best investment."
        image={clinicImage}
        icon={Stethoscope}
        iconColor="bg-blue-600"
        badges={["Family-Friendly", "Comprehensive Care", "Modern Technology"]}
      />

      <TreatmentExplainer
        title="What is Preventive Dentistry?"
        subtitle="Understanding the Basics"
        content={[
          "Preventive dentistry focuses on maintaining good oral health and preventing dental problems before they develop. It combines regular professional care with good oral hygiene habits at home.",
          "At Vista Dental Care, we believe prevention is the cornerstone of dental health. Our preventive services include thorough examinations, professional cleanings, fluoride treatments, dental sealants, and personalized oral health education.",
          "By catching issues early – like small cavities or early gum disease – we can treat them quickly and easily, saving you time, discomfort, and money. Prevention truly is the best medicine when it comes to your teeth.",
        ]}
        highlights={[
          { icon: CheckCircle, text: "Regular check-ups every 6 months" },
          { icon: Brush, text: "Professional scaling & polishing" },
          { icon: Droplets, text: "Fluoride treatments available" },
          { icon: ShieldCheck, text: "Dental sealants for protection" },
        ]}
        image={dentalTeamImage}
      />

      <BenefitsGrid
        title="Benefits of Preventive Care"
        subtitle="Why It Matters"
        benefits={benefits}
      />

      <ProcessTimeline
        title="Your Preventive Care Journey"
        subtitle="Simple 4-Step Process"
        steps={processSteps}
      />

      <WhoIsThisFor
        title="Is Preventive Dentistry Right for You?"
        subtitle="Everyone Benefits"
        description="Preventive dentistry is for everyone – from children getting their first teeth to seniors maintaining their oral health. If you fit any of these descriptions, you'll benefit from our preventive care:"
        candidates={candidates}
        image={clinicImage}
      />

      <ServiceFAQ
        title="Common Questions About Preventive Care"
        subtitle="FAQs"
        faqs={faqs}
      />

      <ServiceTestimonial
        quote="I used to dread dental visits, but Vista Dental changed that. The team is so gentle and thorough. My teeth have never felt cleaner, and I actually look forward to my check-ups now!"
        author="Amina O."
        role="Regular Patient for 3 Years"
        rating={5}
        service="General & Preventive Dentistry"
      />

      <RelatedServices
        currentService="General & Preventive Dentistry"
        services={relatedServices}
      />

      <ServiceCTA
        title="Ready to Prioritize Your Oral Health in Abuja?"
        description="Schedule your comprehensive dental check-up at Vista Dental Care. Early prevention is the best protection for your smile — start your treatment today."
        primaryButtonText="Book Check-up"
      />
    </Layout>
  );
};

export default GeneralPreventive;
