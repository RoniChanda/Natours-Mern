import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { useUpdateMeMutation } from "../../redux/apis/userApi";
import Alert from "../ui/Alert";
import { checkValidity } from "../../redux/slices/authSlice";
import FormContainer from "../form/FormContainer";
import Input from "../form/Input";

export default function DetailsForm({ name, email, photo }) {
  const [updateMe, { isLoading, data, error }] = useUpdateMeMutation();
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    photo: null,
  });
  const [photoName, setPhotoName] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    if (name && email) {
      setFormData((prevState) => ({ ...prevState, name, email, photo }));
    }
  }, [name, email, photo]);

  const inputHandler = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const imageHandler = (e) => {
    setFormData((prevState) => ({ ...prevState, photo: e.target.files[0] }));
    setPhotoName(e.target.files[0].name);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("name", formData.name);
    form.append("email", formData.email);
    form.append("photo", formData.photo);

    updateMe(form)
      .unwrap()
      .then(() => {
        dispatch(checkValidity());
        setPhotoName("");
      });
  };

  let alert;
  if (error) {
    alert = <Alert type="error" msg={error.data?.message || error.error} />;
  } else if (data?.status === "SUCCESS") {
    alert = <Alert type="success" msg="Data updated successfully!" />;
  }

  return (
    <FormContainer
      className="user-view__form-container"
      heading="Your account settings"
      isLoading={isLoading}
      formClass="form-user-data"
      onSubmit={submitHandler}
    >
      {alert}
      <Input
        label="Name"
        required
        name="name"
        type="text"
        value={formData.name}
        onChange={inputHandler}
      />
      <Input
        groupClass="ma-bt-md"
        label="Email address"
        required
        name="email"
        type="email"
        value={formData.email}
        onChange={inputHandler}
      />

      <div className="form__group form__photo-upload">
        <img className="form__user-photo" src={photo} alt="User photo" />
        <input
          className="form__upload"
          name="photo"
          id="photo"
          type="file"
          accept="image/*"
          onChange={imageHandler}
        />
        <label className="form__label" htmlFor="photo">
          Choose new photo
        </label>
        <span style={{ marginLeft: "1rem" }}>
          {photoName.length > 25 ? photoName.slice(0, 25) + "..." : photoName}
        </span>
      </div>
      <div className="form__group right">
        <button type="submit" className="btn btn--small btn--green">
          Save settings
        </button>
      </div>
    </FormContainer>
  );
}
