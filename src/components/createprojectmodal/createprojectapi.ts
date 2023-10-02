import { handleZodError } from "~/utils/error-handling";
import toast from "react-hot-toast";
import { api } from "~/utils/api";
import router from "next/router";
import type { ProjectCreateData } from "./createprojecttypes";

// Custom hook to handle mutations and their state
export const useProjectMutation =  ({ onSuccess }: { onSuccess: () => void }) => {    
    // Function to run on successful mutations
    const handleSuccess = async (data: ProjectCreateData) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (data?.id) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        await router.push(`/projects/${data.id}`);
        onSuccess(); // Execute any additional onSuccess logic
      }
  };
  
    
    //We add a mutation for creating a task (with on success)
    const { mutateAsync: createProjectAsyncMutation, isLoading: isCreating } = api.projects.create.useMutation({
      onSuccess: handleSuccess,
      onError: (e) => {
        const fieldErrors = e.data?.zodError?.fieldErrors; 
        const message = handleZodError(fieldErrors);
        toast.error(message);
      }
    });
  
    return {
      isCreating,
      createProjectAsyncMutation,
    }
  }