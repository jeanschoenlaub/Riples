import { api } from "~/utils/api";
import { handleZodError } from "~/utils/error-handling";
import toast from "react-hot-toast";
import type { CreateProjectGoalPayload, DeleteProjectGoalPayload, EditProjectGoalPayload, FinishProjectGoalPayload } from "./goaltypes";
import { useOnboarding } from "~/components/onboarding/onboardingwrapper";


export const useProjectGoalMutation = () => {
    const apiContext = api.useContext();
    const { triggerOnboardingWatch } = useOnboarding();

    const handleSuccess = async () => {
    await apiContext.projects.getProjectByProjectId.invalidate();
    };

    // Create Goal Mutation
    const { mutate: createProjectGoalMutation, isLoading: isCreating } = api.goals.create.useMutation({
    onSuccess: handleSuccess,
    });

    const createProjectGoal = (payload: CreateProjectGoalPayload) => {
    return new Promise<void>((resolve) => {
        createProjectGoalMutation(payload, {
        onSuccess: () => { 
            resolve(); 
        },
        onError: (e) => {
            const fieldErrors = e.data?.zodError?.fieldErrors;
            const message = handleZodError(fieldErrors);
            toast.error(message);
        },
        });
    });
    };

    // Edit Goal Mutation
    const { mutate: editProjectGoalMutation, isLoading: isEditing } = api.goals.edit.useMutation({
    onSuccess: handleSuccess,
    });

    const editProjectGoal = (payload: EditProjectGoalPayload) => {
    return new Promise<void>((resolve) => {
        editProjectGoalMutation(payload, {
        onSuccess: () => { resolve(); },
        onError: (e) => {
            const fieldErrors = e.data?.zodError?.fieldErrors;
            const message = handleZodError(fieldErrors);
            toast.error(message);
        },
        });
    });
    };

    // Delete Goal Mutation
    const { mutate: deleteProjectGoalMutation, isLoading: isDeleting } = api.goals.delete.useMutation({
    onSuccess: handleSuccess,
    });

    const deleteProjectGoal = (payload: DeleteProjectGoalPayload) => {
    return new Promise<void>((resolve) => {
        deleteProjectGoalMutation(payload, {
        onSuccess: () => { resolve(); },
        onError: (e) => {
            const fieldErrors = e.data?.zodError?.fieldErrors;
            const message = handleZodError(fieldErrors);
            toast.error(message);
        },
        });
    });
    };

    // Finish Goal Mutation
    const { mutate: finishProjectGoalMutation, isLoading: isFinishing } = api.goals.finish.useMutation({
        onSuccess: handleSuccess,
    });

    const finishProjectGoal = (payload: FinishProjectGoalPayload) => {
        return new Promise<void>((resolve) => {
            finishProjectGoalMutation(payload, {
                onSuccess: () => { 
                    triggerOnboardingWatch();
                    resolve(); 
                },
                onError: (e) => {
                    const fieldErrors = e.data?.zodError?.fieldErrors;
                    const message = handleZodError(fieldErrors);
                    toast.error(message);
                },
            });
        });
    };

    // (Keep the other mutations for project members here...)
    return {
    isCreating,
    isEditing,
    isDeleting,
    isFinishing,
    finishProjectGoal,
    createProjectGoal,
    editProjectGoal,
    deleteProjectGoal,
    };
};
