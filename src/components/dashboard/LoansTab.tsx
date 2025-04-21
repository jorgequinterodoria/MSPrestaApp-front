import { useState } from "react";
import { Client, InterestRate, Loan, PaymentPeriod } from "../../types";
import { formatCurrency, formatDateWithMonthName } from "../../utils/formatters";
import { PaginatedTable } from "./PaginatedTable";

interface LoansTabProps {
  loans: Loan[];
  clients: Client[];
  paymentPeriods: PaymentPeriod[];
  interestRates: InterestRate[];
  onNewLoan: () => void;
  canCreateLoan: boolean;
}

export const LoansTab = ({
  loans,
  clients,
  paymentPeriods,
  interestRates,
  onNewLoan,
  canCreateLoan,
}: LoansTabProps) => {
  // Add search state
  const [search, setSearch] = useState('');

  const columns = [
    {
      header: "Cliente",
      accessor: (loan: Loan) => {
        const client = clients.find((c) => c.id === loan.client_id);
        return client ? client.full_name : "Cliente no encontrado";
      },
    },
    {
      header: "Monto",
      accessor: (loan: Loan) => formatCurrency(loan.principal_amount),
    },
    {
      header: "Interés",
      accessor: (loan: Loan) => {
        const interest = interestRates.find(
          (i) => i.id === loan.interest_rate_id
        );
        return interest ? `${interest.description}% ` : "";
      },
    },
    {
      header: "# de cuotas",
      accessor: (loan: Loan) =>
        loan.num_cuotes == 0 ? "--" : `${loan.num_cuotes} meses`,
    },
    {
      header: "Cuota Mensual",
      accessor: (loan: Loan) => formatCurrency(loan.cuote),
    },
    {
      header: "Tipo de Pago",
      accessor: (loan: Loan) =>
        loan.loan_type === "interest_only" ? "Intereses" : "Interes + Capital",
    },
    {
      header: "Saldo Pendiente",
      accessor: (loan: Loan) => formatCurrency(loan.current_balance),
    },
    {
      header: "Fecha de Creación",
      accessor: (loan: Loan) => formatDateWithMonthName(loan.start_date),
    },
    {
      header: "Fecha de Finalización",
      accessor: (loan: Loan) => formatDateWithMonthName(loan.end_date),
    },
    {
      header: "Estado",
      accessor: (loan: Loan) =>
        loan.status === "active" ? "Activo" : "Inactivo",
    },
    {
      header: "Frecuencia de pago",
      accessor: (loan: Loan) => {
        const paymentPeriod = paymentPeriods.find(
          (p) => p.id === loan.payment_period_id
        );
        return paymentPeriod ? paymentPeriod.name : "Frecuencia no encontrada";
      },
    },
  ];

  // Filter loans by client name
  const filteredLoans = loans.filter(loan => {
    const client = clients.find((c) => c.id === loan.client_id);
    return client ? client.full_name.toLowerCase().includes(search.toLowerCase()) : false;
  });

  return (
    <div className="px-2 md:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
        <h2 className="text-lg md:text-xl font-semibold">Préstamos Activos</h2>
        {/* Search input */}
        <input
          type="text"
          placeholder="Buscar por nombre de cliente..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-64 mb-2 md:mb-0 md:mr-2 px-2 py-1 border border-gray-300 rounded-md"
        />
        {canCreateLoan && (
          <button
            onClick={onNewLoan}
            className="w-full md:w-auto bg-blue-600 text-white px-3 py-1 md:px-4 md:py-2 rounded-md hover:bg-blue-700 text-sm md:text-base"
          >
            Nuevo Préstamo
          </button>
        )}
      </div>
      <PaginatedTable data={filteredLoans} columns={columns} />
    </div>
  );
};
