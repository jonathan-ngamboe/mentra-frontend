export type RouteConfig = {
    // The path pattern to match against the current URL
    path: string;
  
    // If true, the path must match exactly. If false, it matches as a prefix
    exact?: boolean;
  
    // Nested routes configuration
    children?: RouteConfig[];
  
    // If true, the route requires authentication to access
    protected?: boolean;
  
    // Where to redirect when accessing this route while authenticated
    // Can be a static path or a function returning a path
    redirectTo?: string | ((locale: string) => string);
  };
  