import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";

const SITE_URL = "https://apnabzaar.netlify.app";
const SITE_NAME = "ApnaBazaar";
const DEFAULT_DESCRIPTION =
  "ApnaBazaar is an online marketplace for local products, daily essentials, fashion, electronics, handmade goods, fresh produce and trusted nearby sellers.";
const DEFAULT_KEYWORDS =
  "ApnaBazaar, Apna Bazaar, online marketplace India, local shopping, buy local products, daily essentials online, fresh produce, handmade products, electronics online, fashion online, local sellers, best deals";
const OG_IMAGE = `${SITE_URL}/og-image.svg`;

const privateRoutes = [
  "/checkout",
  "/orders",
  "/profile",
  "/vendor/dashboard",
  "/reset-password",
  "/user/verify",
];

const titleCase = (value = "") =>
  value
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const cleanPath = (pathname) => (pathname === "/" ? "/" : pathname.replace(/\/+$/, ""));

const setMeta = (name, content, attr = "name") => {
  if (!content) return;

  let element = document.head.querySelector(`meta[${attr}="${name}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attr, name);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
};

const setLink = (rel, href) => {
  let element = document.head.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }
  element.setAttribute("href", href);
};

const setJsonLd = (id, data) => {
  let element = document.head.querySelector(`script[data-seo-id="${id}"]`);
  if (!element) {
    element = document.createElement("script");
    element.type = "application/ld+json";
    element.setAttribute("data-seo-id", id);
    document.head.appendChild(element);
  }
  element.textContent = JSON.stringify(data);
};

const getRouteSeo = (pathname) => {
  const path = cleanPath(pathname);
  const parts = path.split("/").filter(Boolean);
  const isPrivate = privateRoutes.some((route) => path === route || path.startsWith(`${route}/`));

  if (path === "/") {
    return {
      title: "ApnaBazaar - Shop Local Products, Deals and Daily Essentials Online",
      description: DEFAULT_DESCRIPTION,
      keywords: DEFAULT_KEYWORDS,
      type: "WebPage",
    };
  }

  if (path === "/categories") {
    return {
      title: "Shop Categories Online - ApnaBazaar",
      description:
        "Browse ApnaBazaar categories for daily essentials, fresh produce, fashion, electronics, handmade goods and local products from nearby sellers.",
      keywords:
        "ApnaBazaar categories, shop by category, daily essentials, fresh produce, fashion, electronics, handmade goods, local marketplace",
      type: "CollectionPage",
    };
  }

  if (parts[0] === "categories" && parts[1]) {
    const category = titleCase(decodeURIComponent(parts[1]));
    return {
      title: `${category} Online - Shop Local ${category} on ApnaBazaar`,
      description: `Shop ${category} online on ApnaBazaar. Find local sellers, trusted products, fresh deals, ratings, stock and doorstep delivery options.`,
      keywords: `${category}, ${category} online, buy ${category}, local ${category}, ApnaBazaar ${category}, best ${category} deals`,
      type: "CollectionPage",
    };
  }

  if (parts[0] === "search" && parts[1]) {
    const query = titleCase(decodeURIComponent(parts.slice(1).join(" ")));
    return {
      title: `${query} - Search Products on ApnaBazaar`,
      description: `Search ${query} on ApnaBazaar and compare local products, prices, ratings, stock and seller options.`,
      keywords: `${query}, buy ${query} online, ${query} ApnaBazaar, local ${query} products, ${query} deals`,
      type: "SearchResultsPage",
    };
  }

  if (parts[0] === "productdetail" && parts[1]) {
    return {
      title: "Product Details - Price, Stock, Reviews and Seller Info | ApnaBazaar",
      description:
        "View ApnaBazaar product details with price, stock status, images, seller information, ratings, reviews and related product suggestions.",
      keywords:
        "ApnaBazaar product details, product price, product reviews, product rating, online shopping, local seller products",
      type: "Product",
    };
  }

  if (path === "/about") {
    return {
      title: "About ApnaBazaar - Local Shopping Marketplace",
      description:
        "Learn about ApnaBazaar, a local online marketplace built to connect shoppers with trusted sellers, fresh products and community businesses.",
      keywords: "about ApnaBazaar, local marketplace, support local sellers, online shopping India",
      type: "AboutPage",
    };
  }

  if (path === "/contact") {
    return {
      title: "Contact ApnaBazaar - Customer Support and Seller Help",
      description:
        "Contact ApnaBazaar for customer support, seller help, order questions, product requests and marketplace assistance.",
      keywords: "contact ApnaBazaar, customer support, seller support, order help, product request",
      type: "ContactPage",
    };
  }

  if (path === "/signin") {
    return {
      title: "Sign In to ApnaBazaar",
      description: "Sign in to ApnaBazaar to manage orders, wishlist, addresses, recommendations and local shopping preferences.",
      keywords: "ApnaBazaar signin, login ApnaBazaar, customer account",
      robots: "noindex, follow",
      type: "WebPage",
    };
  }

  if (path === "/signup") {
    return {
      title: "Create an ApnaBazaar Account",
      description: "Create an ApnaBazaar account to shop local products, track orders, save wishlist items and discover nearby sellers.",
      keywords: "ApnaBazaar signup, create account, online shopping account",
      robots: "noindex, follow",
      type: "WebPage",
    };
  }

  if (isPrivate) {
    return {
      title: "Account Page - ApnaBazaar",
      description: "Secure ApnaBazaar account page.",
      keywords: DEFAULT_KEYWORDS,
      robots: "noindex, nofollow",
      type: "WebPage",
    };
  }

  return {
    title: `${SITE_NAME} - Local Online Marketplace`,
    description: DEFAULT_DESCRIPTION,
    keywords: DEFAULT_KEYWORDS,
    type: "WebPage",
  };
};

export default function SeoManager() {
  const location = useLocation();
  const seo = useMemo(() => getRouteSeo(location.pathname), [location.pathname]);

  useEffect(() => {
    const canonicalPath = cleanPath(location.pathname);
    const canonicalUrl = `${SITE_URL}${canonicalPath === "/" ? "/" : canonicalPath}`;
    const robots = seo.robots || "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

    document.title = seo.title;

    setMeta("description", seo.description);
    setMeta("keywords", seo.keywords);
    setMeta("robots", robots);
    setMeta("googlebot", robots);
    setMeta("author", "Apnabazaar Team");
    setMeta("application-name", SITE_NAME);
    setMeta("theme-color", "#4f46e5");

    setMeta("og:title", seo.title, "property");
    setMeta("og:description", seo.description, "property");
    setMeta("og:type", "website", "property");
    setMeta("og:url", canonicalUrl, "property");
    setMeta("og:image", OG_IMAGE, "property");
    setMeta("og:image:alt", "ApnaBazaar online local marketplace", "property");
    setMeta("og:site_name", SITE_NAME, "property");

    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", seo.title);
    setMeta("twitter:description", seo.description);
    setMeta("twitter:image", OG_IMAGE);

    setLink("canonical", canonicalUrl);

    setJsonLd("route-page", {
      "@context": "https://schema.org",
      "@type": seo.type,
      name: seo.title,
      description: seo.description,
      url: canonicalUrl,
      isPartOf: {
        "@type": "WebSite",
        name: SITE_NAME,
        url: SITE_URL,
      },
    });
  }, [location.pathname, seo]);

  return null;
}
