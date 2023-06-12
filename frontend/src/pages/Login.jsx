import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import {
  useForgotPasswordMutation,
  useLoginMutation,
} from "../redux/apis/userApi";
import { isLoggedIn } from "../redux/slices/authSlice";
import Alert from "../components/ui/Alert";
import Container from "../components/ui/Container";
import FormContainer from "../components/form/FormContainer";
import Input from "../components/form/Input";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [
    login,
    { isLoading: loginLoading, data: loginData, error: loginError },
  ] = useLoginMutation();
  const [
    forgotPassword,
    {
      isLoading: forgotPasswordLoading,
      error: forgotPasswordError,
      data: forgotPasswordData,
    },
  ] = useForgotPasswordMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (loginData && loginData.status === "SUCCESS") {
      dispatch(isLoggedIn(loginData.data.user));
      navigate("/");
    }
  }, [loginData, dispatch, navigate]);

  const inputHandler = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    login(formData);
  };

  const error = loginError || forgotPasswordError;
  let alert;
  if (error) {
    alert = <Alert type="error" msg={error.data?.message || error.error} />;
  } else if (forgotPasswordData?.status === "SUCCESS") {
    alert = (
      <Alert
        type="success"
        msg={`Reset link sent to your email: ${formData.email}`}
      />
    );
  }

  return (
    <Container>
      {alert}
      <FormContainer
        className="login-form"
        heading="Log into your account"
        isLoading={loginLoading || forgotPasswordLoading}
        onSubmit={submitHandler}
      >
        <Input
          label="Email address"
          required
          name="email"
          type="email"
          onChange={inputHandler}
          value={formData.email}
        />
        <Input
          groupClass="ma-bt-md"
          label="Password"
          required
          name="password"
          type="password"
          onChange={inputHandler}
          value={formData.password}
        />
        <div
          className="form__group"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <button type="submit" className="btn btn--green">
            Login
          </button>
          <button
            type="button"
            className="nav__el"
            style={{ color: "#000" }}
            onClick={() => forgotPassword(formData.email)}
          >
            Forgot Password?
          </button>
        </div>
      </FormContainer>
    </Container>
  );
}
