// ─── B2B Supplier Orders (Admin orders from suppliers) ───────────────────────

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "paid" | "unpaid" | "partial";

export interface IOrderVariant {
  id: number;
  name: string;
  sku: string;
  price: string;
  attributes: Record<string, string>;
}

export interface IOrderItem {
  id: number;
  variant: IOrderVariant | null;
  quantity: number;
  selling_unit_price: string;
  total_price: string;
}

export interface IOrders {
  id: number;
  order_number: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  order_date: string;
  total_price: string;
  items: IOrderItem[];
  delivery_tracking_code: string | null;
  delivery_consignment_id: string | null;
  delivery_status: string | null;
}

export interface ICreateOrder {
  store?: number;
  items: Array<{
    variant: number;
    quantity: number;
    selling_unit_price: number;
  }>;
}

// ─── Customer Orders (Affiliated — visible in supplier dashboard) ─────────────

export type CustomerOrderStatus =
  | "Placed"
  | "Paid"
  | "Confirmed"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export type DeliveryMethod = "steadfast" | "pathao" | "custom";

export interface IAffiliatedOrderItem {
  id: number;
  product_title: string;
  sku: string | null;
  quantity: number;
  final_unit_price: string;
  net_price: string;
  product_image: string | null;
}

export interface IAffiliatedCustomerOrder {
  id: number;
  order_number: string;
  status: CustomerOrderStatus;
  order_date: string;
  total_price: string | null;
  customer_name: string;
  customer_phone: string;
  shipping_address: string | null;
  delivery_method: DeliveryMethod | null;
  delivery_tracking_code: string | null;
  delivery_status: string | null;
  items: IAffiliatedOrderItem[];
}
