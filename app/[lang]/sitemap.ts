import { baseURL, routes as routesConfig } from "@/resources/config";

export default async function sitemap() {
  const activeRoutes = Object.entries(routesConfig)
    .filter(([_, isActive]) => isActive)
    .map(([route]) => route);

  const routes = activeRoutes.map((route) => ({
    url: `${baseURL}${route !== "/" ? route : ""}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));

  return [...routes];
}
