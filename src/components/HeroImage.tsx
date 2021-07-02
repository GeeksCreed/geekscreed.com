import React from "react";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import classnames from "classnames";

interface Props {
  source: any;
  post?: boolean;
  children?: React.ReactNode;
}

const HeroImage = (props: Props) => {
  const { source, post, children } = props;

  const imageData = getImage(source);

  return source ? (
    <section className="m-hero with-picture" data-aos="fade">
      <div
        className={classnames("m-hero__picture", {
          "in-post": post,
        })}
      >
        <GatsbyImage image={imageData} loading="eager" alt="Plant" />
      </div>

      {children}
    </section>
  ) : (
    <section className="m-hero no-picture" data-aos="fade">
      {children}
    </section>
  );
};

export default HeroImage;
