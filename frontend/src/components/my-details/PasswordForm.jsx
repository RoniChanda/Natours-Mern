import { useState } from "react";

import { useUpdatePasswordMutation } from "../../redux/apis/userApi";
import Alert from "../ui/Alert";
import FormContainer from "../form/FormContainer";
import Input from "../form/Input";

export default function PasswordForm() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    password: "",
    passwordConfirm: "",
  });
  const [updatePassword, { isLoading, data, error }] =
    useUpdatePasswordMutation();

  const inputHandler = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    updatePassword(formData)
      .unwrap()
      .finally(() =>
        setFormData({ password: "", currentPassword: "", passwordConfirm: "" })
      );
  };

  let alert;
  if (error) {
    alert = <Alert type="error" msg={error.data?.message || error.error} />;
  } else if (data?.status === "SUCCESS") {
    alert = <Alert type="success" msg="Password updated successfully!" />;
  }

  return (
    <FormContainer
      className="user-view__form-container"
      heading="Password change"
      isLoading={isLoading}
      formClass="form-user-settings"
      onSubmit={submitHandler}
    >
      {alert}
      <Input
        label="Current password"
        required
        name="currentPassword"
        type="password"
        value={formData.currentPassword}
        onChange={inputHandler}
      />
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

      <div className="form__group right">
        <button type="submit" className="btn btn--small btn--green">
          Save password
        </button>
      </div>
    </FormContainer>
  );
}
