import { handleZodError } from "~/utils/error-handling";
import toast from "react-hot-toast";
import { api } from "~/utils/api";
import { CreateProjectPayload } from "./createprojecttypes";

// Custom hook to handle mutations and their state
export const useProjectMutation =  ({ onSuccess }: { onSuccess: () => void }) => {
    const apiContext = api.useContext();
    
    // Function to run on successful mutations
    const handleSuccess = () => {
      void apiContext.projects.getAll.invalidate(); // Invalidate the cache
      onSuccess(); // Execute any additional onSuccess logic
    };
    
    //We add a mutation for creating a task (with on success)
    const { mutateAsync: createProjectAsyncMutation, isLoading: isCreating } = api.projects.create.useMutation();
  
    const createProject = async (payload: CreateProjectPayload) => {
        try {
          const response = await createProjectAsyncMutation(payload);
          // handle the success case here, if needed
          handleSuccess();
          return response; // this will be the created project returned from the server
        } catch (e) {
            if (e instanceof Error) {
              const fieldErrors = (e as any).data?.zodError?.fieldErrors;
              const message = handleZodError(fieldErrors);
              toast.error(message);
            }
            // Handle generic errors
            toast.error("An unknown error occurred.");
          }
    };
  
  
    return {
      isCreating,
      createProject,
    }
  }