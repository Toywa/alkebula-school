import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/api/",
        "/educator/",
        "/parent/",
      ],
    },
    sitemap: "https://www.alkebulaschool.com/sitemap.xml",
  };
}