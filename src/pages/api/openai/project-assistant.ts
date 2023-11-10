import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI, { ClientOptions } from "openai";
import { MessageContentText } from 'openai/resources/beta/threads/messages/messages';

const options: ClientOptions = {
  apiKey: process.env.OPENAI_API_KEY, 
}
const openai = new OpenAI(options);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const ASSISTANT_ID = 'asst_AuMgUlkhbiRl0vsW4KjWO4bC'; // Your hardcoded assistant ID

    if (req.method !== 'POST') {
        return res.status(405).end('Method Not Allowed');
    }

    const { prompt, projectId, existingthreadId } = req.body;
    if (!prompt) {
        return res.status(400).end('Bad Request: Prompt is required');
    }

    try {
        let threadId
        if (!existingthreadId) {
            // Create a new thread using the OpenAI SDK
            const thread = await openai.beta.threads.create();
            threadId = thread.id;
        } else { 
            threadId = existingthreadId
        }

        const prompt_with_params = prompt + " projectId="+ projectId
        console.log(prompt_with_params + "thread"+threadId)

        // Add a message to the thread using the OpenAI SDK
        await openai.beta.threads.messages.create(threadId, {
        role: "user",
        content: prompt_with_params
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
                // Handle action calling
                const toolCalls = runResponse.required_action?.submit_tool_outputs.tool_calls ?? []; 
                if (toolCalls[0]) {
                    const toolCallId = toolCalls[0].id;
                    const functionDetails = toolCalls[0].function;
                    const functionName = functionDetails.name;
                    const functionArguments = JSON.parse(functionDetails.arguments);
                
                    // Execute the required function 
                    const result = await executeFunction(functionName, functionArguments);
                
                    // Submit tool output
                    await openai.beta.threads.runs.submitToolOutputs(threadId, run.id, {
                        tool_outputs: [
                            {
                                "tool_call_id": toolCallId,
                                "output": result,
                            },
                        ]
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
        res.status(500).json({ error: error.message || 'An error occurred with the OpenAI service' });
    }
}

async function executeFunction(functionName:string, functionArguments) {
    if (functionName === 'getTasksByProjectId') {
        console.log('Executing getTasksByProjectId with arguments:', functionArguments);

        try {
            // Construct the query parameter
            const queryParams = new URLSearchParams({
                batch: '1',
                input: JSON.stringify({"0": { json: functionArguments }})
            }).toString();

            const url = `http://localhost:3000/api/trpc/tasks.getTasksByProjectId?${queryParams}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const tasks = await response.json();

            return JSON.stringify(tasks); // Return the tasks from your API
        } catch (error) {
            console.error('Error fetching tasks:', error);
            throw error;
        }
    } else {
        console.error('Unknown function name:', functionName);
        throw new Error(`Function ${functionName} is not implemented`);
    }
}
