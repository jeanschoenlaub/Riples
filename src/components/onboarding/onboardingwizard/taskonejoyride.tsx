
import { useEffect, useState } from 'react';
import { useWizard } from '../../wizard/wizardswrapper';
import ReactJoyride, { CallBackProps, Step } from 'react-joyride';

export const TaskOneJoyRide = () => {
    const [isTourOpen, setIsTourOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [screenWidth, setScreenWidth] = useState<number | null>(null);
    const wizardContext = useWizard();


    useEffect(() => {
        setIsClient(true); 
        setIsTourOpen(true);
    }, []);

    useEffect(() => {
        if (isClient) {
            setScreenWidth(window.innerWidth);
        }
    }, [isClient]);

    const tooltipWidthForSidebar = screenWidth && screenWidth >= 600 ? (screenWidth / 4) - 20 : 'auto';

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
            content: "Think of a project you would like to do, either by yourself or with others. Type it in above and click the create button",
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
            target: "#project-access-and-visibility",
            title: " Project Access and Visibility ",
            content: "These concepts might be new to you, but it's pretty easy ! Click on the toggles and the sentence below will explain what the settings imply. Again you can change these later.",
            placement: "right",
            spotlightClicks: true,
            disableBeacon: true,
            styles: {
                options: {
                    width: tooltipWidthForSidebar,
                },
            }
        },
    ];

    const handleTourCallback = (data: CallBackProps) => {
        if (data.action === 'next' && data.index === 4) {
            if (isClient && wizardContext) {
                wizardContext.setShowWizard(false);
            } 
        } else {
            localStorage.setItem('productTourFinished', 'true');
        }
    };

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
                hideCloseButton={true}
                disableScrolling={true}
                callback={handleTourCallback}
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

