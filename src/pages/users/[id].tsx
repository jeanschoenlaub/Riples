//From https://trpc.io/docs/client/nextjs/server-side-helpers
import { createServerSideHelpers } from '@trpc/react-query/server';
import type{ GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';

import Head from "next/head";
import { api } from "~/utils/api";
import { prisma } from "~/server/db";
import { appRouter } from "~/server/api/root";
import superjson from 'superjson';

import { getSession, useSession } from 'next-auth/react';
import React, { useState } from 'react';
import { GlobalNavBar } from '~/components/navbar/navbar';
import { SideNavProject } from '~/components/navbar/sidenavproject';
import { Tabs } from '~/components/reusables/tabs';
import { ProjectCard } from '~/components/cards/projectcard';
import { ProfileImage } from '~/components/reusables/profileimage';
import { UserAbout } from '~/components/user-page/userinfo';
import Tooltip from '~/components/reusables/tooltip';
import { UserStats } from '~/components/user-page/userstats';
import { useRouter } from 'next/router';

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

  const authorId = context.params!.id;

  /*
   * Prefetching the `getProjectByUserId` query.
   * `prefetch` does not return the result and never throws - if you need that behavior, use `fetch` instead.
   */
  await helpers.projects.getProjectByAuthorId.prefetch({ authorId });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      authorId: authorId,
    },
  };
}

export default function UserPage(
    props: InferGetServerSidePropsType<typeof getServerSideProps>,
  ) {
    const { authorId } = props; //author id is the user id from url slug
  
  
    const router = useRouter();
    //We either have initial state on first land or can be changed from childs or via router pushes
    const [activeTab, setActiveTab] = useState<string>(() => {
      const tabFromQuery = Array.isArray(router.query.activeTab)
        ? router.query.activeTab[0]
        : router.query.activeTab;

      return tabFromQuery ?? "about";
    });

    const { data: projectData } = api.projects.getProjectByAuthorId.useQuery({ authorId });
    const { data: user} = api.users.getUserByUserId.useQuery({ userId: authorId });
    const { data: session } = useSession();
    
    const isUserOwner = session?.user.id == authorId

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
            <div id="project-nav-container" className="hidden md:flex flex-col w-1/4 p-4 border border-slate-700">
              <SideNavProject></SideNavProject>
            </div>

            <div id="user-main" className="relative flex flex-col w-full md:w-1/2 border border-slate-700">
              <div id="user-meta" className="mt-3 ml-3 mr-3 md:mr-5 md:ml-5">
                  <span className="flex space-x-10 gap-5 items-center font-medium text-gray-500">  
                      {/* User Profile Image Hover buttons */}
                      <div className="group relative">
                          <ProfileImage user={user.user} size={80} />

                          {/* Hover buttons for user's profile image */}
                          <div className="absolute bottom-0 right-0 flex flex-col items-end mb-2 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <Tooltip content="The feature of uploading your own picture is coming." shiftRight={true} width="200px">
                                  <span className="mb-2">
                                      <button className="m-2 py-1 px-2 bg-sky-100 opacity-70 text-black cursor-not-allowed" disabled>
                                          Upload picture
                                      </button>
                                  </span>
                              </Tooltip>
                          </div>
                      </div>
                  </span>
              </div>

              <div id="project-main-tabs" className="mt-3 ml-3 mr-3 md:mr-5 md:ml-5 border-b border-gray-200">
                  <Tabs activeTab={activeTab} setActiveTab={setActiveTab} projects="y" />
              </div>

              <div className="ml-3 mr-3 border-r-2 border-l-2 border-gray-20 md:mr-5 md:ml-5 space-y-2">
                  {/* SHOWN IF ABOUT TAB */}
                  {activeTab === 'about' && (
                      <>
                          <UserAbout 
                              user={{
                                  id: user.user.id,
                                  name: user.user.name ?? "",
                                  username: user.user.username ?? "",
                                  description: user.user.description,  // This assumes that 'description' isn't part of the original user object, so we default it to an empty string.
                                  // interestTags: [], // Uncomment this when you're ready to handle interest tags
                              }}
                              isUserOwner={isUserOwner}  
                          />
                          <hr/>
                           <UserStats  user={{
                                  id: user.user.id,
                                  createdAt: user.user.createdAt,
                                }}></UserStats>
                      </>
                  )}

                  {/* SHOWN IF PROJECTS TAB */}
                  {activeTab === 'projects' && (
                      <div className="font text-gray-800"> 
                          <div>
                              Only your public project 
                              {projectData?.filter(project => project.project.projectPrivacy === "public").map((fullProject) => (
                                  <ProjectCard key={fullProject.project.id} {...fullProject} />
                              ))}
                          </div>
                      </div>
                  )}
              </div>
          </div>

            <div id="future-content" className="hidden md:flex flex-col w-1/4 p-4 border border-slate-700">
              <h1>Future Content</h1>
            </div>
          </div>
        </main>
      </>
    );
  }



