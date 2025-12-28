import { apiSlice } from "./apiSlice";
const PREDICTIONS_URL = "/api/predictions";

export const predictionApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
    makePredictions: builder.mutation({
      query: (data) => ({
        url: `${PREDICTIONS_URL}`,
        method: "PUT",
        body: data, 
      }),
      invalidatesTags: ['Prediction']
    }),
    getPredictionsByPlayer: builder.query({
      query: ({id, mid}) => ({
        url: `${PREDICTIONS_URL}/${id}/matchday/${mid}`
      }),
      providesTags: ['Prediction']
    }),
    getMyPredictions: builder.query({
      query: ({id, mid, fid}) => ({
        url: `${PREDICTIONS_URL}/${id}/matchday/${mid}/fixture/${fid}`,
      }),
      providesTags: ['Prediction']
    }),
  }),
})

export const {
  useGetPredictionsByPlayerQuery,
  useMakePredictionsMutation,
  useGetMyPredictionsQuery
} = predictionApiSlice;