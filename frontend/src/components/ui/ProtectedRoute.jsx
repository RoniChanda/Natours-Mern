import { Fragment, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

import { checkValidity } from "../../redux/slices/authSlice";

export default function ProtectedRoute({ children, reverse }) {
  const { isAuth } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    dispatch(checkValidity());
  }, [dispatch]);

  let content;
  if (reverse) {
    content = isAuth ? <Navigate to="/" /> : children;
  } else {
    content = isAuth ? children : <Navigate to="/login" />;
  }

  return <Fragment>{content}</Fragment>;
}
