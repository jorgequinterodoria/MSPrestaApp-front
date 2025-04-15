import { create } from 'zustand';
import { Loan, Payment, Client, PaymentPeriod, InterestRate } from '../types';
import { fetchLoans, fetchClients, fetchPayments,fetchPaymentsPeriods,fetchInterestRates } from '../services/api';

interface DashboardStore {
  loans: Loan[];
  clients: Client[];
  payments: Payment[];
  interestRates: InterestRate[]
  paymentPeriods:PaymentPeriod[];
  loading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  loans: [],
  clients: [],
  payments: [],
  interestRates:[],
  paymentPeriods:[],
  loading: false,
  error: null,
  fetchData: async () => {
    set({ loading: true });
    try {
      const [loansData, clientsData, paymentsData, interestRatesData, paymentPeriodsData] = await Promise.all([
        fetchLoans(),
        fetchClients(),
        fetchPayments(),
        fetchInterestRates(),
        fetchPaymentsPeriods(),
      ]);
      set({
        loans: loansData,
        clients: clientsData,
        payments: paymentsData,
        interestRates:interestRatesData,
        paymentPeriods:paymentPeriodsData,
        loading: false,
      });
    } catch (error) {
      set({ error: "Error al cargar los datos"+error, loading: false });
    }
  },
}));