import { CreateProjectModal } from "../create-project/create-project";
import { useState } from "react";
import { NavBarSignInModal } from "../navbar/signinmodal";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { ToDoList } from "../create-feed-grid-components/to-do-list";
import { DueTasks } from "../create-feed-grid-components/latest-due-tasks";

export const CreateFeed = () => {
  //const { data: projectData, isLoading: projectLoading } = api.projects.getAll.useQuery();
  const [showCreateProjModal, setShowCreateProjModal] = useState(false); 
  const [inputValue, setInputValue] = useState('');  // New state for input value
  const [showSignInModal, setShowSignInModal] = useState(false); // If click on folllow when not signed in we redirect

  const { data: session } = useSession();
  
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
      {/*  Project Creation input and button */}
      <div id="project-collab-create-project-entry" className="mt-4 mr-2 md:ml-6 md:mr-6 mb-2 flex items-center grow space-x-4">
        <input 
          id="project-collab-create-project-input"
          type="text" 
          value={inputValue}  // Controlled input
          onChange={(e) => setInputValue(e.target.value)}  // Update state on change
          placeholder="Create a project" 
          className="py-2 px-4 text-base rounded grow focus:outline-none focus:border-gray-500 border-2"
        />
        <button 
          id="project-collab-create-project-button"
          className="bg-green-500 text-white rounded px-4 py-2 hover:bg-green-600 focus:outline-none focus:border-green-700 focus:ring focus:ring-blue-200"
          onClick={() => {
            handleCreateClick();
            //setInputValue('');  // Reset the input value
          }}
        >
          <span className='flex text-lg items-center'>
          Create
          <svg className="w-5 h-5 ml-2 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 21 18">
            <path stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m8.806 5.614-4.251.362-2.244 2.243a1.058 1.058 0 0 0 .6 1.8l3.036.356m9.439 1.819-.362 4.25-2.243 2.245a1.059 1.059 0 0 1-1.795-.6l-.449-2.983m9.187-12.57a1.536 1.536 0 0 0-1.26-1.26c-1.818-.313-5.52-.7-7.179.96-1.88 1.88-5.863 9.016-7.1 11.275a1.05 1.05 0 0 0 .183 1.25l.932.939.937.936a1.049 1.049 0 0 0 1.25.183c2.259-1.24 9.394-5.222 11.275-7.1 1.66-1.663 1.275-5.365.962-7.183Zm-3.332 4.187a2.115 2.115 0 1 1-4.23 0 2.115 2.115 0 0 1 4.23 0Z"/>
          </svg>
          </span>
        </button>
      </div>

      
      <div className="flex mt-6 justify-center">
        <a href="https://forms.gle/WPq2stK3YBDcggHw5" target="_blank" rel="noopener noreferrer">
              <button className="bg-green-500 text-white rounded py-1 px-2 text-center text-sm">
                Feedback
              </button>
            </a>
      </div>

      {/* To do list */}
      <DueTasks></DueTasks>
      <ToDoList></ToDoList>

      {/*  Modals Opening on logic */}
      <div>
        <CreateProjectModal showModal={showCreateProjModal} inputValue={inputValue} onClose={() => setShowCreateProjModal(false)} />
        <NavBarSignInModal showModal={showSignInModal} onClose={() => setShowSignInModal(false)} />
      </div>

    </div>
  )
}