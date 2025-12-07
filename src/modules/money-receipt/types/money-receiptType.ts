export interface IReceiptData {
  id: number;
  receipt_number: string;
  receipt_date: string;
  invoice_number: string;
  payment_method: string; // sslcommerz, bkash, nagad, cash, etc.
  amount: number;
  payment_status: ReceiptPaymentStatus;
  created_at: string;
}

export type ReceiptPaymentStatus = "pending" | "paid" | "failed" | "cancelled";
