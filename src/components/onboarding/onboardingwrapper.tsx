import { OnboardingJoyRideOne } from "./onboardingjoyride1";
import { OnboardingUserProfile } from "./onboardinguserprofiles";

export const OnboardingWrapper: React.FC = () => {
  return (
    <>
      <OnboardingJoyRideOne/>
      <OnboardingUserProfile/>
    </>
  );
};
