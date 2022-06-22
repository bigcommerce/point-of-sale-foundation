export type PaymentMethodResponse = {
  id: string;
  name: string;
  stored_instruments: PaymentMethodStoredInstrument[];
  supported_instruments: PaymentMethodSupportedInstrument[];
  test_mode: boolean;
  type: string;
};

export type PaymentMethodStoredInstrument = {
  expiry_month: number;
  expiry_year: number;
  issuer_identification_number: string;
  last_4: string;
  token: string;
  is_default: boolean;
  type: string;
};

export type PaymentAccessTokenResponse = {
  id: string;
};

export type PaymentMethodSupportedInstrument = {
  instrument_type:
    | "VISA"
    | "MASTERCARD"
    | "DISCOVER"
    | "AMEX"
    | "DINERS_CLUB"
    | "JCB"
    | "DANKORT"
    | "MAESTRO"
    | "STORED_CARD";
  verification_value_required: boolean;
};

export type ProcessPaymentInstrument = {
  type: string;
  cardholder_name: string;
  number: string;
  expiry_month: number;
  expiry_year: number;
  verification_value?: string;
  issue_month?: number;
  issue_year?: number;
  issue_number?: string;
};

export type ProcessPaymentRequest = {
  instrument: ProcessPaymentInstrument;
  payment_method_id: string;
  save_instrument?: boolean;
};

export type ProcessPaymentResponse = {
  id: string;
  transaction_type: string;
  status: string;
  title?: string;
  detail?: string;
  type?: string;
  code?: number;
  errors?: any;
};
