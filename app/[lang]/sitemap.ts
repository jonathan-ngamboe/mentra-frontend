import { baseURL, routes as routesConfig } from "@/resources/config";
import { SupportedLocale } from "./dictionaries";

interface SitemapParams {
  params: { lang: SupportedLocale };
}

export default async function sitemap({ params }: SitemapParams) {
  const lang = params.lang;
  
  const activeRoutes = Object.entries(routesConfig)
    .filter(([_, isActive]) => isActive)
    .map(([route]) => route);

  const routes = activeRoutes.map((route) => ({
    url: `${baseURL}/${lang}${route !== "/" ? route : ""}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));

  return [...routes];
}