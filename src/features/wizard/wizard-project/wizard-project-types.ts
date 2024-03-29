import type OpenAI from "openai";
import type { Dispatch, RefObject, SetStateAction } from "react";

export type WizardAboutProps = {
    projectId: string;
};

export interface ApprovalToolCall {
    toolCallId: string,
    functionName: string,
    functionArguments: string,
    approved: boolean | null;
}

export type ApprovalToolCallState = ApprovalToolCall[];


type CheckApprovalStatus = () => Promise<boolean>;
export interface useProjectAssistantParameters {
    prompt: string;
    projectId: string;
    existingThreadId?: string; // Optional threadId
    approvalRequestsRef: RefObject<ApprovalToolCallState>;
    setApprovalRequests: Dispatch<SetStateAction<ApprovalToolCallState>>;
    checkApprovalStatus: CheckApprovalStatus;
}

export interface AssistantResponse {
    response: string;
    threadId?: string; // Assuming the API returns the thread ID in this format
    runId: string;
    toolCalls:  OpenAI.Beta.Threads.Runs.RequiredActionFunctionToolCall[];
}


