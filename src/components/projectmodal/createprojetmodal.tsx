import { api } from "~/utils/api";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Modal } from "~/components/reusables/modaltemplate";  
import { handleZodError } from "~/utils/error-handling";
import toast from "react-hot-toast";
import ProjectDescriptionComponent from "./projectDescription";
import ProjectBuildComponent from "./projectBuild";
import ProjectSettingsComponent from "./projectSettings";


interface CreateProjectModalProps {
  showModal: boolean;
  inputValue? : string;
  onClose: () => void;
}

interface CreateProjectPayload {
  title: string;
  summary: string;
}

enum Step {
  ProjectDescription = 'DESCRIPTION',
  ProjectBuild = 'BUILD',
  ProjectSettings = 'SETTINGS',
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ showModal, inputValue, onClose }) => {
  const { data: session } = useSession(); 

  // For the project description component 
  const [projectName, setProjectName] = useState(inputValue ? inputValue : '');
  const [projectDescription, setProjectDescription] = useState('');

  // For the project Build page 
  const [projectStatus, setProjectStatus] = useState('To-Do');
  const [taskCount, setTaskCount] = useState<number>(0);
  const [tasks, setTasks] = useState<string[]>([]);
  const handleTasksChange = (updatedTasks: string[]) => {
      setTasks(updatedTasks);
  };

  //for the settings page
  const [isSolo, setIsSolo] = useState(true);
  const [isPrivate, setIsPrivate] = useState(true);
  const [tags, setTags] = useState<string[]>([]);
  const handleTagsChange = (updatedTags: string[]) => {
    setTags(updatedTags);
  };
  


  // Modify handleTasksChange to set task count
  useEffect(() => {
    setProjectName(inputValue ? inputValue : '');
  }, [inputValue]);

  
  //For the previous and next logic
  const [currentStep, setCurrentStep] = useState(Step.ProjectDescription);
  const nextStep = () => {
    if (currentStep === Step.ProjectDescription) {
      setCurrentStep(Step.ProjectBuild);
    } else if (currentStep === Step.ProjectBuild) {
      setCurrentStep(Step.ProjectSettings);
    }
  };

  const prevStep = () => {
    if (currentStep === Step.ProjectSettings) {
      setCurrentStep(Step.ProjectBuild);
    } else if (currentStep === Step.ProjectBuild) {
      setCurrentStep(Step.ProjectDescription);
    }
  };

  const resetForm = () => {
    setProjectDescription('');
    setTaskCount(0);  // Reset task count
    onClose();
  };

  const generateCreatePayload = (): CreateProjectPayload => ({
    title: projectName,
    summary: projectDescription
  });

  const handleSave = () => {
    const payload = generateCreatePayload();
    createProject(payload);
  };

  const { isCreating, createProject} = useProjectMutation({ onSuccess: resetForm });
  const isLoading = isCreating;

  const closeModal = () => {
    resetForm();
  };


  return (
    <>
      <Modal showModal={showModal} size="medium" isLoading={isLoading} onClose={closeModal}> 
      {currentStep === Step.ProjectDescription && 
        <ProjectDescriptionComponent 
        projectName={projectName}
        setProjectName={setProjectName}
        projectDescription={projectDescription}
        setProjectDescription={setProjectDescription}
        isLoading={isLoading}
      />
      }
      {currentStep === Step.ProjectBuild && <ProjectBuildComponent 
        projectStatus={projectStatus}
        setProjectStatus={setProjectStatus}
        taskCount={taskCount}
        setTaskCount={setTaskCount}
        tasks={tasks}
        onTasksChange={handleTasksChange}
      />}
      
      {currentStep === Step.ProjectSettings && <ProjectSettingsComponent
        tags={tags}
        onTagsChange={handleTagsChange}
        isSolo={isSolo}
        setIsSolo={setIsSolo}
        isPrivate={isPrivate}
        setIsPrivate={setIsPrivate}
      />}

      <div className="flex justify-between">
        <span className="text-lg flex justify-center items-center space-x-4 mt-2 mb-2 w-auto">
          {currentStep !== Step.ProjectDescription && (
            <button 
              onClick={prevStep}
              className="bg-blue-500 text-white text-lg rounded px-4 py-1 flex items-center justify-center w-auto"
              disabled={isLoading}
            >
              <span className='flex items-center'>
                <svg className="w-4 h-4 mr-2 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5H1m0 0 4 4M1 5l4-4"/>
                </svg>
                Previous 
              </span>
            </button>
          )}
        </span>

        <span className="text-lg flex justify-center items-center space-x-4 mt-2 mb-2 w-auto">
          {currentStep !== Step.ProjectSettings ? (
            <button 
              onClick={nextStep}
              className="bg-blue-500 text-white text-lg rounded px-4 py-1  flex items-center justify-center w-auto"
              disabled={isLoading}
            >
              <span className='flex items-center'>
                Next 
                <svg className="w-4 h-4 ml-2 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                </svg>
              </span>
            </button>
          ) : (
            <button 
              onClick={nextStep}
              className="bg-green-500 text-white text-base rounded px-4 py-1 ml-2 flex items-center justify-center w-auto"
              disabled={isLoading}
            >
              <span className='flex items-center'>
                Create
                <svg className="w-4 h-4 ml-2 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 21 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m8.806 5.614-4.251.362-2.244 2.243a1.058 1.058 0 0 0 .6 1.8l3.036.356m9.439 1.819-.362 4.25-2.243 2.245a1.059 1.059 0 0 1-1.795-.6l-.449-2.983m9.187-12.57a1.536 1.536 0 0 0-1.26-1.26c-1.818-.313-5.52-.7-7.179.96-1.88 1.88-5.863 9.016-7.1 11.275a1.05 1.05 0 0 0 .183 1.25l.932.939.937.936a1.049 1.049 0 0 0 1.25.183c2.259-1.24 9.394-5.222 11.275-7.1 1.66-1.663 1.275-5.365.962-7.183Zm-3.332 4.187a2.115 2.115 0 1 1-4.23 0 2.115 2.115 0 0 1 4.23 0Z"/>
                </svg>
              </span>
            </button>
          )}
        </span>
      </div>
      </Modal>
    </>
  );
};

// Custom hook to handle mutations and their state
const useProjectMutation =  ({ onSuccess }: { onSuccess: () => void }) => {
  const apiContext = api.useContext();
  
  // Function to run on successful mutations
  const handleSuccess = () => {
    void apiContext.projects.getAll.invalidate(); // Invalidate the cache
    onSuccess(); // Execute any additional onSuccess logic
  };
  
  //We add a mutation for creating a task (with on success)
  const { mutate: createProjectMutation, isLoading: isCreating }  = api.projects.create.useMutation({
    onSuccess: handleSuccess,
    onError: (e) => {
      const fieldErrors = e.data?.zodError?.fieldErrors; 
      const message = handleZodError(fieldErrors);
      toast.error(message);
    }
  });

  const createProject = (payload: CreateProjectPayload) => {
    createProjectMutation(payload);
  };


  return {
    isCreating,
    createProject,
  }
}