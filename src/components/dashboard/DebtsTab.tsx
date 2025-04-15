import { Debt, Loan, User } from '../../types';
import { PaginatedTable } from './PaginatedTable';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface DebtsTabProps {
  debts: Debt[];
  loans: Loan[];
  clients: User[];
}

export const DebtsTab = ({ debts, loans, clients }: DebtsTabProps) => {
  const getDebtWithClientName = () => {
    return debts.map((debt) => {
      const loan = loans.find((l) => l.id === debt.loan_id);
      const client = loan ? clients.find((c) => c.id === loan.user_id) : null;
      return {
        ...debt,
        clientName: client ? client.name : "Cliente no encontrado",
      };
    });
  };

  const columns = [
    { header: 'Cliente', accessor: (debt: Debt & { clientName: string }) => debt.clientName },
    { header: 'Monto', accessor: (debt: Debt) => formatCurrency(debt.amount) },
    { header: 'Fecha de Préstamo', accessor: (debt: Debt) => formatDate(debt.due_date) },
    { header: 'Estado', accessor: (debt: Debt) => debt.status },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Gestión de Mora</h2>
      </div>
      <PaginatedTable data={getDebtWithClientName()} columns={columns} />
    </div>
  );
};