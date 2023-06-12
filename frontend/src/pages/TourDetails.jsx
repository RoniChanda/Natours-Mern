import { Fragment } from "react";
import { useParams } from "react-router-dom";

import { useFetchTourDetailsQuery } from "../redux/apis/tourApi";
import TourHeader from "../components/tour-details/TourHeader";
import TourDescription from "../components/tour-details/TourDescription";
import TourPictures from "../components/tour-details/TourPictures";
import { convertDate } from "../utils/date";
import TourCta from "../components/tour-details/TourCta";
import TourReviews from "../components/tour-details/TourReviews";
import TourMap from "../components/tour-details/TourMap";
import Loader from "../components/ui/Loader";
import Alert from "../components/ui/Alert";
import Container from "../components/ui/Container";

export default function TourDetails() {
  const { id } = useParams();
  const { isLoading, data, error } = useFetchTourDetailsQuery(id);

  let content;
  if (isLoading) {
    content = <Loader />;
  } else if (error) {
    content = <Alert type="error" msg={error.data?.message || error.error} />;
  } else {
    const tour = data.data.tour;

    content = (
      <Container noMain>
        <TourHeader
          tour={tour}
          imageCover={tour.imageCover}
          name={tour.name}
          duration={tour.duration}
          startLocation={tour.startLocation}
        />
        <TourDescription
          startDate={convertDate(tour.startDates[0])}
          difficulty={tour.difficulty}
          maxGroupSize={tour.maxGroupSize}
          ratingsAverage={tour.ratingsAverage}
          guides={tour.guides}
          name={tour.name}
          description={tour.description}
        />
        <TourPictures pictures={tour.images} name={tour.name} />
        <TourMap locations={tour.locations} />
        <TourReviews reviews={tour.reviews} />
        <TourCta
          pictures={tour.images}
          duration={tour.duration}
          tourId={tour.id}
        />
      </Container>
    );
  }

  return <Fragment>{content}</Fragment>;
}
