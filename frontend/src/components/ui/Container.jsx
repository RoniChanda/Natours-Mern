import { Fragment } from "react";
import Footer from "../layout/Footer";

export default function Container({ children, noMain }) {
  return (
    <Fragment>
      <main className={!noMain ? "main" : undefined}>{children}</main>
      <Footer />
    </Fragment>
  );
}
