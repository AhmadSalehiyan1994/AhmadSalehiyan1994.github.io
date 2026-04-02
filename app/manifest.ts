import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ahmad Salehiyan Portfolio",
    short_name: "Salehiyan",
    description: "Industrial Engineering, optimization, maintenance, and machine learning portfolio.",
    start_url: "/",
    display: "standalone",
    background_color: "#030712",
    theme_color: "#0f172a",
    lang: "en",
    icons: [
      {
        src: "/images/first.png?v=2",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/images/first.png?v=2",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/images/first.png?v=2",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
