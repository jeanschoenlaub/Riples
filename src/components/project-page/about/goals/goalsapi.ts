import { api } from "~/utils/api";
import { handleZodError } from "~/utils/error-handling";
import toast from "react-hot-toast";

type CreateProjectGoalPayload = {
    projectId: string;
    title: string;
    progress: number;
    progressFinalValue: number;
};

type EditProjectGoalPayload = {
    goalId: string;
    projectId: string;
    title: string;
    progress: number;
    progressFinalValue: number;
};

type DeleteProjectGoalPayload = {
    goalId: string;
};

export const useProjectGoalMutation = () => {
    const apiContext = api.useContext();
    const handleSuccess = async () => {
    await apiContext.projects.getProjectByProjectId.invalidate();
    };

    // Create Goal Mutation
    const { mutate: createProjectGoalMutation, isLoading: isCreating } = api.goals.create.useMutation({
    onSuccess: handleSuccess,
    });

    const createProjectGoal = (payload: CreateProjectGoalPayload) => {
    return new Promise<void>((resolve, reject) => {
        createProjectGoalMutation(payload, {
        onSuccess: () => { resolve(); },
        onError: (e) => {
            const fieldErrors = e.data?.zodError?.fieldErrors;
            const message = handleZodError(fieldErrors);
            toast.error(message);
            reject(e);
        },
        });
    });
    };

    // Edit Goal Mutation
    const { mutate: editProjectGoalMutation, isLoading: isEditing } = api.goals.edit.useMutation({
    onSuccess: handleSuccess,
    });

    const editProjectGoal = (payload: EditProjectGoalPayload) => {
    return new Promise<void>((resolve, reject) => {
        editProjectGoalMutation(payload, {
        onSuccess: () => { resolve(); },
        onError: (e) => {
            const fieldErrors = e.data?.zodError?.fieldErrors;
            const message = handleZodError(fieldErrors);
            toast.error(message);
            reject(e);
        },
        });
    });
    };

    // Delete Goal Mutation
    const { mutate: deleteProjectGoalMutation, isLoading: isDeleting } = api.goals.delete.useMutation({
    onSuccess: handleSuccess,
    });

    const deleteProjectGoal = (payload: DeleteProjectGoalPayload) => {
    return new Promise<void>((resolve, reject) => {
        deleteProjectGoalMutation(payload, {
        onSuccess: () => { resolve(); },
        onError: (e) => {
            const fieldErrors = e.data?.zodError?.fieldErrors;
            const message = handleZodError(fieldErrors);
            toast.error(message);
            reject(e);
        },
        });
    });
    };

    // (Keep the other mutations for project members here...)

    return {
    isCreating,
    isEditing,
    isDeleting,
    createProjectGoal,
    editProjectGoal,
    deleteProjectGoal,
    };
};
