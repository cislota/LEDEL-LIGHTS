// src/components/sections/TargetAudience.tsx
import Image from 'next/image';

const cards = [
  {
    img: '/media/buisnes.jpg', 
    title: 'Владельцам бизнеса',
  },
  {
    img: '/media/opt.jpg',
    title: 'Специалистам по оптовым закупкам',
  },
  {
    img: '/media/org.jpg',
    title: 'Строительно-монтажным организациям',
  },
  {
    img: '/media/design.jpg',
    title: 'Дизайнерам и проектировщикам',
  },
];

export default function TargetAudience() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Заголовок */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2
            className="text-2xl md:text-3xl font-bold"
            style={{
              fontSize: '24px',
              fontFamily: '"TildaSans", Arial, sans-serif',
              color: '#000000',
              lineHeight: 1.4,
            }}
          >
            Более, чем за 10 лет разработали{' '}
            <span style={{ color: '#d5302c', fontWeight: 'bold' }}>
              выгодные условия
            </span>{' '}
            для разных заказчиков...
          </h2>
        </div>

        {/* Карточки */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {cards.map((card, i) => (
            <div key={i} className="text-center">
              <div className="relative inline-block mb-6">
                <Image
                  src={card.img}
                  alt={card.title}
                  width={200}
                  height={150}
                  className="rounded-xl object-cover shadow-md"
                  style={{ borderRadius: '16px' }}
                />
                {/* Optional: hover effect or cursor pointer */}
                <div className="absolute inset-0 rounded-xl bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-300" />
              </div>
              <h3
                className="font-semibold text-gray-800"
                style={{
                  fontSize: '16px',
                  fontFamily: '"TildaSans", Arial, sans-serif',
                  lineHeight: 1.5,
                }}
              >
                {card.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}