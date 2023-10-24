import OpenAI from 'openai';

export const generateTasks = async (projectTitle: string, projectSummary: string, taskNumber: string) => {
    const prompt = `
Given the project titled "${projectTitle}" with the summary "${projectSummary}", 
please structure your response as follows:

Tasks:
1.
2.

Based on the given information, suggest "${taskNumber}" tasks (task title only), suitable for this project. Make the task title as simple and short as possible.
`;

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-3.5-turbo',
    });

    return chatCompletion.choices;
}


export const generateGoals = async (projectTitle: string, projectSummary: string, goalNumber: string) => {
    const prompt = `
Given the project titled "${projectTitle}" with the summary "${projectSummary}", 
please structure your response as follows:


1.
2.
...

Based on the given information, suggest "${goalNumber}" goals (titles only) suitable for this project. Make the goal title as simple and short as possible`

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-3.5-turbo',
    });

    return chatCompletion.choices;
}

export const generatePost= async (projectTitle: string, projectSummary: string) => {
    const prompt = `
Given the project titled "${projectTitle}" with the summary "${projectSummary}", 
suggest a 3 sentence straightforward post to share the project that you have just created and started with your friends.
`;

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-3.5-turbo',
    });

    return chatCompletion.choices;
}

export const generateRipleContent= async (projectTitle: string, projectSummary: string, userprompt: string) => {
    const prompt = `
    You are writing for a project titled "${projectTitle}".
    This project is about "${projectSummary}"
    Following this user prompt: "${userprompt}", write a short post content.`;

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const chatCompletion = await openai.chat.completions.create({
        messages: [
                {
                  "role": "system",
                  "content": "As an experienced content manager, you will to generate a short 3 paragraphe post content. "
                },
                {
                  "role": "user",
                  "content": prompt,
                }
              ],
        model: 'gpt-3.5-turbo',
    });

    return chatCompletion.choices;
}

export const generateRipleHTML= async (ripleContent: string, userprompt: string) => {
    const prompt = `
    User prompt: "${userprompt}" 
    HTML: "${ripleContent}
    .`;

    console.log(prompt)

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const chatCompletion = await openai.chat.completions.create({
        messages: [
                {
                  "role": "system",
                  "content": `
                    You will be provided with an HTML and a user prompt. Edit the HTML based on the user prompt, using tailwind and class=""

                    For example: <div class="container mx-auto">
                        <p class="font-bold">Text About Lions:</p>
                    
                        <ul class="list-disc pl-5 px-4">
                            <li>Lions are majestic creatures known for their powerful roar.</li>
                            <li>They are part of the big cat family and are native to Africa.</li>
                            <li>Male lions have a distinctive mane of hair around their necks.</li>
                            <li>Lions are skilled hunters and often work together in groups called prides.</li>
                        </ul>
                    
                        <div class="flex justify-center my-4">
                            <div class="text-center">
                                <img src="https://riples-public-images-08453786.s3.us-west-2.amazonaws.com/riple-images/ac23c6a6-be78-4aeb-8ac1-03b43518bd3a" alt="Uploaded Image" class="mx-auto block responsive-image">
                                <p class="italic">asdxcwec</p>
                            </div>
                        </div>
                    </div>

                    Return only HTML
                  `
                },
                {
                  "role": "user",
                  "content": prompt,
                }
              ],
        model: 'gpt-3.5-turbo',
    });

    return chatCompletion.choices;
}