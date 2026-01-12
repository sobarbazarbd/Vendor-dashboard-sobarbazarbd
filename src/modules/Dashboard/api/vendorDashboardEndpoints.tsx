import api from "../../../app/api/api";
import { TagTypes } from "../../../app/utils/tagTypes";
import { ApiResponse } from "../../../app/utils/constant";

export interface DashboardStats {
  overview: {
    total_revenue: number;
    today_revenue: number;
    this_month_revenue: number;
    this_year_revenue: number;
    revenue_growth: number;
    total_orders: number;
    pending_orders: number;
    processing_orders: number;
    total_products: number;
    active_products: number;
  };
  orders: {
    total: number;
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
  products: {
    total: number;
    active: number;
    out_of_stock: number;
    low_stock: number;
  };
  revenue: {
    total: number;
    today: number;
    this_month: number;
    last_month: number;
    this_year: number;
    growth: number;
  };
  accounts: {
    total_balance: number;
    cash: number;
    bank: number;
    mfs: number;
  };
  top_products: Array<{
    product__name: string;
    product__id: number;
    total_sold: number;
    revenue: number;
  }>;
  recent_orders: Array<{
    id: number;
    order_number: string;
    status: string;
    payment_status: string;
    total_amount: number;
    order_date: string;
    item_count: number;
  }>;
  monthly_revenue_chart: Array<{
    month: string;
    revenue: number;
  }>;
}

const vendorDashboardEndpoint = api.injectEndpoints({
  endpoints: (builder) => ({
    getVendorDashboardStats: builder.query<ApiResponse<DashboardStats>, void>({
      query: () => ({
        url: "/api/v1.0/stores/dashboard/",
        method: "GET",
      }),
      providesTags: [
        {
          type: TagTypes.DASHBOARD,
          id: "VENDOR_DASHBOARD",
        },
      ],
    }),
  }),
});

export const { useGetVendorDashboardStatsQuery } = vendorDashboardEndpoint;
