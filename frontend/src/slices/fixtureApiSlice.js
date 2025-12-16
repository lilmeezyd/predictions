import { apiSlice } from "./apiSlice";
const FIXTURES_URL = "/api/fixtures";

export const fixtureApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFixtures: builder.query({
      query: () => ({
        url: `${FIXTURES_URL}`,
      }),
      providesTags: ['Fixture']
    }), 
    getFixture: builder.query({
      query: (id) => ({
        url: `${FIXTURES_URL}/${id}`
      })
    }),
    addFixture: builder.mutation({
      query: (data) => ({
        url: `${FIXTURES_URL}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['Fixture']
    }),
    updateFixture: builder.mutation({
      query: ({id, ...rest}) => ({
        url: `${FIXTURES_URL}/${id}`,
        method: "PATCH",
        body: rest,
      }),
      invalidatesTags: ['Fixture']
    }),
    deleteFixture: builder.mutation({
      query: (id) => ({
        url: `${FIXTURES_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ['Fixture']
    }),
    startMatch: builder.mutation({
      query: (id) => ({
        url: `${FIXTURES_URL}/${id}/start`,
        method: 'PATCH'
      }),
      invalidatesTags: ['Fixture']
    }),
    endMatch: builder.mutation({
      query: (id) => ({
        url: `${FIXTURES_URL}/${id}/end`,
        method: 'PATCH'
      }),
      invalidatesTags: ['Fixture']
    }),
    resetMatch: builder.mutation({
      query: (id) => ({
        url: `${FIXTURES_URL}/${id}/reset`,
        method: 'PATCH'
      }),
      invalidatesTags: ['Fixture']
    }),
    editMatchScores: builder.mutation({
      query: ({id, ...rest}) => {
        return {
        url: `${FIXTURES_URL}/${id}/scores`,
        method: 'PATCH',
        body: rest
        }
      },
      invalidatesTags: ['Fixture']
    }),
  }),
});

export const {
  useGetFixturesQuery,
  useGetFixtureQuery,
  useAddFixtureMutation,
  useUpdateFixtureMutation,
  useDeleteFixtureMutation,
  useEditMatchScoresMutation,
  useStartMatchMutation,
  useEndMatchMutation,
  useResetMatchMutation
} = fixtureApiSlice;
