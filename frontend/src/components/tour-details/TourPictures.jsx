export default function TourPictures({ pictures, name }) {
  return (
    <section className="section-pictures">
      {pictures.map((pic, index) => (
        <div key={index} className="picture-box">
          <img
            className={`picture-box__img picture-box__img--${index + 1}`}
            src={`${import.meta.env.VITE_IMAGE_URL}/tours/${pic}`}
            alt={`${name} ${index + 1}`}
          />
        </div>
      ))}
    </section>
  );
}
