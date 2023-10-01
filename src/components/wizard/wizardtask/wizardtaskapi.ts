import { api } from "~/utils/api";
import type { GenerateProjectGoalMutationPayload, GenerateProjectPostMutationPayload, GenerateProjectTaskMutationPayload } from "./wizardtasktype";
import type OpenAI from "openai";
import { handleZodError } from "~/utils/error-handling";
import toast from "react-hot-toast";

export const useOpenAIMutation = () => {
    const apiContext = api.useContext();
    const handleSuccess = async () => {
        await apiContext.projects.getProjectByProjectId.invalidate();
    };

    const { mutate: generateProjectTaskMutation, isLoading: isGeneratingTasks} = api.openai.generateProjectTasks.useMutation({
        onSuccess: handleSuccess,
    });
    const generateProjectTask = (payload: GenerateProjectTaskMutationPayload): Promise<OpenAI.Chat.Completions.ChatCompletion.Choice[]> => {
        return new Promise((resolve, reject) => {
            generateProjectTaskMutation(payload, {
                onSuccess: (data) => {
                    resolve(data);  // Assuming `data` is of type `Choice[]`
                },
                onError: (e) => {
                    const fieldErrors = e.data?.zodError?.fieldErrors;
                    const message = handleZodError(fieldErrors);
                    toast.error(message);
                    reject(e);
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
                    const fieldErrors = e.data?.zodError?.fieldErrors;
                    const message = handleZodError(fieldErrors);
                    toast.error(message);
                    reject(e);
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
                    const fieldErrors = e.data?.zodError?.fieldErrors;
                    const message = handleZodError(fieldErrors);
                    toast.error(message);
                    reject(e);
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