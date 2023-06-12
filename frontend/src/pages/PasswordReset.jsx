import { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

import { useResetPasswordMutation } from "../redux/apis/userApi";
import { isLoggedIn } from "../redux/slices/authSlice";
import Alert from "../components/ui/Alert";
import Container from "../components/ui/Container";
import FormContainer from "../components/form/FormContainer";
import Input from "../components/form/Input";

export default function Login() {
  const [formData, setFormData] = useState({
    password: "",
    passwordConfirm: "",
  });
  const [resetPassword, { isLoading, error, data }] =
    useResetPasswordMutation();
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (data && data.status === "SUCCESS") {
      dispatch(isLoggedIn(data.data.user));
      navigate("/");
    }
  }, [data, dispatch, navigate]);

  const inputHandler = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(token);
    resetPassword({ formData, token });
  };

  return (
    <Fragment>
      <header className="header">
        <div />
        <div className="header__logo">
          <img src="/img/logo-white.png" alt="Natours logo" />
        </div>
        <div />
      </header>
      <Container>
        {error && (
          <Alert type="error" msg={error.data?.message || error.error} />
        )}
        <FormContainer
          className="login-form"
          heading="Reset Password"
          isLoading={isLoading}
          onSubmit={submitHandler}
        >
          <Input
            label="New password"
            required
            name="password"
            type="password"
            value={formData.password}
            onChange={inputHandler}
          />
          <Input
            groupClass="ma-bt-lg"
            label="Confirm password"
            required
            name="passwordConfirm"
            type="password"
            value={formData.passwordConfirm}
            onChange={inputHandler}
          />
          <div className="form__group">
            <button type="submit" className="btn btn--green">
              Reset
            </button>
          </div>
        </FormContainer>
      </Container>
    </Fragment>
  );
}
