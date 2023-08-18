import Head from "next/head";
import { api } from "~/utils/api";
import { GlobalNavBar } from "~/components/navbar";
import { ProjectNav } from "~/components/sidebar";
//From https://trpc.io/docs/client/nextjs/server-side-helpers
import { createServerSideHelpers } from '@trpc/react-query/server';
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { prisma } from "~/server/db";
import { appRouter } from "~/server/api/root";
import superjson from 'superjson';

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

  const { data } = projQuery;
  return (
    <>
      <Head>
        <title>{data?.project.title}</title>*/
      </Head>
      <main className="flex flex-col items-center w-full h-screen">
        <div id="nav-container" className="w-full">
          <GlobalNavBar></GlobalNavBar>
        </div>

        <div className="flex justify-center w-full bg-sky-50">
          <div id="quick-links" className="hidden md:flex flex-col w-1/5 p-4 border border-slate-700">
              <ProjectNav></ProjectNav>
          </div>
          
          <div id="project-info" className="flex flex-col w-full md:w-4/5 p-4 border border-slate-700">
             
                <h1>{data?.project.title}</h1>
                <em>Created {data?.project.createdAt.toLocaleDateString()}</em>
                <h2>Raw data:</h2>
                <pre>{JSON.stringify(data, null, 4)}</pre>
          </div>
        </div>
      </main>
    </>
  );
}


