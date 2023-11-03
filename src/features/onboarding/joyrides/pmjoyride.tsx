import { useEffect, useState } from 'react';
import ReactJoyride from 'react-joyride';
import type { CallBackProps, Step } from 'react-joyride';
import { useOnboarding } from '../onboardingwrapper';

export const ProjectManagerAIJoyRide = () => {
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

