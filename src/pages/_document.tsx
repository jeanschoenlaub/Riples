import Document, { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';
import { env } from '~/env.mjs';
// ... your other imports

export default class MyDocument extends Document {
  render(): JSX.Element {
    return (
      <Html>
        <Head>
          {/* Your other head elements */}
        </Head>
        <body>
          <Main />
          <NextScript />
          {/* Global Site Tag (gtag.js) - Google Analytics */}
          <Script
            id="gtag-inline-script"
            src={`https://www.googletagmanager.com/gtag/js?id=${env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
            strategy="afterInteractive"
          />
          <Script
            id="gtag-window-data-layer"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
                  page_path: window.location.pathname,
                });
              `,
            }}
            strategy="afterInteractive"
          />
        </body>
      </Html>
    );
  }
}
