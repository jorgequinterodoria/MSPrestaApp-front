import { create } from 'zustand';
import { Loan, Payment, Client, PaymentPeriod, InterestRate } from '../types';
import { fetchLoans, fetchClients, fetchPayments,fetchPaymentsPeriods,fetchInterestRates,fetchLoansByWeek, fetchCountLoans, fetchTotalLoansAmount, fetchPaymentsPerMonth } from '../services/api';

interface DashboardStore {
  loans: Loan[];
  clients: Client[];
  payments: Payment[];
  interestRates: InterestRate[]
  paymentPeriods:PaymentPeriod[];
  loansPerWeek:Loan[]
  totalLoans:number;
  totalLoansAmount:number;
  paymentsPerMonth: { month: string; total_amount: string }[];
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
  totalLoans:0,
  totalLoansAmount:0,
  paymentsPerMonth:[],
  loading: false,
  error: null,
  fetchData: async () => {
    set({ loading: true });
    try {
      const [loansData, clientsData, paymentsData, interestRatesData, paymentPeriodsData, loansPerWeekData,totalLoansData, totalLoansAmountData, paymentsPerMonthData] = await Promise.all([
        fetchLoans(),
        fetchClients(),
        fetchPayments(),
        fetchInterestRates(),
        fetchPaymentsPeriods(),
        fetchLoansByWeek(),
        fetchCountLoans(),
        fetchTotalLoansAmount(),
        fetchPaymentsPerMonth()
      ]);
      set({
        loans: loansData,
        clients: clientsData,
        payments: paymentsData,
        interestRates:interestRatesData,
        paymentPeriods:paymentPeriodsData,
        loansPerWeek:loansPerWeekData,
        totalLoans:totalLoansData,
        totalLoansAmount:totalLoansAmountData,
        paymentsPerMonth:paymentsPerMonthData,
        loading: false,
      });
    } catch (error) {
      set({ error: "Error al cargar los datos"+error, loading: false });
    }
  },
}));