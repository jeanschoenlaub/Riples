//From https://trpc.io/docs/client/nextjs/server-side-helpers
import { createServerSideHelpers } from '@trpc/react-query/server';
import type{ GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';

import Head from "next/head";
import { api } from "~/utils/api";
import { prisma } from "~/server/db";
import { appRouter } from "~/server/api/root";
import superjson from 'superjson';

import { getSession } from 'next-auth/react';
import React, { useState } from 'react';
import { GlobalNavBar } from '~/components/navbar/navbar';
import { ProjectNav } from '~/components/sidebar';
import { Tabs } from '~/components/tabs';
import { ProjectCard } from '~/components/projectcard';
import { ProfileImage } from '~/components/profileimage';

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ id: string }>,
) {
  // Retrieve the session information
  const session = await getSession(context);

  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: {
        prisma,
        session,
        revalidateSSG: null, // Set to null as we are doing SSR
    },
    transformer: superjson,
  });

  const authorID = context.params!.id;

  /*
   * Prefetching the `getProjectByUserId` query.
   * `prefetch` does not return the result and never throws - if you need that behavior, use `fetch` instead.
   */
  await helpers.projects.getProjectByAuthorId.prefetch({ authorID });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      authorID: authorID,
    },
  };
}

export default function UserPage(
    props: InferGetServerSidePropsType<typeof getServerSideProps>,
  ) {
    const { authorID } = props; //author id is the user id from url slug
  
    const [activeTab, setActiveTab] = useState('projects');

    const { data: projectData } = api.projects.getProjectByAuthorId.useQuery({ authorID });
    const { data: user} = api.users.getUserByUserId.useQuery({ userId: authorID });

    if (!user) return <div>Something went wrong</div>;
  
    return (
      <>
        <Head>
          <title>{user.user.name}</title>
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
                    <ProfileImage user={user.user} size={80} />
                  </span>
              </div>

              <div id="project-main-tabs" className="ml-5 border-b border-gray-200 dark:border-gray-700">
                <Tabs activeTab={activeTab} setActiveTab={setActiveTab} projects="y"/>
              </div>

              {/* SHOWN IF ABOUT TAB */}
              {activeTab === 'about' && (
                <div className="mt-4 space-y-2">
                    <div className="font text-gray-800"> 
                      Username : {user.user.username}
                   </div>
                </div>
              )}
              
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



