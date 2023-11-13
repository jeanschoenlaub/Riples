import { useState } from "react";
import { ApprovalToolCall, AssistantResponse, useProjectAssistantParameters } from "./wizard-project-types";

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

            const assistantResponseData: AssistantResponse = await response.json() as AssistantResponse;
            
            if (assistantResponseData.threadId) {
                setThreadId(assistantResponseData.threadId);
            }

            if (assistantResponseData.toolCalls){
                let approvalRequired = false;
                let newApprovalRequests: ApprovalToolCall[] | [] = [] 

                // Filter tool calls that require user approval
                const toolCallsRequiringApproval = assistantResponseData.toolCalls.filter(toolCall => 
                    toolCall.function.name === "createTask"
                );

                if (toolCallsRequiringApproval.length > 0) {
                    newApprovalRequests = toolCallsRequiringApproval.map(toolCall => ({
                        toolCallId: toolCall.id,
                        functionName: toolCall.function.name,
                        functionArguments: toolCall.function.arguments,
                        approved: null // Null indicates awaiting approval
                    }));

                    setApprovalRequests(newApprovalRequests);
                    approvalRequired = true;

                    while (await checkApprovalStatus()) {
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }

                // Make the API call to /api/openai/project-actions if no approval is needed or after approval 
                if (!approvalRequired || !(await checkApprovalStatus())) {

                    const approvedToolCallIds = newApprovalRequests
                        .filter(request => request.approved === true)
                        .map(request => request.toolCallId);

                    // Filter assistantResponseData.toolCalls to include only those with IDs in approvedToolCallIds
                    const filteredToolCalls = assistantResponseData.toolCalls.filter(toolCall => 
                        approvedToolCallIds.includes(toolCall.id)
                    );     

                    const bodyDataAction = {
                        existingThreadId: assistantResponseData.threadId,
                        runId: assistantResponseData.runId,
                        toolCalls: filteredToolCalls,
                        projectId: projectId,
                    };

                    const actionResponse = await fetch('/api/openai/project-actions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(bodyDataAction),
                    });

                    const actionResponseData: AssistantResponse = await actionResponse.json() as AssistantResponse;
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