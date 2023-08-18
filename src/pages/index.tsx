import Head from "next/head";
import Link from "next/link";
import Image from 'next/image';
import toast from "react-hot-toast";
import { useState } from "react";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
dayjs.extend(relativeTime);

import { api } from "~/utils/api";
import type {RouterOutputs} from "~/utils/api";
import { useUser } from "@clerk/nextjs";

//My components
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import { GlobalNavBar } from "~/components/navbar";
import { Feed } from "~/components/feed";

const ProjectNav = () => {
  const { data, isLoading } = api.projects.getAll.useQuery();
  if (isLoading ) return(<LoadingPage></LoadingPage>)
  if (!data) return(<div> Something went wrong</div>)

  return(
    <div id="project-side-bar-container" className="border-b border-slate-700 p-4">
      <div id="project-side-bar-container-2" className="flex flex-col gap-3 items-center border-b border-e border-t border-l border-slate-300 p-2 g-4 justify-between rounded-2xl  bg-white ">
        <div id="project-side-bar-header" className="flex gap-2">
          <h1> Your Projects </h1>
        </div>
        <div id="project-side-bar-project-card-container" style={{maxHeight: "80vh", overflowY: "auto"}}>
          {data.map((fullProject) => (
              <ProjectSideBar key={fullProject.projects.id} {...fullProject}></ProjectSideBar>
          ))}
        </div>
      </div>
    </div>
  )
  
}

type fakeData = RouterOutputs["projects"]["getAll"][number]
const ProjectSideBar = (props: fakeData) => {
  const {projects, author} = props;
  const getImagePath = (ripleType: string) => {
    if (ripleType === 'solo') {
      return '/images/solo_riple.png';
    } else {
      return '/images/multi_riple.png';
    }
  };

  return(
    <div id="project-side-bar-project-card" className="flex p-4 bg-white border-b border-e border-t border-l border-slate-300 justify-between rounded-lg">
        <div id="project-side-bar-project-title">
          {projects.title}
        </div>
        
          <Image 
            src={getImagePath(projects.ripleType)} 
            alt="Riple Type"
            className="rounded-full"
            width={40}
            height={40}
          />
    </div>
  )
}

export default function Home() {
  //Start this query asap
  const {user} = useUser()
  api.projects.getAll.useQuery();
  
  return (
    <>
      <Head>
          <title>Riples - Collaborate on Projects & Join Creative Bubbles</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="description" content="Riples is a social platform where creators share projects, inviting others to join their collaborative circles. Dive into a ripple and make waves together!" />
          <meta name="keywords" content="Riples, collaboration, projects, social app, create, join, collaborate, bubbles, ripples, community" />
          <meta name="author" content="Riples Team" />
          <link rel="icon" href="/images/favicon.ico" />
      </Head>
      
      <main className="flex flex-col items-center w-full h-screen">
        <div id="nav-container" className="w-full">
          <GlobalNavBar></GlobalNavBar>
        </div>

        <div className="flex justify-center w-full bg-sky-50">
          <div id="quick-links" className="hidden md:flex flex-col w-1/4 p-4 border border-slate-700">
              <ProjectNav></ProjectNav>
          </div>
          
          <div id="feed" className="flex flex-col w-full md:w-1/2 p-4 border border-slate-700">
              <Feed></Feed>
          </div>
          
          <div id="future-content" className="hidden md:flex flex-col w-1/4 p-4 border border-slate-700">
              <h1>Future Content</h1>
          </div>
        </div>
      </main>

    </>
  );
}
