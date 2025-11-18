// src/pages/Dashboard.tsx
import { useMemo, useState } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { useBudgetAlerts } from '../hooks/useBudgets';
import { TrendingUp, TrendingDown, DollarSign, AlertTriangle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { format, subMonths } from 'date-fns';

const Dashboard = () => {
  const currentDate = new Date();
  const [selectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear] = useState(currentDate.getFullYear());

  // Obtener TODAS las transacciones
  const { data: transactionsData, isLoading } = useTransactions();

  // Obtener alertas de presupuestos
  const { data: alertsData } = useBudgetAlerts();

  // Calcular tendencia mensual (últimos 6 meses)
  const monthlyTrend = useMemo(() => {
    if (!transactionsData?.transactions) return [];

    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const monthNum = date.getMonth() + 1;
      const yearNum = date.getFullYear();

      const monthTransactions = transactionsData.transactions.filter((t) => {
        const tDate = new Date(t.date);
        return tDate.getMonth() + 1 === monthNum && tDate.getFullYear() === yearNum;
      });

      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + parseFloat(String(t.amount)), 0);

      const expense = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(String(t.amount)), 0);

      months.push({
        month: format(date, 'MMM yyyy'),
        income,
        expense,
      });
    }

    return months;
  }, [transactionsData]);

  // Calcular estadísticas filtrando en el frontend
  const stats = useMemo(() => {
    if (!transactionsData?.transactions) {
      return {
        totalIncome: 0,
        totalExpense: 0,
        balance: 0,
        byCategory: [],
        recentTransactions: [],
      };
    }

    // Filtrar transacciones por mes y año actual
    const transactions = transactionsData.transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      const transactionMonth = transactionDate.getMonth() + 1;
      const transactionYear = transactionDate.getFullYear();
      
      return transactionMonth === selectedMonth && transactionYear === selectedYear;
    });

    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(String(t.amount)), 0);

    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(String(t.amount)), 0);

    const balance = totalIncome - totalExpense;

    // Agrupar gastos por categoría
    const expensesByCategory: any = {};
    
    transactions
      .filter(t => t.type === 'expense')
      .forEach(transaction => {
        const categoryId = transaction.categoryId;
        const amount = parseFloat(String(transaction.amount));
        
        if (!expensesByCategory[categoryId]) {
          expensesByCategory[categoryId] = {
            name: transaction.category?.name || 'Unknown',
            value: 0,
            color: transaction.category?.color || '#000000',
            icon: transaction.category?.icon || '📦',
          };
        }
        
        expensesByCategory[categoryId].value += amount;
      });

    const byCategory = Object.values(expensesByCategory) as Array<{
      name: string;
      value: number;
      color: string;
      icon: string;
    }>;

    // Últimas 5 transacciones
    const recentTransactions = [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    return {
      totalIncome,
      totalExpense,
      balance,
      byCategory,
      recentTransactions,
    };
  }, [transactionsData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          {format(new Date(selectedYear, selectedMonth - 1), 'MMMM yyyy')}
        </p>
      </div>

      {/* Alertas de presupuestos */}
      {alertsData?.alerts && alertsData.alerts.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-yellow-800">Alertas de Presupuesto</h3>
              <ul className="mt-2 space-y-1">
                {alertsData.alerts.map((alert) => (
                  <li key={alert.budgetId} className="text-sm text-yellow-700">
                    <span className="font-medium">{alert.categoryName}</span>:{' '}
                    {alert.percentage.toFixed(0)}% Usado
                    {alert.status === 'exceeded' && ' (Exceeded!)'}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Cards de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Income */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ingreso total</p>
              <p className="text-2xl font-bold text-green-600 mt-2">
                ${stats.totalIncome.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Total Expense */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Gasto Total </p>
              <p className="text-2xl font-bold text-red-600 mt-2">
                ${stats.totalExpense.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        {/* Balance */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Balance</p>
              <p className={`text-2xl font-bold mt-2 ${stats.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                ${stats.balance.toFixed(2)}
              </p>
            </div>
            <div className={`p-3 rounded-full ${stats.balance >= 0 ? 'bg-blue-100' : 'bg-red-100'}`}>
              <DollarSign className={`w-6 h-6 ${stats.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Gráfica de tendencia mensual */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Tendencia Mensual (Ultimos 6 meses)</h2>
        {monthlyTrend.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: number) => `${value.toFixed(2)}`} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="income" 
                stroke="#6BCF7F" 
                strokeWidth={2}
                name="Ingreso"
              />
              <Line 
                type="monotone" 
                dataKey="expense" 
                stroke="#FF6B6B" 
                strokeWidth={2}
                name="Gasto"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            No hay datos para la tendencia mensual
          </div>
        )}
      </div>

      {/* Gráfica y transacciones recientes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfica de gastos por categoría */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Gastos por categoria</h2>
          {stats.byCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.byCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: any) => 
                    percent ? `${name} ${(percent * 100).toFixed(0)}%` : name
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.byCategory.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              No hay gastos este mes
            </div>
          )}
        </div>

        {/* Transacciones recientes */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h2>
          {stats.recentTransactions.length > 0 ? (
            <div className="space-y-3">
              {stats.recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{transaction.category?.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {transaction.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(transaction.date), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}$
                    {parseFloat(String(transaction.amount)).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              Todavia no hay transacciones este mes
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;