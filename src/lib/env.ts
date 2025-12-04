export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || "http://localhost:3000";

// Čárkami oddělený seznam produkčních hostů (bez protokolu)
// např.: "dk-cam.studio,www.dk-cam.studio"
export const PROD_HOSTS =
  (process.env.NEXT_PUBLIC_PROD_HOSTS || "")
    .split(",")
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);

// true, pokud SITE_URL host patří mezi produkční hosty
export const IS_PROD = (() => {
  try {
    const host = new URL(SITE_URL).host.toLowerCase();
    return PROD_HOSTS.includes(host);
  } catch {
    return false;
  }
})();
