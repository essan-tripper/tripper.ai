import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/account", "/cart", "/order"],
    },
    sitemap: "https://tripperbyessan.com/sitemap.xml",
  };
}
