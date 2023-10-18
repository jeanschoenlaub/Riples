import { api } from "~/utils/api";
import { handleMutationError } from "~/utils/error-handling";
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
    return new Promise<void>((resolve, reject) => {
        createProjectGoalMutation(payload, {
        onSuccess: () => { 
            resolve(); 
        },
        onError: (e) => {
            handleMutationError(e, reject);
          }
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
            handleMutationError(e, reject);
          }
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
            handleMutationError(e, reject);
          }
        });
    });
    };

    // Finish Goal Mutation
    const { mutate: finishProjectGoalMutation, isLoading: isFinishing } = api.goals.finish.useMutation({
        onSuccess: handleSuccess,
    });

    const finishProjectGoal = (payload: FinishProjectGoalPayload) => {
        return new Promise<void>((resolve, reject) => {
            finishProjectGoalMutation(payload, {
                onSuccess: () => { 
                    triggerOnboardingWatch();
                    resolve(); 
                },
                onError: (e) => {
                    handleMutationError(e, reject);
                }
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
