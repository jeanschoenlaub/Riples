import Head from "next/head";
import { api } from "~/utils/api";
import React, { useEffect, useState } from 'react';
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
import { LoadingPage } from "~/components/reusables/loading";
import { CollabTab } from "~/components/project-page/collab";
import { GlobalNavBar } from "~/components/navbar/navbar";
import { SideNavProject } from "~/components/navbar/sidenavproject";
import Follow from "~/components/reusables/follow";
import { AdminTab } from "~/components/project-page/admin/admin";
import { RiplesTab } from "~/components/project-page/riples/riples";
import { useRouter } from "next/router";
import { useWizard } from "~/components/wizard/wizardswrapper";
import ProjectCoverImage from "~/components/project-page/coverimage";
import Link from "next/link";
import { BreadCrumbArrowSVG } from "~/components/reusables/svgstroke";

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
  await helpers.riples.getRipleByProjectId.prefetch({ projectId });
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
  const { data: ripleData, isLoading: ripleLoading } = api.riples.getRipleByProjectId.useQuery({ projectId });
  const { data: projectMemberData, isLoading:projectMemberLoading} = api.projectMembers.getMembersByProjectId.useQuery({ projectId });

  //Allows the setting of which tab is active via the query parameter
  const router = useRouter();
  const initialTab: string = (Array.isArray(router.query.activeTab) 
  ? router.query.activeTab[0] 
  : router.query.activeTab) ?? 'about';
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  // This useEffect will react to changes in the router.query object
  useEffect(() => {
    const newTab = (Array.isArray(router.query.activeTab) 
      ? router.query.activeTab[0] 
      : router.query.activeTab) ?? 'about';
    
    if (newTab !== activeTab) {
      setActiveTab(newTab);
    }
  }, [router.query]);


  //Then, if the user is project lead, we set the wizard to project mode
  const wizardContext = useWizard();
  const isProjectLead = session?.user.id === projectData?.project.authorID;
  useEffect(() => {
    if (isProjectLead){
      if (activeTab == "about"){
        wizardContext.setWizardName("projectabout")
      }
    return () => {
      wizardContext.setWizardName("")
    };
  }
  }, [wizardContext.setWizardName,isProjectLead, activeTab]);

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
            <div id="project-nav-container" className="hidden md:flex flex-col w-1/4 p-4 ">
              <SideNavProject></SideNavProject>
            </div>

            <div id="project-main" className="relative flex flex-col w-full md:w-3/4">
              <ProjectCoverImage coverImageId={projectData?.project.coverImageId} projectId={projectData.project.id}></ProjectCoverImage>


            <div id="project-main-metadata" className="mt-3 ml-3 mr-3 md:mr-5 md:ml-0">
                <div id="project-metadata" className="flex items-center justify-between"> 
                <nav className="justify-between block md:flex px-4 py-3 text-gray-700 border border-gray-200 rounded-lg sm:flex sm:px-5 bg-gray-50 dark:bg-gray-800 dark:border-gray-700" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center mb-3 space-x-1 md:space-x-3 sm:mb-0">
                      <li>
                        <div className="flex items-center ">
                          <Link href={"/?activeTab=Social"} className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white">
                             riples.app
                          </Link>
                        </div>
                      </li>
                      <li aria-current="page">
                        <div className="flex items-center">
                          <BreadCrumbArrowSVG height="3" width="3"></BreadCrumbArrowSVG>
                            <Link href={`/projects/${projectData.project.id}`} className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white">
                              {projectData.project.title}
                            </Link>
                          </div>
                      </li>
                      <li aria-current="page">
                        <div className="flex items-center">
                        <BreadCrumbArrowSVG height="3" width="3"></BreadCrumbArrowSVG>
                          <button id="dropdownDatabase" data-dropdown-toggle="dropdown-database" className="inline-flex items-center px-3 py-2 text-sm font-normal text-center text-gray-900 bg-sky-100 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-white dark:focus:ring-gray-700"><svg className="w-3 h-3 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                              <path d="M8 5.625c4.418 0 8-1.063 8-2.375S12.418.875 8 .875 0 1.938 0 3.25s3.582 2.375 8 2.375Zm0 13.5c4.963 0 8-1.538 8-2.375v-4.019c-.052.029-.112.054-.165.082a8.08 8.08 0 0 1-.745.353c-.193.081-.394.158-.6.231l-.189.067c-2.04.628-4.165.936-6.3.911a20.601 20.601 0 0 1-6.3-.911l-.189-.067a10.719 10.719 0 0 1-.852-.34 8.08 8.08 0 0 1-.493-.244c-.053-.028-.113-.053-.165-.082v4.019C0 17.587 3.037 19.125 8 19.125Zm7.09-12.709c-.193.081-.394.158-.6.231l-.189.067a20.6 20.6 0 0 1-6.3.911 20.6 20.6 0 0 1-6.3-.911l-.189-.067a10.719 10.719 0 0 1-.852-.34 8.08 8.08 0 0 1-.493-.244C.112 6.035.052 6.01 0 5.981V10c0 .837 3.037 2.375 8 2.375s8-1.538 8-2.375V5.981c-.052.029-.112.054-.165.082a8.08 8.08 0 0 1-.745.353Z"/>
                            </svg>Version<svg className="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
                            </svg></button>
                          <div id="dropdown-database" className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefault">
                              <li>
                                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">databaseProd</a>
                              </li>
                              <li>
                                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">databaseStaging</a>
                              </li>
                              <li>
                                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">flowbiteProd</a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </li>
                    </ol>
                  </nav>
                  <Follow projectId={projectId} />
                </div>

                <div id="project-main-tabs-container" className="border-b mt-2 border-gray-200 ">
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
                  <AboutTab project={projectData} projectTags={projectData.project.projectTags?.map(tag => tag.name) || []}  isMember={isMember} isPending={isPending} isProjectLead={isProjectLead} userId={userId} username={session?.user.username}></AboutTab>
                )}

                {/* SHOWN IF RIPLES TAB */}
                {activeTab === 'riples' && (
                    <RiplesTab ripleData={ripleData} projectId={projectId} projectTitle={projectData.project.title} projectSummary={projectData.project.summary} projectCoverImageId={projectData.project.coverImageId}></RiplesTab>
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



