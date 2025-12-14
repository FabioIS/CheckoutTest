export interface CardDetails {
  number: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

export interface TokenizeCardRequest {
  type: 'card';
  number: string;
  expiry_month: string;
  expiry_year: string;
  cvv: string;
}

export interface TokenizeCardResponse {
  token: string;
}

export interface PaymentRequest {
  source: {
    type: 'token';
    token: string;
  };
  amount: number;
  currency: string;
  '3ds': {
    enabled: boolean;
  };
  success_url: string;
  failure_url: string;
}

export enum PaymentResponseStatus {
  Authorized = 'Authorized',
  Pending = 'Pending',
  CardVerified = 'Card Verified',
  Declined = 'Declined',
  RetryScheduled = 'Retry Scheduled',
}

export interface PaymentResponse {
  id: string;
  status: PaymentResponseStatus;
  _links: {
    redirect?: {
      href: string;
    };
  };
}

export enum PaymentStatus {
  idle = 'idle',
  tokenizing = 'tokenizing',
  pending3ds = 'pending-3ds',
  success = 'success',
  error = 'error',
}

export interface PaymentState {
  status: PaymentStatus;
  threeDSecureUrl?: string | null;
  error: string | null;
  paymentId: string | null;
}

export enum CardScheme {
  visa = 'visa',
  mastercard = 'mastercard',
  amex = 'amex',
  unknown = 'unknown',
}
