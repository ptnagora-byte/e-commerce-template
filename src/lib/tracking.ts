// Archivio Shop — UTMify + Meta Pixel. Tracking is activated only with marketing consent.
// The UTMify script identifiers below were decoded from the snippets supplied by the store owner.
// Pixel ID from UTMify: 6ad25c5b9304b26ffb5d78fa (NOT a Facebook Pixel ID).
export const META_PIXEL_ID = "1154719256863460";
export const UTMIFY_PIXEL_ID = "6ad25c5b9304b26ffb5d78fa";
export const TRACKING_CONSENT_KEY = "archivio-marketing-consent-v1";
const PRODUCT = {
  content_ids: ["archivio-playboy-500-pdf"],
  content_name: "Collezione Digitale Playboy - 500+ PDF",
  content_type: "product",
  currency: "EUR",
  value: 27,
};
const CAMPAIGN_KEYS = [
  "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term",
  "fbclid", "gclid"
] as const;
let active = false;
let lastTrackedPath = "";
let checkoutListenerAttached = false;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: (...args: unknown[]) => void;
    pixelId?: string;
  }
}
export function hasMarketingConsent(): boolean {
  if (typeof window === "undefined") return false;
  try { return window.localStorage.getItem(TRACKING_CONSENT_KEY) === "accepted"; }
  catch { return false; }
}
export function saveMarketingConsent(accepted: boolean) {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(TRACKING_CONSENT_KEY, accepted ? "accepted" : "rejected"); }
  catch { /* Storage may be disabled by the browser. */ }
}
export function readMarketingConsent(): "accepted" | "rejected" | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(TRACKING_CONSENT_KEY);
    return value === "accepted" || value === "rejected" ? value : null;
  } catch { return null; }
}
function loadScript(id: string, src: string, attributes: Record<string,string> = {}) {
  if (document.getElementById(id)) return;
  const element = document.createElement("script");
  element.id = id;
  element.src = src;
  element.async = true;
  for (const [key,value] of Object.entries(attributes)) element.setAttribute(key,value);
  (document.head || document.documentElement).appendChild(element);
}
function setupMetaPixel() {
  if (typeof window.fbq !== "function") {
    type PixelQueue = ((...args: unknown[]) => void) & {
      queue?: unknown[][];
      loaded?: boolean;
      version?: string;
      push?: (...args: unknown[]) => void;
      callMethod?: (...args: unknown[]) => void;
    };
    const fbq: PixelQueue = function (...args: unknown[]) {
      if (typeof fbq.callMethod === "function") fbq.callMethod(...args);
      else fbq.queue?.push(args);
    };
    fbq.queue = [];
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.push = (...args: unknown[]) => { fbq.queue?.push(args); };
    window.fbq = fbq;
    window._fbq = fbq;
    loadScript("archivio-meta-fbevents", "https://connect.facebook.net/en_US/fbevents.js");
  }
  window.fbq?.("init", META_PIXEL_ID);
}
function captureAttribution() {
  const params = new URLSearchParams(window.location.search);
  try {
    for (const key of CAMPAIGN_KEYS) {
      const value = params.get(key);
      if (value && value.length < 512) window.sessionStorage.setItem("archivio_attr_" + key,value);
    }
  } catch { /* sessionStorage can be unavailable */ }
}
export function attachCheckoutTracking() {
  if (typeof document === "undefined" || checkoutListenerAttached) return;
  checkoutListenerAttached = true;
  document.addEventListener("click",event=>{
    const target = event.target;
    if (!(target instanceof Element)) return;
    const anchor = target.closest("a[href]");
    if (!(anchor instanceof HTMLAnchorElement)) return;
    try {
      const href = new URL(anchor.href, window.location.href);
      if (href.hostname !== "pay.cakto.com.br") return;
      if (hasMarketingConsent()) {
        captureAttribution();
        for (const key of CAMPAIGN_KEYS) {
          if (href.searchParams.has(key)) continue;
          const current = new URLSearchParams(window.location.search).get(key);
          let value = current;
          try { value ||= window.sessionStorage.getItem("archivio_attr_" + key); } catch {}
          if (value) href.searchParams.set(key,value);
        }
      }
      // Modify the destination before the browser opens the checkout (including _blank).
      anchor.href = href.toString();
      trackInitiateCheckout();
    } catch { /* Only safe, valid destination URLs are processed. */ }
  },{capture:true});
}
export function initializeMarketingTracking() {
  if (typeof window === "undefined" || !hasMarketingConsent() || active) return;
  active = true;
  captureAttribution();
  setupMetaPixel();
  // Same remote scripts represented by the two provided obfuscated snippets.
  window.pixelId = UTMIFY_PIXEL_ID;
  loadScript("archivio-utmify-pixel","https://cdn.utmify.com.br/scripts/pixel/pixel.js");
  loadScript("archivio-utmify-utms","https://cdn.utmify.com.br/scripts/utms/latest.js",{
    "data-utmify-prevent-xcod-sck":"",
    "data-utmify-prevent-subids":""
  });
  // Let components already on screen know that consented tracking is ready.
  window.dispatchEvent(new Event("archivio:marketing-tracking-ready"));
}
function metaEvent(name: string,details?: Record<string,unknown>) {
  if (!hasMarketingConsent() || !active) return;
  if (details) window.fbq?.("trackSingle",META_PIXEL_ID,name,details);
  else window.fbq?.("trackSingle",META_PIXEL_ID,name);
}
export function trackCurrentPage(path: string) {
  if (!active || !hasMarketingConsent() || path === lastTrackedPath) return;
  lastTrackedPath = path;
  captureAttribution();
  metaEvent("PageView");
  if (path === "/prodotto" || path === "/prodotto/") {
    metaEvent("ViewContent", PRODUCT);
  }
}
export function trackAddToCart() {
  metaEvent("AddToCart",{...PRODUCT,num_items:1});
}
export function trackInitiateCheckout() {
  // A checkout click is NOT an approved purchase.
  metaEvent("InitiateCheckout",{...PRODUCT,num_items:1});
}
export function trackSearch(searchString: string) {
  const cleaned=searchString.trim().slice(0,120);
  if (cleaned) metaEvent("Search",{search_string:cleaned});
}
/**
 * Review interactions use custom events rather than Lead or Purchase:
 * preparing an email or copying a review does NOT confirm submission.
 * NEVER pass customer names, email addresses, regions, review text, or typed search data here.
 */
function reviewInteraction(eventName: string): boolean {
  if (typeof window === "undefined" || !active || !hasMarketingConsent()) return false;
  window.fbq?.("trackSingleCustom", META_PIXEL_ID, eventName, {
    section: "reviews",
    content_type: PRODUCT.content_type,
    content_ids: PRODUCT.content_ids,
  });
  return true;
}
export function trackReviewSectionView(): boolean {
  return reviewInteraction("ReviewSectionView");
}
export function trackReviewFormStart(): boolean {
  return reviewInteraction("ReviewFormStart");
}
export function trackReviewEmailIntent(): boolean {
  return reviewInteraction("ReviewEmailIntent");
}
export function trackReviewCopyIntent(): boolean {
  return reviewInteraction("ReviewCopyIntent");
}
// Do NOT fire Purchase in this storefront. Purchase should be recorded
// only by Cakto's confirmed-payment integration / server webhook.
