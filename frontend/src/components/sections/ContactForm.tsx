// src/components/sections/ContactForm.tsx
'use client';

import { useState } from 'react';
import { submitContactForm } from '@/utils/api';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrorMessage('Введите ваше имя');
      return;
    }

    if (!phone.trim()) {
      setErrorMessage('Введите номер телефона');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await submitContactForm({
        name: name.trim(),
        phone: phone.trim(),
        message: message.trim() || undefined,
        subject: 'Заявка с сайта',
        form_type: 'contact_form',
      });

      setSubmitStatus('success');
      setName('');
      setPhone('');
      setMessage('');

      setTimeout(() => setSubmitStatus('idle'), 3000);
    } catch (error) {
      console.error('Ошибка отправки формы:', error);
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Ошибка отправки');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-2xl">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8" style={{ fontFamily: '"TildaSans", Arial, sans-serif' }}>
          Оставить заявку
        </h2>

        {submitStatus === 'success' && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-center" style={{ fontFamily: '"TildaSans", Arial, sans-serif' }}>
            ✅ Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-center" style={{ fontFamily: '"TildaSans", Arial, sans-serif' }}>
            ❌ {errorMessage || 'Произошла ошибка при отправке. Попробуйте снова.'}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-1 text-gray-700" style={{ fontFamily: '"TildaSans", Arial, sans-serif' }}>
              Имя
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#d5302c] focus:outline-none"
              placeholder="Ваше имя"
              required
              style={{ fontFamily: '"TildaSans", Arial, sans-serif' }}
            />
          </div>

          <div>
            <label htmlFor="phone" className="block mb-1 text-gray-700" style={{ fontFamily: '"TildaSans", Arial, sans-serif' }}>
              Телефон
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#d5302c] focus:outline-none"
              placeholder="+7 (___) ___-__-__"
              required
              style={{ fontFamily: '"TildaSans", Arial, sans-serif' }}
            />
          </div>

          <div>
            <label htmlFor="message" className="block mb-1 text-gray-700" style={{ fontFamily: '"TildaSans", Arial, sans-serif' }}>
              Сообщение
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#d5302c] focus:outline-none resize-none"
              placeholder="Расскажите, что вас интересует"
              style={{ fontFamily: '"TildaSans", Arial, sans-serif' }}
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#d5302c] text-white py-3 rounded hover:bg-[#b52824] transition disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              fontFamily: '"TildaSans", Arial, sans-serif',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
          </button>
        </form>
      </div>
    </section>
  );
}
