import Head from "next/head";
import { api } from "~/utils/api";
import Image from 'next/image';
import React, { useState } from 'react';

//From https://trpc.io/docs/client/nextjs/server-side-helpers
import { createServerSideHelpers } from '@trpc/react-query/server';
import type{ GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { prisma } from "~/server/db";
import { appRouter } from "~/server/api/root";
import superjson from 'superjson';


//My components
import { Tabs } from "~/components/tabs";
import { AboutTab } from "~/components/about";
import { RipleCard } from "~/components/riplecard";
import { LoadingPage } from "~/components/loading";
import { CollabTab } from "~/components/collab";
import { GlobalNavBar } from "~/components/navbar/navbar";
import { ProjectNav } from "~/components/sidebar";

import { getSession } from 'next-auth/react'; // Importing getSession from next-auth
import Follow from "~/components/follow";

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

  const projectId = context.params!.id;

  /*
   * Prefetching the `getProjectByProjectId` query.
   * `prefetch` does not return the result and never throws - if you need that behavior, use `fetch` instead.
   */
  await helpers.projects.getProjectByProjectId.prefetch({ projectId });
  await helpers.riples.getRiplebyProjectId.prefetch({ projectId });
  await helpers.projectMembers.getMembersByProjectId.prefetch({ projectId });

  // Make sure to return { props: { trpcState: helpers.dehydrate() } }
  return {
    props: {
      trpcState: helpers.dehydrate(),
      projectId,
    },
  };
}

export default function Project(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  const { projectId } = props;

  const { data: projectData, isLoading: projectLoading } = api.projects.getProjectByProjectId.useQuery({ projectId });
  const { data: ripleData, isLoading: ripleLoading } = api.riples.getRiplebyProjectId.useQuery({ projectId });
  const { data: projectMemberData, isLoading: projectMemberLoading } = api.projectMembers.getMembersByProjectId.useQuery({ projectId });

  const [activeTab, setActiveTab] = useState('riples'); // default active tab is 'riples for project pages'

  if (ripleLoading || projectLoading) return(<LoadingPage></LoadingPage>)
  if (!projectData || !ripleData) return (<div> Something went wrong</div>)

  return (
    <>
      <Head>
        <title>{projectData.project.title}</title>
      </Head>
      <main className="flex flex-col items-center w-full h-screen">
        <div id="nav-container" className="w-full">
          <GlobalNavBar></GlobalNavBar>
        </div>

        <div className="flex justify-center w-full bg-sky-50">
            <div id="project-nav-container" className="hidden md:flex flex-col w-1/5 p-4 border border-slate-700">
              <ProjectNav></ProjectNav>
            </div>

            <div id="project-main" className="relative flex flex-col w-full md:w-3/5 border border-slate-700">
              <div id="project-main-cover-image" className="relative w-full h-[50vh] overflow-hidden">
                <Image 
                    src={projectData?.project.coverImageUrl} 
                    alt="Project cover image" 
                    layout="fill" 
                    objectFit="cover"
                />
              </div>
              <div id="project-main-metadata" className="mt-4 ml-5 mr-5">
                <div id="project-metadata" className="flex items-center justify-between"> 
                  <h1 className="text-2xl font-bold">{projectData?.project.title}</h1>
                  <Follow projectId={projectId} />
                </div>

                <div id="project-main-tabs" className="border-b border-gray-200 dark:border-gray-700">
                  <Tabs 
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab} 
                    riples="y" 
                    collab={projectData?.project.projectType === "multi" ? "y" : ""}
                  />
                </div>
              
                {/* SHOWN IF ABOUT TAB */}
                {activeTab === 'about' && (
                  <AboutTab project={projectData.project} author={projectData.author} members={projectMemberData} ></AboutTab>
                )}

                {/* SHOWN IF RIPLES TAB */}
                {activeTab === 'riples' && (
                  <div className="mt-4 space-y-2">
                      <div className="font text-gray-800"> 
                        <div>
                          {ripleData?.map((fullRiple) => (
                            <RipleCard key={fullRiple.riple.id} {...fullRiple}></RipleCard>
                          ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* SHOWN IF COLLAB*/}
                {activeTab === 'collab' && <CollabTab project={projectData.project} />}

              </div>
            </div>
            <div id="future-content" className="hidden md:flex flex-col w-1/5 p-4 border border-slate-700">
              <h1>Future Content</h1>
          </div>
        </div>
      </main>
    </>
  );
}



