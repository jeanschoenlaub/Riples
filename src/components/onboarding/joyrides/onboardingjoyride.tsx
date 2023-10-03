import React from 'react';
import { useEffect, useState } from 'react';
import ReactJoyride from 'react-joyride';
import type { CallBackProps, Step } from 'react-joyride';
import { useWizard } from '../../wizard/wizardswrapper';
import { useSession } from 'next-auth/react';
import { api } from '~/utils/api'; 
import { useOnboardingMutation } from './onboardingapi';

export const OnboardingJoyRideOne = () => {
    const [isTourOpen, setIsTourOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [screenWidth, setScreenWidth] = useState<number | null>(null);
    const wizardContext = useWizard();
    const { data: session } = useSession(); 

    //Quite a bit of logic for not displaying tour mutliple times
    const { completeProductTour } = useOnboardingMutation();
    let initialProductTourFinished = false;
    if (typeof localStorage !== 'undefined') {
         initialProductTourFinished = localStorage.getItem('productTourFinished') === 'true';
    }
    const [productTourFinished, setProductTourFinished] = useState(initialProductTourFinished);

    const shouldExecuteQuery = !!session?.user?.id; // Run query only if session and user ID exist
    const userId = session?.user?.id ?? ''; // This will never be empty due to the above check

    // Conditional query using tRPC to fetch the product tour status
    const { data: productTourStatus, error } = api.userOnboarding.getProductTourStatus.useQuery(
        { userId },
        { enabled: shouldExecuteQuery }
    );

    useEffect(() => {
        if (productTourStatus) {
            setProductTourFinished(productTourStatus.productTourFinished);
            localStorage.setItem('productTourFinished', productTourStatus.productTourFinished.toString());
        }
        if (error) {
            console.error("Failed to fetch product tour status:", error);
        }
    }, [productTourStatus, error]);

    useEffect(() => {
        setIsClient(true); 
        const tourTimeout = setTimeout(() => {
            if (!productTourFinished) {
                setIsTourOpen(true);
            }
        }, 5000);

        return () => clearTimeout(tourTimeout);
    }, [productTourFinished]);

    //If the user as already completed the product tour unsigned in and signs in afterwards
    useEffect(() => {
        if (session && localStorage.getItem('productTourFinished') === 'true') {
            completeProductTour({ userId: session.user.id, productTourFinished: true });
            setProductTourFinished(true);
        }
    }, [session]);

    useEffect(() => {
        if (isClient) {
            setScreenWidth(window.innerWidth);
        }
    }, [isClient]);

    const tooltipWidthForSidebar = screenWidth && screenWidth >= 600 ? (screenWidth / 4) - 40 : 'auto';
    const tooltipplacementForSidebar = screenWidth && screenWidth < 600 ? 'center' : 'right-start';
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
            target: "#navbartoggle",
            title: "Social / Create",
            content: "Click this button to toggle between the Social feed and Create feed. Try it!",
            placement: "bottom",
            spotlightClicks: true,
            disableBeacon: true,
        },
        {
            target: "#socialfeed",
            title: "The Feed",
            content: "This is the social feed, where you get the latest project news based on your friends, interests and your current projects!",
            placement: tooltipplacementForSidebar,
            disableBeacon: true,
            styles: {
                options: {
                    width: tooltipWidthForSidebar,
                },
            }
        },
        {
            target: "#misterwattbutton",
            title: "Mister Watt",
            content: "This is Mister Watt, your AI assistant. Click on Mister Watt!",
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
        {
            target: "#misterwattbutton",
            title: "First Task",
            content: "Your first task is to create a project ! Get Creating.",
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
            if (session) { 
                completeProductTour({ userId: session.user.id, productTourFinished : true })
            }
            else {
                localStorage.setItem('productTourFinished', 'true');
            }
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
            />
            </div>
        </>
    );
};

