// src/components/layout/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4 text-center">
        <div className="mb-4">
          <div className="text-xl font-bold">LEDL Lights</div>
          <p className="text-gray-400 mt-2">Светодиодное освещение с 2015 года</p>
        </div>
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} Все права защищены.
        </p>
      </div>
    </footer>
  );
}