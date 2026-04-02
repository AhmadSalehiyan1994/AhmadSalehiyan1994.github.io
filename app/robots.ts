import type { MetadataRoute } from "next";
import { siteContent } from "@/lib/content";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/_next/"],
    },
    sitemap: `${siteContent.person.website}sitemap.xml`,
    host: siteContent.person.website,
  };
}
