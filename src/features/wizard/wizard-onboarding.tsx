import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { QuestionSVG } from "~/components/svg-stroke";
import Tooltip from "~/components/tooltip";
import { useOnboarding } from "../onboarding/onboardingwrapper";
import { useWizard } from "~/features/wizard";

export const WizardOnboarding = () => {
    const onboarding = useOnboarding();
    const wizardContext = useWizard();
    const [taskStatuses, setTaskStatuses] = useState([
        { taskName: 'Create a project', onboardingField: 'stepOneCompleted', isCompleted: false },
        { taskName: 'Complete a Task & a Subtask', onboardingField: 'stepTwoCompleted', isCompleted: false },
        { taskName: 'Finish your user profile', onboardingField: 'stepThreeCompleted', isCompleted: false},
        { taskName: 'Share a goal completion', onboardingField: 'stepFourCompleted', isCompleted: false},
    ]);    

    const { data: session } = useSession(); 
    const shouldExecuteQuery = !!session?.user?.id;
    const userId = session?.user?.id ?? '';
    const { data: userOnboardingStatus } = api.userOnboarding.getOnboardingStatus.useQuery(
      { userId: userId },
      { enabled: shouldExecuteQuery }
    );

    useEffect(() => {
        if (userOnboardingStatus) {
            setTaskStatuses(prevStatus => {
                const updatedStatus = [...prevStatus];
                updatedStatus.forEach(task => {
                    if (task.onboardingField in userOnboardingStatus && userOnboardingStatus[task.onboardingField as keyof typeof userOnboardingStatus]) {
                        task.isCompleted = true;
                    }
                });
                return updatedStatus;
            });
        }
    }, [userOnboardingStatus]);

    return (
        <div>
            <div className="onboarding-status-window">
                <div className="font-semibold"> Welcome to Riples 👋 </div>
                <div className="mb-4"> Complete these tasks to understand the full power of Riples:</div>
                
                {taskStatuses.map((task, index) => (
                    <div id={`onboardingtask-${index}`} key={index} className="flex">
                        <span className={`mr-1 indicator ${task.isCompleted ? 'completed' : 'pending'}`}>
                            {task.isCompleted ? '✅ ' : '🔲 '}
                        </span>
                        <span>{task.taskName}</span>
                        <span 
                            className="ml-2 text-blue-600 cursor-pointer"
                            onClick={() => { 
                                // First, reset the active index
                                onboarding.setActiveJoyrideIndex(null);

                                // Use a setTimeout to let React process the previous update
                                setTimeout(() => {
                                onboarding.setActiveJoyrideIndex(index);
                                });

                                wizardContext.setShowWizard(false)
                            }}
                        >
                            <Tooltip content="Click me for help with a guided tour and explanations" shiftRight={true} width="150px">
                                <QuestionSVG width="4" height="4" colorStrokeHex="#2563eb"></QuestionSVG>
                            </Tooltip>
                        </span>
                    </div>
                ))}
                
                <div className="mb-4 mt-4 border-b"> Once you&apos;re done with these, I will help you streamline your projects 🧙🏿‍♂️</div>
            </div>
        </div>
    );
};
