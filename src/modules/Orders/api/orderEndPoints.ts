import api from "../../../app/api/api";
import { FilterTypes } from "../../../app/features/filterSlice";
import { ApiResponse, PaginatedResponse } from "../../../app/utils/constant";
import { handleOnQueryStarted } from "../../../app/utils/onQueryStartedHandler";
import { TagTypes } from "../../../app/utils/tagTypes";
import { ICreateOrder, IOrders } from "../types/ordersType";

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
        {
          type: TagTypes.ADMISSION,
          id: TagTypes.ADMISSION + "_ID",
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
  }),
});

export const {
  useGetOrdersQuery,
  useCreateOrderMutation,
  useGetSingleOrderQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} = ordersEndpoint;
