import { api } from "~/utils/api";
import type { GenerateRipleContentPayload, GenerateRipleHTMLPayload } from "./wizardripletype";
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

    const { mutate: generateRipleHTMLMutation, isLoading: isGeneratingRipleHTML} = api.openai.generateRipleHTML.useMutation({});

    // Usage in the mutations
    const generateRipleHTML = (payload: GenerateRipleHTMLPayload): Promise<OpenAI.Chat.Completions.ChatCompletion.Choice[]> => {
        return new Promise((resolve, reject) => {
            generateRipleHTMLMutation(payload, {
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
      generateRipleHTML,
      isGeneratingRipleHTML,
    };
  };



