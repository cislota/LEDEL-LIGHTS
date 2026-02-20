// src/components/ui/ProductCard.tsx
import Link from 'next/link';

export function ProductCard({ product }: { product: any }) {
  return (
    <div className="border rounded-lg overflow-hidden shadow hover:shadow-md transition">
      <img
        src={product.image_url}
        alt={product.title}
        className="w-full h-48 object-cover"
        width={400}
        height={200}
      />
      <div className="p-4">
        <h3 className="font-semibold">{product.title}</h3>
        <Link
          href={`/katalog/${product.slug}`}
          className="text-blue-600 text-sm mt-2 inline-block hover:underline"
        >
          Подробнее →
        </Link>
      </div>
    </div>
  );
}