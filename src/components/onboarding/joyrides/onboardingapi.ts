import { api } from "~/utils/api";

export const useOnboardingMutation = () => {
    const { mutate: completeProductTourMutation } = api.userOnboarding.setProductTourCompleted.useMutation();
    const { mutate: setStepOneCompletedMutation } = api.userOnboarding.setStepOneCompleted.useMutation();
    const { mutate: setStepTwoCompletedMutation } = api.userOnboarding.setStepTwoCompleted.useMutation();


    const completeProductTour = (payload: { userId: string }) => {
        completeProductTourMutation(payload, {
            onError: (e) => {
                console.error("Failed to save product tour status:", e);
            }
        });
    };

    const setStepOneCompleted = (payload: { userId: string; }) => {
        setStepOneCompletedMutation(payload, {
            onError: (e) => {
                console.error("Failed to save step one status:", e);
            }
        });
    };

    const setStepTwoCompleted = (payload: { userId: string; }) => {
        setStepTwoCompletedMutation(payload, {
            onError: (e) => {
                console.error("Failed to save step two status:", e);
            }
        });
    };

    return {
        completeProductTour,
        setStepOneCompleted,
        setStepTwoCompleted  // make sure to return it
    }
}
