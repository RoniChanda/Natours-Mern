import Loader from "../ui/Loader";

export default function FormContainer({
  children,
  isLoading,
  className,
  heading,
  formClass,
  onSubmit,
}) {
  return (
    <div className={className || undefined}>
      <h2
        className="heading-secondary ma-bt-md"
        style={{ display: "flex", alignItems: "center" }}
      >
        {heading}
        {isLoading && <Loader style={{ marginLeft: "1rem" }} />}
      </h2>
      <form className={`form ${formClass || undefined}`} onSubmit={onSubmit}>
        {children}
      </form>
    </div>
  );
}
