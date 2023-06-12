import ReviewsCard from "./ReviewsCard";

export default function TourReviews({ reviews }) {
  return (
    <section className="section-reviews">
      <div className="reviews">
        {reviews.map((review) => (
          <ReviewsCard key={review.id} review={review} />
        ))}
      </div>
    </section>
  );
}
