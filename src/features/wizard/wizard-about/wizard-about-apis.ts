import { api } from "~/utils/api";
import type OpenAI from "openai";
import { handleMutationError } from "~/utils/error-handling";
import { GenerateProjectTaskMutationPayload } from "../wizard-task/wizard-task-type";

export const useOpenAIProjectWizardMutation = () => {
    const apiContext = api.useContext();
    const handleSuccess = async () => {
        //await apiContext.projects.getProjectByProjectId.invalidate();
    };

    const { mutate: generateProjectChallengeMutation, isLoading: isGeneratingChallenge} = api.openai.generateProjectChallenge.useMutation({
        onSuccess: handleSuccess,
    });

    // Usage in the mutations
    const generateProjectChallenge = (payload: GenerateProjectTaskMutationPayload): Promise<OpenAI.Chat.Completions.ChatCompletion.Choice[]> => {
        return new Promise((resolve, reject) => {
            generateProjectChallengeMutation(payload, {
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
      generateProjectChallenge,
      isGeneratingChallenge
    };
  };



