import Head from "next/head";
import Link from "next/link";
import Image from 'next/image';

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
dayjs.extend(relativeTime);

import { api } from "~/utils/api";
import type {RouterOutputs} from "~/utils/api";
import { useUser } from "@clerk/nextjs";

//My components
import { LoadingPage } from "~/components/loading";
import { GlobalNavBar } from "~/components/navbar";
import { useState } from "react";

const Feed = () => {
  const { data, isLoading } = api.projects.getAll.useQuery();
  const {mutate}  = api.projects.create.useMutation();
  const [input, setInput] = useState("")

  if (isLoading ) return(<LoadingPage></LoadingPage>)

  if (!data) return(<div> Something went wrong</div>)

  return ( 
    <div>
      <input 
        placeholder="Create a Riple"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      >
      </input> 
      <button onClick={() => mutate({content:input})}> Post</button>
      {data?.map((fullProject) => (
        <ProjectCard key={fullProject.projects.id} {...fullProject}></ProjectCard>
      ))}
  </div>
  )
} 

type ProjectWithUser = RouterOutputs["projects"]["getAll"][number]
const ProjectCard = (props: ProjectWithUser) => {
  const {projects, author} = props;

  const getImagePath = (ripleType: string) => {
    if (ripleType === 'solo') {
      return '/images/solo_riple.png';
    } else {
      return '/images/multi_riple.png';
    }
  };

  return (
    <div id="riple-card" className="border-b border-slate-700 p-4" key={projects.id}>
      <div id="riple-card-metadata"  className="flex gap-3 items-center border-b border-e border-t border-l border-slate-300 p-2 g-4 justify-between rounded-full  bg-white ">
        <div id="riple-card-metadata-auth-profile-image" className="flex gap-2">
          <Image 
            src={author?.imageUrl} 
            alt="Profile Image" 
            className="rounded-full"
            width={40}
            height={40}
          />
          <div id="riple-card-metadata-auth-name-and-created-date">
            <div className="font-bold text-gray-800"> {author?.firstName} {author?.lastName} </div>
            <div className="text-sm text-gray-400">{dayjs(projects.createdAt).fromNow()}</div>
          </div>
        </div>

        <div className="flex-shrink-0">
          <div id="riple-card-riple-type">
            <Image 
              src={getImagePath(projects.ripleType)} 
              alt="Riple Type"
              className="rounded-full"
              width={40}
              height={40}
            />
          </div>
        </div>
      </div>

      <div id="riple-card-body" className="p-4 bg-white border-b border-e border-t border-l border-slate-300 rounded-lg">
        {projects.title}
      </div>
    </div>
  );
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
              <h1>Quick Links</h1>
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
