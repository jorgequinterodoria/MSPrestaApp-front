import { Payment, Loan, Client } from '../../types';
import { PaginatedTable } from './PaginatedTable';
import { formatCurrency, formatDateWithMonthName } from '../../utils/formatters';

interface PaymentsTabProps {
  payments: Payment[];
  loans: Loan[];
  clients: Client[];
  onNewPayment: () => void;
  canCreatePayment: boolean;
}

export const PaymentsTab = ({ payments, loans, clients, onNewPayment, canCreatePayment }: PaymentsTabProps) => {
  const getClientName = (payment: Payment) => {
    const loan = loans.find((l) => l.id === payment.loan_id);
    const client = loan ? clients.find((c) => c.id === loan.client_id) : null;
    return client ? client.full_name : "Cliente no encontrado";
  };

  const columns = [
    { header: 'Cliente', accessor: (payment: Payment) => getClientName(payment) },
    { header: 'Monto', accessor: (payment: Payment) => formatCurrency(payment.amount) },
    { header: 'Fecha', accessor: (payment: Payment) => formatDateWithMonthName(payment.payment_date) },
    { header: 'Intereses', accessor: (payment: Payment) => formatCurrency(payment.interest_pay) },
    {header:'Capital', accessor:(payment:Payment)=>formatCurrency(payment.capital_pay)},
    {header:'Saldo', accessor:(payment:Payment)=>formatCurrency(payment.remaining)},
    {header:'Notas', accessor:(payment:Payment)=>payment.notes}
  ];

  return (
    <div className="px-2 md:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
        <h2 className="text-lg md:text-xl font-semibold">Registro de Pagos</h2>
        {canCreatePayment && (
          <button
            onClick={onNewPayment}
            className="w-full md:w-auto bg-blue-600 text-white px-3 py-1 md:px-4 md:py-2 rounded-md hover:bg-blue-700 text-sm md:text-base"
          >
            Registrar Pago
          </button>
        )}
      </div>
      <PaginatedTable data={payments} columns={columns} />
    </div>
  );
};