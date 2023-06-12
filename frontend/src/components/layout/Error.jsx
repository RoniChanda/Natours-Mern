import { Link, useRouteError } from "react-router-dom";

export default function Error() {
  const error = useRouteError();

  let errorContent;
  if (error.status === 404) {
    errorContent = "Page not found!";
  } else {
    console.error(error);
    errorContent = "Please try again later!";
  }

  return (
    <div className="error">
      <div className="error__title">
        <h2 className="heading-secondary heading-secondary--error">
          Uh oh! Something went wrong!
        </h2>
        <h2 className="error__emoji"></h2>
      </div>
      <div className="error__msg">{errorContent}</div>

      {error.status === 404 && (
        <Link to="/" className="btn btn--green btn--small">
          Back to Home
        </Link>
      )}
    </div>
  );
}
