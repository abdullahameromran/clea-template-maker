import { useEffect } from "react";

type JsonLd = Record<string, unknown> | Array<Record<string, unknown>>;

type SeoConfig = {
  title: string;
  description: string;
  path?: string;
  type?: string;
  image?: string;
  robots?: string;
  jsonLd?: JsonLd;
};

const SITE_NAME = "InvoiceHub PDF Generator";
const DEFAULT_ROBOTS = "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";

function getSiteOrigin(): string {
  const configured = (import.meta.env.VITE_SITE_URL as string | undefined)?.trim();
  if (configured) {
    return configured.replace(/\/+$/, "");
  }

  if (typeof window !== "undefined") {
    return window.location.origin.replace(/\/+$/, "");
  }

  return "";
}

function buildAbsoluteUrl(path?: string): string {
  const origin = getSiteOrigin();
  if (!path) {
    return typeof window !== "undefined" ? `${origin}${window.location.pathname}` : origin;
  }
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}

function ensureMeta(attr: "name" | "property", key: string, content: string) {
  let element = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

function ensureLink(rel: string, href: string) {
  let element = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }
  element.setAttribute("href", href);
}

function setJsonLd(jsonLd?: JsonLd) {
  const existing = document.head.querySelector('script[data-seo="json-ld"]');
  if (!jsonLd) {
    existing?.remove();
    return;
  }

  const script = existing ?? document.createElement("script");
  script.setAttribute("type", "application/ld+json");
  script.setAttribute("data-seo", "json-ld");
  script.textContent = JSON.stringify(jsonLd);

  if (!existing) {
    document.head.appendChild(script);
  }
}

export function useSeo({
  title,
  description,
  path,
  type = "website",
  image,
  robots = DEFAULT_ROBOTS,
  jsonLd,
}: SeoConfig) {
  useEffect(() => {
    const canonicalUrl = buildAbsoluteUrl(path);
    const ogImage = image ? buildAbsoluteUrl(image) : `${getSiteOrigin()}/favicon.png`;

    document.title = title;
    ensureMeta("name", "description", description);
    ensureMeta("name", "robots", robots);
    ensureMeta("name", "author", "InvoiceHub");
    ensureMeta("name", "application-name", SITE_NAME);
    ensureMeta("name", "theme-color", "#142a5c");
    ensureMeta("property", "og:site_name", SITE_NAME);
    ensureMeta("property", "og:title", title);
    ensureMeta("property", "og:description", description);
    ensureMeta("property", "og:type", type);
    ensureMeta("property", "og:url", canonicalUrl);
    ensureMeta("property", "og:image", ogImage);
    ensureMeta("property", "og:locale", "en_US");
    ensureMeta("name", "twitter:card", "summary_large_image");
    ensureMeta("name", "twitter:title", title);
    ensureMeta("name", "twitter:description", description);
    ensureMeta("name", "twitter:image", ogImage);
    ensureLink("canonical", canonicalUrl);
    setJsonLd(jsonLd);
  }, [description, image, jsonLd, path, robots, title, type]);
}

export function getOrganizationJsonLd() {
  const siteUrl = getSiteOrigin();

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "InvoiceHub",
    url: siteUrl,
    logo: `${siteUrl}/favicon.png`,
  };
}

export function getWebsiteJsonLd() {
  const siteUrl = getSiteOrigin();

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}
