import OpenAI from 'openai';

export const generateTasks = async (projectTitle: string, projectSummary: string) => {
    const prompt = `Given the project titled "${projectTitle}" with the summary "${projectSummary}", suggest tasks and goals suitable for this project.`;

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-3.5-turbo',
    });

    return chatCompletion.choices;
}
