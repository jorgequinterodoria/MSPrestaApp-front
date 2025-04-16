export interface User {
  id: string;
  name: string;
  password: string; 
  username: string;
  phone?: string; 
  role: 'admin' | 'collector' | 'CLIENTE';
  created_at: string;
}

export interface Client {
  id: string;
  full_name: string;
  phone: string;
  address: string;
}

export interface Loan {
  id: string;
  client_id: string;
  user_id: string;
  loan_type: 'interest_only' | 'fixed_installment';
  principal_amount: number;
  start_date: string;
  end_date: string;
  interest_rate_id: string;
  payment_period_id: string;
  cuote: number;
  num_cuotes: number;
  current_balance: number;
  status: 'active' | 'terminated';
  created_at: string;
}

export interface Payment {
  id: string;
  loan_id: string;
  amount: number;
  interest_pay: number;
  capital_pay: number;
  remaining: number;
  payment_date: string;
  notes: string;
  created_at: string;
}

export interface Notification {
  id: string;
  client_id: string;
  loan_id: string;
  message: string;
  type:'reminder'|'due' |'alert'
  send_date: 'sent'|'pending'
  status:string
  created_at: string;
}

export interface InterestRate{
  id: string;
  percentage:number
  description:string
  is_active:number
  created_at: string;
}

export interface PaymentPeriod{
  id:string
  name:string
  days:number
  is_active:number
  created_at: string;
}
export interface Permission {
  action: string;
  resource: string;
  allowed: boolean;
}

export const PERMISSIONS: Record<string, Permission[]> = {
  admin: [
    { action: 'create', resource: 'loan', allowed: true },
    { action: 'read', resource: 'loan', allowed: true },
    { action: 'update', resource: 'loan', allowed: true },
    { action: 'delete', resource: 'loan', allowed: true },
    { action: 'create', resource: 'client', allowed: true },
    { action: 'read', resource: 'client', allowed: true },
    { action: 'update', resource: 'client', allowed: true },
    { action: 'delete', resource: 'client', allowed: true },
    { action: 'create', resource: 'payment', allowed: true },
    { action: 'read', resource: 'payment', allowed: true },
    { action: 'update', resource: 'payment', allowed: true },
    { action: 'delete', resource: 'payment', allowed: true },
    { action: 'read', resource: 'debt', allowed: true },
    { action: 'update', resource: 'debt', allowed: true }
  ],
  collector: [
    { action: 'create', resource: 'loan', allowed: true },
    { action: 'read', resource: 'loan', allowed: true },
    { action: 'update', resource: 'loan', allowed: true },
    { action: 'read', resource: 'client', allowed: true },
    { action: 'read', resource: 'payment', allowed: true },
    { action: 'create', resource: 'payment', allowed: true }
  ],
  CLIENTE: [
    { action: 'read', resource: 'loan', allowed: true },
    { action: 'read', resource: 'payment', allowed: true }
  ]
};

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export interface NewClientFormProps {
  onClose: () => void;
}

export interface NewLoanFormProps {
  onClose: () => void;
}

export interface NewPaymentFormProps {
  onClose: () => void;
}

export interface ClientReport {
  client_id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  client_status: 'active' | 'disabled' | 'completed';
  total_loans: number;
  total_borrowed: number;
  total_remaining: number;
  completed_loans: number;
  total_debts: number;
  pending_debts: number;
  late_debts: number;
}

export interface LoanSummary {
  loan_id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  loan_amount: number;
  interest_rate: number;
  payment_type: 'capital' | 'interest';
  payment_frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  start_date: string;
  end_date: string;
  remaining_amount: number;
  loan_status: 'active' | 'disabled' | 'completed';
  lender_name: string;
  payment_count: number;
  capital_paid: number;
  interest_paid: number;
  debts_count: number;
  pending_debt_amount: number;
  late_debt_amount: number;
}