import React, { Fragment } from "react";
import { Link } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";

import TooltipWrapper from "./TooltipWrapper";

const PostCard = (props) => {
  const { post } = props;

  const { frontmatter } = post;

  const {
    tags,
    authors,
    title,
    published_at,
    feature_image,
    featured,
  } = frontmatter;

  const primary_author = authors?.length > 0 ? authors[0] : null;
  const primary_tag = tags?.length > 0 ? tags[0] : null;

  const imageData = getImage(feature_image);

  const cardContent = (
    <Link
      to={`/blog${post.fields.slug}`}
      className="m-article-card__info-link"
      aria-label={title}
    >
      <div>
        <h2
          className="m-article-card__title js-article-card-title"
          title={title}
        >
          {title}
        </h2>
      </div>
      <div className="m-article-card__timestamp">
        <span>{published_at}</span>
        <span>&bull;</span>
        <span>{post.timeToRead} min read</span>
      </div>
    </Link>
  );

  return (
    <article className="m-article-card  post">
      {/* {{#unless feature_image}}no-picture{{/unless}} */}
      <div className="m-article-card__picture">
        <Link
          to={`/blog${post.fields.slug}`}
          className="m-article-card__picture-link"
          aria-hidden="true"
          tabIndex={-1}
        >
          <GatsbyImage
            className="m-article-card__picture-background"
            loading="lazy"
            image={imageData}
            alt=""
          />
        </Link>
        {primary_author && (<Link
          to={`/author/${primary_author.id}`}
          className="m-article-card__author js-tooltip"
          aria-label={primary_author.name}
        >
          <Fragment>
            {/* data-tippy-content="{{t "Posted by"}} {{primary_author.name}} {{authors autolink="false" from="2" prefix=(t "Among with") separator=" , "}}" */}
            {/* {{#if primary_author.profile_image}} */}
            {/* {{else}} */}
            {/* <div style="background-image: url({{asset "images/default-avatar-square-small.jpg"}});"></div> */}
            {/* {{/if}} */}
          </Fragment>
          <TooltipWrapper content={`Posted by ${primary_author.name}`}>
            <div
              style={{
                backgroundImage: `url(${
                  primary_author.profile_image ||
                  "/assets/images/default-avatar-square-small.jpg"
                })`,
              }}
            />
          </TooltipWrapper>
        </Link>
        )}
        {featured && (
          <Link
            to={`/blog${post.fields.slug}`}
            className="m-article-card__featured js-tooltip"
            aria-label="Featured"
          >
            {/* 
            data-tippy-content="{{t "Featured"}}" 
            */}
            <span className="icon-star" aria-hidden="true"></span>
          </Link>
        )}
      </div>
      {primary_tag ? (
        <div className="m-article-card__info">
          <Link to={`/tag/${primary_tag.id}`} className="m-article-card__tag">
            {primary_tag.name}
          </Link>
          {cardContent}
        </div>
      ) : (
        <div className="m-article-card__info no-tag">{cardContent}</div>
      )}
    </article>
  );
};

{
  /* <div className="m-recommended-slider__item glide__slide">
    </div> */
}

export default PostCard;
