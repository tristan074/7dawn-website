import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://7dawn.ai";
  return [
    { url: `${base}/zh`, lastModified: new Date(), alternates: { languages: { en: `${base}/en`, zh: `${base}/zh` } } },
    { url: `${base}/en`, lastModified: new Date(), alternates: { languages: { en: `${base}/en`, zh: `${base}/zh` } } },
  ];
}
