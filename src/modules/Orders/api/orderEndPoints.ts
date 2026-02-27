import api from "../../../app/api/api";
import { FilterTypes } from "../../../app/features/filterSlice";
import { ApiResponse, PaginatedResponse } from "../../../app/utils/constant";
import { handleOnQueryStarted } from "../../../app/utils/onQueryStartedHandler";
import { TagTypes } from "../../../app/utils/tagTypes";
import {
  IAffiliatedCustomerOrder,
  ICreateOrder,
  IOrders,
} from "../types/ordersType";

const ordersEndpoint = api.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<
      ApiResponse<PaginatedResponse<IOrders>>,
      FilterTypes
    >({
      query: (params) => ({
        url: "/api/v1.0/stores/orders/",
        params,
      }),
      providesTags: [
        {
          type: TagTypes.ORDERS,
          id: TagTypes.ORDERS + "_ID",
        },
      ],
    }),

    createOrder: builder.mutation<ApiResponse<ICreateOrder>, FormData>({
      query: (data) => ({
        url: "/api/v1.0/stores/orders/",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        await handleOnQueryStarted(queryFulfilled, dispatch);
      },
      invalidatesTags: [
        {
          type: TagTypes.ORDERS,
          id: TagTypes.ORDERS + "_ID",
        },
      ],
    }),

    getSingleOrder: builder.query<ApiResponse<any>, number>({
      query: (studId) => ({
        url: `/api/v1.0/stores/orders/${studId}/`,
      }),

      providesTags: [
        {
          type: TagTypes.ORDERS,
          id: TagTypes.ORDERS + "_ID",
        },
      ],
    }),

    deleteOrder: builder.mutation<ApiResponse<IOrders>, { id: any }>({
      query: ({ id }) => ({
        url: `/api/v1.0/stores/orders/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: [
        {
          type: TagTypes.ORDERS,
          id: TagTypes.ORDERS + "_ID",
        },
      ],
    }),

    updateOrder: builder.mutation<
      ApiResponse<IOrders>,
      { id: number | undefined; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/api/v1.0/stores/orders/${id}/update-status/`,
        method: "PATCH",
        body: data,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        await handleOnQueryStarted(queryFulfilled, dispatch);
      },
      invalidatesTags: [
        {
          type: TagTypes.ORDERS,
          id: TagTypes.ORDERS + "_ID",
        },
      ],
    }),

    // ─── Affiliated Customer Orders ─────────────────────────────────────────

    getAffiliatedCustomerOrders: builder.query<
      ApiResponse<PaginatedResponse<IAffiliatedCustomerOrder>>,
      FilterTypes
    >({
      query: (params) => ({
        url: "/api/v1.0/stores/affiliated-customer-orders/",
        params,
      }),
      providesTags: [
        {
          type: TagTypes.AFFILIATED_CUSTOMER_ORDERS,
          id: TagTypes.AFFILIATED_CUSTOMER_ORDERS + "_ID",
        },
      ],
    }),

    updateAffiliatedOrderStatus: builder.mutation<
      ApiResponse<IAffiliatedCustomerOrder>,
      { id: number; status: string }
    >({
      query: ({ id, status }) => ({
        url: `/api/v1.0/stores/affiliated-customer-orders/${id}/update-status/`,
        method: "PATCH",
        body: { status },
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        await handleOnQueryStarted(queryFulfilled, dispatch);
      },
      invalidatesTags: [
        {
          type: TagTypes.AFFILIATED_CUSTOMER_ORDERS,
          id: TagTypes.AFFILIATED_CUSTOMER_ORDERS + "_ID",
        },
      ],
    }),

    shipAffiliatedOrder: builder.mutation<
      ApiResponse<{ tracking_code: string; consignment_id: string; status: string }>,
      {
        id: number;
        delivery_method: "steadfast" | "pathao";
        city_id?: number;
        zone_id?: number;
        area_id?: number;
      }
    >({
      query: ({ id, ...body }) => ({
        url: `/api/v1.0/stores/affiliated-customer-orders/${id}/ship/`,
        method: "POST",
        body,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        await handleOnQueryStarted(queryFulfilled, dispatch);
      },
      invalidatesTags: [
        {
          type: TagTypes.AFFILIATED_CUSTOMER_ORDERS,
          id: TagTypes.AFFILIATED_CUSTOMER_ORDERS + "_ID",
        },
      ],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useCreateOrderMutation,
  useGetSingleOrderQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useGetAffiliatedCustomerOrdersQuery,
  useUpdateAffiliatedOrderStatusMutation,
  useShipAffiliatedOrderMutation,
} = ordersEndpoint;
