import Head from "next/head";
import { api } from "~/utils/api";
import { GlobalNavBar } from "~/components/navbar/navbar";
import { SideNavProject } from "~/components/navbar/sidenavproject";
import { SocialFeed } from "~/components/feeds/socialfeed";  // Rename to avoid naming conflicts
import { CreateFeed } from "~/components/feeds/createfeed"; // Assume you have a CreateFeed component
import { useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  //Start this query asap
  api.projects.getAll.useQuery();

  const router = useRouter();
  //We either have initial state on first land or can be changed from childs or via router pushes
  const [activeTab, setActiveTab] = useState<string>(() => {
    const tabFromQuery = Array.isArray(router.query.activeTab)
      ? router.query.activeTab[0]
      : router.query.activeTab;

    return tabFromQuery ?? "Create";
  });
  
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
          <GlobalNavBar activeTab={activeTab} setActiveTab={setActiveTab
          } />
        </div>

        <div id="main-body-container" className="flex justify-center w-full bg-sky-50">
          <div id="project-nav-container" className="hidden md:flex flex-col w-1/4 p-4 ">
            <SideNavProject></SideNavProject>
          </div>

         <div id="feed-container" className="flex flex-col  w-full md:w-1/2 g-4 p-4 ">
            {/* Different Content Between Social and Create */}
            {activeTab === "Social" ? <SocialFeed /> : <CreateFeed />}
          </div>
              
          <div id="future-content" className="hidden md:flex flex-col w-1/4 p-4 ">
              <h1></h1>
          </div>
        </div>
      </main>

    </>
  );
}
