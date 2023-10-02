import { api } from "~/utils/api";
import { handleZodError } from "~/utils/error-handling";
import toast from "react-hot-toast";
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
      editProjectInfo,
      applyToProject,
    };
  };