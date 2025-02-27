import { RouteConfig } from "@/types/route";


/**
 * Routes configuration defining the application's routing rules
 * including protection status and redirection behavior
 */
export const ROUTES_CONFIG: RouteConfig[] = [
  {
    path: "/services/career-matching",
    exact: false,
    redirectTo: "/services/career-matching/test",
    children: [
      {
        path: "/services/career-matching/test",
        protected: true,
      },
      {
        path: "/services/career-matching/results",
        protected: true,
      },
    ],
  },
  {
    path: "/login",
    exact: true,
  },
];

/**
 * Matches a given pathname against the routes configuration
 * Returns the matching route config or null if no match is found
 *
 * @param pathname - The current path to match against routes
 * @param routes - Array of route configurations to check
 * @returns Matching RouteConfig or null
 */
export function matchRoutePattern(
    pathname: string,
    routes: RouteConfig[]
  ): RouteConfig | null {
    for (const route of routes) {
      // Check for exact match first
      if (route.exact && pathname === route.path) {
        return route;
      }
  
      // If the route has children and the path matches the prefix
      if (route.children && pathname.startsWith(route.path)) {
        // Try to match children first
        const childMatch = matchRoutePattern(pathname, route.children);
        if (childMatch) {
          return childMatch;
        }
      }
  
      // If no child matches but the path matches and it's not exact
      if (!route.exact && pathname.startsWith(route.path)) {
        return route;
      }
    }
    return null;
  }