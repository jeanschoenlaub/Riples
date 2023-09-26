import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { api } from "~/utils/api";
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from "react-hot-toast";
import "~/styles/globals.css";
import Head from "next/head";
import { SessionProvider } from "next-auth/react"
import { OnboardingWrapper } from "~/components/onboarding/onboardingwrapper";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { pageview } from "~/utils/googleanalytics";
import { WizardWrapper } from "~/components/wizard/wizardswrapper";

type TaskStatus = {
  taskName: string;
  isCompleted: boolean;
  actionLink?: string;
};

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => 
{
    const router = useRouter();
    //For Google Analytics
    useEffect(() => {
        const handleRouteChange = (url: string) => {
            pageview(url)
        }
        router.events.on('routeChangeComplete', handleRouteChange)
        return () => {
            router.events.off('routeChangeComplete', handleRouteChange)
        }
    }, [router.events])

  

    return (
      <SessionProvider session={session}>
        {/* Default Head can be overriden in specific pages */}
        <Head>
            <title>Riples - Get Doing! </title>
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
        <WizardWrapper>
          <OnboardingWrapper />
          <Component {...pageProps} />
        </WizardWrapper>
        <Analytics />
        </SessionProvider>
    );
};


export default api.withTRPC(MyApp);
