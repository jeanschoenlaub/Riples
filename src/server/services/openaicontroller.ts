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
                    You will be provided with an HTML and a user prompt. Edit the HTML based on the user prompt, using the following commands:
                    
                    Headings: Use <p style="font-size: 1em; font-weight: bold;"> tags.
                    Content Paragraphs: Enclose in regular <p> tags.
                    Separation: Insert <br> tags between sections.
                    Listings: Utilize <li> tags for key points or features.

                    If you don'tsee the command for what was asked usehtml tags that can work through sanitise
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