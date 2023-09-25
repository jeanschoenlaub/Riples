import { env } from "~/env.mjs";

export const event = ({ action, params }: { action: string, params: GAEventParams }) => {
  window.gtag('event', action, params);
}

// log the pageview with their URL
export const pageview = (url: string) => {
  const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS;
    if (!gaId) {
      console.error('NEXT_PUBLIC_GOOGLE_ANALYTICS is not defined');
      return;
    }
    window.gtag('config', gaId, {
      page_path: url,
    });
}
