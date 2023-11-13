import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI, { ClientOptions } from "openai";
import { Messages, processAssistantMessages } from './utils';
import { RouterOutputs } from '~/utils/api';

const options: ClientOptions = {
  apiKey: process.env.OPENAI_API_KEY, 
}

interface RequestBody {
    prompt: string;
    projectId: string;
    existingThreadId?: string;
}

const openai = new OpenAI(options);

type Task = RouterOutputs["tasks"]["getTasksByProjectId"]

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const ASSISTANT_ID = 'asst_AuMgUlkhbiRl0vsW4KjWO4bC'; // Your hardcoded assistant ID


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

        //Loop while waiting for the run execution - either sets messageContent OR toolCalls
        let messageContent: string = ""; 
        let toolCalls: OpenAI.Beta.Threads.Runs.RequiredActionFunctionToolCall[] | undefined = undefined;
        while (true) {
            const runResponse = await openai.beta.threads.runs.retrieve(threadId, run.id);
            
            if (runResponse.status === "completed") { // No function to run we just need to pull mesages
                const response = await openai.beta.threads.messages.list(threadId);
                const messages: Messages = response.data;
                messageContent = processAssistantMessages(messages);
                break; 
            } 

            if (runResponse.status === "requires_action") { // If function to run we just return those along with arguments
                toolCalls = runResponse.required_action?.submit_tool_outputs.tool_calls ?? [];
                break
            }
            await new Promise(resolve => setTimeout(resolve, 500)); // Wait for a short period before polling again
        }      
        res.status(200).json({ response: messageContent, toolCalls: toolCalls, runId: run.id, threadId: threadId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred with the OpenAI Assistant service' });
    }
}
