import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI, { ClientOptions } from "openai";
import { MessageContentText } from 'openai/resources/beta/threads/messages/messages';
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
                        const result = await executeFunction(functionName, functionArguments, projectId);
            
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

async function executeFunction(functionName:string, functionArguments: functionArguments, projectId:string) {
    
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'; //If vercel deployment take that otherwise localhos
    
    if (functionName === 'createTask') {
        try {
            // Will need to figure out protected routes with AI and sending status and projectId
            const queryParams = new URLSearchParams({
                batch: '1',
                input: JSON.stringify({"0": { json: { projectId: projectId, title: functionArguments.projectTitle, content: functionArguments.projectContent} }})
            }).toString();

            const url = `${baseUrl}/api/trpc/tasks.create?${queryParams}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return ("success creating task"); // Return the tasks from your API
        } catch (error) {
            console.error('Error creating tasks:', error);
            throw error;
        }
    } else if (functionName === 'getTasks') {
        try {
            // Construct the query parameter
            const queryParams = new URLSearchParams({
                batch: '1',
                input: JSON.stringify({"0": { json: { projectId: projectId } }})
            }).toString();

            const url = `${baseUrl}/api/trpc/tasks.getTasksByProjectId?${queryParams}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const tasks = await response.json() as TaskFromGetAll;
            return JSON.stringify(tasks); // Return the tasks from your API
        } catch (error) {
            console.error('Error fetching tasks:', error);
            throw error;
        }
    }
    else {
        console.error('Unknown function name:', functionName);
        throw new Error(`Function ${functionName} is not implemented`);
    }
}
