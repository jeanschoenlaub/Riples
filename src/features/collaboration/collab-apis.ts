import { api } from "~/utils/api";


export const useCollabMutation = (followers: Follower[] | undefined) => {
    const apiContext = api.useContext();
  
    // Function to invalidate the cache after a new question is created or a notification is sent
    const handleSuccess = async () => {
      await apiContext.forum.getForumQuestionsByProjectId.invalidate();
    };
  
    const { mutate: createForumQuestionMutation, isLoading: isCreatingQuestion } = api.forum.createForumQuestion.useMutation({
      onSuccess: handleSuccess,
    });
  
    const { mutate: createNotificationMutation } = api.notification.createNotification.useMutation({
      onSuccess: handleSuccess,
    });
  
    const createForumQuestion = (payload: CreateForumQuestionPayload) => {
      return new Promise<void>((resolve, reject) => {
        createForumQuestionMutation(payload, {
          onSuccess: () => {
            if (!followers || followers.length === 0) {
              resolve();
              return;
            }
  
            // Notify each follower about the new forum question
            followers.forEach(follower => {
              const notificationContent = `A new discussion started in the project you follow: ${payload.content.substring(0, 100)}...`; // Truncate content for the notification
  
              // Create a notification for each follower
              createNotificationMutation({
                userId: follower.userId,
                content: notificationContent,
                link: `/projects/${payload.projectId}?activeTab=forum`
              }, {
                onError: (error) => {
                  console.error("Error sending notification:", error);
                }
              });
            });
  
            resolve();
          },
          onError: (error) => {
            console.error("Error during forum question creation:", error);
            reject(error);
          }
        });
      });
    };
  
    return {
      isCreatingQuestion,
      createForumQuestion,
    };
  };
  