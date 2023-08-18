import { type AppType } from "next/app";
import { api } from "~/utils/api";
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from "react-hot-toast";
import "~/styles/globals.css";
import Head from "next/head";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      {/* Default Head can be overriden in specific pages*/}
      <Head>
          <title>Riples - Collaborate on Projects & Join Creative Bubbles</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="description" content="Riples is a social platform where creators share projects, inviting others to join their collaborative circles. Dive into a ripple and make waves together!" />
          <meta name="keywords" content="Riples, collaboration, projects, social app, create, join, collaborate, bubbles, ripples, community" />
          <meta name="author" content="Riples Team" />
          <link rel="icon" href="/images/favicon.ico" />
      </Head>
      < Toaster /> 
      <Component {...pageProps} />
    </ClerkProvider>
  );

};

export default api.withTRPC(MyApp);
