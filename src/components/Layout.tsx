import React, {
  lazy,
  Suspense,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { graphql, useStaticQuery } from "gatsby";
import { useLink, useScript, useHead, useTitleTemplate } from "hoofd";
// import AOS from "aos";

import Header from "./Header";
import Footer from "./Footer";

import ThemeContext from "../contexts/ThemeContext";

import "../styles/fonts.css";
import "../styles/app.scss";
import "../styles/overrides.css";

const AD_SENSE_CLIENT = process.env.GATSBY_GOOGLE_AD_SENSE_CLIENT;

const Search = lazy(() => import("./Search"));

const Layout = ({ children, location }) => {
  const [theme, setTheme] = useState("");

  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    import("aos").then((AOS) => {
      AOS.init({
        once: true,
        startEvent: "DOMContentLoaded",
      });
    });

    const currentSavedTheme = localStorage.getItem("theme");

    if (currentSavedTheme) {
      setTheme(currentSavedTheme);
    } else {
      const darkModeMatcher = window?.matchMedia(
        "(prefers-color-scheme: dark)"
      );

      setTheme(darkModeMatcher?.matches ? "dark" : "light");
    }
  }, []);

  useLayoutEffect(() => {
    // To reset to scroll position
    window.scrollTo({
      left: 0,
      top: 0,
      behavior: "auto",
    });
  }, [location.pathname]);

  useEffect(() => {
    if (theme) {
      localStorage.setItem("theme", theme);
      document.querySelector("html").dataset.theme = theme;
    }
  }, [theme]);

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

  const organizationLdJson = useMemo(() => {
    const json = {
      "@context": "http://schema.org",
      "@type": "Organization",
      name: siteMetadata.title,
      url: siteMetadata.siteUrl,
      description: siteMetadata.description,
      logo: `${siteMetadata.siteUrl}/icon.png`,
      sameAs: [
        `http://www.facebook.com/${siteMetadata.social.facebook}`,
        `http://www.twitter.com/${siteMetadata.social.twitter}`,
      ],
    };
    return JSON.stringify(json);
  }, []);

  const toggleSearch = () => {
    setShowSearch((showSearch) => !showSearch);
  };

  const toggleTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.checked ? "dark" : "light";
    setTheme(value);
  };

  useTitleTemplate(`%s | ${siteMetadata.title}`);

  useHead({
    language: "en",
    metas: [
      { httpEquiv: "X-UA-Compatible", content: "IE=edge" },
      { name: "HandheldFriendly", content: "True" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      { name: "description", content: siteMetadata.description },
      { name: "og:site_name", content: siteMetadata.title },
      { name: "og:description", content: siteMetadata.description },
      { name: "twitter:site", content: siteMetadata.social.twitter },
    ],
  });

  useLink({ rel: "dns-prefetch", href: "https://polyfill.io" });
  useLink({ rel: "preconnect", href: "https://polyfill.io" });

  useLink({
    rel: "dns-prefetch",
    href: "https://avatars0.githubusercontent.com",
  });
  useLink({
    rel: "preconnect",
    href: "https://avatars0.githubusercontent.com",
  });

  useScript({
    id: "org-ld-data",
    type: "application/ld+json",
    text: organizationLdJson,
  });

  useEffect(() => {
    document.body.classList.toggle("no-scroll-y", showSearch);
  }, [showSearch]);

  return (
    <ThemeContext.Provider value={theme}>
      <Header
        theme={theme}
        siteMetadata={site.siteMetadata}
        onSearchClick={toggleSearch}
        onThemeChange={toggleTheme}
      />

      {children}

      {showSearch && (
        <Suspense fallback={null}>
          <Search onClose={toggleSearch} />
        </Suspense>
      )}

      <Footer siteMetadata={site.siteMetadata} />
    </ThemeContext.Provider>
  );
};

export default Layout;
