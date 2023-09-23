import Link from "next/link"
import { api } from "~/utils/api";
import { useState } from "react";
import { LoadingPage } from "./reusables/loading";
import { ProjectCard } from "./cards/projectcard";

export const SideNavProject = () => {
  const [SideBarToggle, setSideBarToggle] = useState('Creating');
  const { data: projectData, isLoading: projectLoading } = api.projects.getAll.useQuery();

    if (projectLoading) return(<LoadingPage isLoading={projectLoading}></LoadingPage>)
  
    if (!projectData) return(<div> Something went wrong</div>)

    return(
      <div id="project-side-bar-container" className="flex flex-col justify-center items-center gap-y-4 border bg-white border-slate-300 rounded-lg mx-2 md:mx-2 p-4 mt-4 mb-4 shadow-md" style={{ backdropFilter: 'blur(10px)' }}> 
        {/* Toggle Following / Working */}
        <div className="flex items-center justify-center">
          <div className="mx-2 w-40 h-auto bg-white rounded-full cursor-pointer relative py-3">
            <div
              className={`absolute top-0 h-full bg-blue-400 bg-opacity-50 flex items-center justify-center rounded-full transition-all duration-300 ease-in-out ${SideBarToggle === "Following" ? "left-0 w-1/2" : "left-1/2 w-1/2"}`}
            >
            </div>
            <div
              onClick={() => setSideBarToggle("Following")}
              className={`absolute top-0 left-0 w-1/2 h-full flex items-center justify-center rounded-sm cursor-pointer ${SideBarToggle === "Following" ? "text-blue-500" : "text-gray-400"} p-2`}
            >
              Following
            </div>
            <div
              onClick={() => setSideBarToggle("Working")}
              className={`absolute top-0 left-1/2 w-1/2 h-full flex items-center justify-center rounded cursor-pointer ${SideBarToggle === "Creating" ? "text-blue-500" : "text-gray-400"} p-2`}
            >
              Working
            </div>
          </div>
        </div>




    
        {/* Project List */}
        <div className="flow-root w-full border-t">
          <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
            {SideBarToggle === "Following" ? "Follow proj" : projectData?.map((fullProject) => (
              <ProjectCard key={fullProject.project.id} project={fullProject.project} author={fullProject.author} />
            ))}
          </ul>
        </div>
      </div>
    )
    
  }