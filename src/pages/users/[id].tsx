//From https://trpc.io/docs/client/nextjs/server-side-helpers
import { createServerSideHelpers } from '@trpc/react-query/server';
import type{ GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';

import Head from "next/head";
import { api } from "~/utils/api";
import { GlobalNavBar } from "~/components/navbar";
import { prisma } from "~/server/db";
import { appRouter } from "~/server/api/root";
import superjson from 'superjson';
import Image from 'next/image';

import React, { useState } from 'react';


import { filterUserForClient } from '~/server/api/routers/projects';
import { clerkClient } from '@clerk/nextjs';
import { ProjectNav } from '~/components/sidebar';
import { ProjectCard } from '~/components/projectcard';
import Tabs from '~/components/tabs';

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

  // Fetch user data using Clerk
  const authorID = context.params!.id;
  const user = await clerkClient.users.getUser(authorID); //Not used yet but could be in anabout tab ? 
  const filteredUserData = filterUserForClient(user);

  /*
   * Prefetching the `getProjectByUserId` query.
   * `prefetch` does not return the result and never throws - if you need that behavior, use `fetch` instead.
   */
  await helpers.projects.getProjectByAuthorId.prefetch({ authorID });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      authorID: authorID,
      user: filteredUserData,
    },
  };
}

export default function UserPage(
    props: InferGetServerSidePropsType<typeof getServerSideProps>,
  ) {
    const { authorID, user } = props;
  
    const [activeTab, setActiveTab] = useState('projects');

    const { data: projectData } = api.projects.getProjectByAuthorId.useQuery({ authorID });
  
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

            <div id="user-main" className="relative flex flex-col w-full md:w-3/5 border border-slate-700">

            
              <div id="user-meta" className="mt-4 ml-5">
                 
                  <span className="flex space-x-10 gap-5 items-center font-medium text-gray-500">  
                      <Image 
                          src={user.imageUrl} 
                          alt="Profile Image" 
                          className="rounded-full border border-slate-300"
                          width={80}
                          height={80}
                      />
                      {`${user?.firstName} ${user?.lastName}`}
                  </span>
              </div>

              <div id="project-main-tabs" className="ml-5 border-b border-gray-200 dark:border-gray-700">
                <Tabs activeTab={activeTab} setActiveTab={setActiveTab} projects="y"/>
              </div>
              
              {/* SHOWN IF PROJECTS TAB */}
              {activeTab === 'projects' && (
                <div className="mt-4 space-y-2">
                    <div className="font text-gray-800"> 
                      <div>
                        {projectData?.map((fullProject) => (
                          <ProjectCard key={fullProject.project.id} {...fullProject}></ProjectCard>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div id="future-content" className="hidden md:flex flex-col w-1/5 p-4 border border-slate-700">
              <h1>Future Content</h1>
            </div>
          </div>
        </main>
      </>
    );
  }



