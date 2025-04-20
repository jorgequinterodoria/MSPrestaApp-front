import { create } from 'zustand';
import { Loan, Payment, Client, PaymentPeriod, InterestRate } from '../types';
import { fetchLoans, fetchClients, fetchPayments,fetchPaymentsPeriods,fetchInterestRates,fetchLoansByWeek } from '../services/api';

interface DashboardStore {
  loans: Loan[];
  clients: Client[];
  payments: Payment[];
  interestRates: InterestRate[]
  paymentPeriods:PaymentPeriod[];
  loansPerWeek:Loan[]
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
  loansPerWeek:[],
  loading: false,
  error: null,
  fetchData: async () => {
    set({ loading: true });
    try {
      const [loansData, clientsData, paymentsData, interestRatesData, paymentPeriodsData, loansPerWeekData] = await Promise.all([
        fetchLoans(),
        fetchClients(),
        fetchPayments(),
        fetchInterestRates(),
        fetchPaymentsPeriods(),
        fetchLoansByWeek(),
      ]);
      set({
        loans: loansData,
        clients: clientsData,
        payments: paymentsData,
        interestRates:interestRatesData,
        paymentPeriods:paymentPeriodsData,
        loansPerWeek:loansPerWeekData,
        loading: false,
      });
    } catch (error) {
      set({ error: "Error al cargar los datos"+error, loading: false });
    }
  },
}));