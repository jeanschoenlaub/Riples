import { api } from "~/utils/api";
import { handleMutationError } from "~/utils/error-handling";
import type { AddCommentPayload, AddlikePayload } from "./riplecardtypes";

export const useRipleInteractionsMutation = () => {
    const apiContext = api.useContext();
    const handleSuccess = async () => {
        await apiContext.like.getLikeCount.invalidate();
        await apiContext.like.hasLiked.invalidate();
    };
    const handleSuccessComment = async () => {
        await apiContext.comment.getCommentsByRiple.invalidate();
        await apiContext.comment.getCommentCount.invalidate();
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

    // Add Comment to Riple Mutation
    const { mutate: addCommentMutation, isLoading: isAddingComment } = api.comment.addComment.useMutation({
        onSuccess: handleSuccessComment,
    });

    const addCommentToRiple = (payload: AddCommentPayload) => {
        return new Promise<void>((resolve, reject) => {
            addCommentMutation(payload, {
                onSuccess: () => {
                    // Construct the notification content using the projectTitle and username from the payload.
                    const notificationContent = `User ${payload.username} commented on your Riple: ${payload.ripleTitle}`;

                    // Create a notification for the user
                    createNotificationMutation({
                        userId: payload.ripleAuthorID, 
                        content: notificationContent,
                        link: `/projects/${payload.projectId}?activeTab=riples`
                    });

                    resolve();
                },
                onError: (e) => {
                    handleMutationError(e, reject);
                }
            });
        });
    };

    // Remove Comment from Riple Mutation
    const { mutate: removeCommentMutation, isLoading: isRemovingComment } = api.comment.removeComment.useMutation({
        onSuccess: handleSuccessComment,
    });

    const removeCommentFromRiple = (commentId: string) => {
        return new Promise<void>((resolve, reject) => {
            removeCommentMutation({ commentId }, {
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
        isAddingComment,
        isRemovingComment,
        addCommentToRiple,
        removeCommentFromRiple,
        addLikeToRiple,
        removeLikeFromRiple,
    };
};


export type DeleteRiplePayload = {
    ripleId: string;
}

export const UseRiplesMutations  = () => {
    const apiContext = api.useContext();
    const handleSuccess = async () => {
        await apiContext.riples.getRipleByProjectId.invalidate();
        await apiContext.riples.getAll.invalidate();
    };

    // Delete Riple Mutation
    const { mutate: deleteRipleMutation, isLoading: isDeleting } = api.riples.delete.useMutation({
        onSuccess: handleSuccess,
    });
    
    const deleteRiple = (payload: DeleteRiplePayload) => {
        return new Promise<void>((resolve, reject) => {
        deleteRipleMutation(payload, {
            onSuccess: () => { resolve(); },
            onError: (e) => {
                handleMutationError(e, reject);
              }        
        });
        });
    };
  
  return {
    // ... other returned values
    isDeleting,
    deleteRiple,
  };
}