import { useEffect, useRef, useState } from "react";

interface useProjectAssistantParameters {
    prompt: string;
    projectId: string;
    existingThreadId?: string; // Optional threadId
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

    const pollInterval = useRef<NodeJS.Timeout | null>(null);

    const stopPolling = () => {
        if (pollInterval.current) {
            clearInterval(pollInterval.current);
            pollInterval.current = null;
        }
    };

    const startPolling = () => {
        stopPolling(); // Ensure no existing polls are running
        pollInterval.current = setInterval(async () => {
            // Implement the logic to check for updates from the server
            // For example, fetching status updates or user approvals
        }, 3000); // Poll every 3 seconds, adjust as needed
    };

    const fetchData = async ({ prompt, projectId, existingThreadId }: useProjectAssistantParameters) => {
        const bodyData = threadId ? { prompt, projectId, existingThreadId } : { prompt, projectId };
        console.log(bodyData)
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

            const responseData: AssistantResponse = await response.json() as AssistantResponse;
            setData(responseData.response);
            if (responseData.threadId) {
                setThreadId(responseData.threadId);
            }
        } catch (err) {
            setError("error sending or receiving data from project assistant");
        } finally {
            setLoading(false);
            stopPolling(); // Stop polling when fetching is complete
        }
    };

    useEffect(() => {
        // Cleanup on unmount
        return () => {
            stopPolling();
        };
    }, []);

    return { data, threadId, loading, error, fetchData };
};
