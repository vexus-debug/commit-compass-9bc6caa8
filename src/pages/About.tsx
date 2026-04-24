import { Layout } from "@/components/layout";
import {
  AboutHeroSection,
  StoryTimelineSection,
  MissionVisionSection,
  ValuesSection,
  FacilitiesSection,
  TeamSection,
  TrustSection,
  AboutCTASection,
} from "@/components/about";

const About = () => {
  return (
    <Layout>
      <AboutHeroSection />
      <StoryTimelineSection />
      <MissionVisionSection />
      <ValuesSection />
      <FacilitiesSection />
      <TeamSection />
      <TrustSection />
      <AboutCTASection />
    </Layout>
  );
};

export default About;
