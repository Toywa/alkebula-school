import type { MetadataRoute } from "next";

const siteUrl = "https://www.alkebulaschool.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/about",
    "/faq",
    "/contact",
    "/educators",
    "/tutors/apply",

    "/online-cambridge-igcse-tutors",
    "/edexcel-igcse-tutors",
    "/a-level-online-tutors",
    "/ib-online-tutors",
    "/homeschool-support",

    "/legal/terms",
    "/legal/privacy-policy",
    "/legal/refund-policy",
    "/legal/code-of-conduct",
    "/legal/tutor-terms",
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority:
      route === ""
        ? 1
        : route.includes("igcse") ||
          route.includes("a-level") ||
          route.includes("ib-online") ||
          route.includes("homeschool")
        ? 0.85
        : 0.7,
  }));
}