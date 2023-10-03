import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { QuestionSVG } from "~/components/reusables/svgstroke";
import { useWizard } from "~/components/wizard/wizardswrapper";
import Tooltip from "~/components/reusables/tooltip";
import { useOnboarding } from "../onboardingwrapper";

export const WizardOnboarding = () => {
    const onboarding = useOnboarding();
    const [taskStatuses, setTaskStatuses] = useState([
        { taskName: 'Create a project', isCompleted: false, actionLink: '/?activeTab=Create' },
        { taskName: 'Create and check off a subtask', isCompleted: false, actionLink: '/?activeTab=create' },
        { taskName: 'Finish your user profile', isCompleted: false, actionLink: '/?activeTab=create' },
        // ... add other tasks
    ]);

    

    const { data: session } = useSession(); 
    const shouldExecuteQuery = !!session?.user?.id;
    const userId = session?.user?.id ?? '';
    const { data: projectLead } = api.projects.getProjectByAuthorId.useQuery(
      { authorId: userId },
      { enabled: shouldExecuteQuery }
    );

    useEffect(() => {
        if (projectLead && projectLead.length > 0) {
            setTaskStatuses(prevStatus => {
                const updatedStatus = [...prevStatus];
                const projectTask = updatedStatus.find(task => task.taskName === 'Create a project');
                if (projectTask) projectTask.isCompleted = true;
                return updatedStatus;
            });
        }
    }, [projectLead]);

    return (
        <div>
        <div className="onboarding-status-window">
            <div className="font-semibold"> Welcome to Riples 👋 </div>
            <div className="mb-4"> Complete these tasks to understand the full power of Riples:</div>
            
            {taskStatuses.map((task, index) => (
                <div id={`onboardingtask-${index}`} key={index} className="flex items-center">
                    <span className={`mr-1 indicator ${task.isCompleted ? 'completed' : 'pending'}`}>
                        {task.isCompleted ? '✅ ' : '🔲 '}
                    </span>
                    <span>{task.taskName}</span>
                    <span 
                        className="ml-2 text-blue-600 cursor-pointer"
                        onClick={() => { onboarding.setActiveJoyrideIndex(index)}}
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
