import Head from "next/head";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
dayjs.extend(relativeTime);

import { RouterOutputs, api } from "~/utils/api";
import { useUser } from "@clerk/nextjs";

//My components
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import { GlobalNavBar } from "~/components/navbar";
import { Feed } from "~/components/feed";
import { ProjectNav } from "~/components/sidebar";

type ProjectWithUser = RouterOutputs["projects"]["getProjectByProjectId"]
export default function Home(props: ProjectWithUser) {
  // You could potentially use the props.project somewhere else if needed.
  const {data, isLoading} = api.projects.getProjectByProjectId.useQuery({projectId: "cllf3m4560000o7slczuy0tb6",});
  const project = data?.project;
  const propsProject = props.project;

 
  if (isLoading) return (<LoadingPage></LoadingPage>);
  
  if (!data) return(<div> Something went wrong</div>);
  
  return (
    <>
      <Head>
        <title>{data.project.title}</title>*/
      </Head>
      <main className="flex flex-col items-center w-full h-screen">
        <div id="nav-container" className="w-full">
          <GlobalNavBar></GlobalNavBar>
        </div>

        <div className="flex justify-center w-full bg-sky-50">
          <div id="quick-links" className="hidden md:flex flex-col w-1/5 p-4 border border-slate-700">
              <ProjectNav></ProjectNav>
          </div>
          
          <div id="feed" className="flex flex-col w-full md:w-4/5 p-4 border border-slate-700">
              <div className="text-size-6xl text-font-bold">  </div>
          </div>

        </div>
      </main>

    </>
  );
}
