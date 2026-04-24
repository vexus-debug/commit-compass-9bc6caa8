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
  Smile,
  Sparkles,
  Crown,
  Heart,
  Timer,
  CheckCircle,
  Shield,
  Ruler,
  Target,
  Calendar,
  Star,
  Zap,
} from "lucide-react";
import orthodonticsImage from "@/assets/orthodontics.jpg";
import dentalTechImage from "@/assets/dental-technology.jpg";

const processSteps = [
  {
    step: 1,
    title: "Orthodontic Evaluation",
    description: "We examine your teeth, take X-rays and impressions to create a detailed treatment plan.",
    icon: Ruler,
  },
  {
    step: 2,
    title: "Treatment Discussion",
    description: "We explain your options, timeline, and costs so you can make an informed decision.",
    icon: Target,
  },
  {
    step: 3,
    title: "Braces Fitting",
    description: "Your braces are carefully placed. We'll teach you how to care for them properly.",
    icon: Smile,
  },
  {
    step: 4,
    title: "Regular Adjustments",
    description: "Monthly visits ensure your teeth are moving correctly toward their final positions.",
    icon: Calendar,
  },
];

const benefits = [
  {
    icon: Smile,
    title: "Perfectly Aligned Smile",
    description: "Achieve beautifully straight teeth that enhance your appearance and give you a confident, radiant smile.",
  },
  {
    icon: Shield,
    title: "Improved Oral Health",
    description: "Straight teeth are easier to clean and floss, reducing your risk of cavities, gum disease, and tooth decay.",
  },
  {
    icon: Zap,
    title: "Better Bite Function",
    description: "Correcting bite issues prevents uneven wear, jaw pain, and TMJ problems while improving chewing efficiency.",
  },
  {
    icon: Timer,
    title: "Long-Term Results",
    description: "With proper retainer use after treatment, your straight smile will last a lifetime. It's a permanent solution.",
  },
  {
    icon: Heart,
    title: "Boosted Confidence",
    description: "Many patients experience improved self-esteem and confidence after orthodontic treatment. Smile freely!",
  },
  {
    icon: CheckCircle,
    title: "Various Options Available",
    description: "Choose from traditional metal braces, ceramic braces, or other options to suit your lifestyle and preferences.",
  },
];

const faqs = [
  {
    question: "How long does orthodontic treatment take?",
    answer: "Treatment duration varies based on the complexity of your case. Simple cases may take 12-18 months, while more complex cases can take 2-3 years. During your consultation, we'll give you a more accurate timeline based on your specific needs.",
  },
  {
    question: "Do braces hurt?",
    answer: "You may experience some discomfort when braces are first placed and after adjustments, but it's typically mild and temporary. Over-the-counter pain relievers and soft foods can help. Most patients adjust within a few days and find treatment very manageable.",
  },
  {
    question: "Am I too old for braces?",
    answer: "Absolutely not! While orthodontic treatment is common in teenagers, more and more adults are getting braces. Age is not a barrier to achieving a straighter smile. We have many adult patients who are thrilled with their results.",
  },
  {
    question: "What foods should I avoid with braces?",
    answer: "You should avoid hard, sticky, and chewy foods that can damage braces. This includes popcorn, nuts, hard candies, caramel, and chewing gum. We'll provide a complete list and helpful tips for eating comfortably with braces.",
  },
  {
    question: "What happens after braces are removed?",
    answer: "After braces are removed, you'll wear a retainer to keep your teeth in their new positions. Initially, you may need to wear it all the time, then transition to nighttime only. Retainer use is crucial for maintaining your beautiful results.",
  },
  {
    question: "What's the difference between metal and ceramic braces?",
    answer: "Metal braces are durable, effective, and the most affordable option. Ceramic braces work the same way but use tooth-colored or clear brackets, making them less noticeable. Ceramic braces may cost more and require more careful maintenance.",
  },
];

const candidates = [
  "Children and teens with crooked or crowded teeth",
  "Adults who want to straighten their smile",
  "People with overbite, underbite, or crossbite",
  "Those with spacing issues or gaps between teeth",
  "Individuals with bite problems causing jaw pain",
  "Anyone who didn't complete orthodontics earlier in life",
];

const relatedServices = [
  {
    title: "Cosmetic Dentistry",
    description: "Complete your smile with whitening and veneers.",
    href: "/services/cosmetic",
    icon: Sparkles,
  },
  {
    title: "General Dentistry",
    description: "Maintain your new smile with preventive care.",
    href: "/services/general-preventive",
    icon: Shield,
  },
  {
    title: "Restorative Dentistry",
    description: "Repair damaged teeth alongside orthodontics.",
    href: "/services/restorative",
    icon: Crown,
  },
];

const Orthodontics = () => {
  return (
    <Layout>
      <ServiceHero
        title="Orthodontics"
        subtitle="Straighten Your Smile"
        description="Looking for orthodontic treatment in Abuja? Vista Dental Care corrects crooked teeth, bite issues, and spacing problems for both children and adults. With modern braces options and experienced care, your journey to a straighter smile starts here."
        image={orthodonticsImage}
        icon={Smile}
        iconColor="bg-purple-600"
        badges={["All Ages Welcome", "Multiple Options", "Payment Plans Available"]}
      />

      <TreatmentExplainer
        title="How Orthodontics Works"
        subtitle="The Science of Straight Teeth"
        content={[
          "Orthodontic treatment uses gentle, constant pressure to gradually move teeth into their correct positions. Braces apply this pressure through brackets attached to teeth and connected by wires.",
          "At Vista Dental Care in Abuja, we offer traditional metal braces and ceramic braces. Each option works effectively to straighten teeth, correct bite issues, and create a harmonious smile.",
          "Treatment is highly customized to your needs. We use detailed planning and regular adjustments to ensure your teeth move safely and efficiently toward their ideal positions.",
        ]}
        highlights={[
          { icon: Star, text: "Traditional metal braces" },
          { icon: Sparkles, text: "Ceramic (clear) braces" },
          { icon: Timer, text: "Custom treatment timelines" },
          { icon: CheckCircle, text: "Retainers for lasting results" },
        ]}
        image={dentalTechImage}
      />

      <BenefitsGrid
        title="Benefits of Orthodontic Treatment"
        subtitle="More Than Just Straight Teeth"
        benefits={benefits}
      />

      <ProcessTimeline
        title="Your Orthodontic Journey"
        subtitle="What to Expect"
        steps={processSteps}
      />

      <WhoIsThisFor
        title="Is Orthodontic Treatment Right for You?"
        subtitle="Who Can Benefit"
        description="Orthodontic treatment can help people of all ages achieve straighter, healthier smiles. You might be a good candidate if:"
        candidates={candidates}
        image={orthodonticsImage}
      />

      <ServiceFAQ
        title="Orthodontics FAQs"
        subtitle="Common Questions"
        faqs={faqs}
      />

      <ServiceTestimonial
        quote="I never thought I'd get braces at 32, but Vista Dental made it so easy. The ceramic braces were barely noticeable, and now my smile is perfectly straight. Worth every month of treatment!"
        author="David A."
        role="Adult Orthodontic Patient"
        rating={5}
        service="Orthodontics"
      />

      <RelatedServices
        currentService="Orthodontics"
        services={relatedServices}
      />

      <ServiceCTA
        title="Ready for a Straighter Smile in Abuja?"
        description="Schedule your orthodontic consultation at Vista Dental Care. We'll assess your needs and explain all your options for achieving the smile you deserve."
        primaryButtonText="Book Consultation"
      />
    </Layout>
  );
};

export default Orthodontics;
