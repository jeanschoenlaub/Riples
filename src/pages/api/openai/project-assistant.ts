import { TRPCError } from '@trpc/server';
import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI, { ClientOptions } from "openai";
import { MessageContentText } from 'openai/resources/beta/threads/messages/messages';
import { appRouter } from '~/server/api/root';
import { getServerAuthSession } from '~/server/auth';
import { prisma } from '~/server/db';
import { RouterOutputs } from '~/utils/api';

const options: ClientOptions = {
  apiKey: process.env.OPENAI_API_KEY, 
}

type functionArguments= {
    projectTitle: string;
    projectContent: string;
};

interface RequestBody {
    prompt: string;
    projectId: string;
    existingThreadId?: string;
}

type TaskFromGetAll = RouterOutputs["tasks"]["getTasksByProjectId"]


const openai = new OpenAI(options);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const ASSISTANT_ID = 'asst_AuMgUlkhbiRl0vsW4KjWO4bC'; // Your hardcoded assistant ID

    const session = await getServerAuthSession({ req, res });
    const caller = appRouter.createCaller({
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

    const { prompt, projectId, existingThreadId } = req.body as RequestBody;
    if (!prompt) {
        return res.status(400).end('Bad Request: Prompt is required');
    }

    try {
        let threadId
        if (!existingThreadId) {
            // Create a new thread using the OpenAI SDK
            console.log("new thread")
            const thread = await openai.beta.threads.create();
            threadId = thread.id;
        } else { 
            console.log("keeping old thread")
            threadId = existingThreadId
        }

        // Add a message to the thread using the OpenAI SDK
        await openai.beta.threads.messages.create(threadId, {
        role: "user",
        content: prompt
        });

        // Run the Assistant and wait for completion
        const run = await openai.beta.threads.runs.create(threadId, {
            assistant_id: ASSISTANT_ID,
        });

        //Loop while waiting for the run execution including 
        let runResponse;
        while (true) {
            runResponse = await openai.beta.threads.runs.retrieve(threadId, run.id);
            
            if (runResponse.status === "completed") {
                break; // Exit loop if run is completed
            }

            if (runResponse.status === "requires_action") {
                // Handle action calling for all tool calls
                const toolCalls = runResponse.required_action?.submit_tool_outputs.tool_calls ?? [];
                const toolOutputs = await Promise.all(
                    toolCalls.map(async (toolCall) => {
                        const toolCallId = toolCall.id;
                        const functionDetails = toolCall.function;
                        const functionName = functionDetails.name;
                        const functionArguments = JSON.parse(functionDetails.arguments) as functionArguments;
            
                        // Execute the required function 
                        const result = await executeFunction(functionName, functionArguments, projectId, caller);
            
                        return {
                            "tool_call_id": toolCallId,
                            "output": result,
                        };
                    })
                );
            
                // Submit tool outputs for all calls
                if (toolOutputs.length > 0) {
                    await openai.beta.threads.runs.submitToolOutputs(threadId, run.id, {
                        tool_outputs: toolOutputs
                    });
                }
            }
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for a short period before polling again
        }

        // Retrieve messages after run completion
        const response = await openai.beta.threads.messages.list(threadId);
        const messages = response.data;
        let messageContent = ''; // getting only the answer back
        if (messages) {
            const assistantMessages = messages.filter(msg => msg.role === 'assistant');
            if (assistantMessages[0]) {
                const latestAssistantMessage = assistantMessages[0];
                messageContent = latestAssistantMessage.content
                    .filter(content => content.type === 'text')
                    .map(content => (content as MessageContentText).text.value)
                    .join('\n');
            } else {
                console.log("No response from the assistant found.");
            }
        } else {
            console.log("No messages found in the response.");
        }
        res.status(200).json({ response: messageContent, threadId: threadId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred with the OpenAI Assistant service' });
    }
}

async function executeFunction(functionName:string, functionArguments: functionArguments, projectId:string, caller:any) {

    if (functionName === 'createTask') {
        try {
            // Use the tRPC caller to call the procedure directly
            const result = await caller.tasks.create({
              title: functionArguments.projectTitle,
              content: functionArguments.projectContent,
              projectId: projectId,
              status: 'To-Do' // Include other required fields
            });
            return("success creating task");
        } catch (error) {
            console.error('Error OpenAI Assistant creting task:', error);
            return("error creating tasks") // provides the error msg back to OpenAI assistant -> handy for providing more context on the error to user
        }
    } else if (functionName === 'getTasks') {
        try {
            const result = await caller.tasks.getTasksByProjectId({
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
