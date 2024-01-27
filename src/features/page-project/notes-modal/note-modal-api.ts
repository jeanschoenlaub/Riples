import { api } from "~/utils/api";
import { handleMutationError } from "~/utils/error-handling";
import { useOnboarding } from "~/features/onboarding/onboardingwrapper";
import { CreateNotePayload, DeleteNotePayload, EditNotePayload } from "./note-modal-types";

// Custom hook to handle mutations and their state
export const useNoteMutation = () => {
    const apiContext = api.useContext();
    const { triggerOnboardingWatch } = useOnboarding();

    const handleSuccess = async () => {
      await apiContext.notes.getNotesByProjectId.invalidate();
    };

    // Create Task Mutation
    const { mutate: createNoteMutation, isLoading: isCreating } = api.notes.create.useMutation({
        onSuccess: handleSuccess,
    });
    const createNote = (payload: CreateNotePayload) => {
      return new Promise<void>((resolve, reject) => {
        createNoteMutation(payload, {
          onSuccess: () => { resolve(); },
          onError: (e) => {
            handleMutationError(e, reject);
          }    
        });
      });
    };
  
    // Edit Task Mutation
    const { mutate: editNoteMutation, isLoading: isEditing } = api.notes.edit.useMutation({
        onSuccess: handleSuccess,
    });
  
    const editNote = (payload: EditNotePayload) => {
      return new Promise<void>((resolve, reject) => {
        editNoteMutation(payload, {
          onSuccess: () => {
            resolve(); 
          },
          onError: (e) => {
            handleMutationError(e, reject);
          }    
        });
      });
    };
  
    // Mutation for deleting a task
    const { mutate: deleteNoteMutation, isLoading: isDeleting } = api.notes.delete.useMutation({
        onSuccess: handleSuccess,
    });
    const deleteNote = (payload: DeleteNotePayload) => {
      return new Promise<void>((resolve,reject) => {
        deleteNoteMutation(payload, {
          onSuccess: () => { resolve(); },
          onError: (e) => {
            handleMutationError(e, reject);
          }
        });
      });
    };
  
    // // Change Task Owner Mutation
    // const { mutate: changeTaskOwnerMutation, isLoading: isChangingOwner } = api.tasks.changeOwner.useMutation({
    //     onSuccess: handleSuccess,
    // });
    // const changeTaskOwner = (payload: ChangeTaskOwnerPayload) => {
    //   return new Promise<void>((resolve, reject) => {
    //     changeTaskOwnerMutation(payload, {
    //       onSuccess: () => { resolve(); },
    //       onError: (e) => {
    //         handleMutationError(e, reject);
    //       }    
    //     });
    //   });
    // };
  
   
    return {
      isCreating,
      isEditing,
      isDeleting,
      handleSuccess, 
      createNote,
      editNote,
      deleteNote  
    }
  }