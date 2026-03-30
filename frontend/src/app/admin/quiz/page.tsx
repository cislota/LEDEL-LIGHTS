'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import { api } from '@/lib/api';
import { QuizResult } from '@/types';

export default function QuizPage() {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState<QuizResult | null>(null);
  const [filterProcessed, setFilterProcessed] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 20;

  useEffect(() => {
    loadResults();
  }, [page, filterProcessed]);

  const loadResults = async () => {
    setLoading(true);
    try {
      const params: any = { page, page_size: pageSize };
      if (filterProcessed === 'processed') {
        params.is_processed = true;
      } else if (filterProcessed === 'unprocessed') {
        params.is_processed = false;
      }
      const res = await api.quiz.list(params);
      const data = res.data.data;
      setResults(data.items || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Failed to load quiz results:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleProcessed = async (id: number, isProcessed: boolean) => {
    try {
      await api.quiz.update(id, { is_processed: isProcessed });
      loadResults();
      if (selectedResult?.id === id) {
        setSelectedResult({ ...selectedResult, is_processed: isProcessed });
      }
    } catch (error) {
      console.error('Failed to update quiz result:', error);
      alert('Ошибка при обновлении статуса');
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { 
      key: 'name', 
      label: 'Клиент',
      render: (result: QuizResult) => (
        <div>
          <div className="font-medium">{result.name || 'Аноним'}</div>
          <div className="text-sm text-gray-500">{result.phone || result.email || '—'}</div>
        </div>
      )
    },
    { 
      key: 'result_type', 
      label: 'Рекомендация',
      render: (result: QuizResult) => result.result_type || '—'
    },
    { 
      key: 'is_processed', 
      label: 'Статус',
      render: (result: QuizResult) => (
        <StatusBadge status={result.is_processed ? 'true' : 'false'} type="processed" />
      )
    },
    {
      key: 'created_at',
      label: 'Дата',
      render: (result: QuizResult) => new Date(result.created_at).toLocaleDateString('ru-RU')
    },
  ];

  const totalPages = Math.ceil(total / pageSize);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Заявки из квиза</h1>
          <select
            value={filterProcessed}
            onChange={(e) => {
              setFilterProcessed(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Все заявки</option>
            <option value="unprocessed">Необработанные</option>
            <option value="processed">Обработанные</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Загрузка...</div>
        ) : (
          <>
            <DataTable
              columns={columns}
              data={results}
              onRowClick={setSelectedResult}
              emptyMessage="Нет заявок"
            />

            {/* Pagination */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Показано {results.length} из {total}
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

        {/* Result Detail Modal */}
        {selectedResult && (
          <QuizDetailModal
            result={selectedResult}
            onClose={() => setSelectedResult(null)}
            onToggleProcessed={handleToggleProcessed}
          />
        )}
      </div>
    </AdminLayout>
  );
}

function QuizDetailModal({ 
  result, 
  onClose, 
  onToggleProcessed 
}: { 
  result: QuizResult; 
  onClose: () => void;
  onToggleProcessed: (id: number, isProcessed: boolean) => void;
}) {
  const [managerComment, setManagerComment] = useState(result.manager_comment || '');

  const handleSaveComment = async () => {
    try {
      await api.quiz.update(result.id, { manager_comment: managerComment });
      alert('Комментарий сохранен');
    } catch (error) {
      console.error('Failed to save comment:', error);
      alert('Ошибка при сохранении комментария');
    }
  };

  const parseAnswers = () => {
    try {
      return JSON.parse(result.answers);
    } catch {
      return result.answers;
    }
  };

  const parseRecommendedProducts = () => {
    try {
      return JSON.parse(result.recommended_products || '[]');
    } catch {
      return [];
    }
  };

  const answers = parseAnswers();
  const recommendedProducts = parseRecommendedProducts();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-xl font-bold">Заявка из квиза #{result.id}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Status Toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => onToggleProcessed(result.id, true)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                result.is_processed
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ✓ Обработан
            </button>
            <button
              onClick={() => onToggleProcessed(result.id, false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                !result.is_processed
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ○ Не обработан
            </button>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-gray-500">Имя</div>
              <div className="font-medium">{result.name || 'Аноним'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Телефон</div>
              <div className="font-medium">{result.phone || '—'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Email</div>
              <div className="font-medium">{result.email || '—'}</div>
            </div>
          </div>

          {/* Result Type */}
          {result.result_type && (
            <div>
              <div className="text-sm text-gray-500 mb-1">Рекомендация</div>
              <div className="p-3 bg-blue-50 rounded-lg font-medium">{result.result_type}</div>
            </div>
          )}

          {/* Recommended Products */}
          {recommendedProducts.length > 0 && (
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">Рекомендованные товары</div>
              <div className="space-y-2">
                {recommendedProducts.map((product: any, index: number) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium">{product.title || product.name || 'Товар'}</div>
                    {product.price && (
                      <div className="text-sm text-gray-500">{product.price} ₽</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Answers */}
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">Ответы квиза</div>
            <div className="p-3 bg-gray-50 rounded-lg">
              {typeof answers === 'object' ? (
                <pre className="text-sm whitespace-pre-wrap">
                  {JSON.stringify(answers, null, 2)}
                </pre>
              ) : (
                <div className="text-sm">{answers}</div>
              )}
            </div>
          </div>

          {/* Manager Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Комментарий менеджера
            </label>
            <textarea
              value={managerComment}
              onChange={(e) => setManagerComment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Добавьте комментарий..."
            />
            <button
              onClick={handleSaveComment}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Сохранить комментарий
            </button>
          </div>

          {/* Meta Info */}
          <div className="pt-4 border-t border-gray-200 text-sm text-gray-500">
            Создана: {new Date(result.created_at).toLocaleString('ru-RU')}
          </div>
        </div>
      </div>
    </div>
  );
}
