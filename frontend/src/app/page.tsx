// src/app/page.tsx
'use client'

import {useRef} from 'react';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Advantages from '@/components/sections/Advantages';
import ProductsPreview from '@/components/sections/ProductsPreview';
import ContactForm from '@/components/sections/ContactForm';
import HeroTilda from '@/components/sections/HeroTilda';
import TargetAudience from '@/components/sections/TargetAudience';
import OfferCards from '@/components/sections/OfferCards';
import CatalogSection from '@/components/sections/CatalogSection';
import ContactManagerSection from '@/components/sections/ContactManagerSection';
import ProjectSliderSection from '@/components/sections/ProjectSliderSection';
import ClientTestimonialsSection from '@/components/sections/ClientTestimonialsSection';
import FinalCTASection from '@/components/sections/FinalCTASection';
import QuizModal from '@/components/sections/QuizModal';
import AvailabilityModal from '@/components/sections/AvailabilityModal';  

export default function HomePage() {
  const catalogRef = useRef<HTMLElement>(null);
  const finalCTARef = useRef<HTMLElement>(null);

  return (
    <>
      <Header />
      <main>
        <HeroTilda />
        <Advantages />
        <TargetAudience />
        <OfferCards />
        <CatalogSection ref={catalogRef}/>
        <ContactManagerSection />
        <ProjectSliderSection />
        <ClientTestimonialsSection />
        <FinalCTASection ref={finalCTARef} />
        <QuizModal />
        <AvailabilityModal
          catalogRef={catalogRef}
          finalCTARef={finalCTARef}
        />

      </main>
      <Footer />
    </>
  );
}