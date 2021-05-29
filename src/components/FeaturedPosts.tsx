import React, { FC, Fragment, useEffect } from "react";
import classnames from "classnames";
import { Link } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import Glide, {
  Breakpoints,
  Controls,
  Swipe,
} from "@glidejs/glide/dist/glide.modular.esm";
import shave from "shave";

interface Props {
  posts: any[];
}

const FeaturedPosts: FC<Props> = (props) => {
  const { posts } = props;

  useEffect(() => {
    const numSlides = posts.length;

    const featuredSlider = new Glide(".js-featured-slider", {
      type: "slider",
      rewind: false,
      gap: 0,
      swipeThreshold: false,
      dragThreshold: false,
      // direction: isRTL() ? "rtl" : "ltr",
      breakpoints: {
        768: {
          swipeThreshold: numSlides === 1 ? false : 80,
          dragThreshold: numSlides === 1 ? false : 120,
        },
      },
    });

    const ArrowDisabler = (Glide, Components) => {
      const controlClasses = {
        controls: "js-featured-slider-controls",
        backArrow: "js-featured-slider-previous",
        nextArrow: "js-featured-slider-next",
      };

      return {
        mount() {
          if (Glide.settings.rewind || numSlides === 1) {
            return;
          }

          Glide.on(["mount.after", "run"], () => {
            for (let controlItem of Components.Controls.items) {
              if (!controlItem.className.includes(controlClasses.controls)) {
                continue;
              }

              const left = controlItem.querySelector(
                `.${controlClasses.backArrow}`
              );

              if (left) {
                if (Glide.index === 0) {
                  left.setAttribute("disabled", "");
                } else {
                  left.removeAttribute("disabled");
                }
              }

              const right = controlItem.querySelector(
                `.${controlClasses.nextArrow}`
              );

              if (right) {
                const lastSlideIndex = Glide.settings.bound
                  ? Glide.index + (Glide.settings.perView - 1)
                  : Glide.index;

                if (lastSlideIndex === Components.Sizes.length - 1) {
                  right.setAttribute("disabled", "");
                } else {
                  right.removeAttribute("disabled");
                }
              }
            }
          });
        },
      };
    };

    featuredSlider.on("mount.after", () => {
      shave(".js-featured-article-title", 200);
    });

    featuredSlider.mount({ Controls, Swipe, Breakpoints, ArrowDisabler });
  }, []);

  return (
    <Fragment>
      <div className="m-featured-slider glide js-featured-slider">
        <div className="glide__track" data-glide-el="track">
          <div className="m-featured-slider__list glide__slides">
            {posts.map(({ node: post }) => {
              const { frontmatter } = post;

              const {
                tags,
                authors,
                title,
                published_at,
                feature_image,
              } = frontmatter;

              const primary_author = authors?.length > 0 ? authors[0] : null;
              const primary_tag = tags?.length > 0 ? tags[0] : null;

              const imageData = getImage(feature_image);

              return (
                <div
                  className="m-featured-slider__list__item glide__slide js-featured-slide"
                  key={post.fields.slug}
                >
                  <article
                    className={classnames("m-featured-article", {
                      "no-picture": !imageData,
                    })}
                  >
                    <div className="m-featured-article__picture">
                      {imageData && (
                        <Fragment>
                          {/* <div
                            id="featured-bg-{{id}}"
                            style={{
                              backgroundImage: `url(${post.feature_image})`,
                            }}
                          ></div> */}
                          <GatsbyImage
                            loading="lazy"
                            image={imageData}
                            alt=""
                          />
                        </Fragment>
                      )}
                    </div>
                    <div className="m-featured-article__meta">
                      {primary_author && (
                        <Link
                          to={`/author/${primary_author.id}`}
                          className="m-featured-article__author js-tooltip"
                          aria-label={primary_author.name}
                        >
                          {/*  data-tippy-content="{{t "Posted by"}} {{primary_author.name}} {{authors autolink="false" from="2" prefix=(t "Among with") separator=" , "}}" */}
                          <div
                            style={{
                              backgroundImage: `url(${
                                primary_author.profile_image ||
                                "/assets/images/default-avatar-square-small.jpg"
                                })`,
                            }}
                          />
                        </Link>
                      )}
                      {primary_tag && (
                        <Link
                          to={`/tag/${primary_tag.id}`}
                          className="m-featured-article__tag"
                        >
                          {primary_tag.name}
                        </Link>
                      )}
                    </div>
                    <div className="m-featured-article__ribbon">
                      <span className="icon-star"></span>
                      <span>Featured</span>
                    </div>
                    <Link
                      to={`/blog${post.fields.slug}`}
                      className="m-featured-article__content"
                    >
                      <h2
                        className="m-featured-article__title js-featured-article-title"
                        title={title}
                      >
                        {title}
                      </h2>
                      <div className="m-featured-article__timestamp">
                        <span>{published_at}</span>
                        <span>&bull;</span>
                        <span>{post.timeToRead} min read</span>
                      </div>
                    </Link>
                  </article>
                </div>
              );
            })}
          </div>
        </div>
        <div
          data-glide-el="controls"
          className="glide__arrows js-featured-slider-controls"
        >
          <button
            data-glide-dir="<"
            className="m-icon-button in-featured-articles glide-prev js-featured-slider-previous"
            aria-label="Previous"
          >
            <span className="icon-arrow-left" aria-hidden="true"></span>
          </button>
          <button
            data-glide-dir=">"
            className="m-icon-button in-featured-articles glide-next js-featured-slider-next"
            aria-label="Next"
          >
            <span className="icon-arrow-right" aria-hidden="true"></span>
          </button>
        </div>
      </div>
    </Fragment>
  );
};

export default FeaturedPosts;
