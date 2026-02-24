// src/components/sections/Advantages.tsx
import Image from 'next/image';

const advantages = [
  {
    icon: '/media/Group_12238.svg',
    lines: [
      // Строка 1: "Подбираем светильники под"
      {
        parts: [
          { text: 'Подбираем ', color: '#000000' },
          { text: 'светильники под', color: '#d5302c', bold: true },
        ],
      },
      // Строка 2: "любой бюджет и проект"
      {
        parts: [
          { text: 'любой бюджет и проект', color: '#000000' },
        ],
      },
    ],
  },
  {
    icon: '/media/Group_12239.svg',
    lines: [
      // Строка 1: "Отгружаем напрямую"
      {
        parts: [
          { text: 'Отгружаем ', color: '#000000' },
          { text: 'напрямую', color: '#d5302c', bold: true },
        ],
      },
      // Строка 2: "с завода производителя"
      {
        parts: [
          { text: 'с завода производителя', color: '#000000' },
        ],
      },
    ],
  },
  {
    icon: '/media/Group_12240.svg',
    lines: [
      // Строка 1: "Бесплатно оптимизируем"
      {
        parts: [
          { text: 'Бесплатно оптимизируем', color: '#000000' },
        ],
      },
      // Строка 2: "световое пространство —"
      {
        parts: [
          { text: 'световое пространство ', color: '#000000' },
          { text: '—', color: '#d5302c', bold: true },
        ],
      },
      // Строка 3: "экономия больше 70%"
      {
        parts: [
          { text: 'экономия больше 70%', color: '#d5302c', bold: true },
        ],
      },
    ],
  },
];

export default function Advantages() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {advantages.map((item, i) => (
            <div key={i} className="text-center">
              {/* Иконка */}
              <div 
                className="flex justify-center mb-6"
                style={{ margin: '0 85px 30px' }}
              >
                <Image
                  src={item.icon}
                  alt=""
                  width={140}
                  height={140}
                  className="max-w-[140px] h-auto"
                />
              </div>

              {item.lines.map((line, lineIdx) => (
                <div
                  key={lineIdx}
                  className="mb-1 last:mb-0"
                  style={{
                    fontSize: '20px',
                    fontFamily: '"TildaSans", Arial, sans-serif',
                    fontWeight: 'bold',
                    color: '#000000',
                    lineHeight: '1.3',
                    whiteSpace: 'normal',
                  }}
                >
                  {line.parts.map((part, idx) => (
                    <span
                      key={idx}
                      style={{
                        color: part.color,
                        fontWeight: part.bold ? 'bold' : 'normal',
                      }}
                    >
                      {part.text.replace(/ /g, '\u00A0')}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}