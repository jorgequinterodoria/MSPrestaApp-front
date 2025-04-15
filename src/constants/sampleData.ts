import { Client, Loan, Payment } from '../types';

export const SAMPLE_CLIENTS: Client[] = [
  {
    id: '1',
    name: 'Carlos Rodríguez',
    email: 'carlos@example.com',
    phone: '555-0101',
    status: 'active'
  },
  {
    id: '2',
    name: 'Ana María López',
    email: 'ana@example.com',
    phone: '555-0102',
    status: 'active'
  },
  {
    id: '3',
    name: 'Roberto Sánchez',
    email: 'roberto@example.com',
    phone: '555-0103',
    status: 'active'
  }
];

export const SAMPLE_LOANS: Loan[] = [
  {
    id: '1',
    client_id: '1',
    amount: 5000,
    interest_rate: 10,
    start_date: '2024-03-01',
    payment_type: 'capital',
    status: 'active',
    remaining_amount: 4000
  },
  {
    id: '2',
    client_id: '2',
    amount: 3000,
    interest_rate: 12,
    start_date: '2024-02-15',
    payment_type: 'interest',
    status: 'active',
    remaining_amount: 2500
  },
  {
    id: '3',
    client_id: '3',
    amount: 8000,
    interest_rate: 15,
    start_date: '2024-01-20',
    payment_type: 'capital',
    status: 'active',
    remaining_amount: 6000
  }
];

export const SAMPLE_PAYMENTS: Payment[] = [
  {
    id: '1',
    loan_id: '1',
    amount: 1000,
    payment_date: '2024-03-15',
    payment_type: 'capital',
    status: 'active'
  },
  {
    id: '2',
    loan_id: '2',
    amount: 500,
    payment_date: '2024-03-01',
    payment_type: 'interest',
    status: 'active'
  },
  {
    id: '3',
    loan_id: '3',
    amount: 2000,
    payment_date: '2024-02-20',
    payment_type: 'capital',
    status: 'active'
  }
];