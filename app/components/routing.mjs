import { SEO_ROUTES } from "../../seo.config.mjs";

/**
 * @param {keyof typeof SEO_ROUTES} route
 * @param {"path" | "hash"} routingMode
 */
export function routeHref(route, routingMode) {
  if (routingMode === "hash") return route === "home" ? "#" : `#/${route}`;
  return SEO_ROUTES[route].path;
}

/**
 * The hash router owns the fragment in the static build, so its skip link keeps
 * the current route fragment and relies on the focus handler. Path mode can use
 * a native fragment fallback before hydration.
 *
 * @param {keyof typeof SEO_ROUTES} route
 * @param {"path" | "hash"} routingMode
 */
export function skipHref(route, routingMode) {
  return routingMode === "path"
    ? `${SEO_ROUTES[route].path}#main-content`
    : routeHref(route, routingMode);
}
