import { TRPCError } from '@trpc/server';
import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI, { type ClientOptions } from "openai";
import { appRouter } from '~/server/api/root';
import { getServerAuthSession } from '~/server/auth';
import { prisma } from '~/server/db';
import { type Messages, processAssistantMessages } from './utils';
import type { RouterOutputs } from '~/utils/api';

const options: ClientOptions = {
  apiKey: process.env.OPENAI_API_KEY, 
}

type FunctionArguments= {
    taskTitle: string;
    taskContent: string;
};

export interface RequestBody {
    prompt: string;
    projectId: string;
    existingThreadId: string;
    runId: string;
    toolCalls:  OpenAI.Beta.Threads.Runs.RequiredActionFunctionToolCall[];
    notApprovedToolCallIds: string[];
}

const openai = new OpenAI(options);

type Task = RouterOutputs["tasks"]["getTasksByProjectId"];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const session = await getServerAuthSession({ req, res });
    const caller  = appRouter.createCaller({
        session: session,
        revalidateSSG: null, // adjust this if you have a method to revalidate SSG
        prisma
    });
    
    if (!session || !session.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    if (req.method !== 'POST') {
        return res.status(405).end('Method Not Allowed');
    }

    const { projectId, existingThreadId, runId, toolCalls, notApprovedToolCallIds } = req.body as RequestBody;

    let messageContent
    try {
        while (true) {
            const runResponse = await openai.beta.threads.runs.retrieve(existingThreadId, runId);
            
            if (runResponse.status === "completed") { // No function to run we just need to pull mesages
                const response = await openai.beta.threads.messages.list(existingThreadId);
                const messages: Messages = response.data;
                messageContent = processAssistantMessages(messages);
                break; 
            } 

            if (runResponse.status === "requires_action") {
                console.log("a")
                console.log(notApprovedToolCallIds)
                // For Not User Approved approved tool calls, we still send the answer back to OpenAI with message
                const notApprovedToolCalls = toolCalls.filter(tc => notApprovedToolCallIds.includes(tc.id));
                const notApprovedToolOutputs = notApprovedToolCalls.map(tc => ({
                    "tool_call_id": tc.id,
                    "output": "User did not approve running this tool"
                }));

            
                // For User Approved tool calls we handle them based on the function in handleRequiresAction
                const approvedToolCalls = toolCalls.filter(tc => !notApprovedToolCallIds.includes(tc.id));
                console.log(approvedToolCalls)
                const approvedToolOutputs = await handleRequiresAction(approvedToolCalls, projectId, caller);
            
                // Combine outputs and submit
                const combinedToolOutputs = [...approvedToolOutputs, ...notApprovedToolOutputs];
                console.log(combinedToolOutputs)
                if (combinedToolOutputs.length > 0) {
                    await openai.beta.threads.runs.submitToolOutputs(existingThreadId, runId, {
                        tool_outputs: combinedToolOutputs
                    });
                }
            }

            await new Promise(resolve => setTimeout(resolve, 500)); // Wait for a short period before polling again
        }      
        res.status(200).json({ response: messageContent, toolCalls: toolCalls, runId: runId, threadId: existingThreadId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred with the OpenAI Assistant service' });
    }
}   
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handleRequiresAction(toolCalls: OpenAI.Beta.Threads.Runs.RequiredActionFunctionToolCall[], projectId: string, caller:any) {
    const toolOutputs = await Promise.all(
        toolCalls.map(async (toolCall) => {
            const toolCallId = toolCall.id;
            const functionDetails = toolCall.function;
            const functionName = functionDetails.name;
            const functionArguments = JSON.parse(functionDetails.arguments) as FunctionArguments
            
            const result: string = await executeFunction(functionName, functionArguments, projectId, caller);
            
            return {
                "tool_call_id": toolCallId,
                "output": result,
            };
        })
    );

    return toolOutputs;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function executeFunction(functionName:string, functionArguments: FunctionArguments, projectId:string, caller:any) {

    if (functionName === 'createTask') {
        try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            await caller.tasks.create({
                title: functionArguments.taskTitle,
                content: functionArguments.taskContent || "",
                projectId: projectId,
                status: 'To-Do' 
            });
            return("success creating task");
        } catch (error) {
            console.error('Error OpenAI Assistant creating task:', error);
            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
            return("error creating task"+error) // provides the error msg back to OpenAI assistant -> handy for providing more context on the error to user
        }
    } else if (functionName === 'getTasks') {
        try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
            const result: Task = await caller.tasks.getTasksByProjectId({
                projectId: projectId,
            });
            return JSON.stringify(result); 
        } catch (error) {
            console.error('Error OpenAI Assistant  getTask:', error);
            throw error;
        }
    }
    else {
        console.error('Unknown function name:', functionName);
        throw new Error(`Function ${functionName} is not implemented`);
    }
}
