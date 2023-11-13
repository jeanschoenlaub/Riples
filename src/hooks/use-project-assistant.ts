import type OpenAI from "openai";
import { SetStateAction, useState, Dispatch } from "react";
import { ApprovalRequest, ApprovalRequestsState } from "~/features/wizard/wizard-project/wizard-project";

type CheckApprovalStatus = () => Promise<boolean>;
interface useProjectAssistantParameters {
    prompt: string;
    projectId: string;
    existingThreadId?: string; // Optional threadId
    approvalRequests: ApprovalRequest[];
    setApprovalRequests: Dispatch<SetStateAction<ApprovalRequestsState>>;
    checkApprovalStatus: CheckApprovalStatus;
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
   
    const fetchData = async ({ prompt, projectId, existingThreadId, approvalRequests, setApprovalRequests, checkApprovalStatus }: useProjectAssistantParameters) => {
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
            console.log(assistantResponseData)
            
            if (assistantResponseData.threadId) {
                setThreadId(assistantResponseData.threadId);
            }

            if (assistantResponseData.toolCalls){
                console.log("approval rwrequried")
                let approvalRequired = false;

                // Filter tool calls that require user approval
                const toolCallsRequiringApproval = assistantResponseData.toolCalls.filter(toolCall => 
                    toolCall.function.name === "createTask"
                );

                if (toolCallsRequiringApproval.length > 0) {
                    const newApprovalRequests = toolCallsRequiringApproval.map(toolCall => ({
                        id: toolCall.id,
                        name: toolCall.function.name,
                        arguments: toolCall.function.arguments,
                        approved: null // Null indicates awaiting approval
                    }));

                    setApprovalRequests(newApprovalRequests);
                    console.log(approvalRequests)
                    approvalRequired = true;

                    while (await checkApprovalStatus()) {
                        console.log("waiting approval")
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }

                // Make the API call to /api/openai/project-actions if no approval is needed or after approval 
                if (!approvalRequired || !(await checkApprovalStatus())) {
                    
                    const bodyDataAction = {
                        existingThreadId: assistantResponseData.threadId,
                        runId: assistantResponseData.runId,
                        toolCalls: assistantResponseData.toolCalls,
                        projectId: projectId,
                    };

                    console.log(approvalRequests)
                    console.log("making call")
                    console.log(bodyDataAction)

                    const actionResponse = await fetch('/api/openai/project-actions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(bodyDataAction),
                    });

                    const actionResponseData: AssistantResponse = await actionResponse.json();
                    setData(actionResponseData.response);
                }
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
