import OpenAI from 'openai';

export const generateTasks = async (projectTitle: string, projectSummary: string, taskNumber: string) => {
    const prompt = `
Given the project titled "${projectTitle}" with the summary "${projectSummary}", 
please structure your response as follows:

Tasks:
1.
2.

Based on the given information, suggest "${taskNumber}" tasks (task title only), suitable for this project.
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

Based on the given information, suggest "${goalNumber}" goals (titles only) suitable for this project`

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