import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { api } from "~/utils/api";
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from "react-hot-toast";
import "~/styles/globals.css";
import Head from "next/head";
import { SessionProvider } from "next-auth/react"
import { OnboardingWrapper } from "~/components/modals/onboarding";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      {/* Default Head can be overriden in specific pages */}
      <Head>
        <title>Riples - Collaborate on Projects & Join Creative Bubbles</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Riples is a social platform where creators share projects, inviting others to join their collaborative circles. Dive into a ripple and make waves together!"
        />
        <meta
          name="keywords"
          content="Riples, collaboration, projects, social app, create, join, collaborate, bubbles, ripples, community"
        />
        <meta name="author" content="Riples Team" />
        <link rel="icon" href="/images/favicon.ico" />
      </Head>
      <Toaster />
      <OnboardingWrapper />
      <Component {...pageProps} />
      <Analytics />
    </SessionProvider>
  );
};


export default api.withTRPC(MyApp);
