'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import { api } from '@/lib/api';
import { ContactFormSubmission } from '@/types';

export default function ContactsPage() {
  const [submissions, setSubmissions] = useState<ContactFormSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactFormSubmission | null>(null);
  const [filterProcessed, setFilterProcessed] = useState<string>('all');
  const [filterFormType, setFilterFormType] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 20;

  useEffect(() => {
    loadSubmissions();
  }, [page, filterProcessed, filterFormType]);

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const params: any = { page, page_size: pageSize };
      if (filterProcessed === 'processed') {
        params.is_processed = true;
      } else if (filterProcessed === 'unprocessed') {
        params.is_processed = false;
      }
      if (filterFormType !== 'all') {
        params.form_type = filterFormType;
      }
      const res = await api.contacts.list(params);
      const data = res.data.data;
      setSubmissions(data.items || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Failed to load contact submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleProcessed = async (id: number, isProcessed: boolean) => {
    try {
      await api.contacts.update(id, { is_processed: isProcessed });
      loadSubmissions();
      if (selectedSubmission?.id === id) {
        setSelectedSubmission({ ...selectedSubmission, is_processed: isProcessed });
      }
    } catch (error) {
      console.error('Failed to update submission:', error);
      alert('Ошибка при обновлении статуса');
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { 
      key: 'name', 
      label: 'Клиент',
      render: (submission: ContactFormSubmission) => (
        <div>
          <div className="font-medium">{submission.name}</div>
          <div className="text-sm text-gray-500">{submission.phone || submission.email || '—'}</div>
        </div>
      )
    },
    { 
      key: 'form_type', 
      label: 'Тип формы',
      render: (submission: ContactFormSubmission) => {
        const types: Record<string, string> = {
          footer: 'Подвал',
          contact_section: 'Раздел контактов',
          callback: 'Обратный звонок',
        };
        return types[submission.form_type || ''] || submission.form_type || '—';
      }
    },
    { 
      key: 'is_processed', 
      label: 'Статус',
      render: (submission: ContactFormSubmission) => (
        <StatusBadge status={submission.is_processed ? 'true' : 'false'} type="processed" />
      )
    },
    {
      key: 'created_at',
      label: 'Дата',
      render: (submission: ContactFormSubmission) => new Date(submission.created_at).toLocaleDateString('ru-RU')
    },
  ];

  const totalPages = Math.ceil(total / pageSize);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Заявки из форм</h1>
          <div className="flex gap-2">
            <select
              value={filterProcessed}
              onChange={(e) => {
                setFilterProcessed(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Все статусы</option>
              <option value="unprocessed">Необработанные</option>
              <option value="processed">Обработанные</option>
            </select>
            <select
              value={filterFormType}
              onChange={(e) => {
                setFilterFormType(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Все формы</option>
              <option value="footer">Подвал</option>
              <option value="contact_section">Раздел контактов</option>
              <option value="callback">Обратный звонок</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Загрузка...</div>
        ) : (
          <>
            <DataTable
              columns={columns}
              data={submissions}
              onRowClick={setSelectedSubmission}
              emptyMessage="Нет заявок"
            />

            {/* Pagination */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Показано {submissions.length} из {total}
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

        {/* Submission Detail Modal */}
        {selectedSubmission && (
          <ContactDetailModal
            submission={selectedSubmission}
            onClose={() => setSelectedSubmission(null)}
            onToggleProcessed={handleToggleProcessed}
          />
        )}
      </div>
    </AdminLayout>
  );
}

function ContactDetailModal({ 
  submission, 
  onClose, 
  onToggleProcessed 
}: { 
  submission: ContactFormSubmission; 
  onClose: () => void;
  onToggleProcessed: (id: number, isProcessed: boolean) => void;
}) {
  const [managerComment, setManagerComment] = useState(submission.manager_comment || '');

  const handleSaveComment = async () => {
    try {
      await api.contacts.update(submission.id, { manager_comment: managerComment });
      alert('Комментарий сохранен');
    } catch (error) {
      console.error('Failed to save comment:', error);
      alert('Ошибка при сохранении комментария');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-xl font-bold">Заявка из формы #{submission.id}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Status Toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => onToggleProcessed(submission.id, true)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                submission.is_processed
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ✓ Обработана
            </button>
            <button
              onClick={() => onToggleProcessed(submission.id, false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                !submission.is_processed
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ○ Не обработана
            </button>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-gray-500">Имя</div>
              <div className="font-medium">{submission.name}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Телефон</div>
              <div className="font-medium">{submission.phone || '—'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Email</div>
              <div className="font-medium">{submission.email || '—'}</div>
            </div>
          </div>

          {/* Form Type */}
          <div>
            <div className="text-sm text-gray-500 mb-1">Тип формы</div>
            <div className="p-3 bg-gray-50 rounded-lg font-medium">
              {submission.form_type || '—'}
            </div>
          </div>

          {/* Subject */}
          {submission.subject && (
            <div>
              <div className="text-sm text-gray-500 mb-1">Тема</div>
              <div className="p-3 bg-gray-50 rounded-lg font-medium">{submission.subject}</div>
            </div>
          )}

          {/* Message */}
          {submission.message && (
            <div>
              <div className="text-sm text-gray-500 mb-1">Сообщение</div>
              <div className="p-3 bg-gray-50 rounded-lg whitespace-pre-wrap">{submission.message}</div>
            </div>
          )}

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
            Создана: {new Date(submission.created_at).toLocaleString('ru-RU')}
          </div>
        </div>
      </div>
    </div>
  );
}
