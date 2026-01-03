import { apiSlice } from "./apiSlice";
const TABLES_URL = "/api/standings";

export const tableApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getOverallTable: builder.query({
            query: () => ({
                url: `${TABLES_URL}`
            }),
            providesTags: ['Table']
        }),
        getWeeklyTables: builder.query({
            query: () => ({
                url: `${TABLES_URL}/matchdays`
            }),
            providesTags: ['Table']
        }),
        getSingleWeeklyTable: builder.query({
            query: (id) => ({
                url: `${TABLES_URL}/matchdays/${id}`
            }),
            providesTags: ['Table']
        }),
        getHighestScoringEntrant: builder.query({
            query: () => ({
                url: `${TABLES_URL}/weekly-highest`
            }),
            providesTags: ['Table']
        })
    })
})

export const {
    useGetOverallTableQuery,
    useGetWeeklyTablesQuery,
    useGetSingleWeeklyTableQuery,
    useGetHighestScoringEntrantQuery
} = tableApiSlice