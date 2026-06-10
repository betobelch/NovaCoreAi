import { HeroSection } from "@/components/hero-section"
import { ProblemsSection } from "@/components/problems-section"
import { ServicesSection } from "@/components/services-section"
import { ProcessSection } from "@/components/process-section"
import { BenefitsSection } from "@/components/benefits-section"
import { ProofSection } from "@/components/proof-section"
import { AboutSection } from "@/components/about-section"
import { ContactSection } from "@/components/contact-section"
import { FinalCtaSection } from "@/components/final-cta-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <ProblemsSection />
      <ServicesSection />
      <ProcessSection />
      <BenefitsSection />
      <ProofSection />
      <AboutSection />
      <ContactSection />
      <FinalCtaSection />
      <Footer />
    </main>
  )
}
