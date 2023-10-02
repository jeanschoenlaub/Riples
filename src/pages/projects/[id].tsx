import Head from "next/head";
import { api } from "~/utils/api";
import Image from 'next/image';
import React, { useState } from 'react';
import { getSession, useSession } from 'next-auth/react'; // Importing getSession from next-auth

//From https://trpc.io/docs/client/nextjs/server-side-helpers
import { createServerSideHelpers } from '@trpc/react-query/server';
import type{ GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { prisma } from "~/server/db";
import { appRouter } from "~/server/api/root";
import superjson from 'superjson';


//My components
import { Tabs } from "~/components/reusables/tabs";
import { AboutTab } from "~/components/project-page/about/about";
import { RipleCard } from "~/components/cards/riplecard";
import { LoadingPage } from "~/components/reusables/loading";
import { CollabTab } from "~/components/project-page/collab";
import { GlobalNavBar } from "~/components/navbar/navbar";
import { SideNavProject } from "~/components/navbar/sidenavproject";
import Follow from "~/components/reusables/follow";
import { AdminTab } from "~/components/project-page/admin/admin";
import Tooltip from "~/components/reusables/tooltip";
import { RiplesTab } from "~/components/project-page/riples";

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
  const { data: session, status: sessionStatus } = useSession()
  const userId = session?.user.id;
  const { data: projectData, isLoading: projectLoading } = api.projects.getProjectByProjectId.useQuery({ projectId });
  const { data: ripleData, isLoading: ripleLoading } = api.riples.getRiplebyProjectId.useQuery({ projectId });
  const { data: projectMemberData, isLoading:projectMemberLoading} = api.projectMembers.getMembersByProjectId.useQuery({ projectId });

  const [activeTab, setActiveTab] = useState('about'); // default active tab is 'riples for project pages'

  const isLoading = (ripleLoading || projectLoading || projectMemberLoading || sessionStatus=="loading")
  if (isLoading) return(<LoadingPage isLoading={isLoading}></LoadingPage>)
  if (!projectData || !ripleData || !projectMemberData ) return (<div> Something went wrong</div>)

  //helpers to determine if the current user is a Member or the project Lead 
  const isMember = projectMemberData.some(({ member }) =>
    member.userID === session?.user.id && (member.status === 'APPROVED')
  );
  const isPending = projectMemberData.some(({ member }) =>
    member.userID ===session?.user.id && (member.status === 'PENDING')
  );
  const isProjectLead = session?.user.id === projectData.project.authorID;

  const displayCollabTab = 
    isProjectLead || isMember ||
    (projectData?.project.projectType === "collab" && projectData?.project.projectPrivacy === "public")

  return (
    <>
      <Head>
        <title>{projectData.project.title}</title>
      </Head>
      <main className="flex flex-col items-center w-full h-screen">
        <div id="nav-container" className="w-full">
          <GlobalNavBar ToogleinBetween={true}></GlobalNavBar>
        </div>

        <div className="flex justify-center w-full bg-sky-50">
            <div id="project-nav-container" className="hidden md:flex flex-col w-1/4 p-4 border border-slate-700">
              <SideNavProject></SideNavProject>
            </div>

            <div id="project-main" className="relative flex flex-col w-full md:w-3/4 border border-slate-700">
              <div id="project-main-cover-image" className=" hidden md:flex group relative w-full h-[30vh] overflow-hidden">
                  <Image 
                      src={projectData?.project.coverImageUrl} 
                      alt="Project cover image" 
                      layout="fill" 
                      objectFit="cover"
                  />

                  {/* Hover buttons */}
                  <div className="absolute bottom-0 right-0 flex flex-col items-end mb-2 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Tooltip content="The feature of uploading your own picture is coming." width="200px">
                          <span className="mb-2">
                              <button className="m-2 py-1 px-2 bg-sky-100 opacity-70 text-black cursor-not-allowed" disabled>
                                  Replace image
                              </button>
                          </span>
                      </Tooltip>
                      <Tooltip content="The feature of repositioning picture is coming." width="200px">
                          <span>
                              <button className="m-2 py-1 px-2 bg-sky-100 opacity-70 text-black cursor-not-allowed" disabled>
                                  Reposition
                              </button>
                          </span>
                      </Tooltip>
                  </div>
            </div>

            <div id="project-main-metadata" className="mt-3 ml-3 mr-3 md:mr-5 md:ml-5">
                <div id="project-metadata" className="flex items-center justify-between"> 
                  <h1 className="text-2xl font-bold">{projectData?.project.title}</h1>
                  <Follow projectId={projectId} />
                </div>

                <div id="project-main-tabs" className="border-b mt-2 border-gray-200 dark:border-gray-700">
                  <Tabs 
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab} 
                    riples="y"
                    admin={isProjectLead} 
                    collab={ displayCollabTab}
                  />
                </div>
              
                {/* SHOWN IF ABOUT TAB */}
                {activeTab === 'about' && (
                  <AboutTab project={projectData}  isMember={isMember} isPending={isPending} isProjectLead={isProjectLead} userId={userId} ></AboutTab>
                )}

                {/* SHOWN IF RIPLES TAB */}
                {activeTab === 'riples' && (
                    <RiplesTab ripleData={ripleData} ></RiplesTab>
                )}


                {/* SHOWN IF COLLAB*/}
                {activeTab === 'collab' && <CollabTab project={projectData.project} isMember={isMember} isPending={isPending} isProjectLead={isProjectLead} />}

                {/* SHOWN IF ADMIN */}
                {activeTab === 'admin' && <AdminTab project={projectData.project} members={projectMemberData} isProjectLead={isProjectLead} ></AdminTab>}

              </div>
            </div>
            </div>
      </main>
    </>
  );
}



