// src/components/sections/Advantages.tsx
const advantages = [
  {
    icon: '/media/Group_9.svg', // замените на реальное имя файла из вашей папки
    title: 'Энергосбережение',
    desc: 'Потребление электроэнергии до 80% меньше',
  },
  {
    icon: '/media/question_riddle.svg',
    title: 'Гарантия 5 лет',
    desc: 'Надёжность подтверждена временем',
  },
  {
    icon: '/media/envelope_e-mail_mail.svg',
    title: 'Бесплатная доставка',
    desc: 'По Санкт-Петербургу при заказе от 10 000 ₽',
  },
  {
    icon: '/media/Vector.svg', // уточните имя файла
    title: 'Индивидуальный подход',
    desc: 'Подберём решение под ваш проект',
  },
];

export default function Advantages() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Наши преимущества</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {advantages.map((item, i) => (
            <div key={i} className="text-center">
              <div className="flex justify-center mb-4">
                <img
                  src={item.icon}
                  alt={item.title}
                  width={60}
                  height={60}
                  className="max-w-[60px]"
                />
              </div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}