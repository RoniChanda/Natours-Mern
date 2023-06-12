import { createSlice } from "@reduxjs/toolkit";

// thunk action creator
export const checkValidity = () => async (dispatch) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/users/check-cookie-validity`,
      { credentials: "include" }
    );

    const resData = await response.json();

    if (resData.status === "SUCCESS") {
      dispatch(authSlice.actions.isLoggedIn(resData.data.user));
    } else if (resData.status === "FAIL") {
      dispatch(authSlice.actions.isLoggedOut());
    }
    return resData;
  } catch (error) {
    console.error(error);
  }
};

const initialState = {
  isLoading: false,
  user: null,
  isAuth: localStorage.getItem("isAuth") || false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    isLoggedIn(state, action) {
      localStorage.setItem("isAuth", true);
      state.isAuth = true;
      state.user = action.payload;
    },
    isLoggedOut(state) {
      localStorage.removeItem("isAuth");
      state.isAuth = false;
      state.user = null;
    },
  },
});

export const { isLoggedIn, isLoggedOut } = authSlice.actions;
export const authReducer = authSlice.reducer;
