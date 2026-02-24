// src/components/sections/TargetAudience.tsx
import Image from 'next/image';

const cards = [
  {
    img: '/media/business.jpg',
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
            style={{
              fontSize: '24px',
              fontFamily: '"TildaSans", Arial, sans-serif',
              color: '#000000',
              lineHeight: 1.4,
              fontWeight: 'normal', // 
              margin: 0,
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
              {/* Контейнер с изображением: 259×173 px, белый фон */}
              <div
                className="relative mx-auto mb-6"
                style={{
                  width: '259px',
                  height: '173px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  overflow: 'hidden',
                }}
              >
                <Image
                  src={card.img}
                  alt={card.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 259px"
                  className="object-cover"
                  priority={i === 0}
                />
              </div>

              {/* Подпись под картинкой */}
              <h3
                style={{
                  fontSize: '18px',
                  fontFamily: '"TildaSans", Arial, sans-serif',
                  lineHeight: '1.4',
                  color: '#000000',
                  margin: '0',
                  fontWeight: 'normal',
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