
export const event = ({ action, params }: { action: string, params: GAEventParams }) => {
  window.gtag('event', action, params);
}

// log the pageview with their URL
export const pageview = (url: string) => {
  if (typeof window !== "undefined") {
    window.gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, {
      page_path: url,
    })
  }
}
