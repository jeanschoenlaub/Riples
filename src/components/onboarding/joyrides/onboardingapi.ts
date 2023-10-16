import { api } from "~/utils/api";

export const useOnboardingMutation = () => {
    const { mutate: completeProductTourMutation } = api.userOnboarding.setProductTourCompleted.useMutation();
    const { mutate: setStepOneCompletedMutation } = api.userOnboarding.setStepOneCompleted.useMutation();
    const { mutate: setStepTwoCompletedMutation } = api.userOnboarding.setStepTwoCompleted.useMutation();
    const { mutate: setStepThreeCompletedMutation } = api.userOnboarding.setStepThreeCompleted.useMutation();
    const { mutate: setStepFourCompletedMutation } = api.userOnboarding.setStepFourCompleted.useMutation();
    const { mutate: setOnaboardingCompletedAchievement } = api.notification.createNotification.useMutation();

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

    const setStepThreeCompleted = (payload: { userId: string; }) => {
        setStepThreeCompletedMutation(payload, {
            onError: (e) => {
                console.error("Failed to save step one status:", e);
            }
        });
    };

    const setStepFourCompleted = (payload: { userId: string; }) => {
        setStepFourCompletedMutation(payload, {
            onError: (e) => {
                console.error("Failed to save step two status:", e);
            }
        });
    };

    const sendOnboardingCompletedNotification = (userId: string) => {
        const notificationContent = "Congratulations! You've completed the onboarding process.";

        // Create a notification for the user
        setOnaboardingCompletedAchievement({
            userId: userId,
            content: notificationContent,
            link: `/profile/${userId}?activeTab=achievements` // Pointing user to their achievements page
        });
    };

    return {
        completeProductTour,
        setStepOneCompleted,
        setStepTwoCompleted,
        setStepThreeCompleted,
        setStepFourCompleted,
        sendOnboardingCompletedNotification
    }
}

