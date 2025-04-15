import { useState } from 'react';
import { ClientReport, LoanSummary } from '../../types';
import { PaginatedTable } from './PaginatedTable';
import { BarChart, FileText } from 'lucide-react';

const formatCurrency = (amount: number | undefined | null) => {
  if (amount === undefined || amount === null) return '$0.00';
  return `$${amount.toFixed(2)}`;
};

interface ReportsTabProps {
  loanSummary: LoanSummary[];
  clientReports: ClientReport[];
}

export const ReportsTab = ({loanSummary, clientReports}:ReportsTabProps) => {
  const [activeReport, setActiveReport] = useState<'loans' | 'clients'>('loans');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);



  const clientColumns = [
    { header: 'Nombre', accessor: (row: ClientReport) => row.client_name },
    { header: 'Email', accessor: (row: ClientReport) => row.client_email },
    { header: 'Teléfono', accessor: (row: ClientReport) => row.client_phone },
    { header: 'Estado', accessor: (row: ClientReport) => row.client_status },
    { header: 'Total Prestado', accessor: (row: ClientReport) => formatCurrency(row.total_borrowed) },
    { header: 'Préstamos Activos', accessor: (row: ClientReport) => row.total_loans },
    { header: 'Préstamos Completados', accessor: (row: ClientReport) => row.completed_loans },
    { header: 'Total Deudas', accessor: (row: ClientReport) => row.total_debts },
    { header: 'Deudas Pendientes', accessor: (row: ClientReport) => row.pending_debts },
    { header: 'Deudas Atrasadas', accessor: (row: ClientReport) => row.late_debts }
  ];

  const loanColumns = [
    { header: 'Cliente', accessor: (row: LoanSummary) => row.client_name },
    { header: 'Monto', accessor: (row: LoanSummary) => formatCurrency(row.loan_amount) },
    { header: 'Interés', accessor: (row: LoanSummary) => `${row.interest_rate}%` },
    { header: 'Tipo de Pago', accessor: (row: LoanSummary) => row.payment_type },
    { header: 'Frecuencia', accessor: (row: LoanSummary) => row.payment_frequency },
    { header: 'Fecha Inicio', accessor: (row: LoanSummary) => new Date(row.start_date).toLocaleDateString() },
    { header: 'Fecha Fin', accessor: (row: LoanSummary) => new Date(row.end_date).toLocaleDateString() },
    { header: 'Saldo Pendiente', accessor: (row: LoanSummary) => formatCurrency(row.remaining_amount) },
    { header: 'Estado', accessor: (row: LoanSummary) => row.loan_status },
    { header: 'Pagos Realizados', accessor: (row: LoanSummary) => row.payment_count },
    { header: 'Capital Pagado', accessor: (row: LoanSummary) => formatCurrency(row.capital_paid) },
    { header: 'Interés Pagado', accessor: (row: LoanSummary) => formatCurrency(row.interest_paid) }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Reportes y Estadísticas</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveReport('loans')}
            className={`flex items-center px-4 py-2 rounded-md ${
              activeReport === 'loans'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <BarChart className="h-5 w-5 mr-2" />
            Resumen de Préstamos
          </button>
          <button
            onClick={() => setActiveReport('clients')}
            className={`flex items-center px-4 py-2 rounded-md ${
              activeReport === 'clients'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <FileText className="h-5 w-5 mr-2" />
            Resumen de Clientes
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Cargando reportes...</div>
      ) : error ? (
        <div className="text-red-500 text-center py-8">{error}</div>
      ) : activeReport === 'loans' ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Resumen de Préstamos</h3>
            <PaginatedTable data={[loanSummary]} columns={loanColumns} />
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Resumen por Cliente</h3>
            <PaginatedTable data={clientReports} columns={clientColumns} />
          </div>
        </div>
      )}
    </div>
  );
};