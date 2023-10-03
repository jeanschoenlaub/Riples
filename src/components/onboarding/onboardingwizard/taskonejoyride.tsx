import { useEffect, useState } from 'react';
import ReactJoyride from 'react-joyride';
import type { CallBackProps, Step } from 'react-joyride';
import { useOnboarding } from '../onboardingwrapper';

export const TaskOneJoyRide = () => {
    const [isTourOpen, setIsTourOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [screenWidth, setScreenWidth] = useState<number | null>(null);
    
   

    useEffect(() => {
        setIsClient(true); 
        setIsTourOpen(true);
    }, []);

    useEffect(() => {
        if (isClient) {
            setScreenWidth(window.innerWidth);
        }
    }, [isClient]);

    const OnboardingContext = useOnboarding();
    const handleJoyrideCompletion = (data: CallBackProps) => {
        if (data.status === 'finished' || data.status === 'skipped') {OnboardingContext.setActiveJoyrideIndex(null);}
    }

    const tooltipWidthForSidebar = screenWidth && screenWidth >= 600 ? (screenWidth / 4) - 20 : 'auto';
    const offsetValue = screenWidth ? (screenWidth / 8) : 0;
    const tooltipWidthForMiddle = screenWidth ? (screenWidth/2) - 20 : 'auto';

    const tourSteps: Step[] = [
        {
            target: "#navbartoggle",
            title: "Navigate to Create Feed",
            content: "Click on the Create text in the toogle highlighted above",
            placement: "bottom",
            spotlightClicks: true,
            disableBeacon: true,
        },
        {
            target: "#project-collab-create-project-entry",
            title: "What do you want to get done ? ",
            content: "Think of a project you would like to do, maybe related to sports, learning, creating .... Type it in above and click the create button",
            placement: "bottom",
            spotlightClicks: true,
            disableBeacon: true,

        },
        {
            target: "#project-collab-create-project-button",
            title: "Click that button",
            content: "Click create",
            placement: "bottom",
            spotlightClicks: true,
            disableBeacon: true,

        },
        {
            target: "#create-projec-modal-project-name-and-content",
            title: " Project Info ",
            content: "You can add some context (optional). Don't worry, you can change the title and the story easily later !",
            placement: "right",
            spotlightClicks: true,
            disableBeacon: true,
            styles: {
                options: {
                    width: tooltipWidthForSidebar,
                },
            }
        },
        {
            target: "#project-access-and-visibility-with-text",
            title: " Project Access and Visibility ",
            content: "Choose who can see and participate in this project (can be changed later.)",
            placement: "right",
            spotlightClicks: true,
            disableBeacon: true,
            styles: {
                options: {
                    width: tooltipWidthForSidebar,
                },
            }
        },
        {
            target: "#project-tags",
            title: "Project Tags ",
            content: "Optional, allows Riples to recommend you project to the user with matching interest and skillsets. Only for public",
            placement: "top",
            spotlightClicks: true,
            disableBeacon: true,
            styles: {
                options: {
                    width: tooltipWidthForSidebar,
                },
            }
        },
        {
            target: "#next-button-project-create-modal",
            title: "Click Next",
            content: "",
            placement: "top",
            spotlightClicks: true,
            disableOverlay: true,
            disableBeacon: true,
            styles: {
                options: {
                    width: tooltipWidthForSidebar,
                },
            }
        },
        {
            target: "#project-build-tasks",
            title: "Task",
            content: "Break down your projects into tasks. You can use the + and - buttonsto add or remove task. Also you can use AI to create task for you (next)",
            placement: "right",
            spotlightClicks: true,
            disableBeacon: true,
            styles: {
                options: {
                    width: tooltipWidthForSidebar,
                },
            }
        },
        {
            target: "#wizardtask",
            title: "AI Project Manager",
            content: "Mister Watt turned into a proffessional PM, to help you out. ",
            placement: "left",
            spotlightClicks: true,
            disableBeacon: true,
            offset: offsetValue,
            styles: {
                options: {
                    width: tooltipWidthForMiddle,
                },
                tooltipContent: {
                    padding: '3px 1px',
                },
            },
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

