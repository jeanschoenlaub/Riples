import { OnboardingJoyRideOne } from "./joyrides/onboardingjoyride";
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
import { ClipboardSVG } from "../reusables/svgstroke";
import Tooltip from "../reusables/tooltip";


type OnboardingContextType = {
  activeJoyrideIndex: number | null;
  setActiveJoyrideIndex: React.Dispatch<React.SetStateAction<number | null>>;
  watchOnboarding: number;
  triggerOnboardingWatch: () => void;
};

type TaskMessage = {
  title: string;
  type: string;
  message: string;
  subMessage: string;
  achievement?: JSX.Element;
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
  const [currentMessage, setCurrentMessage] = useState<TaskMessage>({
    title: "",
    type:"",
    message: "",
    subMessage: "",
  });
  const wizardContext = useWizard();
  const [prevOnboardingFinished, setPrevOnboardingFinished] = useState<boolean | null>(null);

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

  //watchOnboarding is triggered from specific actions that might result in step completions for instant modal instead of on reload
  useEffect(() => {
    const fetchData = async () => {
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


  // Onboarding step1 check 
  const { setStepOneCompleted } = useOnboardingMutation();
  useEffect(() => {
      //Same logic everytime we want to have the Onboarding status Say it's not already done +check 
      if (projectLead && projectLead.length > 0 && userOnboardingStatus &&  !userOnboardingStatus?.stepOneCompleted) {
          setCurrentMessage({
            title: "Congratulations",
            type:"success",
            message: "You just created your first Project on Riples 💥!",
            subMessage: "Now, feel free to have a look at your newly created project pages"
          });
          setShowModal(true);
          // Execute the mutation to update step one status
          setStepOneCompleted({ userId: userId });
      }
  }, [projectLead, userOnboardingStatus ]);

  //step2 check - this only works if completing tasks on you own project
  const { setStepTwoCompleted } = useOnboardingMutation();
  const isAuthorOfRelevantProject = projectLead?.some(project => (
    project.project.tasks.some(task => 
      task.status === 'Done' &&
      task.subTasks.some(subTask => subTask.status === true)
    ) 
  ));
  useEffect(() => {
    if (isAuthorOfRelevantProject && userOnboardingStatus &&  !userOnboardingStatus?.stepTwoCompleted) {
      setShowModal(true);
      setCurrentMessage({
        title: "As simple as that ! ",
        type:"success",
        message: " Tasks are how you breakdown and update you progress on Riples 💪",
        subMessage: "Now, feel free to continue adding data to your project"
    });
  
      // Execute the mutation to update step one status
      setStepTwoCompleted({ userId: userId });
      //open up the wizard for people to try and do next task
    }
  }, [projectLead, userOnboardingStatus]);

  //step3 check user has a username
  const { setStepThreeCompleted } = useOnboardingMutation();
  useEffect(() => {
    if (!userDataQuery.isLoading && userData?.user.username && userData?.user.interestTags && (userData?.user.interestTags.length > 0) && userOnboardingStatus && !userOnboardingStatus?.stepThreeCompleted) {
      setShowModal(true);
      setCurrentMessage({
        title: "Now we're talking",
        type:"success",
        message: "Your profile allows other user to know about you and what you have done",
        subMessage: "You can also check out the projects (portofolio) part of your profile."
      });
  
      // Execute the mutation to update step one status
      setStepThreeCompleted({ userId: userId });
      //open up the wizard for people to try and do next task
    }
  }, [userData, userOnboardingStatus]);

  //step 4 check
  const { setStepFourCompleted } = useOnboardingMutation();
  const isAuthorOfRelevantRiples = riplesData?.some(ripleData => 
    ripleData.riple.ripleType === 'goalFinished'
  );
  useEffect(() => {
    if (isAuthorOfRelevantRiples && userOnboardingStatus && !userOnboardingStatus?.stepFourCompleted) {
      setShowModal(true);
      setCurrentMessage({
        title: "Well Done",
        type:"success",
        message: "Sharing your progress will attract other relevant users to your project",
        subMessage: "You can also share project creation, or updates. If you want to delete posts (riples), you can do so by navigating to the 'Riples' page of the relevant project"    
      });
  
      // Execute the mutation to update step one status
      setStepFourCompleted({ userId: userId });
      //open up the wizard for people to try and do next task
    }
  }, [riplesData]);

  //Finaished all steps check
  const { sendOnboardingCompletedNotification } = useOnboardingMutation();
  useEffect(() => {
    // If the previous status was not finished and the current status is finished
    if (prevOnboardingFinished === false && userOnboardingStatus?.onBoardingFinished === true) {
        setShowModal(true);
        setCurrentMessage({
            title: "Achievement Unlocked!",
            type: "achievement",
            message: "Congratulations! You've completed the onboarding!",
            achievement: (
              <Tooltip content="You've unlocked this achievement by completing onboarding!">
                  <ClipboardSVG width='8' height='8' colorStrokeHex='#2563eb' />
              </Tooltip>
            ),
            subMessage: "You can find your achievements in your Profile / About page."
        });
        sendOnboardingCompletedNotification(userId)
    }
    // Update the previous status to the current status for the next effect run
    if (userOnboardingStatus?.onBoardingFinished !== undefined) {
        setPrevOnboardingFinished(userOnboardingStatus.onBoardingFinished);
    }
}, [userOnboardingStatus]);
  
  
  const onClose = () => {
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
      <Modal  showModal={showModal} 
              Success={currentMessage.type === "success"} 
              Achievement={currentMessage.type === "achievement"}  
              size="medium" 
              onClose={onClose}
      >
          <div className="flex flex-col">
            <div className="text-lg flex justify-center items-center space-x-4 mb-2 w-auto">
                {currentMessage.title}
            </div>
            <div className="text-center font-semibold mb-2 ">
              {currentMessage.message}
            </div>
            { currentMessage && (<div className="flex justify-center font-semibold mb-2 ">
              {currentMessage.achievement}
            </div>) }
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