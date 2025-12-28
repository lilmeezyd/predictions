import { apiSlice } from "./apiSlice";
const MATCHDAYS_URL = "/api/matchdays";

export const matchdayApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMatchdays: builder.query({
      query: () => ({
        url: `${MATCHDAYS_URL}`,
      }),
      providesTags: ["Matchday"],
    }),
    getMatchday: builder.query({
      query: (id) => ({
        url: `${MATCHDAYS_URL}/${id}`,
      }),
    }),
    addMatchday: builder.mutation({
      query: (data) => ({
        url: `${MATCHDAYS_URL}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Matchday"],
    }),
    startMatchday: builder.mutation({
      query: (id) => ({
        url: `${MATCHDAYS_URL}/${id}/set-current-matchday`,
        method: "PATCH",
      }),
      invalidatesTags: ["Matchday"],
    }),
    resetMatchdays: builder.mutation({
      query: (id) => ({
        url: `${MATCHDAYS_URL}/reset`,
        method: "PATCH",
      }),
      invalidatesTags: ["Matchday"],
    }),
    editMatchday: builder.mutation({
      query: ({ id, ...rest }) => ({
        url: `${MATCHDAYS_URL}/${id}`,
        method: "PATCH",
        body: rest,
      }),
      invalidatesTags: ["Matchday"],
    }),
    getCurrentMatchday: builder.query({
      query: () => ({
        url: `${MATCHDAYS_URL}/current`,
      }),
      providesTags: ["Matchday"]
    }),
    deleteMatchday: builder.mutation({
      query: (id) => ({
        url: `${MATCHDAYS_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Matchday"],
    }),
    updateMatchdayData: builder.mutation({
      query: (id) => ({
        url: `${MATCHDAYS_URL}/updateMdData/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Matchday"],
    }),
    getMaxId: builder.query({
      query: () => ({
        url: `${MATCHDAYS_URL}/data/max`,
        method: "GET",
      }),
    }),
    endMatchdayData: builder.mutation({
      query: (id) => ({
        url: `${MATCHDAYS_URL}/endmatchday/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Matchday"],
    }),
    getMatchdayMaxNMin: builder.query({
      query: () => ({
        url: `${MATCHDAYS_URL}/min-max`
      }),
      providesTags: ["Matchday"]
    })
  }),
});

export const {
  useEndMatchdayDataMutation,
  useUpdateMatchdayDataMutation,
  useGetMaxIdQuery,
  useGetMatchdaysQuery,
  useGetMatchdayQuery,
  useAddMatchdayMutation,
  useStartMatchdayMutation,
  useEditMatchdayMutation,
  useDeleteMatchdayMutation,
  useResetMatchdaysMutation,
  useGetCurrentMatchdayQuery,
  useGetMatchdayMaxNMinQuery
} = matchdayApiSlice;
