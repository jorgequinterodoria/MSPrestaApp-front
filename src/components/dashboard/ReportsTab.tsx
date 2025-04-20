import { useState } from 'react';
import { PaginatedTable } from './PaginatedTable';
import { DollarSign, CreditCard } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';


interface ReportsTabProps {
  totalLoans: number;
  totalLoansAmount:number;
  paymentsPerMonth: { month: string; total_amount: string }[];
}

export const ReportsTab = ({totalLoans, totalLoansAmount, paymentsPerMonth}:ReportsTabProps) => {
const [isLoading] = useState(false);
const [error] = useState<string | null>(null);

  // Summary cards section
  const SummaryCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
            <CreditCard className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Préstamos</p>
            <h4 className="text-2xl font-bold">{totalLoans}</h4>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Monto Prestado</p>
            <h4 className="text-2xl font-bold">{formatCurrency(totalLoansAmount)}</h4>
          </div>
        </div>
      </div>
    </div>
  );

  // Monthly payments table
  const monthlyPaymentsColumns = [
    { 
      header: 'Mes', 
      accessor: (row: { month: string; total_amount: string }) => {
        const monthNames = [
          'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
          'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        // Assuming month comes as a number (1-12) or "01"-"12"
        const monthNum = parseInt(row.month, 10);
        return monthNames[monthNum - 1] || row.month;
      } 
    },
    { header: 'Monto Total', accessor: (row: { month: string; total_amount: string }) => row.total_amount }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Reportes y Estadísticas</h2>
      </div>

      {/* Display summary cards */}
      <SummaryCards />

      {isLoading ? (
        <div className="text-center py-8">Cargando reportes...</div>
      ) : error ? (
        <div className="text-red-500 text-center py-8">{error}</div>
      ) : (
        /* Display monthly payments table */
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Pagos Mensuales</h3>
            <PaginatedTable data={paymentsPerMonth} columns={monthlyPaymentsColumns} />
          </div>
        </div>
      )}
    </div>
  );
};