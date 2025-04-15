import React, { useEffect, useState } from "react";
import { createLoan, fetchClients, fetchUsers, fetchInterestRates, fetchPaymentsPeriods } from "../services/api";
import { Client, InterestRate, NewLoanFormProps, PaymentPeriod, User } from "../types";
import { useAuthStore } from "../store/authStore";

export function NewLoanForm({ onClose }: NewLoanFormProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [interestRates, setInterestRates] = useState<InterestRate[]>([]);
  const [paymentPeriods, setPaymentPeriods] = useState<PaymentPeriod[]>([]);
  const user = useAuthStore((state) => state.user);
  const [formData, setFormData] = useState({
    client_id: 0,
    user_id: user?.id ?? 0,
    loan_type: "interest_only",
    principal_amount: 0,
    start_date: new Date().toISOString().split("T")[0],
    end_date: new Date().toISOString().split("T")[0],
    interest_rate_id: 1,
    payment_period_id: 1,
    cuote: 0,
    num_cuotes: 0,
    current_balance: 0,
    status: "active" as const,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadClients = async () => {
      try {
        const clientsData = await fetchClients();
        setClients(
          clientsData.map((client) => ({
            ...client,
            phone: client.phone || "", // Ensure phone is a string
          }))
        );
      } catch (err) {
        console.error("Error al cargar los clientes:", err);
      }
    };

    const loadUsers = async () => {
      try {
        const usersData = await fetchUsers();
        setUsers(usersData);
      } catch (err) {
        console.error("Error al cargar los usuarios:", err);
      }
    };

    const loadInterestRates = async()=>{
      try {
        const interestRatesData = await fetchInterestRates();
        setInterestRates(interestRatesData);
      } catch (err) {
        console.error("Error al cargar las tasas de interés:", err);
      }
    }
    const loadPaymentPeriods = async()=>{
      try {
        const paymentPeriodsData = await fetchPaymentsPeriods();
        setPaymentPeriods(paymentPeriodsData);
      } catch (err) {
        console.error("Error al cargar los periodos de pago:", err);
      }
    }
    loadClients();
    loadUsers();
    loadInterestRates();
    loadPaymentPeriods();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const loanData = {
        client_id: formData.client_id,
        user_id: formData.user_id,
        loan_type: formData.loan_type,
        principal_amount: formData.principal_amount,
        start_date: formData.start_date,
        end_date: formData.end_date,
        interest_rate_id: formData.interest_rate_id,
        payment_period_id: formData.payment_period_id,
        cuote: formData.cuote,
        num_cuotes: formData.num_cuotes,
        current_balance: formData.current_balance,
        status: "active",
      };

      await createLoan(loanData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error creating loan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-center mb-6">Nuevo Préstamo</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Cliente
          </label>
          <select
            value={formData.client_id}
            onChange={(e) =>
              setFormData({ ...formData, client_id: parseInt(e.target.value) })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Seleccionar cliente</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.full_name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Prestador
          </label>
          <select
            value={formData.user_id}
            onChange={(e) =>
              setFormData({ ...formData, user_id: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Seleccionar Usuario</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Tipo de Préstamo</label>
          <select value={formData.loan_type}
            onChange={(e) =>
              setFormData({...formData, loan_type: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="interest_only">Intereses</option>
            <option value="fixed_installment">Capital+Intereses</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Cantidad
          </label>
          <input
            type="number"
            value={formData.principal_amount}
            onChange={(e) =>
              setFormData({ ...formData, principal_amount: parseInt(e.target.value) })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            min="0"
            step="10000"
          />
        </div>
<div>
          <label className="block text-sm font-medium text-gray-700">
            Tasa de Interés (%)
          </label>
          <select
            value={formData.interest_rate_id}
            onChange={(e) =>
              setFormData({...formData, interest_rate_id: parseInt(e.target.value) })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Seleccionar Tasa de Interés</option>
            {interestRates.map((interestRate) => (
              <option key={interestRate.id} value={interestRate.id}>
                {interestRate.description}%
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Periodo de Pago
          </label>
          <select
            value={formData.payment_period_id}
            onChange={(e) =>
              setFormData({...formData, payment_period_id: parseInt(e.target.value) })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Seleccionar Periodo de Pago</option>
            {paymentPeriods.map((paymentPeriod) => (
              <option key={paymentPeriod.id} value={paymentPeriod.id}>
                {paymentPeriod.name}
              </option>
            ))}
          </select>
</div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Cuota Mensual
          </label>
          <input
            type="number"
            value={formData.cuote}
            onChange={(e) =>
              setFormData({ ...formData, cuote: parseInt(e.target.value) })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            min="0"
            step="1000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Número de Cuotas
          </label>
          <input
            type="number"
            value={formData.num_cuotes}
            onChange={(e) =>
              setFormData({
                ...formData,
                num_cuotes: parseInt(e.target.value, 10),
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            min="0"
          />
        </div>
        <div>
        <label className="block text-sm font-medium text-gray-700">
            Balance Actual
          </label>
          <input
            type="number"
            value={formData.current_balance}
            onChange={(e) =>
              setFormData({...formData, current_balance: parseInt(e.target.value) })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            min="0"
            step="10000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fecha de Inicio
          </label>
          <input
            type="date"
            value={formData.start_date}
            onChange={(e) =>
              setFormData({ ...formData, start_date: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fecha de Finalización
          </label>
          <input
            type="date"
            value={formData.end_date}
            onChange={(e) =>
              setFormData({ ...formData, end_date: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Creando..." : "Crear Préstamo"}
          </button>
        </div>
      </form>
    </div>
  );
}
