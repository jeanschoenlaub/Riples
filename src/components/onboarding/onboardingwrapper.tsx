import { OnboardingJoyRideOne } from "./joyrides/onboardingjoyride";
import { OnboardingUserProfile } from "./onboardinguserprofiles";
import { createContext, useContext, useState, type ReactNode, useEffect } from 'react';
import { TaskOneJoyRide } from "./joyrides/taskonejoyride";
import { TaskTwoJoyRide } from "./joyrides/tasktwojoyride";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { Modal } from "../reusables/modaltemplate";
import { ProjectManagerAIJoyRide } from "./joyrides/pmjoyride";
import { useOnboardingMutation } from "./joyrides/onboardingapi";
import { TaskThreeJoyRide } from "./joyrides/taskthreejoyride";
import { useWizard } from "../wizard/wizardswrapper";
import { TaskFourJoyRide } from "./joyrides/taskfourjoyride";


type OnboardingContextType = {
  activeJoyrideIndex: number | null;
  setActiveJoyrideIndex: React.Dispatch<React.SetStateAction<number | null>>;
  watchOnboarding: number;
  triggerOnboardingWatch: () => void;
};

type TaskMessage = {
  title?: string;
  message?: string;
  subMessage?: string;
};


const TASK_MESSAGES: Record<number, TaskMessage> = {
  0: {
    title: "Congratulations",
    message: "You just created your first Project on Riples 💥!",
    subMessage: "Now, feel free to have a look at your newly created project tabs and move on to the next onboarding task"
  },
  1: {
    title: "As simple as that ! ",
    message: " Tasks are how you breakdown and update you progress on Riples 💪",
    subMessage: "Now, feel free to continue adding data to your project or move on to the next onboarding task"
  },
  2: {
    title: "Now we're talking",
    message: "Your profile allows other user to know about you and what you have done",
    subMessage: "You can also check out the protofolio part of your profile."
  },
  3: {
    title: "Well Done",
    message: "Sharing your progress will attract other relevant users to your project",
    subMessage: "You can also share project creation, or update riples. If you want to delete posts, you can do soby navigating to Riples of the relevant project"
  },
  // add other tasks here
};

export const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
      throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
};

export const OnboardingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
const [activeJoyrideIndex, setActiveJoyrideIndex] = useState<number | null>(null);
const [watchOnboarding, setWatchOnboarding] = useState(0);

const triggerOnboardingWatch = () => {
   setWatchOnboarding(prev => prev + 1);
   console.log(watchOnboarding);
};
return (
    <OnboardingContext.Provider value={{
        activeJoyrideIndex,
        setActiveJoyrideIndex,
        watchOnboarding,
        triggerOnboardingWatch,
    }}>
        {children}
    </OnboardingContext.Provider>
);
};

