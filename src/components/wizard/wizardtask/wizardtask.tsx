import { useState } from "react";;
import type OpenAI from 'openai';
import { useDispatch } from 'react-redux';
import { setTasks, setGoals, setPost } from '~/redux/createprojectslice';
import { LoadingSpinner } from "../../reusables/loading";
import type { WizardTaskProps } from "./wizardtasktype";
import { useOpenAIMutation } from "./wizardtaskapi";

export const WizardTask: React.FC<WizardTaskProps> = ({ projectTitle, projectSummary, taskNumber, goalNumber, userId }) => {
    // Use the mutation and specify the onError callback directly.
    const {  isGeneratingTasks,isGeneratingGoals,isGeneratingPost,generateProjectTask,generateProjectGoal,generateProjectPost} = useOpenAIMutation()
     // States for the checkboxes
    const [isTasksChecked, setIsTasksChecked] = useState(false);
    const [isGoalsChecked, setIsGoalsChecked] = useState(false);
    const [isPostChecked, setIsPostChecked] = useState(false);
    const isLoading = isGeneratingGoals || isGeneratingTasks || isGeneratingPost
    const dispatch = useDispatch();
  
    async function generateProjectAIData() {

        try {
            // Generate tasks
            if (isTasksChecked) {
                const payloadTask={
                    projectTitle: projectTitle,
                    projectSummary: projectSummary,
                    taskNumber: taskNumber,
                    userId: userId,
                }
                try {
                    const rawDataTasks = await generateProjectTask(payloadTask);  // Assuming you've defined `payload` appropriately earlier in the code
                    const tasks = processRawDataForTasksOrGoals(rawDataTasks);
                    dispatch(setTasks(tasks));
                } catch (error) {
                    console.error('Failed to generate tasks:', error);
                }
            }
    
            // Generate goals
            if (isGoalsChecked) 
                {
                    const payloadGoals = {
                        projectTitle: projectTitle,
                        projectSummary: projectSummary,
                        goalNumber: goalNumber,
                        userId: userId,
                }
                const rawDataGoals = await generateProjectGoal(payloadGoals);
                const goals = processRawDataForTasksOrGoals(rawDataGoals);
                dispatch(setGoals(goals));
            }

            // Generate post
            if (isPostChecked) {
                const payloadPost = {
                    projectTitle: projectTitle,
                    projectSummary: projectSummary,
                    userId: userId,
                }
                const rawDataPost = await generateProjectPost(payloadPost);
                const post = processRawDataForPost(rawDataPost);
                dispatch(setPost(post));
            }
        } catch (error) {
            console.error('Failed to generate content:', error);
        }
    }
        
    
    function processRawDataForTasksOrGoals(rawData: OpenAI.Chat.Completions.ChatCompletion.Choice[]): string[] {
        const results: string[] = [];
        console.log(rawData);
    
        rawData.forEach(choice => {
            const messageContent = choice.message.content;
            if (messageContent) {
                const lines = messageContent.split('\n'); // Split the message by line
                for (const line of lines) {
                    const match = line.match(/(?:\d+\.\s*)(.+)/);
                    if (match?.[1]) {
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
        let result = '';
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

                <button 
                    className="bg-blue-500 text-white rounded px-4 py-1 justify-center focus:outline-none focus:ring focus:ring-blue-200"
                    disabled={isLoading}
                    onClick={() => {
                        generateProjectAIData().catch(error => {
                            console.error('Error in generateAndLogTasks:', error);
                        });
                    }}
                >
                    {isLoading ? <div className="flex items-center space-x-2"> <LoadingSpinner size={16}></LoadingSpinner> Generating Content  </div>: "Generate Content"}
                </button>

                <div className="mb-4"> Check our data privacy </div>
            </div>
        </div>
    );
};