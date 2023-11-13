import type OpenAI from "openai";
import { useState } from "react";

interface useProjectAssistantParameters {
    prompt: string;
    projectId: string;
    existingThreadId?: string; // Optional threadId
}

interface AssistantResponse {
    response: string;
    threadId?: string; // Assuming the API returns the thread ID in this format
    runId: string;
    toolCalls:  OpenAI.Beta.Threads.Runs.RequiredActionFunctionToolCall[];
}


export const useProjectAssistant = () => {
    const [data, setData] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [threadId, setThreadId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

   
    const fetchData = async ({ prompt, projectId, existingThreadId }: useProjectAssistantParameters) => {
        const bodyData = threadId ? { prompt, projectId, existingThreadId } : { prompt, projectId };
        try {
            setLoading(true)
            const response = await fetch('/api/openai/project-assistant', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bodyData),
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const assistantResponseData: AssistantResponse = await response.json();
            
            if (assistantResponseData.threadId) {
                setThreadId(assistantResponseData.threadId);
            }

            if (assistantResponseData.toolCalls){
                const bodyDataAction = {
                    existingThreadId: assistantResponseData.threadId,
                    runId: assistantResponseData.runId,
                    toolCalls:  assistantResponseData.toolCalls,
                    projectId: projectId,
                }
                const response = await fetch('/api/openai/project-actions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(bodyDataAction),
                });
                const actionResponseData: AssistantResponse = await response.json();
                setData(actionResponseData.response); // We take the fisrt response Data
            }else{
                setData(assistantResponseData.response); // We take the fisrt response Data
            }

        } catch (err) {
            setError("error sending or receiving data from project assistant");
        } finally {
            setLoading(false);
        }
    };

    return { data, threadId, loading, error, fetchData };
};
