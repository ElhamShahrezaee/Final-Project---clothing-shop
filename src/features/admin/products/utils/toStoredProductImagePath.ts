import { API_BASE_URL } from "../../../../lib/api/client";

/** Converts display URL back to path stored in DB (e.g. /uploads/products/9.jpg). */
export function toStoredProductImagePath(url: string): string {
  if (!url) return "";

  const base = API_BASE_URL.replace(/\/$/, "");
  if (url.startsWith(base)) {
    const path = url.slice(base.length);
    return path.startsWith("/") ? path : `/${path}`;
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    try {
      const pathname = new URL(url).pathname;
      return pathname.startsWith("/") ? pathname : `/${pathname}`;
    } catch {
      return url;
    }
  }

  return url.startsWith("/") ? url : `/${url}`;
}
