// src/pages/BudgetsPage.tsx
import { useState } from 'react';
import { useBudgets, useDeleteBudget } from '../hooks/useBudgets';
import { Plus, Trash2, Edit, TrendingUp, AlertCircle } from 'lucide-react';
import BudgetModal from '../components/budgets/BudgetModal';

const BudgetsPage = () => {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(2025);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<any>(null);

  const { data: budgetsData, isLoading } = useBudgets(selectedMonth, selectedYear);
  const deleteMutation = useDeleteBudget();

  console.log('budgetsData:', budgetsData);

  const handleDelete = async (id: string) => {
    if (window.confirm('Estas seguro que quieres eliminar este Presupuesto?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        alert('Failed to delete budget');
      }
    }
  };

  const handleEdit = (budget: any) => {
    setEditingBudget(budget);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBudget(null);
  };

  const years = Array.from({ length: 5 }, (_, i) => currentDate.getFullYear() - i);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getStatusColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusText = (percentage: number) => {
    if (percentage >= 100) return 'Exceeded';
    if (percentage >= 80) return 'Warning';
    return 'On Track';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Presupuestos</h1>
          <p className="text-gray-600 mt-1">Establece límites de gasto para tus categorías.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Agregar Presupuesto</span>
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Mes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mes
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {months.map((month, index) => (
                <option key={month} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          {/* Año */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Año
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lista de budgets */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : budgetsData?.budgets && budgetsData.budgets.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
          <div className="flex flex-col items-center justify-center text-gray-500">
            <TrendingUp className="w-16 h-16 mb-4 text-gray-300" />
            <p className="text-lg font-medium">No hay Presupuestos este periodo</p>
            <p className="text-sm mt-1">Crea un presupuesto para darle seguimiento a tus gastos</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Crear Presupuesto</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgetsData?.budgets.map((budget) => (
            <div
              key={budget.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{budget.category?.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {budget.category?.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {months[selectedMonth - 1]} {selectedYear}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleEdit(budget)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(budget.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">
                    ${budget.spent?.toFixed(2) || '0.00'} / ${budget.amount?.toFixed(2) || '0.00'}
                  </span>
                  <span className="font-medium text-gray-900">
                    {budget.percentage?.toFixed(0) || 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full transition-all ${getStatusColor(budget.percentage || 0)}`}
                    style={{ width: `${Math.min(budget.percentage || 0, 100)}%` }}
                  />
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Restante: ${budget.remaining?.toFixed(2) || '0.00'}
                </span>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    (budget.percentage || 0) >= 100
                      ? 'bg-red-100 text-red-700'
                      : (budget.percentage || 0) >= 80
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-green-100 text-green-700'
                  }`}
                >
                  {getStatusText(budget.percentage || 0)}
                </span>
              </div>

              {/* Alert si está excedido */}
              {(budget.percentage || 0) >= 80 && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-yellow-700">
                    {(budget.percentage || 0) >= 100
                      ? 'Has excedido tu limite de gasto!'
                      : 'Te estas acercando a el limite de tu presupuesto.'}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <BudgetModal
          budget={editingBudget}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default BudgetsPage;