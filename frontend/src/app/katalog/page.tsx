import { ProductCard } from '@/components/ui/ProductCard';

type Product = {
  id: number;
  slug: string;
  title: string;
  image_url: string;
};

export default async function CatalogPage() {
  const res = await fetch('http://localhost:8000/api/products', { cache: 'no-store' });
  const products: Product[] = await res.json();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Каталог товаров</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}