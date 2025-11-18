// src/components/budgets/BudgetModal.tsx
import { useState } from 'react';
import { X } from 'lucide-react';
import { useCreateBudget, useUpdateBudget } from '../../hooks/useBudgets';
import { useCategories } from '../../hooks/useCategories';

interface BudgetModalProps {
  budget?: any;
  selectedMonth: number;
  selectedYear: number;
  onClose: () => void;
}

const BudgetModal = ({ budget, selectedMonth, selectedYear, onClose }: BudgetModalProps) => {
  const isEditing = !!budget;

  const [formData, setFormData] = useState({
    categoryId: budget?.categoryId || '',
    amount: budget?.amount || '',
    month: budget?.month || selectedMonth,
    year: budget?.year || selectedYear,
  });

  const [error, setError] = useState('');

  const { data: categoriesData } = useCategories('expense'); // Solo categorías de gastos
  const createMutation = useCreateBudget();
  const updateMutation = useUpdateBudget();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.categoryId) {
      setError('Porfavor Selecciona una categoría');
      return;
    }

    if (Number(formData.amount) <= 0) {
      setError('Monto debe de ser mayor que cero');
      return;
    }

    try {
      const data = {
        categoryId: formData.categoryId,
        amount: Number(formData.amount),
        month: Number(formData.month),
        year: Number(formData.year),
      };

      if (isEditing) {
        await updateMutation.mutateAsync({ id: budget.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }

      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar el presupuesto');
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {isEditing ? 'Edit Budget' : 'New Budget'}
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

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              id="category"
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              required
              disabled={isEditing} // No permitir cambiar categoría al editar
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">Selecciona una Categoria</option>
              {categoriesData?.categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
            {isEditing && (
              <p className="text-xs text-gray-500 mt-1">
                Las categorías no se pueden cambiar al editar un presupuesto.
              </p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Monto de Presupuesto
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Month */}
          <div>
            <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-2">
              Mes
            </label>
            <select
              id="month"
              value={formData.month}
              onChange={(e) => setFormData({ ...formData, month: Number(e.target.value) })}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {months.map((month, index) => (
                <option key={month} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          {/* Year */}
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
              Año
            </label>
            <select
              id="year"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
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

export default BudgetModal;