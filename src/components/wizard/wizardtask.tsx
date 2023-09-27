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
     
    const generateProjectTaskMutation = api.openai.generateProjectTasks.useMutation();
  
    async function generateAndLogTasks() {
        try {
        const rawData : OpenAI.Chat.Completions.ChatCompletion.Choice[] = await generateProjectTaskMutation.mutateAsync({
            projectTitle: projectTitle,
            projectSummary: projectSummary
        });
        rawData.forEach(choice => {
            
            const messageContent = choice.message.content;
            if (messageContent){
            // Split the content based on "Goals:" to separate tasks and goals
            const [tasksString, goalsString] = messageContent.split("\n\nGoals:\n");
        
            if (tasksString && goalsString) {
                // Split by newline to get individual tasks and goals
                const tasks = tasksString.replace("Tasks:\n", "").split("\n");
                const goals = goalsString.split("\n");

                console.log("Tasks:", tasks);
                console.log("Goals:", goals);
            } else {
                console.warn("Unexpected message format: ", messageContent);
            }
            }
        });


        } catch (error) {
        console.error('Failed to generate tasks:');
        }
    }

    useEffect(() => {
        generateAndLogTasks();
    }, []);


        return (
            <div>
            <div className="onboarding-status-window">
                <div className="font-semibold"> Task Wizard 👋 </div>
                    <div className="mb-4"> Do you want me to help with creating task and goals for your project ? </div>
                    <button onClick={generateAndLogTasks}>Yes</button>
                    <div className="mb-4"> check our data privacy </div>
            </div>
            </div>
        );
    };
