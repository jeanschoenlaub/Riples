import { api } from "~/utils/api";
import type { CreateRiplePayload } from "./createripletypes";
import { handleMutationError } from "~/utils/error-handling";

type Follower = {
    userId: string;
    // Add any other properties of a follower if required
};

export const useRipleMutation = (followers: Follower[] | undefined) => {
    const apiContext = api.useContext();

    const handleSuccess = async () => {
      await apiContext.riples.getRipleByProjectId.invalidate();
    };
  
    const { mutate: createRipleMutation, isLoading: isCreating } = api.riples.create.useMutation({
        onSuccess: handleSuccess,
    });

    const { mutate: createNotificationMutation } = api.notification.createNotification.useMutation({
        onSuccess: handleSuccess,
    });

    const createRiple = (payload: CreateRiplePayload) => {
        return new Promise<void>((resolve, reject) => {
          createRipleMutation(payload, {
            onSuccess: () => {
              
              if(!followers || followers.length === 0) {
                reject(new Error("No followers provided"));
                return;
              }
              
              // Notify each follower about the new Riple
              followers.forEach(follower => {
                const notificationContent = `A new Riple has been posted in this project you follow: ${payload.projectTitle}`;
                
                // Create a notification for each follower
                createNotificationMutation({
                    userId: follower.userId, 
                    content: notificationContent,
                    link: `/projects/${payload.projectId}?activeTab=riples`
                });
              });
              resolve();
            },
            onError: (e) => {
              handleMutationError(e, reject);
            }    
          });
        });
      };
      
    return {
        isCreating,
        createRiple,
    };      
}
