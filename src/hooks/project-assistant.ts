import { useState } from "react";

interface useProjectAssistantParameters {
    prompt: string;
    projectId: string;
    threadId?: string; // Optional threadId
}

interface AssistantResponse {
    response: string;
    threadId?: string; // Assuming the API returns the thread ID in this format
}

export const useProjectAssistant = () => {
    const [data, setData] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [threadId, setThreadId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async ({ prompt, projectId, threadId }: useProjectAssistantParameters) => {
        const bodyData = threadId ? { prompt, projectId, threadId } : { prompt, projectId };
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

            const responseData: AssistantResponse = await response.json();
            console.log(responseData)
            setData(responseData.response);
            if (responseData.threadId) {
                setThreadId(responseData.threadId);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { data, threadId, loading, error, fetchData };
};
