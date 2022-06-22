export type ErrorResponse = {
  message: string;
  name: string;
  status: number;
  trace?: string;
};

export type CompletedPaymentResponse = {
  amount_paid?: number;
  change?: number;
  id?: string;
  payment_type: string;
  transaction_type?: string;
}
