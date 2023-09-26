import { OnboardingJoyRideOne } from "./onboardingjoyride";
import { OnboardingUserProfile } from "./onboardinguserprofiles";

export const OnboardingWrapper: React.FC = () => {
  return (
    <>
      <OnboardingJoyRideOne/>
      <OnboardingUserProfile/>
    </>
  );
};
