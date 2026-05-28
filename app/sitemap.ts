import type { MetadataRoute } from "next";

const siteUrl = "https://www.alkebulaschool.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/about",
    "/tutors",
    "/apply",
    "/legal/terms",
    "/legal/privacy-policy",
    "/legal/refund-policy",
    "/legal/code-of-conduct",
    "/legal/tutor-terms",
    "/online-cambridge-igcse-tutors",
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}