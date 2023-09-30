import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import OpenAI from 'openai';
import { useDispatch } from 'react-redux';
import { setTasks, setGoals, setPost } from '~/redux/createprojectslice';
import { LoadingSpinner } from "../reusables/loading";
import { generateTasks, generateGoals, generatePost } from "~/server/services/openaicontroller";
import toast from "react-hot-toast";


type WizardTaskProps = {
    projectTitle: string;
    projectSummary: string;
    taskNumber: string;
    goalNumber: string;
    userId: string;
};

export const WizardTask: React.FC<WizardTaskProps> = ({ projectTitle, projectSummary, taskNumber, goalNumber, userId }) => {
    const handleOpenAiError = (error: any) => {
        // Extract and transform your error to a human-readable message.
        // Adjust based on the actual structure of errors from your API.
        console.log("should trigger error message")
        const message = error?.message || "An error occurred!";
        toast.error(message);
    };
    
    // Use the mutation and specify the onError callback directly.
    const generateProjectTaskMutation = api.openai.generateProjectTasks.useMutation({onError: handleOpenAiError});
    const generateProjectGoalMutation = api.openai.generateProjectGoals.useMutation({onError: handleOpenAiError});
    const generateProjectPostMutation = api.openai.generateProjectPost.useMutation({onError: handleOpenAiError});
     // States for the checkboxes
    const [isTasksChecked, setIsTasksChecked] = useState(false);
    const [isGoalsChecked, setIsGoalsChecked] = useState(false);
    const [isPostChecked, setIsPostChecked] = useState(false);
    const [isLoading, setIsLoading] = useState(false); 
    const dispatch = useDispatch();
  
    async function generateAndLogTasks() {
        setIsLoading(true); // Set loading to true
        try {
            // Generate tasks
            if (isTasksChecked) {
                const rawDataTasks: OpenAI.Chat.Completions.ChatCompletion.Choice[] = await generateProjectTaskMutation.mutateAsync({
                    projectTitle: projectTitle,
                    projectSummary: projectSummary,
                    taskNumber:taskNumber,
                    userId: userId,
                });
                const tasks = processRawDataForTasksOrGoals(rawDataTasks);
                dispatch(setTasks(tasks));
            }
    
            // Generate goals
            if (isGoalsChecked) {
                const rawDataGoals: OpenAI.Chat.Completions.ChatCompletion.Choice[] = await  generateProjectGoalMutation.mutateAsync({
                    projectTitle: projectTitle,
                    projectSummary: projectSummary,
                    goalNumber:goalNumber,
                });
                const goals = processRawDataForTasksOrGoals(rawDataGoals);
                dispatch(setGoals(goals));
            }
    
            // Generate post
            if (isPostChecked) {
                const rawDataPost: OpenAI.Chat.Completions.ChatCompletion.Choice[] = await generateProjectPostMutation.mutateAsync({
                    projectTitle: projectTitle,
                    projectSummary: projectSummary,
                });
                const post = processRawDataForPost(rawDataPost);
                dispatch(setPost(post));
            }
    
        } catch (error) {
            console.error('Failed to generate content:', error);
        } finally {
            setIsLoading(false); // Set loading to false, regardless of success or failure
        }
    }
    
    
    function processRawDataForTasksOrGoals(rawData: OpenAI.Chat.Completions.ChatCompletion.Choice[]): string[] {
        let results: string[] = [];
        console.log(rawData);
    
        rawData.forEach(choice => {
            const messageContent = choice.message.content;
            if (messageContent) {
                const lines = messageContent.split('\n'); // Split the message by line
                for (const line of lines) {
                    const match = line.match(/(?:\d+\.\s*)(.+)/);
                    if (match && match[1]) {
                        results.push(match[1]);
                    } else {
                        console.warn("Unexpected line format: ", line);
                    }
                }
            }
        });
        console.log(results);
        return results;
    }
    
    
    function processRawDataForPost(rawData: OpenAI.Chat.Completions.ChatCompletion.Choice[]): string {
        let result: string = '';
        rawData.forEach(choice => {
            const messageContent = choice.message.content;
            if (messageContent) {
                result = messageContent; // Assuming there's only one post
            } else {
                console.warn("Unexpected message format: ", messageContent);
            }
        });
        return result;
    }

    return (
        <div>
            <div className="onboarding-status-window">
                <div className="font-semibold"> Task Wizard 👋 </div>
                <div className="mb-4"> Do you want me to help with creating tasks and goals for your project? </div>

                <div>
                    <label>
                        <input type="checkbox" className="mr-2" checked={isTasksChecked} onChange={() => setIsTasksChecked(!isTasksChecked)} />
                        Tasks
                    </label>
                </div>
                <div>
                    <label>
                        <input type="checkbox" className="mr-2" checked={isGoalsChecked} onChange={() => setIsGoalsChecked(!isGoalsChecked)} />
                        Goals
                    </label>
                </div>
                <div>
                    <label>
                        <input type="checkbox" className="mr-2" checked={isPostChecked} onChange={() => setIsPostChecked(!isPostChecked)} />
                        Post
                    </label>
                </div>

                <button onClick={generateAndLogTasks} className="bg-blue-500 text-white rounded px-4 py-1 justify-center focus:outline-none focus:ring focus:ring-blue-200" disabled={isLoading}>
                    {isLoading ? <div className="flex items-center space-x-2"> <LoadingSpinner size={16}></LoadingSpinner> Generating Content  </div>: "Generate Content"}
                </button>

                <div className="mb-4"> Check our data privacy </div>
            </div>
        </div>
    );
};

