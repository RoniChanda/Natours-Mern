import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const tourApi = createApi({
  reducerPath: "tours",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/tours`,
    credentials: "include", // for cookies
  }),
  endpoints: (builder) => ({
    fetchAllTours: builder.query({
      query: () => ({
        url: "/",
        method: "GET",
      }),
    }),
    fetchTourDetails: builder.query({
      query: (id) => ({
        url: `/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useFetchAllToursQuery, useFetchTourDetailsQuery } = tourApi;
