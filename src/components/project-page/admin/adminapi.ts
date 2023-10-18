import { api } from "~/utils/api";
import { handleMutationError } from "~/utils/error-handling";
import type { ApproveUserPayload, DeleteProjectPayload, EditProjectAdminPayload, RefuseUserPayload } from "./admintype";

export const useProjectAdminMutation = () => {
    const apiContext = api.useContext();
    const handleSuccess = async () => {
        await apiContext.projects.getProjectByProjectId.invalidate();
    };

    // Create Task Mutation
    const { mutate: editProjectAdminMutation, isLoading: isEditing } = api.projects.editAdmin.useMutation({
        onSuccess: handleSuccess,
    });

    const editProjectAdmin = (payload: EditProjectAdminPayload) => {
        return new Promise<void>((resolve, reject) => {
          editProjectAdminMutation(payload, {
            onSuccess: () => { resolve(); },
            onError: (e) => {
              handleMutationError(e, reject);
            }      
          });
      });
    };

    return {
      isEditing,
      editProjectAdmin,
    };
  };


export const useUserStatusMutation = () => {  
    const apiContext = api.useContext();
  
    // Function to run on successful mutations
    const handleSuccess = () => {
      void apiContext.projectMembers.getMembersByProjectId.invalidate(); // Invalidate the cache for the users
    };

      // Create Task Mutation
      const { mutate: approveUserMutation, isLoading: isApproving } = api.projectMembers.approveMember.useMutation({
        onSuccess: handleSuccess,
    });
    const { mutate: createNotificationMutation } = api.notification.createNotification.useMutation({
      onSuccess: handleSuccess,
    });

      const approveUser = (payload: ApproveUserPayload) => {
          return new Promise<void>((resolve, reject) => {
            approveUserMutation(payload, {
              onSuccess: () => { 
                  // Construct the notification content using the projectTitle and username from the payload.
                  const notificationContent = `You are now a member of project: ${payload.projectTitle}`;
      
                  // Create a notification for the user
                  createNotificationMutation({
                      userId: payload.userId, 
                      content: notificationContent,
                      link: `/projects/${payload.projectId}` // This is just an example. You can set it according to your routing structure.
                  });
      
                  resolve();
              },
              onError: (e) => {
                handleMutationError(e, reject);
              }      
            });
        });
      };

    // Refuse User Mutation
    const { mutate: rawRefuseUserMutation, isLoading: isRefusing } = api.projectMembers.deleteProjectMember.useMutation({
      onSuccess: handleSuccess,
  });

  const refuseUser = (payload: RefuseUserPayload) => {
      return new Promise<void>((resolve, reject) => {
          rawRefuseUserMutation(payload, {
              onSuccess: () => { resolve(); },
              onError: (e) => {
                  handleMutationError(e, reject);
              }      
          });
      });
  };

  // Delete Project Mutation
  const { mutateAsync: rawDeleteProjectAsyncMutation, isLoading: isDeleting } = api.projects.delete.useMutation({
      onSuccess: handleSuccess,
  });

  const deleteProject = (payload: DeleteProjectPayload) => {
      return new Promise<void>((resolve, reject) => {
          rawDeleteProjectAsyncMutation(payload, {
              onSuccess: () => { resolve(); },
              onError: (e) => {
                  handleMutationError(e, reject);
              }      
          });
      });
  };

  return {
      isApproving,
      isRefusing,
      isDeleting,
      approveUser,
      refuseUser,
      deleteProject,
  };
  };