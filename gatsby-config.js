require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

const siteMetadata = require("./siteMetadata.json");

const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  siteMetadata,

  mapping: {
    "MarkdownRemark.frontmatter.authors": `AuthorsYaml.id`,
    "MarkdownRemark.frontmatter.tags": `TagsYaml.id`,
  },

  flags: {
    // FAST_DEV: false,
  },

  plugins: [
    `gatsby-transformer-yaml`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: "data",
        path: `./content/data/`,
      },
    },

    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: "assets",
        path: `./content/assets/`,
      },
    },

    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: "./content/images/",
      },
      __key: "images",
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "posts",
        path: "./content/posts/",
      },
      __key: "posts",
    },

    "gatsby-plugin-sass",
    "gatsby-plugin-image",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",

    {
      resolve: "gatsby-plugin-local-search",
      options: {
        // A unique name for the search index. This should be descriptive of
        // what the index contains. This is required.
        name: "pages",

        // Set the search engine to create the index. This is required.
        // The following engines are supported: flexsearch, lunr
        engine: "flexsearch",

        // Provide options to the engine. This is optional and only recommended
        // for advanced users.
        //
        // Note: Only the flexsearch engine supports options.
        engineOptions: "speed",

        // GraphQL query used to fetch all data for the search index. This is
        // required.
        query: `
          {
            allMarkdownRemark(filter: {frontmatter: {draft: {ne: true}}}) {
              nodes {
                id
                fields {
                  slug
                }
                frontmatter {
                  title
                  published_at(formatString: "DD MMM, YYYY")
                }
                rawMarkdownBody
              }
            }
          }
        `,

        // Field used as the reference value for each document.
        // Default: 'id'.
        ref: "id",

        // List of keys to index. The values of the keys are taken from the
        // normalizer function below.
        // Default: all fields
        index: ["title", "body"],

        // List of keys to store and make available in your UI. The values of
        // the keys are taken from the normalizer function below.
        // Default: all fields
        store: ["id", "path", "published_at", "title"],

        // Function used to map the result from the GraphQL query. This should
        // return an array of items to index in the form of flat objects
        // containing properties to index. The objects must contain the `ref`
        // field above (default: 'id'). This is required.
        normalizer: ({ data }) =>
          data.allMarkdownRemark.nodes.map((node) => ({
            id: node.id,
            path: node.fields.slug,
            title: node.frontmatter.title,
            published_at: node.frontmatter.published_at,
            body: node.rawMarkdownBody,
          })),
      },
    },

    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              // It's important to specify the maxWidth (in pixels) of
              // the content container as this plugin uses this as the
              // base for generating different widths of each image.
              // maxWidth: 590,
              linkImagesToOriginal: false,
              showCaptions: true,
            },
          },
          {
            resolve: "gatsby-remark-copy-linked-files",
          },

          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              classPrefix: "lang-",
              noInlineHighlight: true,
            },
          },
        ],
      },
    },

    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `GeeksCreed - Tech Blog`,
        short_name: `GeeksCreed`,
        start_url: "/",
        background_color: `#ffffff`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: "content/assets/images/icon.png", // This path is relative to the root of the site.
      },
    },

    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        createLinkInHead: true,
      },
    },

    // "gatsby-plugin-webpack-bundle-analyser-v2",

    "gatsby-plugin-hoofd",

    ...(isProduction
      ? [
          {
            resolve: "gatsby-plugin-google-analytics",
            options: {
              trackingId: process.env.GATSBY_SITE_GOOGLE_ANALYTICS,
            },
          },
        ]
      : []),

    // {
    //   resolve: `gatsby-plugin-google-adsense`,
    //   options: {
    //     publisherId: process.env.GATSBY_GOOGLE_AD_SENSE_CLIENT,
    //   },
    // },

    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.edges.map((edge) => {
                return Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.excerpt,
                  date: edge.node.frontmatter.published_at,
                  url: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  categories: edge.node.frontmatter.tags.map((tag) => tag.name),
                  custom_elements: [{ "content:encoded": edge.node.html }],
                });
              });
            },
            query: `
              {
                allMarkdownRemark(
                  sort: { order: DESC, fields: [frontmatter___published_at] },
                  filter: {frontmatter: {draft: {ne: true}}}
                ) {
                  edges {
                    node {
                      excerpt
                      html
                      fields { slug }
                      frontmatter {
                        title
                        published_at
                        tags {
                          name
                        }
                      }
                    }
                  }
                }
              }
            `,
            output: "/rss.xml",
            title: "GeeksCreed",
            match: "^/blog/",
          },
        ],
      },
    },
  ],
};
