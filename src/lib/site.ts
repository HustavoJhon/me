import { basics } from "@cv";

/** Public pages, listed in the sitemap. Keep in sync with src/pages. */
export const PAGES = ["/", "/projects/"] as const;

/** Absolute URL on the production site configured in cv.json (`basics.url`). */
export const absoluteUrl = (path: string) => new URL(path, basics.url).href;
