import { useEffect, useState } from "react";

export default function Alert({ type, msg }) {
  const [showAlert, setShowAlert] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowAlert(false), 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    showAlert && (
      <div className={`alert alert--${type}`}>
        {msg || (type === "error" && "Something went very wrong!")}
      </div>
    )
  );
}
