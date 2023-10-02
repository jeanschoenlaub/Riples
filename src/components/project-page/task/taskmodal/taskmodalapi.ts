import { api } from "~/utils/api";
import type { ChangeTaskOwnerPayload, CreateTaskPayload, DeleteTaskPayload, EditStatusPayload, EditTaskPayload } from "./taskmodaltypes";
import { handleZodError } from "~/utils/error-handling";
import toast from "react-hot-toast";

// Custom hook to handle mutations and their state
export const useTaskMutation = () => {
    const apiContext = api.useContext();
    const handleSuccess = async () => {
      await apiContext.tasks.getTasksByProjectId.invalidate();
    };
  
    // Create Task Mutation
    const { mutate: createTaskMutation, isLoading: isCreating } = api.tasks.create.useMutation({
        onSuccess: handleSuccess,
    });
    const createTask = (payload: CreateTaskPayload) => {
      return new Promise<void>((resolve) => {
        createTaskMutation(payload, {
          onSuccess: () => { resolve(); },
          onError: (e) => {
            const fieldErrors = e.data?.zodError?.fieldErrors;
            const message = handleZodError(fieldErrors);
            toast.error(message);
          }
        });
      });
    };
  
    // Edit Task Mutation
    const { mutate: editTaskMutation, isLoading: isEditing } = api.tasks.edit.useMutation({
        onSuccess: handleSuccess,
    });
  
    const editTask = (payload: EditTaskPayload) => {
      return new Promise<void>((resolve) => {
        editTaskMutation(payload, {
          onSuccess: () => { resolve(); },
          onError: (e) => {
            const fieldErrors = e.data?.zodError?.fieldErrors;
            const message = handleZodError(fieldErrors);
            toast.error(message);
          }
        });
      });
    };
  
    // Mutation for deleting a task
    const { mutate: deleteTaskMutation, isLoading: isDeleting } = api.tasks.delete.useMutation({
        onSuccess: handleSuccess,
    });
    const deleteTask = (payload: DeleteTaskPayload) => {
      return new Promise<void>((resolve) => {
        deleteTaskMutation(payload, {
          onSuccess: () => { resolve(); },
          onError: (e) => {
            const fieldErrors = e.data?.zodError?.fieldErrors;
            const message = handleZodError(fieldErrors);
            toast.error(message);
          }
        });
      });
    };
  
    // Change Task Owner Mutation
    const { mutate: changeTaskOwnerMutation, isLoading: isChangingOwner } = api.tasks.changeOwner.useMutation({
        onSuccess: handleSuccess,
    });
    const changeTaskOwner = (payload: ChangeTaskOwnerPayload) => {
      return new Promise<void>((resolve) => {
        changeTaskOwnerMutation(payload, {
          onSuccess: () => { resolve(); },
          onError: (e) => {
            const fieldErrors = e.data?.zodError?.fieldErrors;
            const message = handleZodError(fieldErrors);
            toast.error(message);
          }
        });
      });
    };
  
    // Edit Status Mutation
    const { mutate: editStatusMutation, isLoading: isEditingStatus } = api.tasks.changeStatus.useMutation({
        onSuccess: handleSuccess,
    });
  
    const editStatus = (payload: EditStatusPayload) => {
      return new Promise<void>((resolve) => {
        editStatusMutation(payload, {
          onSuccess: () => { resolve(); },
          onError: (e) => {
            const fieldErrors = e.data?.zodError?.fieldErrors;
            const message = handleZodError(fieldErrors);
            toast.error(message);
          }
        });
      });
    };
  
    return {
      isCreating,
      isEditing,
      isDeleting,
      isChangingOwner,
      isEditingStatus,
      handleSuccess, 
      createTask,
      changeTaskOwner,
      editTask,
      deleteTask,
      editStatus  
    }
  }