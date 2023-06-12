import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { useSignupMutation } from "../redux/apis/userApi";
import { isLoggedIn } from "../redux/slices/authSlice";
import Alert from "../components/ui/Alert";
import Container from "../components/ui/Container";
import FormContainer from "../components/form/FormContainer";
import Input from "../components/form/Input";

export default function Login() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [signup, { isLoading, data, error }] = useSignupMutation();
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
    signup(formData);
  };

  return (
    <Container>
      {error && <Alert type="error" msg={error.data?.message || error.error} />}
      <FormContainer
        className="login-form"
        heading="Create new account"
        isLoading={isLoading}
        onSubmit={submitHandler}
      >
        <Input
          label="Name"
          required
          name="name"
          type="text"
          placeholder="Your name"
          value={formData.name}
          onChange={inputHandler}
        />
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
            Sign up
          </button>
        </div>
      </FormContainer>
    </Container>
  );
}
