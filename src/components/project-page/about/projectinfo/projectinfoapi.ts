import { api } from "~/utils/api";
import { handleMutationError } from "~/utils/error-handling";
import type { EditProjectPayload, ProjectMemberMutationPayload } from "./projectinfotype";

export const useProjectInfoMutation = () => {
    const apiContext = api.useContext();
    const handleSuccess = async () => {
        await apiContext.projects.getProjectByProjectId.invalidate();
    };

    // Create Task Mutation
    const { mutate: editProjectInfoMutation, isLoading: isEditing } = api.projects.editInfo.useMutation({
        onSuccess: handleSuccess,
    });

    const editProjectInfo = (payload: EditProjectPayload) => {
        return new Promise<void>((resolve, reject) => {
          editProjectInfoMutation(payload, {
            onSuccess: () => { resolve(); },
            onError: (e) => {
              handleMutationError(e, reject);
            }      
          });
      });
    };

    const { mutate: applyToProjectMutation, isLoading: isApplying } = api.projectMembers.applyToProject.useMutation({
      onSuccess: handleSuccess
    });

    const { mutate: createNotificationMutation } = api.notification.createNotification.useMutation({
      onSuccess: handleSuccess,
    });
  
    const applyToProject = (payload: ProjectMemberMutationPayload ) => {
      return new Promise<void>((resolve, reject) => {
        applyToProjectMutation(payload, {
          onSuccess: () => { 
            // Construct the notification content using the projectTitle and username from the payload.
            const notificationContent = `User ${payload.username} has applied to your project: ${payload.projectTitle}`;

            // Create a notification for the user
            createNotificationMutation({
                userId: payload.projectLeadId, 
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
  
    // Delete Project Member Mutation
    const { mutate: deleteProjectMemberMutation, isLoading: isDeleting } = api.projectMembers.deleteProjectMember.useMutation({
      onSuccess: handleSuccess,
    });
  
    const deleteMember = (payload: ProjectMemberMutationPayload ) => {
      return new Promise<void>((resolve, reject) => {
        deleteProjectMemberMutation(payload, {
          onSuccess: () => { resolve(); },
          onError: (e) => {
            handleMutationError(e, reject);
          }    
        });
      });
    };

    return {
      isEditing,
      isApplying,
      isDeleting,
      deleteMember,
      editProjectInfo,
      applyToProject,
    };
};

