import { useSelector } from "react-redux";

import SideNav from "../components/my-details/SideNav";
import DetailsForm from "../components/my-details/DetailsForm";
import PasswordForm from "../components/my-details/PasswordForm";
import Container from "../components/ui/Container";

export default function MyDetails() {
  const { user } = useSelector((state) => state.auth);

  return (
    user && (
      <Container>
        <div className="user-view">
          <SideNav role={user.role} />
          <div className="user-view__content">
            <DetailsForm
              name={user.name}
              email={user.email}
              photo={user.photo}
            />
            <div className="line">&nbsp;</div>
            <PasswordForm />
          </div>
        </div>
      </Container>
    )
  );
}
