import { Layout } from "@/components/layout";
import {
  HeroSection,
  AboutPreviewSection,
  WhyChooseUsSection,
  ServicesSection,
  TreatmentProcessSection,
  TestimonialsSection,
  FAQSection,
  LocationSection,
  CTASection,
} from "@/components/home";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <AboutPreviewSection />
      <ServicesSection />
      <WhyChooseUsSection />
      <TreatmentProcessSection />
      <TestimonialsSection />
      <FAQSection />
      <LocationSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
