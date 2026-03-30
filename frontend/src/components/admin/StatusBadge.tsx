interface StatusBadgeProps {
  status: 'new' | 'in_progress' | 'completed' | 'cancelled' | 'success' | 'error' | 'partial' | string;
  type?: 'order' | 'sync' | 'processed';
}

export default function StatusBadge({ status, type = 'order' }: StatusBadgeProps) {
  const getStatusStyles = () => {
    if (type === 'order') {
      switch (status) {
        case 'new':
          return 'bg-blue-100 text-blue-800';
        case 'in_progress':
          return 'bg-yellow-100 text-yellow-800';
        case 'completed':
          return 'bg-green-100 text-green-800';
        case 'cancelled':
          return 'bg-red-100 text-red-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    }
    
    if (type === 'processed') {
      return status === 'true' || status === 'false'
        ? (status === 'true' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800')
        : 'bg-gray-100 text-gray-800';
    }
    
    if (type === 'sync') {
      switch (status) {
        case 'success':
          return 'bg-green-100 text-green-800';
        case 'partial':
          return 'bg-yellow-100 text-yellow-800';
        case 'error':
          return 'bg-red-100 text-red-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    }
    
    return 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = () => {
    const labels: Record<string, string> = {
      new: 'Новый',
      in_progress: 'В работе',
      completed: 'Завершен',
      cancelled: 'Отменен',
      success: 'Успешно',
      partial: 'Частично',
      error: 'Ошибка',
      true: 'Обработан',
      false: 'Не обработан',
    };
    return labels[status] || status;
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyles()}`}>
      {getStatusLabel()}
    </span>
  );
}
