import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import OpenAI from 'openai';
import { env } from "process";

type WizardTaskProps = {
    projectTitle: string;
    projectSummary: string;
};

export const WizardTask: React.FC<WizardTaskProps> = ({ projectTitle, projectSummary }) => {
     
    const openai = new OpenAI({
    apiKey: env.OPENAI_API_KEY
    });

    async function main() {
    console.log(prompt)
    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: 'Say this is a test' }],
        model: 'gpt-3.5-turbo',
    });

    console.log(chatCompletion.choices);
    }


    const handleTaskCreation = async () => {
            // Create a tailored prompt
            const prompt = `Given the project titled "${projectTitle}" with the summary "${projectSummary}", suggest tasks and goals suitable for this project.`;
            console.log(prompt)
            try {
                const response =  ""//await api.openAIChatGPT(prompt);
                
                if (response) {
                    // Handle the response. For instance, display it in a modal or another UI element.
                }
    
            } catch (error) {
                console.error("Failed to get tasks from OpenAI ChatGPT:", error);
            }
        }


    return (
        <div>
        <div className="onboarding-status-window">
            <div className="font-semibold"> Task Wizard 👋 </div>
                <div className="mb-4"> Do you want me to help with creating task and goals for your project ? </div>
                <button onClick={main}>Yes</button>
                <div className="mb-4"> check our data privacy </div>
        </div>
        </div>
    );
};
