const path = require(`path`);

const { createFilePath } = require(`gatsby-source-filesystem`);
const CopyPlugin = require(`copy-webpack-plugin`);

exports.onCreateWebpackConfig = ({ plugins, actions }) => {
  const PRISM_THEMES_TO_COPY = ["prism-coldark-cold.css", "prism-darcula.css"];

  actions.setWebpackConfig({
    plugins: [
      new CopyPlugin({
        patterns: [
          {
            context: path.resolve(
              __dirname,
              "node_modules/prism-themes/themes"
            ),
            from: "*.css",
            to: path.resolve(__dirname, "static/prism-themes"),
            filter: (resourcePath) => {
              return PRISM_THEMES_TO_COPY.includes(path.basename(resourcePath));
            },
          },
        ],
      }),
    ],
  });
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode });

    const parsedPath = path.parse(value);

    createNodeField({
      name: `slug`,
      node,
      value: `/${parsedPath.name}/`,
    });
  }
};

// Create blog pages dynamically
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  const blogPostTemplate = path.resolve(`src/templates/blog-post.tsx`);

  const { data } = await graphql(`
    query {
      allMarkdownRemark(
        sort: {fields: [frontmatter___published_at], order: DESC},
        ${
          process.env.NODE_ENV === "production"
            ? "filter: { frontmatter: {draft: { ne: true } } }"
            : ""
        }) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              tags {
                id
              }
            }
          }
        }
      }
    }
  `);

  data.allMarkdownRemark.edges.forEach((edge) => {
    const { slug } = edge.node.fields;
    const { tags } = edge.node.frontmatter;

    createPage({
      path: `/blog${slug}`,
      component: blogPostTemplate,
      context: {
        slug: slug,
        tags: tags.map((tag) => tag.id),
      },
    });
  });
};

// Log out information after a build is done
exports.onPostBuild = ({ reporter }) => {
  reporter.info(`Your Gatsby site has been built!`);
};
