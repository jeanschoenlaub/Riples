import { api } from "~/utils/api";
import { handleMutationError } from "~/utils/error-handling";

export  interface AddlikePayload {
    ripleId: string;
    projectId: string;
    ripleAuthorID: string;
    ripleTitle: string;
    username: string;
}

export const useRipleInteractionsMutation = () => {
    const apiContext = api.useContext();
    const handleSuccess = async () => {
        await apiContext.like.getLikeCount.invalidate();
        await apiContext.like.hasLiked.invalidate();
    };

    // Add Like to Riple Mutation
    const { mutate: addLikeMutation, isLoading: isAddingLike } = api.like.addLike.useMutation({
        onSuccess: handleSuccess,
    });

    const { mutate: createNotificationMutation } = api.notification.createNotification.useMutation({
        onSuccess: handleSuccess,
      });

    const addLikeToRiple = (payload: AddlikePayload) => {
        return new Promise<void>((resolve, reject) => {
            addLikeMutation( payload , {
                onSuccess: () => { 
                    // Construct the notification content using the projectTitle and username from the payload.
                    const notificationContent = `User ${payload.username} like your Riple: ${payload.ripleTitle}`;

                    // Create a notification for the user
                    createNotificationMutation({
                        userId: payload.ripleAuthorID, 
                        content: notificationContent,
                        link: `/projects/${payload.projectId}?activeTab=riples` // This is just an example. You can set it according to your routing structure.
                    });

                    resolve();
                 },
                onError: (e) => {
                    handleMutationError(e, reject);
                }
            });
        });
    };

    // Remove Like from Riple Mutation
    const { mutate: removeLikeMutation, isLoading: isRemovingLike } = api.like.removeLike.useMutation({
        onSuccess: handleSuccess,
    });

    const removeLikeFromRiple = (ripleId: string) => {
        return new Promise<void>((resolve, reject) => {
            removeLikeMutation({ ripleId }, {
                onSuccess: () => { resolve(); },
                onError: (e) => {
                    handleMutationError(e, reject);
                }
            });
        });
    };

    return {
        isAddingLike,
        isRemovingLike,
        addLikeToRiple,
        removeLikeFromRiple
    };
};
