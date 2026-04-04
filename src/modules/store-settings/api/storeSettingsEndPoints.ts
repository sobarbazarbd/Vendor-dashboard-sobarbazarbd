import api from "../../../app/api/api";
import { FilterTypes } from "../../../app/features/filterSlice";
import { ApiResponse, PaginatedResponse } from "../../../app/utils/constant";
import { handleOnQueryStarted } from "../../../app/utils/onQueryStartedHandler";
import { TagTypes } from "../../../app/utils/tagTypes";
import { IStoreSettings, IShowcaseImage } from "../types/storeSettingsType";

const storeSettingsEndPointsEndpoint = api.injectEndpoints({
  endpoints: (builder) => ({
    getStoreSettings: builder.query<
      ApiResponse<PaginatedResponse<IStoreSettings>>,
      FilterTypes
    >({
      query: (params) => ({
        url: "/api/v1.0/stores/me/",
        params,
      }),
      providesTags: [
        {
          type: TagTypes.STORE_SETTINGS,
          id: TagTypes.STORE_SETTINGS + "_ID",
        },
      ],
    }),

    updateStoreSettings: builder.mutation<
      ApiResponse<IStoreSettings>,
      { data: FormData }
    >({
      query: ({ data }) => ({
        url: `/api/v1.0/stores/me/`,
        method: "PATCH",
        body: data,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        await handleOnQueryStarted(queryFulfilled, dispatch);
      },
      invalidatesTags: [
        {
          type: TagTypes.STORE_SETTINGS,
          id: TagTypes.STORE_SETTINGS + "_ID",
        },
      ],
    }),

    // Showcase images
    getShowcaseImages: builder.query<IShowcaseImage[], void>({
      query: () => ({ url: "/api/v1.0/stores/showcase/" }),
      transformResponse: (res: any): IShowcaseImage[] => {
        if (Array.isArray(res)) return res;
        if (Array.isArray(res?.results)) return res.results;
        if (Array.isArray(res?.data?.results)) return res.data.results;
        if (Array.isArray(res?.data)) return res.data;
        return [];
      },
      providesTags: [{ type: TagTypes.STORE_SHOWCASE, id: "LIST" }],
    }),

    uploadShowcaseImage: builder.mutation<IShowcaseImage, FormData>({
      query: (data) => ({
        url: "/api/v1.0/stores/showcase/",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        await handleOnQueryStarted(queryFulfilled as any, dispatch);
      },
      invalidatesTags: [{ type: TagTypes.STORE_SHOWCASE, id: "LIST" }],
    }),

    deleteShowcaseImage: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/v1.0/stores/showcase/${id}/`,
        method: "DELETE",
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        await handleOnQueryStarted(queryFulfilled as any, dispatch);
      },
      invalidatesTags: [{ type: TagTypes.STORE_SHOWCASE, id: "LIST" }],
    }),
  }),
});

export const {
  useGetStoreSettingsQuery,
  useUpdateStoreSettingsMutation,
  useGetShowcaseImagesQuery,
  useUploadShowcaseImageMutation,
  useDeleteShowcaseImageMutation,
} = storeSettingsEndPointsEndpoint;
