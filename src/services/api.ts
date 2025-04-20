import axios from 'axios';
import { User, Client, Loan, Payment, InterestRate, PaymentPeriod } from '../types';

const API_URL = import.meta.env.VITE_API_URL;


// Users API
export const fetchUsers = async (): Promise<User[]> => {
  const response = await axios.get(`${API_URL}/users`);
  return response.data;
};

export const fetchUserById = async (id: string): Promise<User> => {
  const response = await axios.get(`${API_URL}/users/${id}`);
  return response.data;
};

export const createUser = async (user: Omit<User, 'id' | 'created_at'>): Promise<User> => {
  const response = await axios.post(`${API_URL}/users`, user);
  return response.data;
};

export const updateUser = async (id: string, user: Partial<Omit<User, 'id' | 'created_at'>>): Promise<User> => {
  const response = await axios.put(`${API_URL}/users/${id}`, user);
  return response.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  const response = await axios.delete(`${API_URL}/users/${id}`);
  return response.data;
};

export const searchUsersByName = async (name: string): Promise<User[]> => {
  const response = await axios.get(`${API_URL}/users/search`, {
    params: { name },
  });
  return response.data;
};

// Clients API
export const fetchClients = async (): Promise<Client[]> => {
  const response = await axios.get(`${API_URL}/clients`);
  return response.data;
};

export const fetchClientById = async (id: string): Promise<Client> => {
  const response = await axios.get(`${API_URL}/clients/${id}`);
  return response.data;
};

export const createClient = async (client: Omit<Client, 'id' | 'created_at'>): Promise<Client> => {
  const response = await axios.post(`${API_URL}/clients`, client);
  return response.data;
};

export const updateClient = async (id: string, client: Partial<Omit<Client, 'id' | 'created_at'>>): Promise<Client> => {
  const response = await axios.put(`${API_URL}/clients/${id}`, client);
  return response.data;
};

export const deleteClient = async (id: string): Promise<void> => {
  const response = await axios.delete(`${API_URL}/clients/${id}`);
  return response.data;
};

// Loans API
export const fetchLoans = async (): Promise<Loan[]> => {
  const response = await axios.get(`${API_URL}/loans`);
  return response.data;
};

export const fetchLoansByWeek = async(): Promise<Loan[]> =>{
  const response = await axios.get(`${API_URL}/loans/by-current-week`)
  return response.data
}

export const fetchCountLoans = async(): Promise<number> =>{
  const response = await axios.get(`${API_URL}/loans/total`)
  return response.data.total
}

export const fetchTotalLoansAmount = async(): Promise<number> =>{
  const response = await axios.get(`${API_URL}/loans/total-amount`)
  return response.data.total_amount
}

export const fetchLoanById = async (id: string): Promise<Loan> => {
  const response = await axios.get(`${API_URL}/loans/${id}`);
  return response.data;
};

export const createLoan = async (loan: Omit<Loan, 'id' | 'created_at'>): Promise<Loan> => {
  const response = await axios.post(`${API_URL}/loans`, loan);
  return response.data;
};

export const updateLoan = async (id: string, loan: Partial<Omit<Loan, 'id' | 'created_at'>>): Promise<Loan> => {
  const response = await axios.put(`${API_URL}/loans/${id}`, loan);
  return response.data;
};

export const deleteLoan = async (id: string): Promise<void> => {
  const response = await axios.delete(`${API_URL}/loans/${id}`);
  return response.data;
};

// Payments API
export const fetchPayments = async (): Promise<Payment[]> => {
  const response = await axios.get(`${API_URL}/payments`);
  return response.data;
};

export const fetchPaymentsPerMonth = async(): Promise<{month: string, total_amount: string}[]> => {
  const response = await axios.get(`${API_URL}/payments/total`);
  return response.data;
}

export const fetchPaymentsByLoanId = async (loanId: string): Promise<Payment[]> => {
  const response = await axios.get(`${API_URL}/payments/loan/${loanId}`);
  return response.data;
};

export const createPayment = async (payment: Omit<Payment, 'id' | 'created_at' | 'updated_at'>): Promise<Payment> => {
  const response = await axios.post(`${API_URL}/payments`, payment);
  return response.data;
};

export const updatePayment = async (id: string, payment: Partial<Omit<Payment, 'id' | 'created_at' | 'updated_at'>>): Promise<Payment> => {
  const response = await axios.put(`${API_URL}/payments/${id}`, payment);
  return response.data;
};

export const deletePayment = async (id: string): Promise<void> => {
  const response = await axios.delete(`${API_URL}/payments/${id}`);
  return response.data;
};

// Interest rates API
export const fetchInterestRates = async (): Promise<InterestRate[]> => {
  const response = await axios.get(`${API_URL}/interest-rates`);
  return response.data;
};


// Payments Periods API
export const fetchPaymentsPeriods = async (): Promise<PaymentPeriod[]> => {
  const response = await axios.get(`${API_URL}/payment-periods`);
  return response.data;
};

