import { api } from "~/utils/api";

export const useCollabMutation = (followers?: Follower[] | undefined) => {
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

    // Add a mutation for creating forum answers
    const { mutate: createForumAnswerMutation, isLoading: isCreatingAnswer } = api.forum.createForumAnswer.useMutation({
      onSuccess: handleSuccess,
    });

    // Create a function to call the createForumAnswer mutation
    const createForumAnswer = (payload: CreateForumAnswerPayload) => {
      return new Promise<void>((resolve, reject) => {
        createForumAnswerMutation(payload, {
          onSuccess: () => {
            // Notify the question creator of answers
            const notificationContent = `A user replied to your discussion: ${payload.content.substring(0, 100)}...`; // Truncate content for the notification
  
              // Create a notification for each follower
              createNotificationMutation({
                userId: payload.authorId,
                content: notificationContent,
                link: `/projects/${payload.projectId}?activeTab=forum`
              }, {
                onError: (error) => {
                  console.error("Error sending notification:", error);
                }
            });
            resolve();
          },
          onError: (error) => {
            console.error("Error during forum answer creation:", error);
            reject(error);
          }
        });
      });
    };

    return {
      isCreatingQuestion,
      isCreatingAnswer,
      createForumAnswer,
      createForumQuestion,
    };
  };
  