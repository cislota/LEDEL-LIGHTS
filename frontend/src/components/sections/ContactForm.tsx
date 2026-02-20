// src/components/sections/ContactForm.tsx
export default function ContactForm() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-2xl">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Оставить заявку</h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-1 text-gray-700">Имя</label>
            <input
              type="text"
              id="name"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Ваше имя"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block mb-1 text-gray-700">Телефон</label>
            <input
              type="tel"
              id="phone"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="+7 (___) ___-__-__"
            />
          </div>
          <div>
            <label htmlFor="message" className="block mb-1 text-gray-700">Сообщение</label>
            <textarea
              id="message"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Расскажите, что вас интересует"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
          >
            Отправить заявку
          </button>
        </form>
      </div>
    </section>
  );
}