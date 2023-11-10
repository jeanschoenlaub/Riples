import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI, { ClientOptions } from "openai";

// Define the client options according to the OpenAI client expected options
const options: ClientOptions = {
  apiKey: process.env.OPENAI_API_KEY, // Replace with your API key variable or string
  // You can add other options if necessary, like 'organization' or 'baseURL'
};

const openai = new OpenAI(options);


const ASSISTANT_ID = 'asst_AuMgUlkhbiRl0vsW4KjWO4bC'; // Your hardcoded assistant ID


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).end('Bad Request: Prompt is required');
  }

  try {
    // Step 2: Create a thread using the OpenAI SDK
    const thread = await openai.beta.threads.create();
    const threadId = thread.id;

    // Step 3: Add a message to the thread using the OpenAI SDK
    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: prompt
    });

  
        // Step 4: Run the Assistant and wait for completion
    const run = await openai.beta.threads.runs.create(threadId, {
        assistant_id: 'asst_AuMgUlkhbiRl0vsW4KjWO4bC',
    });

    let runResponse;
    while (true) {
        runResponse = await openai.beta.threads.runs.retrieve(thread.id, run.id);
        
        if (runResponse.status === "completed") {
            break; // Exit loop if run is completed
        }

        if (runResponse.status === "requires_action") {
            // Handle required action
            const toolCalls = runResponse.required_action?.submit_tool_outputs.tool_calls ?? []; 
            if (toolCalls[0]) {
                const toolCallId = toolCalls[0].id;
                const functionDetails = toolCalls[0].function;
                const functionName = functionDetails.name;
                const functionArguments = JSON.parse(functionDetails.arguments);
            
                // Execute the required function (this needs to be implemented based on your environment)
                const result = await executeFunction(functionName, functionArguments);
            
                // Submit tool output
                await openai.beta.threads.runs.submitToolOutputs(thread.id, run.id, {
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

    // Step 5: Retrieve messages after run completion
    const messages = await openai.beta.threads.messages.list(thread.id);

    // Send the run ID back in the response for further operations
    res.status(200).json({ threadId, runId: messages });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || 'An error occurred with the OpenAI service' });
    }
}

async function executeFunction(functionName:string, functionArguments) {
    if (functionName === 'get_all_project_tasks') {
        console.log(functionArguments)
        console.log('Executing get_all_project_tasks');
        // Simulate fetching tasks (for example purposes)
        const tasks = '2 million tasks for testing';
        return tasks; // Return the simulated tasks
    } else {
        console.error('Unknown function name:', functionName);
        throw new Error(`Function ${functionName} is not implemented`);
    }
}