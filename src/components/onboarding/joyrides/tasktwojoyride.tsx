import { useEffect, useState } from 'react';
import ReactJoyride from 'react-joyride';
import type { CallBackProps, Step } from 'react-joyride';
import { useOnboarding } from '../onboardingwrapper';

export const TaskTwoJoyRide = () => {
    const [isTourOpen, setIsTourOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true); 
        setIsTourOpen(true);
    }, []);

    const OnboardingContext = useOnboarding();
    const handleJoyrideCompletion = (data: CallBackProps) => {
        if (data.status === 'finished' || data.status === 'skipped') {OnboardingContext.setActiveJoyrideIndex(null);}
    }

    const tourSteps: Step[] = [
        {
            target: "#main-body-container",
            title: "Navigate to one of your projects",
            content: "Use the side bar to access one of your projects (top left button on mobile)",
            placement: "center",
            spotlightClicks: true,
            disableBeacon: true,
        },
        {
            target: "#project-main-tabs",
            title: "Go to your project tasks",
            content: "You can use the tabs to navigate the relevant project sections",
            placement: "bottom",
            spotlightClicks: true,
            disableBeacon: true,
        },
        {
            target: "#project-collab-task-create-button",
            title: "Create a Task",
            content: "Once a project is created, you can add tasks to it",
            placement: "bottom",
            spotlightClicks: true,
            disableBeacon: true,
        },
        {
            target: "#project-tasklist-task-0",
            title: "Click on the task",
            content: "You can view more infomation about the task by clicking it's title. You will be able to modify the task status there",
            placement: "right",
            spotlightClicks: true,
            disableBeacon: true,
        },
        {
            target: "#task-modal-status",
            title: "Task Status",
            content: "You can modify the task status here",
            placement: "bottom",
            spotlightClicks: true,
            disableBeacon: true,
        },
        {
            target: "#task-0-table-action-column",
            title: "Click on themark-down button",
            content: "You can break down tasks into subtasks. Try it!",
            placement: "top",
            spotlightClicks: true,
            disableBeacon: true,
        },
        {
            target: "#task-table-action-column",
            title: "Click on themark-down button",
            content: "You can break down tasks into subtasks. Try it!",
            placement: "top",
            spotlightClicks: true,
            disableBeacon: true,
        },
       
    ];

    if (!isClient) {
        return null;  // Render nothing during server-side rendering
    }
 
    return (
            <ReactJoyride
                steps={tourSteps}
                run={isTourOpen}
                continuous={true}
                scrollToFirstStep={false}
                showProgress={true}
                showSkipButton={true}
                disableOverlayClose={true}
                callback={handleJoyrideCompletion}
                hideCloseButton={true}
                disableScrolling={true}
                styles={{
                    options: {
                        primaryColor: '#0584C7',
                    },
                    tooltip: {
                        fontSize: 18,
                    },
                    tooltipTitle: {
                        fontSize: 20,
                    },
                }}
            ></ReactJoyride>
    );
};

