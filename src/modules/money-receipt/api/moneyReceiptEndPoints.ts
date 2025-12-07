import api from "../../../app/api/api";
import { FilterTypes } from "../../../app/features/filterSlice";
import { ApiResponse, PaginatedResponse } from "../../../app/utils/constant";
import { TagTypes } from "../../../app/utils/tagTypes";
import { IReceiptData } from "../types/money-receiptType";

const moneyReceiptEndpoint = api.injectEndpoints({
  endpoints: (builder) => ({
    getMoneyReceipts: builder.query<
      ApiResponse<PaginatedResponse<IReceiptData>>,
      FilterTypes
    >({
      query: (params) => ({
        url: "/api/v1.0/stores/store-money-receipts/",
        params,
      }),
      providesTags: [
        {
          type: TagTypes.MONEY_RECEIPTS,
          id: TagTypes.MONEY_RECEIPTS + "_ID",
        },
      ],
    }),

    getSingleMoneyReceipt: builder.query<ApiResponse<any>, any>({
      query: ({ id }: any) => ({
        url: `/api/v1.0/stores/store-money-receipts/${id}/`,
      }),

      providesTags: [
        {
          type: TagTypes.MONEY_RECEIPTS,
          id: TagTypes.MONEY_RECEIPTS + "_ID",
        },
      ],
    }),

    deleteMoneyReceipt: builder.mutation<
      ApiResponse<IReceiptData>,
      { id: any }
    >({
      query: ({ id }) => ({
        url: `/api/v1.0/stores/store-money-receipts/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: [
        {
          type: TagTypes.MONEY_RECEIPTS,
          id: TagTypes.MONEY_RECEIPTS + "_ID",
        },
      ],
    }),
  }),
});

export const {
  useDeleteMoneyReceiptMutation,
  useGetMoneyReceiptsQuery,
  useGetSingleMoneyReceiptQuery,
} = moneyReceiptEndpoint;
