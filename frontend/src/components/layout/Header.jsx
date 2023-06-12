import { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Search from "../ui/Search";
import { useLogoutMutation } from "../../redux/apis/userApi";
import { isLoggedOut } from "../../redux/slices/authSlice";
import Alert from "../ui/Alert";

export default function Header() {
  const { user, isAuth } = useSelector((state) => state.auth);
  const [logout, { error, data }] = useLogoutMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (data && data.status === "SUCCESS") {
      dispatch(isLoggedOut());
    }
  }, [dispatch, data]);

  return (
    <header className="header">
      {error && <Alert type="error" msg="Error logging out. Try again!" />}
      <nav className="nav nav--tours">
        <Link to="/" className="nav__el">
          All tours
        </Link>
        <Search />
      </nav>
      <div className="header__logo">
        <img src="/img/logo-white.png" alt="Natours logo" />
      </div>
      <nav className="nav nav--user">
        {isAuth && user ? (
          <Fragment>
            <button type="button" className="nav__el" onClick={() => logout()}>
              Log out
            </button>
            <Link to="/me" className="nav__el">
              <img src={user.photo} alt={user.name} className="nav__user-img" />
              <span>Hi, {user.name.split(" ")[0]}!</span>
            </Link>
          </Fragment>
        ) : (
          <Fragment>
            <Link to="/login" className="nav__el">
              Log in
            </Link>
            <Link to="/signup" className="nav__el nav__el--cta">
              Sign up
            </Link>
          </Fragment>
        )}
      </nav>
    </header>
  );
}
