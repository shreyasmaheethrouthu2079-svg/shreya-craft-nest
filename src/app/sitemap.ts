import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "https://shreya-craft-nest.vercel.app");

  const currentDate = new Date();

  return [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/track-order`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/signin`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/checkout`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/?category=Handbags#catalog`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/?category=Mini%20Bags#catalog`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/?category=Pouches#catalog`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];
}
