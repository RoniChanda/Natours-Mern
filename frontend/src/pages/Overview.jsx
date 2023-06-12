import Card from "../components/ui/Card";
import { useFetchAllToursQuery } from "../redux/apis/tourApi";

import Loader from "../components/ui/Loader";
import Alert from "../components/ui/Alert";
import Container from "../components/ui/Container";
import { Fragment } from "react";

export default function Overview() {
  const { isLoading, data, error } = useFetchAllToursQuery();

  let content;
  if (isLoading) {
    content = <Loader />;
  } else if (error) {
    content = <Alert type="error" msg={error.data?.message || error.error} />;
  } else {
    const tours = data.data.tours;
    const contentBody = tours.map((tour) => <Card key={tour.id} tour={tour} />);
    content = (
      <Container>
        <div className="card-container">{contentBody}</div>
      </Container>
    );
  }

  return <Fragment>{content}</Fragment>;
}
