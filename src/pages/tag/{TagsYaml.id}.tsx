import React, { Fragment } from "react";
import { useTitle } from "hoofd";

import HeroImage from "../../components/HeroImage";
import PostCard from "../../components/PostCard";
import { graphql } from "gatsby";

const Tag = (props) => {
  const { tag, posts } = props.data;

  const length = posts.nodes.length;

  useTitle(`Posts tagged under ${tag.name}`);

  return (
    <Fragment>
      <main className="main-wrap">
        <HeroImage source={tag.feature_image}>
          <div className="m-hero__content" data-aos="fade-down">
            <h1 className="m-hero-title bigger">{tag.name}</h1>
            {tag.description && (
              <p className="m-hero-description">{tag.description}</p>
            )}
            <div className="m-hero__meta">
              <ul className="m-hero-stats">
                <li>
                  {/* {{plural ../pagination.total empty=(t "No posts") singular=(t "1 post") plural=(t "% posts")}} {{t "with this tag"}} */}
                  {length
                    ? `${length} ${
                        length === 1 ? "post" : "posts"
                      } with this tag`
                    : "No Posts"}
                </li>
              </ul>
            </div>
          </div>
        </HeroImage>

        <div className="l-content">
          <div className="l-wrapper" data-aos="fade-up" data-aos-delay="300">
            <div className="l-grid centered">
              {posts.nodes.map((post) => (
                <PostCard key={post.fields.slug} post={post} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </Fragment>
  );
};

export default Tag;

export const query = graphql`
  query BlogPostsUnderTag($id: String!) {
    posts: allMarkdownRemark(
      filter: {
        frontmatter: {
          tags: { elemMatch: { id: { eq: $id } } }
          draft: { ne: true }
        }
      }
      sort: { fields: frontmatter___published_at, order: DESC }
    ) {
      nodes {
        ...PostCard
      }
    }
    tag: tagsYaml(id: { eq: $id }) {
      id
      description
      name
      slug
      feature_image
    }
  }
`;
