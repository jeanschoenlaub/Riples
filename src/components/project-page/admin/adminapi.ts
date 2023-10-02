import { api } from "~/utils/api";
import { handleZodError } from "~/utils/error-handling";
import toast from "react-hot-toast";
import type { EditProjectAdminPayload } from "./admintype";

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
        return new Promise<void>((resolve) => {
          editProjectAdminMutation(payload, {
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
      isEditing,
      editProjectAdmin,
    };
  };