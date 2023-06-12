import { useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";

import { useCheckoutMutation } from "../../redux/apis/bookingApi";
import Alert from "../ui/Alert";
import Loader from "../ui/Loader";
import { useEffect } from "react";

export default function TourCta({ pictures, duration, tourId }) {
  const { isAuth } = useSelector((state) => state.auth);
  const [checkout, { isLoading, data, error }] = useCheckoutMutation();
  const [searchParams] = useSearchParams();
  const paymentStatus = searchParams.get("status");

  useEffect(() => {
    if (data?.session?.url) {
      window.location.href = data.session.url;
    }
  }, [data]);

  let alert;
  if (error) {
    alert = <Alert type="error" msg={error.data?.message || error.error} />;
  } else if (paymentStatus) {
    alert = (
      <Alert
        type={paymentStatus === "success" ? "success" : "error"}
        msg={
          paymentStatus === "success"
            ? "Payment successful!"
            : "Payment failed!"
        }
      />
    );
  }

  return (
    <section className="section-cta">
      {alert}
      <div className="cta">
        <div className="cta__img cta__img--logo">
          <img src="/img/logo-white.png" alt="Natours logo" />
        </div>
        <img
          className="cta__img cta__img--1"
          src={`${import.meta.env.VITE_IMAGE_URL}/tours/${pictures[1]}`}
          alt="Tour-pic-1"
        />
        <img
          className="cta__img cta__img--2"
          src={`${import.meta.env.VITE_IMAGE_URL}/tours/${pictures[2]}`}
          alt="Tour-pic-2"
        />
        <div className="cta__content">
          <h2 className="heading-secondary">What are you waiting for?</h2>
          <p className="cta__text">
            {duration} days. 1 adventure. Infinite memories. Make it yours
            today!
          </p>
          {isAuth ? (
            <div style={{ display: "flex", alignItems: "center" }}>
              {isLoading && <Loader style={{ marginRight: "1rem" }} />}
              <button
                type="button"
                className="btn btn--green span-all-rows"
                onClick={() => checkout(tourId)}
              >
                Book tour now!
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn--green span-all-rows">
              Login to book tour
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
