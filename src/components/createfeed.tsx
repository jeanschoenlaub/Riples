import { api } from "~/utils/api";
import { LoadingPage } from "~/components/loading";
import { RipleCard } from './riplecard';
import { ProjectCard } from './projectcard';
import { CreateProjectModal } from "./createprojetmodal";
import { useState } from "react";

export const CreateFeed = () => {
  const { data: projectData, isLoading: projectLoading } = api.projects.getAll.useQuery();
    
    const [showCreateProjModal, setShowCreateProjModal] = useState(false); 

    if (projectLoading) return(<LoadingPage></LoadingPage>)
  
    if (!projectData) return(<div> Something went wrong</div>)

    const openProjModal = () => {
      setShowCreateProjModal(true);
    };
  
    return ( 
      <div>

        <div id="project-collab-create-project-button" className="mt-4 ml-2 mb-2 space-y-4 items-center justify-center">
          <button className="bg-blue-500 text-white rounded px-4 py-2" onClick={() => setShowCreateProjModal(true)}>
              Create Project
          </button>      
        </div>

        <div>
          {projectData?.map((fullProject) => (
            <ProjectCard key={fullProject.project.id} {...fullProject}></ProjectCard>
          ))}
        </div>

        {/* 
        <div>
          {data?.map((fullRiple) => (
            <RipleCard key={fullRiple.riple.id} {...fullRiple}></RipleCard>
          ))}
        </div>
        */}

        <div>
        <CreateProjectModal showModal={showCreateProjModal} onClose={() => {setShowCreateProjModal(false); // Hide the modal when closing
          }}
        />
        </div>
      </div>
    )
} 



