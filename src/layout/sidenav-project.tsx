import { api } from "~/utils/api";
import { useState } from "react";
import { LoadingPage } from "~/components";
import { ProjectCard } from "../features/cards/project-card";
import { useSession } from "next-auth/react";

interface SideNavProjectProps {
  onClose?: () => void; // `onClose` is an optional prop, which if provided, should be a function returning void.
}

export const SideNavProject = ({ onClose }: SideNavProjectProps) => {
    const [sideBarToggle, setSideBarToggle] = useState('Doing');
    const { data: session } = useSession(); 

    const shouldExecuteQuery = !!session?.user?.id; // Run query only if session and user ID exist
    const userId = session?.user?.id ?? ''; //will never be empty 
  
  // Conditional query using tRPC to avoid no user error if not signed-in
    const { data: projectLead, isLoading: projectLeadLoading } = api.projects.getProjectByAuthorIdForSideBar.useQuery(
      { authorId: userId },
      { enabled: shouldExecuteQuery }
    )
    const { data: projectFollowed, isLoading: projectFollowedLoading } = api.projectFollowers.getProjectsFollowedByFollowerId.useQuery(
      { userId: userId },
      { enabled: shouldExecuteQuery }
    )
    const { data: projectMember, isLoading: projectMemberLoading } = api.projectMembers.getProjectsByMemberAcceptedId.useQuery(
      { userId: userId },
      { enabled: shouldExecuteQuery }
    )

    const filteredProjectLead = projectLead?.filter(project => project.project.status !== "Done") ?? [];
    const filteredProjectMember = projectMember?.filter(member => member.project.status !== "Done") ?? [];

    const combinedProjectsForWorking = [...filteredProjectLead, ...filteredProjectMember];
    
    if (!session) {
        return (<div> Log in to see your projects </div>);
    }

    const isLoading = ( projectFollowedLoading || projectLeadLoading || projectMemberLoading )

    if (isLoading) return(<LoadingPage isLoading={isLoading}></LoadingPage>)
  
    if ((!projectLead || !projectFollowed || !projectMember)) return(<div> Something went wrong</div>)

    

    return(
      <div id="project-side-bar-container" className="flex flex-col h-3/4 md:h-full items-center gap-y-4 border overflow-hidden  bg-white border-slate-300 rounded-lg mx-2 md:mx-2 p-4 mb-16 md:mb-40 shadow-md" style={{ backdropFilter: 'blur(10px)' }}> 
        {/* Toggle Following / Working */}
        <div id="project-side-bar-container-internal" className="flex flex-col items-center justify-center">
          <div className="mb-2 text-gray-500 font-semibold"> 
              Quick Project Access
           </div>
          <div className="mx-2 w-40 h-auto bg-white rounded-full cursor-pointer relative py-3">
            <div
              className={`absolute top-0 h-full bg-blue-400 bg-opacity-50 flex items-center justify-center rounded-full transition-all duration-300 ease-in-out ${sideBarToggle === "Following" ? "left-0 w-1/2" : "left-1/2 w-1/2"}`}
            >
            </div>
            <div
              onClick={() => setSideBarToggle("Following")}
              className={`absolute top-0 left-0 w-1/2 h-full flex items-center justify-center rounded-sm cursor-pointer ${sideBarToggle === "Following" ? "text-blue-500" : "text-gray-400"} p-2`}
            >
              Following
            </div>
            <div
              onClick={() => setSideBarToggle("Doing")}
              className={`absolute top-0 left-1/2 w-1/2 h-full flex items-center justify-center rounded cursor-pointer ${sideBarToggle === "Doing" ? "text-blue-500" : "text-gray-400"} p-2`}
            >
              Doing
            </div>
          </div>
        </div>

        {/*  List of projects */}
        <div id="side-bar-project-list" className="flow-root space-y w-full border-t">
          <ul role="list" className="divide-y divide-gray-200">
            {sideBarToggle === "Following" 
            ? projectFollowed?.map((fullProject) => (
                <ProjectCard
                  key={fullProject.project.id}
                  project={fullProject.project}
                  author={fullProject.author}
                  borderColor={'border-blue-500'}
                  onClick={onClose}
                />
              ))
            : combinedProjectsForWorking?.map((fullProject) => (
                <ProjectCard
                  key={fullProject.project.id}
                  project={fullProject.project}
                  author={fullProject.author}
                  borderColor={fullProject.author.id == session.user.id ?  'border-green-500':'border-purple-500'}
                  onClick={onClose}
                />
              ))}
          </ul>
        </div>

      </div>
    )
    
  }