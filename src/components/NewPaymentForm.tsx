import React, { useState, useEffect } from 'react';
import { createPayment, fetchClients, fetchLoans } from '../services/api';
import { NewPaymentFormProps, Loan, Client } from '../types'; 
import { formatCurrency } from '../utils/formatters';

export function NewPaymentForm({ onClose }: NewPaymentFormProps) {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    loan_id: '',
    amount:0,
    interest_pay:0,
    capital_pay:0,
    remaining:0,
    payment_date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  useEffect(() => {
    const loadLoans = async () => {
      try {
        const loansData = await fetchLoans();
        setLoans(loansData);
      } catch (err) {
        console.error('Error al cargar los préstamos:', err);
        setError('Error al cargar los préstamos');
      }
    };
    const loadClients = async () => {
      try {
        const clientsData = await fetchClients();
        setClients(clientsData);
      }
      catch (err) {
        console.error('Error al cargar los clientes:', err);
        setError('Error al cargar los clientes');
      }
    }

    loadLoans();
    loadClients();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const paymentData = {
        loan_id: formData.loan_id,
        amount: formData.amount,
        interest_pay: formData.interest_pay,
        capital_pay: formData.capital_pay,
        remaining: formData.remaining,
        payment_date: formData.payment_date,
        notes: formData.notes,
      };

      await createPayment(paymentData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar el pago');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-center mb-6">Registrar Pago</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Préstamo</label>
          <select
            value={formData.loan_id}
            onChange={(e) => setFormData({ ...formData, loan_id: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Seleccionar préstamo</option>
            {loans.map((loan) => {
              const client = clients.find(c => c.id === loan.client_id);
              return (
                <option key={loan.id} value={loan.id}>
                  {client ? client.full_name : 'Cliente desconocido'} - Monto: {formatCurrency(loan.current_balance)}
                </option>
              );
            })}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Monto del Pago</label>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Interés Pagado</label>
          <input
            type="number"
            value={formData.interest_pay}
            onChange={(e) => setFormData({...formData, interest_pay: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            min="0"
            step="1000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Capital Pagado</label>
          <input
            type="number"
            value={formData.capital_pay}
            onChange={(e) => setFormData({...formData, capital_pay: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            min="0"
            step="1000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Saldo Pendiente</label>
          <input
            type="number"
            value={formData.remaining}
            onChange={(e) => setFormData({...formData, remaining: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            min="0"
            step="1000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Fecha de Pago</label>
          <input
            type="date"
            value={formData.payment_date}
            onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Notas</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value })}
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
            {loading ? 'Registrando...' : 'Registrar Pago'}
          </button>
        </div>
      </form>
    </div>
  );
}