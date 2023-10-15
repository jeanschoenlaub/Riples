import { api } from "~/utils/api";
import type { GenerateProjectGoalMutationPayload, GenerateProjectPostMutationPayload, GenerateProjectTaskMutationPayload } from "./wizardtasktype";
import type OpenAI from "openai";
import { handleMutationError } from "~/utils/error-handling";

export const useOpenAIMutation = () => {
    const apiContext = api.useContext();
    const handleSuccess = async () => {
        await apiContext.projects.getProjectByProjectId.invalidate();
    };

    const { mutate: generateProjectTaskMutation, isLoading: isGeneratingTasks} = api.openai.generateProjectTasks.useMutation({
        onSuccess: handleSuccess,
    });

    // Usage in the mutations
    const generateProjectTask = (payload: GenerateProjectTaskMutationPayload): Promise<OpenAI.Chat.Completions.ChatCompletion.Choice[]> => {
        return new Promise((resolve, reject) => {
            generateProjectTaskMutation(payload, {
                onSuccess: (data) => {
                    resolve(data);
                },
                onError: (e) => {
                    handleMutationError(e, reject);
                }
            });
        });
    };

    const { mutate: generateProjectGoalMutation, isLoading: isGeneratingGoals} = api.openai.generateProjectGoals.useMutation({
        onSuccess: handleSuccess,
    });
    const generateProjectGoal = (payload: GenerateProjectGoalMutationPayload): Promise<OpenAI.Chat.Completions.ChatCompletion.Choice[]> => {
        return new Promise((resolve, reject) => {
            generateProjectGoalMutation(payload, {
                onSuccess: (data) => {
                    resolve(data); 
                },
                onError: (e) => {
                    handleMutationError(e, reject);
                }
            });
        });
    };

    const { mutate: generateProjectPostMutation, isLoading: isGeneratingPost} = api.openai.generateProjectPost.useMutation({
        onSuccess: handleSuccess,
    });
    const generateProjectPost = (payload: GenerateProjectPostMutationPayload): Promise<OpenAI.Chat.Completions.ChatCompletion.Choice[]> => {
        return new Promise((resolve, reject) => {
            generateProjectPostMutation(payload, {
                onSuccess: (data) => {
                    resolve(data); 
                },
                onError: (e) => {
                    handleMutationError(e, reject);
                }
            });
        });
    };

    return {
      isGeneratingTasks,
      isGeneratingGoals,
      isGeneratingPost,
      generateProjectTask,
      generateProjectGoal,
      generateProjectPost,
    };
  };



