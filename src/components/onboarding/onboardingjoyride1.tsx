import React from 'react';
import { useEffect, useState } from 'react';
import ReactJoyride, { CallBackProps, Step } from 'react-joyride';
import { useWizard } from '../wizard/wizardswrapper';
import toast from 'react-hot-toast';

export const OnboardingJoyRideOne = () => {
    const [isTourOpen, setIsTourOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [screenWidth, setScreenWidth] = useState<number | null>(null);
    const wizardContext = useWizard();
    const [currentStep, setCurrentStep] = useState(0);


    useEffect(() => {
        setIsClient(true); // Once component is mounted on the client
        const tourTimeout = setTimeout(() => {
            setIsTourOpen(false);//set to true on first time open
        }, 5000);
        
        return () => clearTimeout(tourTimeout);
    }, []);

    useEffect(() => {
        if (isClient) {
            setScreenWidth(window.innerWidth);
        }
    }, [isClient]);

    const tooltipWidthForSidebar = screenWidth ? (screenWidth/4) - 20 : 'auto';
    const offsetValue = screenWidth ? (screenWidth / 8) : 0;
    const tooltipWidthForMiddle = screenWidth ? (screenWidth/2) - 20 : 'auto';

    const tourSteps: Step[] = [
        {
            target: "#global-nav-mid",
            title: "Welcome to Riples !",
            content: "A platform for hosting, sharing, and collaborating on your projects. Follow along for a super quick product tour 🏄‍♂️",
            placement: "center",
            disableBeacon: true
        },
        {
            target: "#socialfeed",
            title: "The Feed",
            content: "This is the social feed, where you get the latest project news based on your friends, interests and your current projects!",
            placement: "right-start",
            disableBeacon: true,
            styles: {
                options: {
                    width: tooltipWidthForSidebar,
                },
            }
        },
        {
            target: "#navbartoggle",
            title: "Social / Create",
            content: "Click this button to toggle between the Social feed and Create feed. Try it!",
            placement: "bottom",
            spotlightClicks: true,
            disableBeacon: true,
        },
        {
            target: "#misterwattbutton",
            title: "Mister Watt",
            content: "This is Mister Watt, your AI assistant. Click on Mister Watt!",
            placement: "left",
            spotlightClicks: true,
            disableBeacon: true,
            disableScrolling: true,
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
        {
            target: "#misterwattbutton",
            title: "First Task",
            content: "Your first task is to create a project ! If you don't know how to do one task, just click on it for instructions.",
            placement: "left",
            offset: offsetValue,
            styles: {
                options: {
                    width: tooltipWidthForMiddle,
                },
                tooltipContent: {
                    padding: '3px 1px',
                },
            },
        }
    ];

    const handleTourCallback = (data: CallBackProps) => {
        if (data.action === 'next' && data.index === 4) {
            if (isClient && wizardContext) {
                wizardContext.setShowWizard(true);
            }  
        }
        if (['completed', 'skipped'].includes(data.status)) {
            setIsTourOpen(false);
        }
    };

    if (!isClient) {
        return null;  // Render nothing during server-side rendering
    }

    return (
        <>
            <div>
            <ReactJoyride
                steps={tourSteps}
                run={isTourOpen}
                continuous={true}
                scrollToFirstStep={false}
                showProgress={true}
                showSkipButton={true}
                hideCloseButton={true}
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
            />
            </div>
        </>
    );
};