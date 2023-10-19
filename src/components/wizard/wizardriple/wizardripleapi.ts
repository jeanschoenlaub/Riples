import { api } from "~/utils/api";
import type { GenerateRipleContentPayload } from "./wizardripletype";
import type OpenAI from "openai";
import { handleMutationError } from "~/utils/error-handling";

export const useOpenAIRipleMutation = () => {
   
    const { mutate: generateRipleContentMutation, isLoading: isGeneratingRipleContent} = api.openai.generateRipleContent.useMutation({});

    // Usage in the mutations
    const generateRipleContent = (payload: GenerateRipleContentPayload): Promise<OpenAI.Chat.Completions.ChatCompletion.Choice[]> => {
        return new Promise((resolve, reject) => {
            generateRipleContentMutation(payload, {
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
      isGeneratingRipleContent,
      generateRipleContent,
    };
  };



