import { useState } from "react";
import { Client, InterestRate, Loan, PaymentPeriod } from "../../types";
import { formatCurrency } from "../../utils/formatters";
import { PaginatedTable } from "./PaginatedTable";

interface LoansTabProps {
  loansPerWeek: Loan[];
  clients: Client[];
  paymentPeriods: PaymentPeriod[];
  interestRates: InterestRate[];
}

export const LoansPerWeekTab = ({
  loansPerWeek,
  clients,
  paymentPeriods,
  interestRates,
}: LoansTabProps) => {
  // Add search state
  const [search, setSearch] = useState('');

  const columns = [
    {
      header: "Cliente",
      accessor: (loanPerWeek: Loan) => {
        const client = clients.find((c) => c.id === loanPerWeek.client_id);
        return client ? client.full_name : "Cliente no encontrado";
      },
    },
    {
      header: "Monto",
      accessor: (loanPerWeek: Loan) => formatCurrency(loanPerWeek.principal_amount),
    },
    {
      header: "Interés",
      accessor: (loanPerWeek: Loan) => {
        const interest = interestRates.find(
          (i) => i.id === loanPerWeek.interest_rate_id
        );
        return interest ? `${interest.description}% ` : "";
      },
    },
    {
      header: "# de cuotas",
      accessor: (loanPerWeek: Loan) =>
        loanPerWeek.num_cuotes == 0 ? "--" : `${loanPerWeek.num_cuotes} meses`,
    },
    {
      header: "Cuota Mensual",
      accessor: (loanPerWeek: Loan) => formatCurrency(loanPerWeek.cuote),
    },
    {
      header: "Tipo de Pago",
      accessor: (loanPerWeek: Loan) =>
        loanPerWeek.loan_type === "interest_only" ? "Intereses" : "Interes + Capital",
    },
    {
      header: "Saldo Pendiente",
      accessor: (loanPerWeek: Loan) => formatCurrency(loanPerWeek.current_balance),
    },
    {
      header: "Fecha de Creación",
      accessor: (loanPerWeek: Loan) => new Date(loanPerWeek.start_date).toLocaleDateString(),
    },
    {
      header: "Fecha de Finalización",
      accessor: (loanPerWeek: Loan) => new Date(loanPerWeek.end_date).toLocaleDateString(),
    },
    {
      header: "Estado",
      accessor: (loanPerWeek: Loan) =>
        loanPerWeek.status === "active" ? "Activo" : "Inactivo",
    },
    {
      header: "Frecuencia de pago",
      accessor: (loanPerWeek: Loan) => {
        const paymentPeriod = paymentPeriods.find(
          (p) => p.id === loanPerWeek.payment_period_id
        );
        return paymentPeriod ? paymentPeriod.name : "Frecuencia no encontrada";
      },
    },
  ];

  // Filter loans by client name
  const filteredLoans = loansPerWeek.filter(loanPerWeek => {
    const client = clients.find((c) => c.id === loanPerWeek.client_id);
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
      </div>
      <PaginatedTable data={filteredLoans} columns={columns} />
    </div>
  );
};
