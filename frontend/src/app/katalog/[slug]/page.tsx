// src/app/katalog/[slug]/page.tsx
export default async function ProductPage({ params }: { params: { slug: string } }) {
  const res = await fetch(`http://localhost:8000/api/products/${params.slug}`, {
    cache: 'no-store',
  });
  const product = await res.json();

  if (!product) {
    return <div>Товар не найден</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
      <img
        src={product.image_url}
        alt={product.title}
        className="max-w-lg rounded shadow"
        width={600}
        height={400}
      />
      <p className="mt-4 text-gray-700">{product.description}</p>
      <a href="/" className="inline-block mt-6 text-blue-600 hover:underline">
        ← Назад в каталог
      </a>
    </div>
  );
}