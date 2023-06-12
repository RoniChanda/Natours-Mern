export default function Loader({ style, className }) {
  return (
    <img
      src="/img/spinner.gif"
      alt="Spinner"
      height="35"
      width="35"
      style={style}
      className={className}
    />
  );
}
