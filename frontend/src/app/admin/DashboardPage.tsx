'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Order, QuizResult, ContactFormSubmission, SyncLog } from '@/types';

interface DashboardStats {
  ordersNew: number;
  ordersInProgress: number;
  quizUnprocessed: number;
  contactsUnprocessed: number;
  lastSync: SyncLog | null;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [recentQuiz, setRecentQuiz] = useState<QuizResult[]>([]);
  const [recentContacts, setRecentContacts] = useState<ContactFormSubmission[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [ordersRes, quizRes, contactsRes, syncRes] = await Promise.all([
        api.orders.list({ page: 1, page_size: 5, status: 'new' }),
        api.quiz.list({ page: 1, page_size: 5, is_processed: false }),
        api.contacts.list({ page: 1, page_size: 5, is_processed: false }),
        api.sync.status().catch(() => ({ data: { success: false, data: null } })),
      ]);

      const ordersNew = ordersRes.data.data?.items || [];
      const quizUnprocessed = quizRes.data.data?.items || [];
      const contactsUnprocessed = contactsRes.data.data?.items || [];

      // Получаем общее количество заказов в работе
      const ordersInProgressRes = await api.orders.list({ page: 1, page_size: 1, status: 'in_progress' });
      const ordersInProgressTotal = ordersInProgressRes.data.data?.total || 0;

      setStats({
        ordersNew: ordersRes.data.data?.total || 0,
        ordersInProgress: ordersInProgressTotal,
        quizUnprocessed: quizRes.data.data?.total || 0,
        contactsUnprocessed: contactsRes.data.data?.total || 0,
        lastSync: syncRes.data.data?.success ? syncRes.data.data.data : null,
      });

      setRecentOrders(ordersNew);
      setRecentQuiz(quizUnprocessed);
      setRecentContacts(contactsUnprocessed);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Новые заказы"
          value={stats?.ordersNew || 0}
          icon="🛒"
          color="blue"
        />
        <StatCard
          title="В работе"
          value={stats?.ordersInProgress || 0}
          icon="🔄"
          color="yellow"
        />
        <StatCard
          title="Заявки из квиза"
          value={stats?.quizUnprocessed || 0}
          icon="📝"
          color="purple"
        />
        <StatCard
          title="Заявки из форм"
          value={stats?.contactsUnprocessed || 0}
          icon="✉️"
          color="green"
        />
      </div>

      {/* Last Sync */}
      {stats?.lastSync && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Последняя синхронизация</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <div className="text-sm text-gray-500">Статус</div>
              <div className={`font-medium ${
                stats.lastSync.status === 'success' ? 'text-green-600' :
                stats.lastSync.status === 'partial' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {stats.lastSync.status === 'success' ? '✅ Успешно' :
                 stats.lastSync.status === 'partial' ? '⚠️ Частично' : '❌ Ошибка'}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Обработано</div>
              <div className="font-medium">{stats.lastSync.items_processed}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Создано</div>
              <div className="font-medium">{stats.lastSync.items_created}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Обновлено</div>
              <div className="font-medium">{stats.lastSync.items_updated}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Ошибки</div>
              <div className="font-medium text-red-600">{stats.lastSync.items_failed}</div>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            Завершена: {new Date(stats.lastSync.completed_at || stats.lastSync.started_at).toLocaleString('ru-RU')}
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Новые заказы</h2>
        {recentOrders.length === 0 ? (
          <p className="text-gray-500">Нет новых заказов</p>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{order.name}</div>
                  <div className="text-sm text-gray-500">{order.phone} • {new Date(order.created_at).toLocaleString('ru-RU')}</div>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  Новый
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Quiz & Contacts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Заявки из квиза</h2>
          {recentQuiz.length === 0 ? (
            <p className="text-gray-500">Нет необработанных заявок</p>
          ) : (
            <div className="space-y-3">
              {recentQuiz.map((result) => (
                <div key={result.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium">{result.name || 'Аноним'}</div>
                  <div className="text-sm text-gray-500">
                    {result.phone || result.email} • {new Date(result.created_at).toLocaleString('ru-RU')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Заявки из форм</h2>
          {recentContacts.length === 0 ? (
            <p className="text-gray-500">Нет необработанных заявок</p>
          ) : (
            <div className="space-y-3">
              {recentContacts.map((contact) => (
                <div key={contact.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium">{contact.name}</div>
                  <div className="text-sm text-gray-500">
                    {contact.phone || contact.email} • {new Date(contact.created_at).toLocaleString('ru-RU')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string; value: number; icon: string; color: string }) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
    green: 'bg-green-500',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-500">{title}</div>
          <div className="text-3xl font-bold text-gray-800 mt-1">{value}</div>
        </div>
        <div className={`w-12 h-12 ${colorClasses[color]} rounded-full flex items-center justify-center text-2xl`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
