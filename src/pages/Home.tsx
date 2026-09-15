import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import NumberTypes from "../components/NumberTypes";
import UseCases from "../components/UseCases";
import Coverage from "../components/Coverage";
import CoreFeatures from "../components/CoreFeatures";
import Pricing from "../components/Pricing";
import Stats from "../components/Stats";
import Faq from "../components/Faq";
import Cta from "../components/Cta";
import Footer from "../components/Footer";
import { useReveal } from "../hooks/useReveal";

export default function Home() {
  useReveal();

  return (
    <>
      <Hero />
      <HowItWorks />
      <NumberTypes />
      <UseCases />
      <Faq />
      <Coverage />
      <CoreFeatures />
      <Pricing />
      <Stats />
      <Cta />
      <Footer />
    </>
  );
}
