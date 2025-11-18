// src/pages/CategoriesPage.tsx
import { useState } from 'react';
import { useCategories, useDeleteCategory } from '../hooks/useCategories';
import { Plus, Trash2, Edit, FolderOpen, Lock } from 'lucide-react';
import CategoryModal from '../components/categories/CategoryModal';

const CategoriesPage = () => {
  const [selectedType, setSelectedType] = useState<'income' | 'expense' | ''>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  const { data: categoriesData, isLoading } = useCategories(selectedType || undefined);
  const deleteMutation = useDeleteCategory();

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error: any) {
        const errorMsg = error.response?.data?.message || 'Failed to delete category';
        alert(errorMsg);
      }
    }
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  // Separar categorías del sistema y personalizadas
  const systemCategories = categoriesData?.categories.filter(cat => !cat.userId) || [];
  const personalCategories = categoriesData?.categories.filter(cat => cat.userId) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categorias</h1>
          <p className="text-gray-600 mt-1">Controla las categorias de tus transacciones</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Agregar Categoria Personalizada</span>
        </button>
      </div>

      {/* Filtro por tipo */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filtrar por tipo
        </label>
        <div className="flex space-x-3">
          <button
            onClick={() => setSelectedType('')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedType === ''
              ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
              : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
              }`}
          >
            Todas
          </button>
          <button
            onClick={() => setSelectedType('income')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedType === 'income'
              ? 'bg-green-100 text-green-700 border-2 border-green-300'
              : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
              }`}
          >
            Ingreso
          </button>
          <button
            onClick={() => setSelectedType('expense')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedType === 'expense'
              ? 'bg-red-100 text-red-700 border-2 border-red-300'
              : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
              }`}
          >
            Gasto
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* Categorías del Sistema */}
          {systemCategories.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Lock className="w-5 h-5 text-gray-500" />
                <h2 className="text-xl font-semibold text-gray-900">Categorias del Sistema</h2>
                <span className="text-sm text-gray-500">(No se pueden editar o eliminar)</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {systemCategories.map((category) => (
                  <div
                    key={category.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
                    style={{ borderLeftWidth: '4px', borderLeftColor: category.color }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-3xl">{category.icon}</span>
                        <div>
                          <h3 className="font-semibold text-gray-900">{category.name}</h3>
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full ${category.type === 'income'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                              }`}
                          >
                            {category.type === 'income' ? 'Ingreso' : 'Gasto'}
                          </span>

                        </div>
                      </div>
                      <Lock className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Categorías Personalizadas */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <FolderOpen className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Mis Categorias</h2>
            </div>
            {personalCategories.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <FolderOpen className="w-16 h-16 mb-4 text-gray-300" />
                  <p className="text-lg font-medium">No hay categorias personalizadas aun</p>
                  <p className="text-sm mt-1">Crea tus propias categorias personalizadas para organizar tus transacciones</p>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="mt-4 flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Crear Categoria</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {personalCategories.map((category) => (
                  <div
                    key={category.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow group"
                    style={{ borderLeftWidth: '4px', borderLeftColor: category.color }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3 flex-1">
                        <span className="text-3xl">{category.icon}</span>
                        <div>
                          <h3 className="font-semibold text-gray-900">{category.name}</h3>
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full ${category.type === 'income'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                              }`}
                          >
                            {category.type === 'income' ? 'Ingreso' : 'Gasto'}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(category)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Modal */}
      {isModalOpen && (
        <CategoryModal
          category={editingCategory}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default CategoriesPage;