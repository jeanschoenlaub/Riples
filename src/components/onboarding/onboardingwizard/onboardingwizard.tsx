import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import Joyride from 'react-joyride';
import { TaskOneJoyRide as TaskOneJoyRideComponent } from "./taskonejoyride";

type WizardProps = {
    tasks: TaskStatus[];
};

type TaskStatus = {
    taskName: string;
    isCompleted: boolean;
    actionLink?: string;
};

export const WizardOnboarding = () => {
    
    const [taskStatuses, setTaskStatuses] = useState([
        { taskName: 'Create a project', isCompleted: false, actionLink: '/?activeTab=Create' },
        { taskName: 'Finish your user profile', isCompleted: false, actionLink: '/?activeTab=create' },
        // ... add other tasks
    ]);

    const [activeJoyrideIndex, setActiveJoyrideIndex] = useState<number | null>(null);

    const TaskJoyride = ({ isActive, index }: { isActive: boolean, index: number }) => {
        if (index === 0 && isActive) {
            return <TaskOneJoyRideComponent />;
        }
        // Add conditions for other tasks as needed.
        return null;
    };

    const { data: session } = useSession(); 
    const shouldExecuteQuery = !!session?.user?.id;
    const userId = session?.user?.id ?? '';
    const { data: projectLead, isLoading: projectLeadLoading } = api.projects.getProjectByAuthorId.useQuery(
      { authorId: userId },
      { enabled: shouldExecuteQuery }
    );

    useEffect(() => {
        if (projectLead) {
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
                        onClick={() => setActiveJoyrideIndex(index)}
                    >
                        <svg className="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="#2563eb" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7.529 7.988a2.502 2.502 0 0 1 5 .191A2.441 2.441 0 0 1 10 10.582V12m-.01 3.008H10M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                        </svg>
                    </span>
                </div>
            ))}
            
            <div className="mb-4 mt-4 border-b"> Once you&apos;re done with these, I will help you streamline your projects 🧙🏿‍♂️</div>
        </div>
        <TaskJoyride isActive={activeJoyrideIndex !== null} index={activeJoyrideIndex ?? -1} />
        </div>
    );
};
