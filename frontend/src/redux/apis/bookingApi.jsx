import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const bookingApi = createApi({
  reducerPath: "bookings",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/bookings`,
    credentials: "include", // for cookies
  }),
  endpoints: (builder) => ({
    checkout: builder.mutation({
      query: (tourId) => ({
        url: `/checkout-session/${tourId}`,
        method: "POST",
        body: {},
      }),
    }),
  }),
});

export const { useCheckoutMutation } = bookingApi;
