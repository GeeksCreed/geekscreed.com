import React, { Fragment } from "react";
import { graphql } from "gatsby";
import { useTitle } from "hoofd";

import HeroImage from "../../components/HeroImage";
import PostCard from "../../components/PostCard";

const Author = (props) => {
  const { author, posts } = props.data;
  const length = posts.nodes.length;

  useTitle(`Posts by ${author.name}`);

  return (
    <Fragment>
      <main className="main-wrap">
        <HeroImage source={author.cover_image}>
          <div className="m-hero__content" data-aos="fade-down">
            <div
              className="m-hero-avatar"
              style={{
                backgroundImage: `url(${
                  author.profile_image ||
                  "/images/default-avatar-square-normal.jpg"
                })`,
              }}
            />

            <h1 className="m-hero-title">{author.name}</h1>

            {author.bio && <p className="m-hero-description">{author.bio}</p>}

            <div className="m-hero__meta">
              <ul className="m-hero-social">
                {author.website && (
                  <li>
                    <a
                      href={author.website}
                      target="_blank"
                      rel="noopener"
                      aria-label="Website"
                    >
                      {/* aria-label="{{t "Website"}}" */}
                      <span className="icon-globe"></span>
                    </a>
                  </li>
                )}
                {author.facebook && (
                  <li>
                    <a
                      href={`https://facebook.com/${author.facebook}`}
                      target="_blank"
                      rel="noopener"
                      aria-label="Facebook"
                    >
                      <span className="icon-facebook"></span>
                    </a>
                  </li>
                )}
                {author.twitter && (
                  <li>
                    <a
                      href={`https://twitter.com/${author.twitter}`}
                      target="_blank"
                      rel="noopener"
                      aria-label="Twitter"
                    >
                      <span className="icon-twitter"></span>
                    </a>
                  </li>
                )}
                {author.linkedin && (
                  <li>
                    <a
                      href={`https://linkedin.com/in/${author.linkedin}`}
                      target="_blank"
                      rel="noopener"
                      aria-label="Linkedin"
                    >
                      <span className="icon-linkedin"></span>
                    </a>
                  </li>
                )}
              </ul>

              <ul className="m-hero-stats">
                <li>
                  {length
                    ? `${length} ${length === 1 ? "post" : "posts"}`
                    : "No Posts"}
                </li>
                {author.location && (
                  <Fragment>
                    <li>&bull;</li>
                    <li>{author.location}</li>
                  </Fragment>
                )}
              </ul>
            </div>
          </div>
        </HeroImage>

        <div className="l-content">
          <div className="l-wrapper" data-aos="fade-up" data-aos-delay="300">
            <div className="l-grid centered">
              {posts.nodes.map((post) => (
                <PostCard post={post} key={post.fields.slug} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </Fragment>
  );
};

export default Author;

export const query = graphql`
  query BlogPostsByAuthor($id: String!) {
    posts: allMarkdownRemark(
      filter: {
        frontmatter: {
          draft: { ne: true }
          authors: { elemMatch: { id: { eq: $id } } }
        }
      }
      sort: { fields: frontmatter___published_at, order: DESC }
    ) {
      nodes {
        ...PostCard
      }
    }
    author: authorsYaml(id: { eq: $id }) {
      id
      name
      bio
      location
      website
      twitter
      linkedin
      profile_image
      cover_image
    }
  }
`;
