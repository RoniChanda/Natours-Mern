import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";

import { tourApi } from "./apis/tourApi";
import { userApi } from "./apis/userApi";
import { bookingApi } from "./apis/bookingApi";
import { authReducer } from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    [tourApi.reducerPath]: tourApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [bookingApi.reducerPath]: bookingApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware(),
    tourApi.middleware,
    userApi.middleware,
    bookingApi.middleware,
  ],
});

setupListeners(store.dispatch);