export const OnboardingWrapper: React.FC = () => {
  const { activeJoyrideIndex } = useOnboarding();
  const [showModal, setShowModal] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  const [currentTask, setCurrentTask] = useState<number | null>(null);
  const currentMessage = TASK_MESSAGES[currentTask ?? 0] ?? {};
  const wizardContext = useWizard();

  const { watchOnboarding } = useOnboarding();

  let JoyrideComponent = null;

  const { data: session } = useSession(); 
  const shouldExecuteQuery = !!session?.user?.id;

  const userId = session?.user?.id ?? '';
  const projectLeadQuery = api.projects.getFullProjectByAuthorId.useQuery(
    { authorId: userId },
    { enabled: shouldExecuteQuery }
  );
  
  const userOnboardingStatusQuery = api.userOnboarding.getOnboardingStatus.useQuery(
    { userId: userId },
    { enabled: shouldExecuteQuery }
  );

  const userDataQuery = api.users.getUserByUserId.useQuery(
    { userId: userId },
    { enabled: shouldExecuteQuery }
  );

  // Conditional query using tRPC
  const riplesDataQuery = api.riples.getRiplesByUserId.useQuery(
    { userId: session?.user?.id ?? "" },
    { enabled: shouldExecuteQuery }
  );
  
  const { data: projectLead } =  projectLeadQuery;
  const { data: userData } =  userDataQuery;
  const { data: riplesData } =  riplesDataQuery;
  const { data: userOnboardingStatus } = userOnboardingStatusQuery;

  useEffect(() => {
    const fetchData = async () => {
      console.log(userOnboardingStatus)
      try {
        if (shouldExecuteQuery) {
          await userOnboardingStatusQuery.refetch();
          await projectLeadQuery.refetch();
          await userDataQuery.refetch();
          await riplesDataQuery.refetch();
        }
      } catch (error) {
        console.error("Error refetching data:", error);
      }
    };

    void fetchData();
  }, [watchOnboarding, shouldExecuteQuery, userId]);
  // eslint-disable-next-line react-hooks/exhaustive-deps

  ////step1 check 
  const { setStepOneCompleted } = useOnboardingMutation();
  useEffect(() => {
      if (projectLead && projectLead.length > 0 && !completedTasks.includes(0) && !userOnboardingStatus?.stepOneCompleted) {
          setCompletedTasks(prev => [...prev, 0]);
          setCurrentTask(0);
          setShowModal(true);

          // Execute the mutation to update step one status
          setStepOneCompleted({ userId: userId });
          //open up the wizard for people to try and do next task
      }
  }, [projectLead, ]);
  // eslint-disable-next-line react-hooks/exhaustive-deps

  //step2 check - this only works if completing tasks on you own project
  const { setStepTwoCompleted } = useOnboardingMutation();
  const isAuthorOfRelevantProject = projectLead?.some(project => (
    project.project.tasks.some(task => 
      task.status === 'Done' &&
      task.subTasks.some(subTask => subTask.status === true)
    ) 
  ));
  useEffect(() => {
    if (isAuthorOfRelevantProject && !completedTasks.includes(1) && !userOnboardingStatus?.stepTwoCompleted) {
      setCompletedTasks(prev => [...prev, 1]);
      setCurrentTask(1);
      setShowModal(true);

      console.log("step2" +userOnboardingStatus)
  
      // Execute the mutation to update step one status
      setStepTwoCompleted({ userId: userId });
      //open up the wizard for people to try and do next task
    }
  }, [projectLead, userOnboardingStatus]);
  // eslint-disable-next-line react-hooks/exhaustive-deps

  //step3 check user has a username
  const { setStepThreeCompleted } = useOnboardingMutation();
  useEffect(() => {
    if (!userDataQuery.isLoading && userData?.user.username && !completedTasks.includes(2) && !userOnboardingStatus?.stepThreeCompleted) {
      setCompletedTasks(prev => [...prev, 2]);
      setCurrentTask(2);
      setShowModal(true);

      console.log("step3"+userOnboardingStatus)
  
      // Execute the mutation to update step one status
      setStepThreeCompleted({ userId: userId });
      //open up the wizard for people to try and do next task
    }
  }, [userData, userOnboardingStatus]);
  // eslint-disable-next-line react-hooks/exhaustive-deps

  //step3 check - this only works if completing tasks on you own project
  const { setStepFourCompleted } = useOnboardingMutation();
  const isAuthorOfRelevantRiples = riplesData?.some(ripleData => 
    ripleData.riple.ripleType === 'goalFinished'
);

  useEffect(() => {
    if (isAuthorOfRelevantRiples && !completedTasks.includes(3) && !userOnboardingStatus?.stepFourCompleted) {
      setCompletedTasks(prev => [...prev, 3]);
      setCurrentTask(3);
      setShowModal(true);
  
      // Execute the mutation to update step one status
      setStepFourCompleted({ userId: userId });
      //open up the wizard for people to try and do next task
    }
  }, [riplesData]);
  
  
  
  const onClose = () => {
      setCurrentTask(null);
      setShowModal(false);
      wizardContext.setShowWizard(true);//Aftr completing a task open the onboarding wizard for next task or real wizard
  };

  // Map activeJoyrideIndex to the correct component
  if (activeJoyrideIndex === 0) {
    JoyrideComponent = TaskOneJoyRide;
  } else if (activeJoyrideIndex === 1) {
    JoyrideComponent = TaskTwoJoyRide;
  }
  else if (activeJoyrideIndex === 2) {
    JoyrideComponent = TaskThreeJoyRide;
  }
  else if (activeJoyrideIndex === 3) {
    JoyrideComponent = TaskFourJoyRide;
  } 
  else if (activeJoyrideIndex === 4) {
    JoyrideComponent = ProjectManagerAIJoyRide;
  }

  return (
    <OnboardingProvider>
      {JoyrideComponent && <JoyrideComponent />}
      <OnboardingJoyRideOne />
      <OnboardingUserProfile />
      <Modal showModal={showModal} Success={true} size="medium" onClose={onClose}>
          <div className="flex flex-col">
            <div className="text-lg flex justify-center items-center space-x-4 mb-2 w-auto">
                {currentMessage.title}
            </div>
            <div className="text-center font-semibold mb-10 ">
              {currentMessage.message}
            </div>
            <div className="italic text-center mb-2">
              {currentMessage.subMessage}
            </div>
          </div>
          <div className="flex justify-center">
              <button 
                  onClick={onClose}
                  className="bg-red-500 text-white text-sm rounded px-4 py-1 flex items-center justify-center w-auto"
              >
                  Close
              </button>
          </div>
        </Modal> 
    </OnboardingProvider>
  );
};