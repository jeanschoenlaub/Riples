import { useState, useEffect } from "react";
import { Modal } from "~/components/reusables/modaltemplate";  
import ProjectDescriptionComponent from "./projectdescription/projectdescription";
import ProjectBuildComponent from "./projectbuild/projectbuild";
import { useProjectMutation } from "./createprojectapi";
import type { RouterOutputs } from "~/utils/api";
import type { CreateProjectModalProps, CreateProjectPayload } from "./createprojecttypes";
import  { Step } from "./createprojecttypes";
import router from "next/router";
import { LoadingSpinner } from "../reusables/loading";
import { useWizard } from "../wizard/wizardswrapper";
import { useSelector} from 'react-redux';
import type { RootState } from '~/redux/store';


type NewProjecResponse  = RouterOutputs["projects"]["create"] 
export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ showModal, inputValue, onClose }) => {
  const wizardContext = useWizard();
  // For the project description component 
  const [projectName, setProjectName] = useState(inputValue ? inputValue : '');
  const [projectDescription, setProjectDescription] = useState('');
  const [isSolo, setIsSolo] = useState(true);
  const [isPrivate, setIsPrivate] = useState(true);
  const [tags, setTags] = useState<string[]>([]);


  const resetForm = () => {
    setProjectName('');
    setProjectDescription('');
    setIsPrivate(true);
    setIsSolo(true);
    setTags([]);
    setTasks(new Array(3).fill(''));
    setPostToFeed(false);
    setPostContent("");
    setCurrentStep(Step.ProjectDescription);
    onClose();
  };

  const handleTagsChange = (updatedTags: string[]) => {
    setTags(updatedTags);
  };

  // For the project Build page 
  const [tasks, setTasks] = useState<string[]>(new Array(3).fill(''));// We want to upate this from wizard context but not change exisitng logic
  const [postToFeed, setPostToFeed] = useState(false);
  const [postContent, setPostContent] = useState('');

  const handleTasksChange = (updatedTasks: string[]) => {
    setTasks(updatedTasks);
    wizardContext.setTaskNumber(updatedTasks.length.toString()); 
  };
  const handleAddTask = () => {
    handleTasksChange([...tasks, '']);
  }
  const handleDeleteTask = () => {
      if (tasks.length > 0) {
          const updatedTasks = [...tasks];
          updatedTasks.pop();
          handleTasksChange(updatedTasks);
      }
  }
  const tasksFromRedux = useSelector((state: RootState) => state.project.tasks);

  const [goals, setGoals] = useState<string[]>(new Array(1).fill('')); // We want to upate this from wizard context but not change exisitng logic
  const handleGoalsChange = (updatedGoals: string[]) => {
    setGoals(updatedGoals);
    wizardContext.setGoalNumber(updatedGoals.length.toString());
  };
  const handleAddGoal = () => {
    handleGoalsChange([...goals, '']);
  }
  const handleDeleteGoal = () => {
      if (goals.length > 0) {
          const updatedGoals = [...goals];
          updatedGoals.pop();
          handleGoalsChange(updatedGoals);
      }
  }
  const goalsFromRedux = useSelector((state: RootState) => state.project.goals);



  // Fill the project Name form the create feed that the user would have filled
  useEffect(() => {
    setProjectName(inputValue ? inputValue : '');
  }, [inputValue]);
  // Override task logic and set task from redux 
  const postFromRedux = useSelector((state: RootState) => state.project.post);
  useEffect(() => {
    if (tasksFromRedux.length) setTasks(tasksFromRedux);
    if (goalsFromRedux.length) setGoals(goalsFromRedux);
    if (postFromRedux.length) setPostContent(postFromRedux);
  }, [tasksFromRedux, goalsFromRedux, postFromRedux]);

  
  //For the previous and next logic
  const [currentStep, setCurrentStep] = useState(Step.ProjectDescription);
  const nextStep = () => {
    if (currentStep === Step.ProjectDescription) {
      setCurrentStep(Step.ProjectBuild);
      wizardContext.setProjectTitle(projectName);
      wizardContext.setProjectSummary(projectDescription);
      wizardContext.setWizardName("taskWizard");
      wizardContext.setShowWizard(true);
    }
  };

  const prevStep = () => {
    if (currentStep === Step.ProjectBuild) {
      setCurrentStep(Step.ProjectDescription);
    }
  };

 

  const generateCreatePayload = (): CreateProjectPayload => ({
    title: projectName,
    summary: projectDescription,
    tags: tags,
    isSolo: isSolo,
    isPrivate: isPrivate,
    tasks: tasks.filter(task => task.trim() !== ""),  // filtering tasks with empty titles
    goals: goals.filter(goal => goal.trim() !== ""),  // filtering goals with empty titles
    postToFeed: postToFeed,
    postContent: postContent,
  });

  const handleCreateProject = async  () => {
    const payload = generateCreatePayload();
    const newProject: NewProjecResponse | undefined = await createProjectAsyncMutation(payload);
    if (newProject) {
      await router.push(`/projects/${newProject.id}`);
    }
  };

  const { isCreating, createProjectAsyncMutation} = useProjectMutation({ onSuccess: resetForm });
  const isLoading = isCreating;

  const closeModal = () => {
    wizardContext.setWizardName("");
    resetForm();
  };

  return (
    <>
      <Modal showModal={showModal} size="medium" isLoading={isLoading} Logo={false} onClose={closeModal}> 
      {currentStep === Step.ProjectDescription && 
        <ProjectDescriptionComponent 
        projectName={projectName}
        setProjectName={setProjectName}
        projectDescription={projectDescription}
        setProjectDescription={setProjectDescription}
        isSolo={isSolo}
        setIsSolo={setIsSolo}
        isPrivate={isPrivate}
        setIsPrivate={setIsPrivate}
        tags={tags}
        onTagsChange={handleTagsChange}
        isLoading={isLoading}
      />
      }
      {currentStep === Step.ProjectBuild && <ProjectBuildComponent 
        tasks={tasks}
        onTaskAdd={handleAddTask}
        onTaskDelete={handleDeleteTask}
        onTasksChange={handleTasksChange}
        goals={goals}
        onGoalsChange={handleGoalsChange}
        onGoalAdd={handleAddGoal}
        onGoalDelete={handleDeleteGoal}
        postToFeed={postToFeed}
        setPostToFeed= {setPostToFeed}
        postContent={postContent}
        setPostContent={setPostContent}
        isPrivate={isPrivate}
      />}
      
      <div className="flex justify-between">
        <span className="text-lg flex justify-center items-center space-x-4 mt-4 w-auto">
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

        <span className="text-lg flex justify-center items-center space-x-4 mt-4 w-auto">
          {currentStep !== Step.ProjectBuild ? (
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
              onClick={() => { void handleCreateProject(); }}
              className="bg-green-500 text-white text-lg rounded px-4 py-1 ml-2 flex items-center justify-center w-auto"
              disabled={isLoading}
            >
              <span className='flex items-center space-x-2'>
               Create
               {isLoading ? <span className="ml-2"><LoadingSpinner size={20} /></span>:
                  <svg className="w-4 h-4 ml-2 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 21 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m8.806 5.614-4.251.362-2.244 2.243a1.058 1.058 0 0 0 .6 1.8l3.036.356m9.439 1.819-.362 4.25-2.243 2.245a1.059 1.059 0 0 1-1.795-.6l-.449-2.983m9.187-12.57a1.536 1.536 0 0 0-1.26-1.26c-1.818-.313-5.52-.7-7.179.96-1.88 1.88-5.863 9.016-7.1 11.275a1.05 1.05 0 0 0 .183 1.25l.932.939.937.936a1.049 1.049 0 0 0 1.25.183c2.259-1.24 9.394-5.222 11.275-7.1 1.66-1.663 1.275-5.365.962-7.183Zm-3.332 4.187a2.115 2.115 0 1 1-4.23 0 2.115 2.115 0 0 1 4.23 0Z"/>
                  </svg>
                 } 
              </span>
            </button>
          )}
        </span>
      </div>
      </Modal>
    </>
  );
};

