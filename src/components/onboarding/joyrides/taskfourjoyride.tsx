import { useEffect, useState } from 'react';
import ReactJoyride from 'react-joyride';
import type { CallBackProps, Step } from 'react-joyride';
import { useOnboarding } from '../onboardingwrapper';

export const TaskFourJoyRide = () => {
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

    const tourSteps: Step[] = [
        {
            target: "#main-body-container",
            title: "Navigate to one of your projects",
            content: "You can use the quick access bar on the left or your portofolio",
            placement: "center",
            spotlightClicks: true,
            disableBeacon: true,
            disableOverlay: true,
        },
        {
            target: "#project-main-tabs",
            title: "About Tab",
            content: "You can find and edit project information on the project about page",
            placement: "bottom",
            spotlightClicks: true,
            disableBeacon: true,
            disableOverlay: true,
        },
        {
            target: "#project-main-tabs",
            title: "About Tab",
            content: "You can find and edit project information on the project about page",
            placement: "bottom",
            spotlightClicks: true,
            disableBeacon: true,
            disableOverlay: true,
            styles: {
                options: {
                    width: tooltipWidthForSidebar,  
                },
            }
        }
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

