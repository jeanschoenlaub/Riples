import { api } from "~/utils/api";
import { EditProjectPayload, ProjectMemberMutationPayload } from "./abouttypes";
import { handleZodError } from "~/utils/error-handling";
import toast from "react-hot-toast";

export const useProjectMutation = (projectId: string) => {
    const apiContext = api.useContext();
    const handleSuccess = async () => {
        await apiContext.projects.getProjectByProjectId.invalidate();
    };

    // Create Task Mutation
    const { mutate: editProjectMutation, isLoading: isEditing } = api.projects.edit.useMutation({
        onSuccess: handleSuccess,
    });

    const editProject = (payload: EditProjectPayload) => {
        return new Promise<void>((resolve, reject) => {
          editProjectMutation(payload, {
            onSuccess: () => { resolve(); },
            onError: (e) => {
              const fieldErrors = e.data?.zodError?.fieldErrors;
              const message = handleZodError(fieldErrors);
              toast.error(message);
              reject(e);
            }
          });
      });
    };

    const { mutate: applyToProjectMutation, isLoading: isApplying } = api.projectMembers.applyToProject.useMutation({
      onSuccess: handleSuccess
    });
  
    const applyToProject = (payload: ProjectMemberMutationPayload ) => {
      return new Promise<void>((resolve, reject) => {
        applyToProjectMutation(payload, {
          onSuccess: () => { resolve(); },
          onError: (e) => { 
            const fieldErrors = e.data?.zodError?.fieldErrors;
              const message = handleZodError(fieldErrors);
              toast.error(message);
              reject(e);
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
            const fieldErrors = e.data?.zodError?.fieldErrors;
              const message = handleZodError(fieldErrors);
              toast.error(message);
              reject(e);
          }
        });
      });
    };

    return {
      isEditing,
      isApplying,
      isDeleting,
      deleteMember,
      editProject,
      applyToProject,
    };
  };