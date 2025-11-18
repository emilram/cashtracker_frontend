// src/components/transactions/TransactionModal.tsx
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useCreateTransaction, useUpdateTransaction } from '../../hooks/useTransactions';
import { useCategories } from '../../hooks/useCategories';
import { format } from 'date-fns';

interface TransactionModalProps {
  transaction?: any;
  onClose: () => void;
}

const TransactionModal = ({ transaction, onClose }: TransactionModalProps) => {
  const isEditing = !!transaction;

  const [formData, setFormData] = useState({
    amount: transaction?.amount || '',
    type: transaction?.type || 'expense',
    date: transaction?.date ? format(new Date(transaction.date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
    description: transaction?.description || '',
    categoryId: transaction?.categoryId || '',
  });

  const [error, setError] = useState('');

  const { data: categoriesData } = useCategories(formData.type as 'income' | 'expense');
  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();

  // Actualizar categoryId cuando cambie el tipo y no haya una categoría válida
  useEffect(() => {
    if (categoriesData?.categories) {
      const currentCategoryValid = categoriesData.categories.some(
        (cat) => cat.id === formData.categoryId
      );
      
      if (!currentCategoryValid && categoriesData.categories.length > 0) {
        setFormData((prev) => ({
          ...prev,
          categoryId: categoriesData.categories[0].id,
        }));
      }
    }
  }, [formData.type, categoriesData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.categoryId) {
      setError('Please select a category');
      return;
    }

    if (Number(formData.amount) <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    try {
      const data = {
        amount: Number(formData.amount),
        type: formData.type as 'income' | 'expense',
        date: formData.date,
        description: formData.description,
        categoryId: formData.categoryId,
      };

      if (isEditing) {
        await updateMutation.mutateAsync({ id: transaction.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }

      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save transaction');
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {isEditing ? 'Editar Transaccion' : 'Nueva Transaccion'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'expense' })}
                className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                  formData.type === 'expense'
                    ? 'bg-red-100 text-red-700 border-2 border-red-300'
                    : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                }`}
              >
                Gasto
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'income' })}
                className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                  formData.type === 'income'
                    ? 'bg-green-100 text-green-700 border-2 border-green-300'
                    : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                }`}
              >
                Ingreso
              </button>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Monto
            </label>
            <input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Fecha
            </label>
            <input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Categoria
            </label>
            <select
              id="category"
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecciona una categoria</option>
              {categoriesData?.categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Descripcion
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="What was this transaction for?"
            />
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;