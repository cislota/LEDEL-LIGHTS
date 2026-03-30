'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import { api } from '@/lib/api';
import { Order } from '@/types';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 20;

  useEffect(() => {
    loadOrders();
  }, [page, filterStatus]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const params: any = { page, page_size: pageSize };
      if (filterStatus !== 'all') {
        params.status = filterStatus;
      }
      const res = await api.orders.list(params);
      const data = res.data.data;
      setOrders(data.items || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    try {
      await api.orders.update(orderId, { status: newStatus });
      loadOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus as any });
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
      alert('Ошибка при обновлении статуса');
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'order_number', label: '№ заказа' },
    { 
      key: 'name', 
      label: 'Клиент',
      render: (order: Order) => (
        <div>
          <div className="font-medium">{order.name}</div>
          <div className="text-sm text-gray-500">{order.phone}</div>
        </div>
      )
    },
    { 
      key: 'status', 
      label: 'Статус',
      render: (order: Order) => <StatusBadge status={order.status} type="order" />
    },
    { 
      key: 'source', 
      label: 'Источник',
      render: (order: Order) => order.source || '—'
    },
    {
      key: 'created_at',
      label: 'Дата',
      render: (order: Order) => new Date(order.created_at).toLocaleDateString('ru-RU')
    },
  ];

  const totalPages = Math.ceil(total / pageSize);

  return (
    <AdminLayout>
      <div className="space-y-6">
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
            <option value="new">Новые</option>
            <option value="in_progress">В работе</option>
            <option value="completed">Завершенные</option>
            <option value="cancelled">Отмененные</option>
          </select>
        </div>

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
                  Страница {page} из {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Вперед
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
          />
        )}
      </div>
    </AdminLayout>
  );
}

function OrderDetailModal({ 
  order, 
  onClose, 
  onUpdateStatus 
}: { 
  order: Order; 
  onClose: () => void;
  onUpdateStatus: (orderId: number, status: string) => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-xl font-bold">Заказ #{order.id}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Статус</label>
            <div className="flex gap-2 flex-wrap">
              {(['new', 'in_progress', 'completed', 'cancelled'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => onUpdateStatus(order.id, status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    order.status === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status === 'new' && 'Новый'}
                  {status === 'in_progress' && 'В работе'}
                  {status === 'completed' && 'Завершен'}
                  {status === 'cancelled' && 'Отменен'}
                </button>
              ))}
            </div>
          </div>

          {/* Customer Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500">Имя</div>
              <div className="font-medium">{order.name}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Телефон</div>
              <div className="font-medium">{order.phone}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Email</div>
              <div className="font-medium">{order.email || '—'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Компания</div>
              <div className="font-medium">{order.company_name || '—'}</div>
            </div>
            {order.inn && (
              <div>
                <div className="text-sm text-gray-500">ИНН</div>
                <div className="font-medium">{order.inn}</div>
              </div>
            )}
          </div>

          {/* Comment */}
          {order.comment && (
            <div>
              <div className="text-sm text-gray-500 mb-1">Комментарий</div>
              <div className="p-3 bg-gray-50 rounded-lg">{order.comment}</div>
            </div>
          )}

          {/* Order Items */}
          {order.items && order.items.length > 0 && (
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">Позиции заказа</div>
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="p-3 bg-gray-50 rounded-lg flex justify-between">
                    <div>
                      <div className="font-medium">{item.product_name}</div>
                      <div className="text-sm text-gray-500">Кол-во: {item.quantity}</div>
                    </div>
                    <div className="font-medium">
                      {item.price ? `${item.price * item.quantity} ₽` : '—'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Meta Info */}
          <div className="pt-4 border-t border-gray-200 grid grid-cols-2 gap-4 text-sm text-gray-500">
            <div>
              Создан: {new Date(order.created_at).toLocaleString('ru-RU')}
            </div>
            <div>
              Обновлен: {new Date(order.updated_at).toLocaleString('ru-RU')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
