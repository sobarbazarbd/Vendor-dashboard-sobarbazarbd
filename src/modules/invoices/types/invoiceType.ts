// Or if you meant to create separate types for each:
export interface IInvoiceData {
  id: number;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  order_number: string;
  total: number;
  amount_paid: number;
  balance: number;
  status: InvoiceStatus;
  created_at: string;
}

export type InvoiceStatus =
  | "paid"
  | "unpaid"
  | "partial"
  | "overdue"
  | "cancelled"
  | "refunded";
