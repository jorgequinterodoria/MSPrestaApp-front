import { Client, InterestRate, Loan, PaymentPeriod } from "../../types";
import { formatCurrency } from "../../utils/formatters";
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
      accessor: (loan: Loan) => new Date(loan.start_date).toLocaleDateString(),
    },
    {
      header: "Fecha de Finalización",
      accessor: (loan: Loan) => new Date(loan.end_date).toLocaleDateString(),
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

  return (
    <div className="px-2 md:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
        <h2 className="text-lg md:text-xl font-semibold">Préstamos Activos</h2>
        {canCreateLoan && (
          <button
            onClick={onNewLoan}
            className="w-full md:w-auto bg-blue-600 text-white px-3 py-1 md:px-4 md:py-2 rounded-md hover:bg-blue-700 text-sm md:text-base"
          >
            Nuevo Préstamo
          </button>
        )}
      </div>
      <PaginatedTable data={loans} columns={columns} />
    </div>
  );
};
