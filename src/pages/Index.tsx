import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustedCompanies from "@/components/TrustedCompanies";
import Features from "@/components/Features";
import RegulatoryUpdates from "@/components/RegulatoryUpdates";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

const Index = () => {
  useSmoothScroll();

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <Hero />
          <TrustedCompanies />
          <section id="features">
            <Features />
          </section>
          <section id="updates">
            <RegulatoryUpdates />
          </section>
          <section id="testimonials">
            <Testimonials />
          </section>
          <section id="contact">
            <Contact />
          </section>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Index;
