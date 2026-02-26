import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Advantages from '@/components/sections/Advantages';
import ProductsPreview from '@/components/sections/ProductsPreview';
import ContactForm from '@/components/sections/ContactForm';
import HeroTilda from '@/components/sections/HeroTilda';
import TargetAudience from '@/components/sections/TargetAudience';
import OfferCards from '@/components/sections/OfferCards';
import CatalogSection from '@/components/sections/CatalogSection';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroTilda />
        <Advantages />
        <TargetAudience />
        <OfferCards />
        <CatalogSection />
        <ProductsPreview />
        <ContactForm />
        
      </main>
      <Footer />
    </>
  );
}