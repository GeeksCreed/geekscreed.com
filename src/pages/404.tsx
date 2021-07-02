import React, { Fragment } from "react";
import { Link } from "gatsby";
import { useTitle } from "hoofd";

import "../styles/404.scss";

const Custom404Page = () => {
  useTitle("Page not found");

  return (
    <Fragment>
      <main className="l-fullscreen">
        <section
          className="l-fullscreen__content"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <h1 className="m-404-title">404</h1>
          <p className="m-404-subtitle">Page not found</p>
          <p className="m-404-text">
            Unfortunately the page you were looking for could not be found.
          </p>
          <Link to="/" className="m-button outlined">
            Go to the home page
          </Link>
        </section>
      </main>
    </Fragment>
  );
};

export default Custom404Page;
