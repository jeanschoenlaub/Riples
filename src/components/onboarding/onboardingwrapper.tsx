import { OnboardingJoyRideOne } from "./onboardingjoyride";
import { OnboardingUserProfile } from "./onboardinguserprofiles";
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { TaskOneJoyRide } from "./onboardingwizard/taskonejoyride";
import { TaskTwoJoyRide } from "./onboardingwizard/tasktwojoyride";

type OnboardingContextType = {
  activeJoyrideIndex: number | null;
  setActiveJoyrideIndex: React.Dispatch<React.SetStateAction<number | null>>;
};

export const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
      throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
};

export const OnboardingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
const [activeJoyrideIndex, setActiveJoyrideIndex] = useState<number | null>(null);

useEffect(() => {
  console.log(activeJoyrideIndex);
}, [activeJoyrideIndex]);

return (
    <OnboardingContext.Provider value={{
        activeJoyrideIndex,
        setActiveJoyrideIndex,
    }}>
        {children}
    </OnboardingContext.Provider>
);
};

export const OnboardingWrapper: React.FC = () => {
const { activeJoyrideIndex } = useOnboarding();

let JoyrideComponent = null;

// Map activeJoyrideIndex to the correct component
if (activeJoyrideIndex === 0) {
  JoyrideComponent = TaskOneJoyRide;
} else if (activeJoyrideIndex === 1) {
  JoyrideComponent = TaskTwoJoyRide;
}

return (
  <OnboardingProvider>
    {JoyrideComponent && <JoyrideComponent />}
    <OnboardingJoyRideOne />
    <OnboardingUserProfile />
  </OnboardingProvider>
);
};