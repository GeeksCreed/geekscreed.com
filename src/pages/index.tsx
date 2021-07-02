import React, { Fragment } from "react";
import { graphql } from "gatsby";
import { useTitle } from "hoofd";

import HeroImage from "../components/HeroImage";
import PostCard from "../components/PostCard";
import FeaturedPosts from "../components/FeaturedPosts";

import "../styles/home.scss";
import "../styles/listing.scss";

export default function Home(props) {
  const { posts, featuredPosts, coverImage, site } = props.data;

  const { siteMetadata } = site;

  useTitle(siteMetadata.description);

  return (
    <Fragment>
      <main className="main-wrap">
        <HeroImage source={coverImage}>
          <div className="m-hero__content" data-aos="fade-down">
            <h1 className="m-hero-title bigger">{siteMetadata.title}</h1>
            <p className="m-hero-description bigger">
              {siteMetadata.description}
            </p>
          </div>
        </HeroImage>
        <div className="l-content">
          <div className="l-wrapper" data-aos="fade-up" data-aos-delay="300">
            <div className="l-grid centered">
              {featuredPosts.edges.length > 0 ? (
                <FeaturedPosts posts={featuredPosts.edges} />
              ) : null}
              {posts.edges.map(({ node: post }) => (
                <PostCard post={post} key={post.fields.slug} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </Fragment>
  );
}

export const query = graphql`
  query IndexPage {
    coverImage: file(relativePath: { eq: "images/cover-image.jpg" }) {
      childImageSharp {
        gatsbyImageData(
          width: 2000
          layout: CONSTRAINED
          placeholder: DOMINANT_COLOR
          quality: 100
        )
      }
    }

    site {
      siteMetadata {
        description
        title
      }
    }

    featuredPosts: allMarkdownRemark(
      filter: { frontmatter: { featured: { eq: true }, draft: { ne: true } } }
      sort: { fields: frontmatter___published_at, order: DESC }
      limit: 5
    ) {
      edges {
        node {
          ...PostCard
        }
      }
    }

    posts: allMarkdownRemark(
      limit: 10
      filter: { frontmatter: { draft: { ne: true } } }
      sort: { fields: frontmatter___published_at, order: DESC }
    ) {
      edges {
        node {
          ...PostCard
        }
      }
    }
  }
`;
