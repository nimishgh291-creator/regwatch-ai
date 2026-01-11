import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustedCompanies from "@/components/TrustedCompanies";
import RegulatoryUpdates from "@/components/RegulatoryUpdates";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <TrustedCompanies />
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
  );
};

export default Index;
