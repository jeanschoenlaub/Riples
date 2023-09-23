import Head from "next/head";
import { api } from "~/utils/api";
<<<<<<< HEAD
import { GlobalNavBar } from "~/components/navbar";
import { SocialFeed } from "~/components/feeds/socialfeed";  // Rename to avoid naming conflicts
import { SideNavProject } from "~/components/sidenavproject";
import { CreateFeed } from "~/components/feeds/createfeed"; // Assume you have a CreateFeed component
=======
import { GlobalNavBar } from "~/components/navbar/navbar";
import { Feed } from "~/components/feed";
import { ProjectNav } from "~/components/sidebar";
>>>>>>> main

export default function Home() {
  //Start this query asap
  //const {user} = useUser()
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
          <div id="project-nav-container" className="hidden md:flex flex-col w-1/5 p-4 border border-slate-700">
<<<<<<< HEAD
            <SideNavProject></SideNavProject>
=======
              <ProjectNav></ProjectNav>
>>>>>>> main
          </div>

          <div id="feed" className="flex flex-col w-full md:w-3/5 g-4 p-1 md:p-4 border border-slate-700">
              <Feed></Feed>
          </div>
              
          <div id="future-content" className="hidden md:flex flex-col w-1/5 p-4 border border-slate-700">
              <h1>Future Content</h1>
          </div>
        </div>
      </main>

    </>
  );
}
