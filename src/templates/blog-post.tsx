import React, {
  useEffect,
  useState,
  useMemo,
  Fragment,
  useContext,
} from "react";
import { graphql, Link } from "gatsby";
import { useHead, useLink, useScript } from "hoofd";
import { getImage } from "gatsby-plugin-image";

import { useInView } from "react-intersection-observer";
import { DiscussionEmbed } from "disqus-react";

import PageProgressButton from "../components/PageProgressButton";
import HeroImage from "../components/HeroImage";
import RelatedPosts from "../components/RelatedPosts";
import TooltipWrapper from "../components/TooltipWrapper";

import ThemeContext from "../contexts/ThemeContext";

import "../styles/post.scss";

const loadPolyfills = async () => {
  if (typeof window.IntersectionObserver === "undefined") {
    await import("intersection-observer");
  }
};

const Post = (props) => {
  const { data } = props;

  const { post, relatedPosts, site } = data;

  const { siteUrl } = site.siteMetadata;

  const { tags, authors, published_at, feature_image } = post.frontmatter;

  const primary_author = authors?.length > 0 ? authors[0] : null;
  const primary_tag = tags?.length > 0 ? tags[0] : null;

  const [showContent, setShowContent] = useState(false);

  const [showComment, setShowComment] = useState(false);

  const theme = useContext(ThemeContext);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowContent(true);
    }, 1000);

    loadPolyfills();

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const { ref: tagsSectionRef, inView: tagsSectionInView } = useInView({
    triggerOnce: true,
  });

  let url = `${siteUrl}/blog${post.fields.slug}`;

  const title = post.frontmatter.title;

  const disqusShortName = process.env.GATSBY_DISQUS_NAME || "geekscreed";

  const disqusConfig = useMemo(
    () => ({
      identifier: "/blog" + post.fields.slug,
      title: title,
      url,
    }),
    [url]
  );

  const handleLoadCommentsClick = () => {
    setShowComment(true);
    window.scroll({
      top: window.scrollY + 100,
      behavior: "smooth",
    });
  };

  const imageData = getImage(post.frontmatter.feature_image);

  const heroImage = `${siteUrl}${imageData?.images?.fallback?.src}`;

  const articleLdJson = useMemo(() => {
    const json = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: title,
      image: [heroImage],
      datePublished: post.frontmatter.published_at,
      // dateModified: "2015-02-05T09:20:00+08:00",
    };
    return JSON.stringify(json);
  }, []);

  useHead({
    title: title,
    metas: [
      {
        name: "twitter:creator",
        content: primary_author.twitter && `@${primary_author.twitter}`,
      },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: url },
      { property: "og:type", content: "article" },
      { property: "og:title", content: title },
      { property: "og:description", content: post.excerpt },
      {
        property: "og:image",
        content: heroImage,
      },
    ],
  });

  useLink({ rel: "canonical", href: url });

  useLink({
    rel: "stylesheet",
    href: theme
      ? theme === "light"
        ? "/prism-themes/prism-coldark-cold.css"
        : "/prism-themes/prism-darcula.css"
      : "",
  });

  useScript({
    id: "article-ld-data",
    type: "application/ld+json",
    text: articleLdJson,
  });

  return (
    <Fragment>
      <main className="main-wrap">
        <article>
          <div className="l-content in-post">
            <HeroImage source={feature_image} post />
            <div
              className="l-wrapper in-post js-aos-wrapper"
              data-aos={showContent ? undefined : "fade-up"}
              data-aos-delay="300"
            >
              <div className="l-post-content js-progress-content">
                <header className="m-heading">
                  <h1 className="m-heading__title in-post">{title}</h1>
                  <div className="m-heading__meta">
                    {primary_tag && (
                      <Fragment>
                        <Link
                          to={`/tag/${primary_tag.slug}`}
                          className="m-heading__meta__tag"
                        >
                          {primary_tag.name}
                        </Link>
                        <span
                          className="m-heading__meta__divider"
                          aria-hidden="true"
                        >
                          &bull;
                        </span>
                      </Fragment>
                    )}
                    <span className="m-heading__meta__time">
                      {published_at}
                    </span>
                  </div>
                </header>
                <div className="pos-relative js-post-content">
                  <div dangerouslySetInnerHTML={{ __html: post.html }} />
                  <div className="m-share">
                    <div className="m-share__content js-sticky">
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
                        className="m-icon-button filled in-share"
                        target="_blank"
                        rel="noopener"
                        aria-label="Facebook"
                      >
                        <span
                          className="icon-facebook"
                          aria-hidden="true"
                        ></span>
                      </a>
                      <a
                        href={`https://twitter.com/intent/tweet?text=${title}&url=${url}`}
                        className="m-icon-button filled in-share"
                        target="_blank"
                        rel="noopener"
                        aria-label="Twitter"
                      >
                        <span
                          className="icon-twitter"
                          aria-hidden="true"
                        ></span>
                      </a>
                      <PageProgressButton />
                    </div>
                  </div>
                  {tags?.length > 0 && (
                    <section className="m-tags in-post" ref={tagsSectionRef}>
                      <h3 className="m-submenu-title">
                        Tags
                        {/* {{t "Tags"}} */}
                      </h3>
                      <ul>
                        {tags?.map((tag) => {
                          return (
                            <li key={tag.id}>
                              <Link to={`/tag/${tag.slug}`}>
                                {/* {{ name }} */}
                                {tag.name}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </section>
                  )}
                </div>
              </div>
            </div>

            {primary_author && (
              <section className="m-author">
                <div className="m-author__content">
                  <div className="m-author__picture">
                    <Link
                      to={`/author/${primary_author.id}`}
                      className="m-author-picture"
                      aria-label={primary_author.name}
                    >
                      <div
                        style={{
                          backgroundImage: `url(${
                            primary_author.profile_image ||
                            "/images/default-avatar-square-small.jpg"
                          })`,
                        }}
                      />
                    </Link>
                  </div>
                  <div className="m-author__info">
                    {primary_author.id && (
                      <h4 className="m-author__name">
                        <Link to={`/author/${primary_author.id}`}>
                          {primary_author.name}
                        </Link>
                      </h4>
                    )}
                    {/* {{#has author="count:>1"}}
                <p className="m-small-text in-author-along-with">
                  {{authors separator=", " prefix=(t "Among with no break line") from="2"}}
                </p>
              {{/has}} */}
                    {primary_author.bio && (
                      <p className="m-author__bio">{primary_author.bio}</p>
                    )}
                    <ul className="m-author-links">
                      {primary_author.website && (
                        <li>
                          <a
                            href={primary_author.website}
                            target="_blank"
                            rel="noopener"
                            aria-label="Website"
                          >
                            <span
                              className="icon-globe"
                              aria-hidden="true"
                            ></span>
                          </a>
                        </li>
                      )}
                      {primary_author.facebook && (
                        <li>
                          <a
                            href={`https://facebook.com/${primary_author.facebook}`}
                            target="_blank"
                            rel="noopener"
                            aria-label="Facebook"
                          >
                            <span
                              className="icon-facebook"
                              aria-hidden="true"
                            ></span>
                          </a>
                        </li>
                      )}
                      {primary_author.twitter && (
                        <li>
                          <a
                            href={`https://twitter.com/${primary_author.twitter}`}
                            target="_blank"
                            rel="noopener"
                            aria-label="Twitter"
                          >
                            <span
                              className="icon-twitter"
                              aria-hidden="true"
                            ></span>
                          </a>
                        </li>
                      )}
                      {primary_author.linkedin && (
                        <li>
                          <a
                            href={`https://linkedin.com/in/${primary_author.linkedin}`}
                            target="_blank"
                            rel="noopener"
                            aria-label="Linkedin"
                          >
                            <span
                              className="icon-linkedin"
                              aria-hidden="true"
                            ></span>
                          </a>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </section>
            )}

            {disqusShortName && (
              <section className="m-comments">
                <div className={`m-load-comments ${showComment ? "hide" : ""}`}>
                  <div className="m-load-comments__line"></div>
                  <TooltipWrapper content="Load comments">
                    <button
                      className="m-icon-button filled as-load-comments js-tooltip js-load-comments"
                      aria-label="Load Comments"
                      onClick={handleLoadCommentsClick}
                    >
                      <span className="icon-comments"></span>
                    </button>
                  </TooltipWrapper>
                </div>

                <div
                  className={`l-wrapper in-comments js-comments-iframe ${
                    showComment ? "" : "m-load-comments__iframe"
                  }`}
                  data-aos="fade-up"
                >
                  {tagsSectionInView && (
                    <div id="disqus_thread">
                      <DiscussionEmbed
                        shortname={disqusShortName}
                        config={disqusConfig}
                      />
                    </div>
                  )}
                </div>
              </section>
            )}

            <RelatedPosts posts={relatedPosts?.edges} />
          </div>
        </article>
      </main>
    </Fragment>
  );
};

export default Post;

export const query = graphql`
  query BlogPostBySlug($slug: String!, $tags: [String]) {
    site {
      siteMetadata {
        siteUrl
      }
    }
    post: markdownRemark(fields: { slug: { eq: $slug } }) {
      fields {
        slug
      }
      frontmatter {
        title
        authors {
          id
          name
          bio
          website
          twitter
          linkedin
          profile_image
        }
        tags {
          id
          name
          slug
        }
        published_at(formatString: "DD MMM, YYYY")
        feature_image {
          childImageSharp {
            gatsbyImageData(
              width: 720
              layout: CONSTRAINED
              placeholder: DOMINANT_COLOR
            )
          }
        }
      }
      excerpt
      html
    }
    relatedPosts: allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___published_at] }
      limit: 3
      filter: {
        fields: { slug: { ne: $slug } }
        frontmatter: {
          tags: { elemMatch: { id: { in: $tags } } }
          draft: { ne: true }
        }
      }
    ) {
      totalCount
      edges {
        node {
          ...PostCard
        }
      }
    }
  }
`;
