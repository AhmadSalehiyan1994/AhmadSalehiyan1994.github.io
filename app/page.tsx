import { AboutSection } from "@/components/about-section";
import { ContactCta } from "@/components/contact-cta";
import { ContactOptions } from "@/components/contact-options";
import { CredentialsSection } from "@/components/credentials-section";
import { ExperienceSection } from "@/components/experience-section";
import { HeroSection } from "@/components/hero-section";
import { SelectedWork } from "@/components/selected-work";
import { SkillsSection } from "@/components/skills-section";
import { TrustStrip } from "@/components/trust-strip";
import { BlogSection } from "@/components/blog-section";
import { GrowthSections } from "@/components/growth-sections";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SelectedWork />
      <TrustStrip />
      <GrowthSections />
      <AboutSection />
      <ExperienceSection />
      <SkillsSection />
      <CredentialsSection />
      <BlogSection />
      <ContactOptions />
      <ContactCta />
    </>
  );
}
