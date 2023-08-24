//From https://trpc.io/docs/client/nextjs/server-side-helpers
import { createServerSideHelpers } from '@trpc/react-query/server';
import type{ GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';

import Head from "next/head";
import { api } from "~/utils/api";
import { GlobalNavBar } from "~/components/navbar";
import { prisma } from "~/server/db";
import { appRouter } from "~/server/api/root";
import superjson from 'superjson';

import React, { useState } from 'react';


import { filterUserForClient } from '~/server/api/routers/projects';
import { clerkClient } from '@clerk/nextjs';
import { ProjectNav } from '~/components/sidebar';

// ...

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ id: string }>,
) {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: {
      prisma,
      currentUserId: null,
    },
    transformer: superjson,
  });
  const userId = context.params!.id;

  // Fetch user data using Clerk
  const user = await clerkClient.users.getUser(userId);
  const filteredUserData = filterUserForClient(user);

  return {
    props: {
      trpcState: helpers.dehydrate(),
      user: filteredUserData,
    },
  };
}

export default function UserPage(
    props: InferGetServerSidePropsType<typeof getServerSideProps>,
  ) {
    const { user } = props;
  
    const [activeTab, setActiveTab] = useState('about');
  
    if (!user) return <div>Something went wrong</div>;
  
    return (
      <>
        <Head>
          <title>{user.firstName}</title>
        </Head>
        <main className="flex flex-col items-center w-full h-screen">
          <div id="nav-container" className="w-full">
            <GlobalNavBar />
          </div>
  
          <div className="flex justify-center w-full bg-sky-50">
            <div id="project-nav-container" className="hidden md:flex flex-col w-1/5 p-4 border border-slate-700">
              <ProjectNav></ProjectNav>
            </div>

            <div id="user-main" className="relative flex flex-col w-full md:w-4/5 border border-slate-700">
                {user.firstName}
                {user.lastName}
            </div>
          </div>
        </main>
      </>
    );
  }



