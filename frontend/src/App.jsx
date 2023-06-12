import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useLayoutEffect, useState } from "react";
import { useDispatch } from "react-redux";

import Overview from "./pages/Overview";
import RootLayout from "./components/layout/RootLayout";
import TourDetails from "./pages/TourDetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PasswordReset from "./pages/PasswordReset";
import ProtectedRoute from "./components/ui/ProtectedRoute";
import Error from "./components/layout/Error";
import { checkValidity } from "./redux/slices/authSlice";
import MyDetails from "./pages/MyDetails";

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    setIsLoading(true);
    dispatch(checkValidity()).then(() => setIsLoading(false));
  }, [dispatch]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <Error />,
      children: [
        {
          index: true,
          element: <Overview />,
        },
        {
          path: "tours/:id/:name",
          element: <TourDetails />,
        },
        {
          path: "login",
          element: (
            <ProtectedRoute reverse>
              <Login />
            </ProtectedRoute>
          ),
        },
        {
          path: "signup",
          element: (
            <ProtectedRoute reverse>
              <Signup />
            </ProtectedRoute>
          ),
        },

        {
          path: "me",
          element: (
            <ProtectedRoute>
              <MyDetails />
            </ProtectedRoute>
          ),
        },
      ],
    },
    {
      path: "/passwordReset/:token",
      element: <PasswordReset />,
    },
  ]);

  return !isLoading && <RouterProvider router={router} />;
}
