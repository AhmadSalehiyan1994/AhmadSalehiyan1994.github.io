import type { MetadataRoute } from "next";
import { siteContent } from "@/lib/content";

const baseUrl = siteContent.person.website.replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "/",
    "/projects",
    "/contact",
    "/cv",
    "/insights",
    "/blog/machine-learning",
    "/blog/integer-programming",
    "/blog/maintenance-management",
    "/legal/privacy",
    ...siteContent.projects.map((project) => `/projects/${project.slug}`),
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route.startsWith("/blog/") ? "monthly" : "weekly",
    priority: route === "/" ? 1 : route.startsWith("/blog/") ? 0.8 : 0.7,
  }));
}
