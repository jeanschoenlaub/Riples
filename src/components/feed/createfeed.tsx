import { api } from "~/utils/api";
import { LoadingPage } from "~/components/reusables/loading";
import { ProjectCard } from '../projectcard';
import { CreateProjectModal } from "../createprojectmodal/createprojetmodal";
import { useState } from "react";
import { NavBarSignInModal } from "../usermodals/signinmodal";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

export const CreateFeed = () => {
  const { data: projectData, isLoading: projectLoading } = api.projects.getAll.useQuery();
  const [showCreateProjModal, setShowCreateProjModal] = useState(false); 
  const [inputValue, setInputValue] = useState('');  // New state for input value
  const [showSignInModal, setShowSignInModal] = useState(false); // If click on folllow when not signed in we redirect

  const { data: session } = useSession();

  if (projectLoading) return <LoadingPage isLoading={projectLoading} />;
  
  if (!projectData) return <div>Something went wrong</div>;

  const handleCreateClick = () => {
    if (!session?.user?.id) {
      toast.error("You must be signed in to create a project")
      setShowSignInModal(true); // Show sign-in modal if the user is not logged in
      return;
  } // Exit if the user is not logged in
    setShowCreateProjModal(true);
    // Pass `inputValue` to your modal here if needed
  };

  return ( 
    <div>
      {/* Attractive Project Creation */}
      <div id="project-collab-create-project-button" className="mt-4 ml-6 mr-6 mb-2 flex items-center grow space-x-4">
        <input 
          type="text" 
          value={inputValue}  // Controlled input
          onChange={(e) => setInputValue(e.target.value)}  // Update state on change
          placeholder="I want to ..." 
          className="py-2 px-4 rounded grow focus:outline-none focus:border-gray-500 border-2"
        />
        <button 
          className="bg-green-500 text-white rounded px-4 py-2 hover:bg-green-600 focus:outline-none focus:border-green-700 focus:ring focus:ring-blue-200"
          onClick={() => {
            handleCreateClick();
            //setInputValue('');  // Reset the input value
          }}
        >
          <span className='flex items-center'>
          Create
          <svg className="w-4 h-4 ml-2 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 21 20">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m8.806 5.614-4.251.362-2.244 2.243a1.058 1.058 0 0 0 .6 1.8l3.036.356m9.439 1.819-.362 4.25-2.243 2.245a1.059 1.059 0 0 1-1.795-.6l-.449-2.983m9.187-12.57a1.536 1.536 0 0 0-1.26-1.26c-1.818-.313-5.52-.7-7.179.96-1.88 1.88-5.863 9.016-7.1 11.275a1.05 1.05 0 0 0 .183 1.25l.932.939.937.936a1.049 1.049 0 0 0 1.25.183c2.259-1.24 9.394-5.222 11.275-7.1 1.66-1.663 1.275-5.365.962-7.183Zm-3.332 4.187a2.115 2.115 0 1 1-4.23 0 2.115 2.115 0 0 1 4.23 0Z"/>
          </svg>
          </span>
        </button>
      </div>

      {/* Project Cards */}
      <div>
        {projectData?.map((fullProject) => (
          <ProjectCard key={fullProject.project.id} {...fullProject} />
        ))}
      </div>

      {/*  Modals Opening on logic */}
      <div>
        <CreateProjectModal showModal={showCreateProjModal} inputValue={inputValue} onClose={() => setShowCreateProjModal(false)} />
        <NavBarSignInModal showModal={showSignInModal} onClose={() => setShowSignInModal(false)} />
      </div>

      
    </div>
  )
}
