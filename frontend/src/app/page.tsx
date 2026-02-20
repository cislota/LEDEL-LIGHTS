import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import Advantages from '@/components/sections/Advantages';
import ProductsPreview from '@/components/sections/ProductsPreview';
import ContactForm from '@/components/sections/ContactForm';
import HeroTilda from '@/components/sections/HeroTilda';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroTilda />
        <Advantages />
        <ProductsPreview />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}