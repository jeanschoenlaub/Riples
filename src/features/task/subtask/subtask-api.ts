import { api } from "~/utils/api";
import type { CreateSubTaskPayload, DeleteSubTaskPayload, EditSubTaskStatusPayload } from "./subtask-types";
import { handleMutationError } from "~/utils/error-handling";

// Custom hook to handle mutations and their state for Subtasks
export const useSubTaskMutation = (taskId: string, { onSuccess }: { onSuccess: () => void }) => {
    const apiContext = api.useContext();
    
    const handleSuccess = async () => {
      await apiContext.tasks.getTasksByProjectId.invalidate();
      await apiContext.tasks.getTasksByCreatedOrOwnerId.invalidate();//For the create feed page custom grid components
      onSuccess();
    };
    
    const { mutate: createSubTaskMutation, isLoading: isCreating } = api.tasks.createSubTask.useMutation({
      onSuccess: handleSuccess
    });
    const createSubTask = (payload: CreateSubTaskPayload) => {
        return new Promise<void>((resolve, reject) => {
            createSubTaskMutation(payload, {
                onSuccess: () => { resolve(); },
                onError: (e) => {
                  handleMutationError(e, reject);
                }
            });
        });
    };
  
    const { mutate: deleteSubTaskMutation, isLoading: isDeleting } = api.tasks.deleteSubTask.useMutation({
      onSuccess: handleSuccess
    });
    const deleteSubTask = (payload: DeleteSubTaskPayload) => {
      return new Promise<void>((resolve, reject) => {
          deleteSubTaskMutation(payload, {
              onSuccess: () => { resolve(); },
              onError: (e) => {
                handleMutationError(e, reject);
              }        
          });
      });
    };
  
    const { mutate: editStatusMutation, isLoading: isEditingStatus } = api.tasks.changeSubTaskStatus.useMutation({
      onSuccess: handleSuccess
    });
    const editStatus = (payload: EditSubTaskStatusPayload) => {
      return new Promise<void>((resolve, reject) => {
          editStatusMutation(payload, {
              onSuccess: () => { resolve(); },
              onError: (e) => {
                handleMutationError(e, reject);
              }        
          });
      });
    };
  
    return {
      isCreating,
      isDeleting,
      isEditingStatus,
      createSubTask,
      deleteSubTask,
      editStatus,
    };
  };