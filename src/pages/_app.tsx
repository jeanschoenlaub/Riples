import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { api } from "~/utils/api";
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from "react-hot-toast";
import "~/styles/globals.css";
import Head from "next/head";
import { SessionProvider } from "next-auth/react"
import { OnboardingProvider, OnboardingWrapper } from "~/features/onboarding/onboardingwrapper";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { pageview } from "~/utils/googleanalytics";
import { Provider } from 'react-redux';
import store from '~/redux/store';
import { ChakraProvider } from '@chakra-ui/react'
import { WizardProvider} from "~/features/wizard";


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
            <title>Riples - Collaborate on Projects & Join Creative Bubbles </title>
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

            <title>Your PWA Title</title>
            <link rel="manifest" href="./manifest.json" />
            <link rel="apple-touch-icon" href="/imageslogo_256x256.png"/>
            <meta name="apple-mobile-web-app-capable" content="yes"></meta>
            <meta name="apple-mobile-web-app-status-bar-style" content="black"></meta>
        </Head>
        <Toaster />
        <Provider store={store}>
          <OnboardingProvider>
            <WizardProvider>
              <OnboardingWrapper />
              <ChakraProvider>
                <Component {...pageProps} />
              </ChakraProvider>
            </WizardProvider>
          </OnboardingProvider>
        </Provider>
        <Analytics />
        </SessionProvider>
    );
};


export default api.withTRPC(MyApp);
