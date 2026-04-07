'use client';

import { useEffect, useState, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import { api, isAuthenticated, restoreAuthToken } from '@/lib/api';
import { useRouter } from 'next/navigation';

// Типы
interface OrderItem {
  id: number;
  order_id: number;
  product_id?: number;
  product_name: string;
  product_uid?: string;
  quantity: number;
  price: number;
  subtotal?: number;
  comment?: string;
}

interface Order {
  id: number;
  order_number?: string;
  name: string;
  phone: string;
  email?: string;
  comment?: string;
  company_name?: string;
  inn?: string;
  status: 'processing' | 'confirmed' | 'cancelled' | 'completed' | 'shipped';
  source?: string;
  total_amount?: number;
  currency: string;
  delivery_address?: string;
  manager_comment?: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

const STATUS_LABELS: Record<string, string> = {
  processing: 'В обработке',
  confirmed: 'Подтверждён',
  cancelled: 'Отменён',
  completed: 'Выполнен',
  shipped: 'Отправлен',
};

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<{ by_status: Record<string, number>; total: number } | null>(null);
  const [updating, setUpdating] = useState(false);
  const pageSize = 20;

  // Проверка авторизации при монтировании
  useEffect(() => {
    const auth = restoreAuthToken();
    if (!auth || !isAuthenticated()) {
      router.push('/admin/login');
    }
  }, [router]);

  // Загрузка заказов
  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = { page, page_size: pageSize };
      if (filterStatus !== 'all') {
        params.status = filterStatus;
      }
      const res = await api.orders.list(params);
      const data = res.data.data;
      setOrders(data.items || []);
      setTotal(data.total || 0);
    } catch (error: any) {
      if (error.response?.status === 401) {
        router.push('/admin/login');
      } else {
        console.error('Failed to load orders:', error);
      }
    } finally {
      setLoading(false);
    }
  }, [page, filterStatus, router]);

  // Загрузка статистики
  const loadStats = useCallback(async () => {
    try {
      const res = await api.orders.getStats();
      if (res.data.data) {
        setStats(res.data.data);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  }, []);

  useEffect(() => {
    loadOrders();
    loadStats();
  }, [page, filterStatus]);

  // Обновление статуса заказа
  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    if (!confirm(`Изменить статус заказа #${orderId} на "${STATUS_LABELS[newStatus] || newStatus}"?`)) {
      return;
    }

    setUpdating(true);
    try {
      await api.orders.updateStatus(orderId, { status: newStatus });
      await loadOrders();
      await loadStats();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus as Order['status'] });
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        router.push('/admin/login');
      } else {
        alert('Ошибка при обновлении статуса: ' + (error.response?.data?.detail || error.message));
      }
    } finally {
      setUpdating(false);
    }
  };

  // Быстрые действия
  const handleCancel = async (orderId: number) => {
    if (!confirm('Отменить этот заказ?')) return;
    setUpdating(true);
    try {
      await api.orders.cancel(orderId);
      await loadOrders();
      await loadStats();
    } catch (error: any) {
      alert('Ошибка: ' + (error.response?.data?.detail || error.message));
    } finally {
      setUpdating(false);
    }
  };

  const handleComplete = async (orderId: number) => {
    if (!confirm('Завершить этот заказ?')) return;
    setUpdating(true);
    try {
      await api.orders.complete(orderId);
      await loadOrders();
      await loadStats();
    } catch (error: any) {
      alert('Ошибка: ' + (error.response?.data?.detail || error.message));
    } finally {
      setUpdating(false);
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  const columns = [
    { key: 'id', label: 'ID' },
    {
      key: 'order_number',
      label: '№ заказа',
      render: (order: Order) => order.order_number || `#${order.id}`
    },
    {
      key: 'name',
      label: 'Клиент',
      render: (order: Order) => (
        <div>
          <div className="font-medium">{order.name}</div>
          <div className="text-sm text-gray-500">{order.phone}</div>
          {order.email && <div className="text-xs text-gray-400">{order.email}</div>}
        </div>
      )
    },
    {
      key: 'total_amount',
      label: 'Сумма',
      render: (order: Order) => order.total_amount
        ? `${order.total_amount.toLocaleString('ru-RU')} ₽`
        : '—'
    },
    {
      key: 'status',
      label: 'Статус',
      render: (order: Order) => (
        <select
          value={order.status}
          onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
          disabled={updating}
          className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
          onClick={(e) => e.stopPropagation()}
        >
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      )
    },
    {
      key: 'source',
      label: 'Источник',
      render: (order: Order) => {
        const sources: Record<string, string> = {
          website: 'Сайт',
          quiz: 'Квиз',
          contact_form: 'Форма',
          product_request: 'Товар',
        };
        return sources[order.source || ''] || order.source || '—';
      }
    },
    {
      key: 'created_at',
      label: 'Дата',
      render: (order: Order) => new Date(order.created_at).toLocaleDateString('ru-RU')
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Заказы</h1>
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Все статусы</option>
            <option value="processing">В обработке</option>
            <option value="confirmed">Подтверждённые</option>
            <option value="completed">Завершённые</option>
            <option value="cancelled">Отменённые</option>
            <option value="shipped">Отправленные</option>
          </select>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <StatCard label="Всего" value={stats.total || 0} color="gray" />
            <StatCard label="В обработке" value={stats.by_status?.processing || 0} color="yellow" />
            <StatCard label="Подтверждены" value={stats.by_status?.confirmed || 0} color="blue" />
            <StatCard label="Завершены" value={stats.by_status?.completed || 0} color="green" />
            <StatCard label="Отменены" value={stats.by_status?.cancelled || 0} color="red" />
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Загрузка...</div>
        ) : (
          <>
            <DataTable
              columns={columns}
              data={orders}
              onRowClick={setSelectedOrder}
              emptyMessage="Нет заказов"
            />

            {/* Pagination */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Показано {orders.length} из {total}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Назад
                </button>
                <span className="px-4 py-2 text-gray-500">
                  Страница {page} из {totalPages || 1}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages || 1, p + 1))}
                  disabled={page >= totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Вперёд
                </button>
              </div>
            </div>
          </>
        )}

        {/* Order Detail Modal */}
        {selectedOrder && (
          <OrderDetailModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onUpdateStatus={handleUpdateStatus}
            onCancel={handleCancel}
            onComplete={handleComplete}
            updating={updating}
          />
        )}
      </div>
    </AdminLayout>
  );
}

