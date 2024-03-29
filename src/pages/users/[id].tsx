//From https://trpc.io/docs/client/nextjs/server-side-helpers
import { createServerSideHelpers } from '@trpc/react-query/server';
import type{ GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';

import { api } from "~/utils/api";
import { prisma } from "~/server/db";
import { appRouter } from "~/server/api/root";
import superjson from 'superjson';

import { getSession, useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { Tabs, ProfileImage , Tooltip } from '~/components';
import { useRouter } from 'next/router';
import { FocusLayout } from '~/layout/focus-layout';
import { UserPortofolio } from '~/features/page-user/user-portofolio';
import { UserAbout } from '~/features/page-user/user-info';
import { UserStats } from '~/features/page-user/user-stats';

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
    const [activeTab, setActiveTab] = useState<string>("about");  // default to "about" initially

    useEffect(() => {
      const tabFromQuery = Array.isArray(router.query.activeTab)
        ? router.query.activeTab[0]
        : router.query.activeTab;

      setActiveTab(tabFromQuery ?? "about");
    }, [router.query]);

    const { data: projectsByAuthor } = api.projects.getProjectByAuthorId.useQuery({ authorId });
    const { data: projectsByMember } = api.projects.getProjectByMemberId.useQuery({ memberId: authorId });
    const { data: user} = api.users.getUserByUserId.useQuery({ userId: authorId });
    const { data: session } = useSession();
    
    const combinedProjects = [...(projectsByAuthor ?? []), ...(projectsByMember ?? [])];

    const isUserOwner = session?.user.id == authorId

    if (!user) return <div>Something went wrong</div>;
  
    return (
      <>
         <FocusLayout ToogleinBetween={true} title={user.user.username ?? ""}>

            <div id="user-main" className="relative flex flex-col w-full">
              <div id="user-meta" className="mt-3 ml-3 mr-3 md:mr-5 md:ml-5">
                  <span className="flex space-x-10 gap-5 items-center font-medium text-gray-500">  
                      {/* User Profile Image Hover buttons */}
                      <div className="group relative">
                          <ProfileImage username={user.user.username} email={user.user.email} image={user.user.image} name={user.user.name} size={80} />

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

              <div id="user-main-tabs" className="mt-3 ml-3 mr-3 md:mr-5 md:ml-5 border-b border-gray-200">
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
                                  description: user.user.description,  
                                  interestTags: user.user.interestTags?.map(tag => tag.name) || [], 
                              }}
                              isUserOwner={isUserOwner}  
                          />
                          <hr/>
                           <UserStats  user={{
                                  id: user.user.id,
                                  createdAt: user.user.createdAt,
                                  onBoardingFinished: user.user.userOnboarding?.onBoardingFinished,
                                }}></UserStats>
                      </>
                  )}

                  {/* SHOWN IF PROJECTS TAB */}
                  {activeTab === 'projects' && (
                    <UserPortofolio projectData={combinedProjects} isUserOwner={isUserOwner}  ></UserPortofolio>
                )}
              </div>
          </div>

          </FocusLayout>
      </>
    );
  }



