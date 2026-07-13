import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://tripperbyessan.com";

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${base}/merch`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${base}/magnets`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${base}/posters`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${base}/about-us`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${base}/course`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/sign-in`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${base}/sign-up`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${base}/plan`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/plan/parallax`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${base}/plan/map`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${base}/plan/3d`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${base}/plan/itinerary`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${base}/plan/travel-jyotirlingas`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    { url: `${base}/travel/kedarnath`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/travel/badrinath`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/travel/gangotri`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/travel/yamunotri`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/travel/dwarka`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/travel/puri`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/travel/rameshwaram`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];
}
