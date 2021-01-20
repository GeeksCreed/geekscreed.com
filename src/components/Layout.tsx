import React, { Fragment, useEffect } from "react";
import { graphql, useStaticQuery } from "gatsby";
import { Helmet } from "react-helmet";
import { GatsbySeo, SocialProfileJsonLd } from "gatsby-plugin-next-seo";
// import AOS from "aos";
import Header from "./Header";
import Footer from "./Footer";

import "tippy.js/dist/tippy.css";
import "../styles/fonts.css";
import "../styles/app.scss";
import "../styles/overrides.css";

const AD_SENSE_CLIENT = process.env.GATSBY_GOOGLE_AD_SENSE_CLIENT;

const Layout = ({ title = "", children }) => {
  useEffect(() => {
    import("aos").then((AOS) => {
      AOS.init({
        once: true,
        startEvent: "DOMContentLoaded",
      });
    });
  }, []);

  const { site } = useStaticQuery(graphql`
    query SiteMetaData {
      site {
        siteMetadata {
          coverImage
          description
          title
          logo
          icon
          siteUrl
          social {
            twitter
            facebook
          }
        }
      }
    }
  `);

  const { siteMetadata } = site;

  const pageTitle = title
    ? `${title} | ${siteMetadata.title}`
    : `${siteMetadata.title} - ${siteMetadata.description}`;

  return (
    <Fragment>
      <GatsbySeo
        description={siteMetadata.description}
        openGraph={{
          site_name: siteMetadata.title,
          description: siteMetadata.description,
        }}
        twitter={{
          site: `@${siteMetadata.social.twitter}`,
        }}
      />

      <SocialProfileJsonLd
        type="Organization"
        name={siteMetadata.title}
        url={siteMetadata.siteUrl}
        sameAs={[
          `http://www.facebook.com/${siteMetadata.social.facebook}`,
          `http://www.twitter.com/${siteMetadata.social.twitter}`,
        ]}
      />

      <Helmet>
        <html lang="en" />

        <title> {pageTitle} </title>

        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="HandheldFriendly" content="True" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <link rel="preconnect" href="https://polyfill.io" />
        <link rel="dns-prefetch" href="https://polyfill.io" />

        {/* {AD_SENSE_CLIENT && (
          <script
            data-ad-client={AD_SENSE_CLIENT}
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
          ></script>
        )} */}
      </Helmet>

      <Header siteMetadata={site.siteMetadata} />

      {children}

      <Footer siteMetadata={site.siteMetadata} />
    </Fragment>
  );
};

export default Layout;