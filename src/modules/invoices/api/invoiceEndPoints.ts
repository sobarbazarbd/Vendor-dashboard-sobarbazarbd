import api from "../../../app/api/api";
import { FilterTypes } from "../../../app/features/filterSlice";
import { ApiResponse, PaginatedResponse } from "../../../app/utils/constant";
import { TagTypes } from "../../../app/utils/tagTypes";
import { IInvoiceData } from "../types/invoiceType";

const invoiceEndpoint = api.injectEndpoints({
  endpoints: (builder) => ({
    getInvoices: builder.query<
      ApiResponse<PaginatedResponse<IInvoiceData>>,
      FilterTypes
    >({
      query: (params) => ({
        url: "/api/v1.0/stores/store-invoices/",
        params,
      }),
      providesTags: [
        {
          type: TagTypes.INVOICES,
          id: TagTypes.INVOICES + "_ID",
        },
      ],
    }),

    getSingleInvoice: builder.query<ApiResponse<any>, any>({
      query: ({ id }: any) => ({
        url: `/api/v1.0/stores/store-invoices/${id}/`,
      }),

      providesTags: [
        {
          type: TagTypes.INVOICES,
          id: TagTypes.INVOICES + "_ID",
        },
      ],
    }),

    deleteInvoice: builder.mutation<ApiResponse<IInvoiceData>, { id: any }>({
      query: ({ id }) => ({
        url: `/api/v1.0/stores/store-invoices/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: [
        {
          type: TagTypes.INVOICES,
          id: TagTypes.INVOICES + "_ID",
        },
      ],
    }),
  }),
});

export const {
  useDeleteInvoiceMutation,
  useGetInvoicesQuery,
  useGetSingleInvoiceQuery,
} = invoiceEndpoint;
