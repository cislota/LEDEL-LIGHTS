'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import StatusBadge from '@/components/admin/StatusBadge';

// URL backend админки (извлекаем из NEXT_PUBLIC_API_BASE_URL)
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';
const BACKEND_ADMIN_URL = API_BASE.replace(/\/api$/, '') + '/admin/sql';
import { api } from '@/lib/api';
import { SyncLog } from '@/types';

export default function SettingsPage() {
  const [syncHistory, setSyncHistory] = useState<SyncLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<SyncLog | null>(null);
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    loadSyncData();
    checkDbInit();
  }, []);

  const loadSyncData = async () => {
    try {
      const res = await api.products.getSyncStatus();
      const data = res.data.data || res.data;
      if (data) {
        setLastSync(data);
      }
    } catch (error) {
      console.error('Failed to load sync status:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkDbInit = async () => {
    try {
      const res = await api.health();
      setDbInitialized(res.data.status === 'ok');
    } catch (error) {
      console.error('Failed to check DB:', error);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await api.products.syncTilda();
      const data = res.data.data || res.data;
      if (res.data.success !== false && data?.stats) {
        const { created, updated, failed, total } = data.stats;
        let msg = `Синхронизация завершена!\nВсего: ${total}, Создано: ${created}, Обновлено: ${updated}`;
        if (failed > 0) msg += `\n⚠️ Ошибок: ${failed}`;
        alert(msg);
        loadSyncData();
      } else if (data?.error) {
        alert('Ошибка: ' + data.error);
      } else {
        alert('Ответ сервера: ' + JSON.stringify(res.data));
      }
    } catch (error: any) {
      console.error('Sync error:', error);
      alert('Ошибка синхронизации: ' + (error.response?.data?.message || error.message));
    } finally {
      setSyncing(false);
    }
  };

  const handleInitDb = async () => {
    if (!confirm('Создать таблицы в базе данных?')) return;
    
    try {
      const res = await api.initDb();
      if (res.data.success) {
        alert('База данных инициализирована! Создано таблиц: ' + (res.data.data?.tables?.length || 0));
        checkDbInit();
      } else {
        alert('Ошибка: ' + res.data.message);
      }
    } catch (error: any) {
      console.error('DB init error:', error);
      alert('Ошибка инициализации БД: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Настройки</h1>

        {/* Database Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">База данных</h2>
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-3 h-3 rounded-full ${dbInitialized ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-gray-600">
              {dbInitialized ? 'База данных подключена' : 'База данных не инициализирована'}
            </span>
          </div>
          {!dbInitialized && (
            <button
              onClick={handleInitDb}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Инициализировать БД
            </button>
          )}
        </div>

        {/* Sync Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Синхронизация с Tilda</h2>

          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
            <strong>ℹ️ Информация:</strong> Синхронизация загружает товары из Tilda API. 
            Если товар с таким же UID уже есть в базе — он обновится. 
            Новые товары будут добавлены.
            {lastSync && lastSync.items_processed === 0 && (
              <span className="block mt-1">
                ⚠️ Последняя синхронизация не нашла новых товаров. Проверьте Tilda API credentials.
              </span>
            )}
          </div>

          <div className="mb-6">
            <button
              onClick={handleSync}
              disabled={syncing}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {syncing ? '⏳ Синхронизация...' : '🔄 Запустить синхронизацию'}
            </button>
            {syncing && (
              <span className="ml-3 text-sm text-gray-500">
                Это может занять 30-60 секунд...
              </span>
            )}
          </div>

          {lastSync && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Последняя синхронизация</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500">Статус</div>
                  <div className="mt-1">
                    <StatusBadge status={lastSync.status} type="sync" />
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500">Обработано</div>
                  <div className="mt-1 text-2xl font-bold">{lastSync.items_processed}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500">Создано</div>
                  <div className="mt-1 text-2xl font-bold text-green-600">{lastSync.items_created}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500">Обновлено</div>
                  <div className="mt-1 text-2xl font-bold text-blue-600">{lastSync.items_updated}</div>
                </div>
              </div>

              {lastSync.items_failed > 0 && (
                <div className="p-4 bg-red-50 rounded-lg mb-4">
                  <div className="text-sm text-red-800">
                    <span className="font-medium">Ошибки:</span> {lastSync.items_failed}
                  </div>
                  {lastSync.error_message && (
                    <div className="mt-2 text-sm text-red-600">{lastSync.error_message}</div>
                  )}
                </div>
              )}

              <div className="text-sm text-gray-500">
                Завершена: {new Date(lastSync.completed_at || lastSync.started_at).toLocaleString('ru-RU')}
              </div>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Информация</h2>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Backend админ-панель:</span>
              <a href={BACKEND_ADMIN_URL} className="text-blue-600 hover:underline" target="_blank">
                /admin/sql (SQLAdmin) →
              </a>
            </div>
            <div className="flex justify-between">
              <span>API документация:</span>
              <a href="/docs" className="text-blue-600 hover:underline" target="_blank">
                /docs (Swagger) →
              </a>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">💡 Подсказка</h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Для управления товарами используйте SQLAdmin панель (/admin/sql)</li>
            <li>Синхронизация загружает товары из Tilda API</li>
            <li>Все изменения в заказах и заявках сохраняются автоматически</li>
            <li>Данные для входа: admin / admin123 (измените в .env)</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}
