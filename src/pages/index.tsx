import Head from "next/head";
import { useState } from "react";
import { api } from "~/utils/api";
import { GlobalNavBar } from "~/components/navbar";
<<<<<<< HEAD
import { SocialFeed } from "~/components/feed/socialfeed";  // Rename to avoid naming conflicts
import { ProjectNav } from "~/components/sidebar";
import { CreateFeed } from "~/components/feed/createfeed"; // Assume you have a CreateFeed component
=======
import { SocialFeed } from "~/components/feeds/socialfeed";  // Rename to avoid naming conflicts
import { SideNavProject } from "~/components/sidenavproject";
import { CreateFeed } from "~/components/feeds/createfeed"; // Assume you have a CreateFeed component
>>>>>>> mvp_sprint_2

export default function Home() {
  // Initialize component state
  const [activeTab, setActiveTab] = useState("Social");

  // Start this query ASAP
  api.projects.getAll.useQuery();

  return (
    <>
      <Head>
        {/* ... your Head content ... */}
      </Head>

      <main className="flex flex-col items-center w-full h-screen">
        <div id="nav-container" className="w-full">
          <GlobalNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        <div className="flex justify-center w-full bg-sky-50">
          <div id="project-nav-container" className="hidden md:flex flex-col w-1/5 p-4 border border-slate-700">
            <SideNavProject></SideNavProject>
          </div>

          <div className="flex flex-col w-full md:w-3/5 g-4 p-1 md:p-4 border border-slate-700">
            {/* Different Content Between Social and Create */}
            {activeTab === "Social" ? <SocialFeed /> : <CreateFeed />}
          </div>

          <div id="future-content" className="hidden md:flex flex-col w-1/5 p-4 border border-slate-700">
            <h1>Future Content</h1>
          </div>
        </div>
      </main>
    </>
  );
}
