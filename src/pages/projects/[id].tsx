import Head from "next/head";
import { api } from "~/utils/api";
import { GlobalNavBar } from "~/components/navbar";
import { ProjectNav } from "~/components/sidebar";
import { RipleCardMeta } from "~/components/feed";
//From https://trpc.io/docs/client/nextjs/server-side-helpers
import { createServerSideHelpers } from '@trpc/react-query/server';
import type{ GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { prisma } from "~/server/db";
import { appRouter } from "~/server/api/root";
import superjson from 'superjson';
import Image from 'next/image';


import { NotionEmbed } from "~/components/notionembed";
import Tabs from "~/components/tabs";

import React, { useState } from 'react';
import { useUser } from "@clerk/nextjs";
import AboutTab from "~/components/about";

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ id: string }>,
) {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: {
        prisma,
        currentUserId: null
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
  // Make sure to return { props: { trpcState: helpers.dehydrate() } }
  return {
    props: {
      trpcState: helpers.dehydrate(),
      projectId,
    },
  };
}

export default function Home(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  const { projectId } = props;
  const projQuery = api.projects.getProjectByProjectId.useQuery({ projectId });

  const { data: projectData } = projQuery;
  const { data: ripleData, isLoading: ripleLoading } = api.riples.getRiplebyProjectId.useQuery({ projectId });

  const user=useUser(); // logged in user


  const [activeTab, setActiveTab] = useState('updates'); // default active tab is 'updates for project pages'

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

            <div id="project-main" className="relative flex flex-col w-full md:w-4/5 border border-slate-700">
              <div id="project-main-cover-image" className="relative w-full h-[50vh] overflow-hidden">
                <Image 
                    src={projectData?.project.coverImageUrl} 
                    alt="Project cover image" 
                    layout="fill" 
                    objectFit="cover"
                />
              </div>
              <div id="project-main-metadata" className="mt-4 ml-16">
                <h1 className="text-2xl font-bold">{projectData?.project.title}</h1>


                <div id="project-main-tabs" className="border-b border-gray-200 dark:border-gray-700">
                  <Tabs activeTab={activeTab} setActiveTab={setActiveTab} collab={projectData?.project.notionEmbedUrl} apply={projectData?.project.applyFormUrl}/>
                </div>
              
                {/* SHOWN IF ABOUT TAB */}
                {activeTab === 'about' && (
                  <AboutTab project={projectData.project} author={projectData.author} ></AboutTab>
                )}

                {/* SHOWN IF UPDATES TAB */}
                {activeTab === 'updates' && (
                  <div className="mt-4 space-y-2">
                      <div className="font text-gray-800"> 
                        <div>
                          {ripleData?.map((fullRiple) => (
                            <RipleCardMeta key={fullRiple.riple.id} {...fullRiple}></RipleCardMeta>
                          ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* SHOWN IF COLLAB*/}
                {activeTab === 'collab' && (
                  <div className="mt-4">
                    <NotionEmbed {...projectData.project}></NotionEmbed>
                  </div>
                )}

                {/* SHOWN IF APPLY */}
                {activeTab === 'apply' && (
                  <div className="mt-4 flex justify-center items-center">
                    {user ? (
                      <a 
                        href="https://forms.gle/nfnVvnJZaMAah17v6" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
                        Apply
                      </a>
                    ) : (
                      <>
                        <div>You must be signed in to apply.</div>
                      </>
                    )}
                  </div>
                )}

            </div>
          </div>
        </div>
      </main>
    </>
  );
}