// Компонент статистики
function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  const colors: Record<string, string> = {
    gray: 'bg-gray-100 text-gray-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
  };

  return (
    <div className={`rounded-lg p-4 ${colors[color]}`}>
      <div className="text-sm opacity-75">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

// Модальное окно деталей заказа
function OrderDetailModal({
  order,
  onClose,
  onUpdateStatus,
  onCancel,
  onComplete,
  updating,
}: {
  order: Order;
  onClose: () => void;
  onUpdateStatus: (orderId: number, status: string) => void;
  onCancel: (orderId: number) => void;
  onComplete: (orderId: number) => void;
  updating: boolean;
}) {
  const [managerComment, setManagerComment] = useState(order.manager_comment || '');

  const handleSaveComment = async () => {
    try {
      await api.orders.update(order.id, { manager_comment: managerComment });
      alert('Комментарий сохранён');
    } catch (error) {
      alert('Ошибка при сохранении комментария');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold">
            Заказ {order.order_number || `#${order.id}`}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
        </div>

        <div className="p-6 space-y-6">
          {/* Статус */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Статус заказа</label>
            <div className="flex gap-2 flex-wrap mb-4">
              {(['processing', 'confirmed', 'completed', 'shipped', 'cancelled'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => onUpdateStatus(order.id, status)}
                  disabled={updating || order.status === status}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                    order.status === status
                      ? 'bg-blue-600 text-white'
                      : status === 'cancelled'
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : status === 'completed'
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {STATUS_LABELS[status]}
                </button>
              ))}
            </div>

            {/* Быстрые действия */}
            <div className="flex gap-2">
              {order.status !== 'cancelled' && (
                <button
                  onClick={() => onCancel(order.id)}
                  disabled={updating}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm disabled:opacity-50"
                >
                  Отменить
                </button>
              )}
              {order.status !== 'completed' && (
                <button
                  onClick={() => onComplete(order.id)}
                  disabled={updating}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm disabled:opacity-50"
                >
                  Завершить
                </button>
              )}
            </div>
          </div>

          {/* Контактная информация */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoField label="Имя" value={order.name} />
            <InfoField label="Телефон" value={order.phone} />
            <InfoField label="Email" value={order.email} />
            <InfoField label="Компания" value={order.company_name} />
            {order.inn && <InfoField label="ИНН" value={order.inn} />}
            <InfoField label="Источник" value={order.source} />
          </div>

          {/* Адрес доставки */}
          {order.delivery_address && (
            <InfoField label="Адрес доставки" value={order.delivery_address} />
          )}

          {/* Комментарий клиента */}
          {order.comment && (
            <div>
              <div className="text-sm text-gray-500 mb-1">Комментарий клиента</div>
              <div className="p-3 bg-blue-50 rounded-lg">{order.comment}</div>
            </div>
          )}

          {/* Позиции заказа */}
          {order.items && order.items.length > 0 && (
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">Позиции заказа</div>
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                    <div>
                      <div className="font-medium">{item.product_name}</div>
                      <div className="text-sm text-gray-500">
                        {item.quantity} шт. × {item.price?.toLocaleString('ru-RU')} ₽
                      </div>
                    </div>
                    <div className="font-bold">
                      {(item.subtotal || (item.quantity * item.price))?.toLocaleString('ru-RU')} ₽
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between">
                <span className="font-medium">Итого:</span>
                <span className="font-bold text-lg">
                  {order.total_amount?.toLocaleString('ru-RU') || 0} ₽
                </span>
              </div>
            </div>
          )}

          {/* Комментарий менеджера */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Комментарий менеджера
            </label>
            <textarea
              value={managerComment}
              onChange={(e) => setManagerComment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Добавьте внутренний комментарий..."
            />
            <button
              onClick={handleSaveComment}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Сохранить комментарий
            </button>
          </div>

          {/* Мета-информация */}
          <div className="pt-4 border-t border-gray-200 grid grid-cols-2 gap-4 text-sm text-gray-500">
            <div>Создан: {new Date(order.created_at).toLocaleString('ru-RU')}</div>
            <div>Обновлён: {new Date(order.updated_at).toLocaleString('ru-RU')}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Вспомогательный компонент для полей информации
function InfoField({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div>
      <div className="text-sm text-gray-500">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}
