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
import { AboutTab } from "~/features/page-project/about/about";
import { Follow, Tabs, LoadingPage } from "~/components";
import { AdminTab } from "~/features/page-project/admin/admin";
import { RiplesTab } from "~/features/page-project/riples/riples";
import { useRouter } from "next/router";
import ProjectCoverImage from "~/features/page-project/cover-image";
import { useWizard} from "~/features/wizard";
import { FocusLayout } from "~/layout/focus-layout";
import { TaskTab } from "~/features/page-project/tasks";

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
        wizardContext.setWizardName("projectabout")
        wizardContext.setProjectId(projectId)
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

  const displayTasksTab = 
    isProjectLead || isMember ||
    (projectData?.project.projectType === "collab" && projectData?.project.projectPrivacy === "public")


  return (
    <>
      <FocusLayout ToogleinBetween={true} title={projectData.project.title}>
            
            <ProjectCoverImage isProjectLead={isProjectLead} coverImageId={projectData?.project.coverImageId} projectId={projectData.project.id}></ProjectCoverImage>

            <div id="project-main-metadata" className="mt-3 ml-3 mr-3 md:mr-5 md:ml-0">
                <div id="project-metadata" className="flex items-center justify-between"> 
                  <h1 className="text-2xl font-bold">{projectData?.project.title}</h1>
                  <Follow projectId={projectId} />
                </div>

                <div id="project-main-tabs-container" className="border-b mt-2 border-gray-200 ">
                  <Tabs 
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab} 
                    riples="y"
                    admin={isProjectLead} 
                    tasks={displayTasksTab}
                    collab={displayCollabTab}
                  />
                </div>
              
                {/* SHOWN IF ABOUT TAB */}
                {activeTab === 'about' && (
                  <AboutTab project={projectData} projectTags={projectData.project.projectTags?.map(tag => tag.name) || []}  isMember={isMember} isPending={isPending} isProjectLead={isProjectLead} userId={userId} username={session?.user.username}></AboutTab>
                )}

                {/* SHOWN IF RIPLES TAB */}
                {activeTab === 'riples' && (
                    <RiplesTab ripleData={ripleData} projectId={projectId} projectTitle={projectData.project.title}  projectSummary={projectData.project.summary} projectCoverImageId={projectData.project.coverImageId}  isMember={isMember} isProjectLead={isProjectLead}></RiplesTab>
                )}

                {/* SHOWN IF TASK*/}
                {activeTab === 'tasks' && <TaskTab project={projectData.project} isMember={isMember} isPending={isPending} isProjectLead={isProjectLead} />}

                {/* SHOWN IF COLLAB 
                {activeTab === 'collab' && <CollabTab project={projectData.project} isMember={isMember} isPending={isPending} isProjectLead={isProjectLead} />}
                */}
                {/* SHOWN IF ADMIN */}
                {activeTab === 'admin' && <AdminTab project={projectData.project} members={projectMemberData} isProjectLead={isProjectLead} ></AdminTab>}

              </div>
            </FocusLayout>
    </>
  );
}



