import React, { useState, useEffect } from 'react';
import { createPayment, fetchLoans } from '../services/api';
import { NewPaymentFormProps, Loan } from '../types';
import { useAuthStore } from "../store/authStore";

export function NewPaymentForm({ onClose }: NewPaymentFormProps) {
  const user = useAuthStore((state) => state.user);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    loan_id: '',
    recorded_by: user?.id ?? '',
    status: 'active' as 'active' | 'disabled' | 'completed',
    amount: '',
    payment_date: new Date().toISOString().split('T')[0],
    payment_type: 'capital' as 'capital' | 'interest'
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

    loadLoans();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const paymentData = {
        loan_id: formData.loan_id,
        recorded_by: user?.id ?? '',
        amount: parseFloat(formData.amount),
        payment_date: formData.payment_date,
        payment_type: formData.payment_type,
        status: formData.status
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
            {loans.map((loan) => (
              <option key={loan.id} value={loan.id}>
                ID: {loan.id} - Monto: ${loan.amount}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Monto del Pago</label>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            min="0"
            step="0.01"
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
          <label className="block text-sm font-medium text-gray-700">Tipo de Pago</label>
          <select
            value={formData.payment_type}
            onChange={(e) => setFormData({ ...formData, payment_type: e.target.value as 'capital' | 'interest' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="capital">Capital</option>
            <option value="interest">Interés</option>
          </select>
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