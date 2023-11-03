import { useState } from "react";
import type OpenAI from 'openai';
import { useDispatch } from 'react-redux';
import { setTasks, setGoals, setPost } from '~/redux/createprojectslice';
import type { WizardTaskProps } from "./wizard-task-type";
import { useOpenAIMutation } from "./wizard-task-api";
import toast from "react-hot-toast";
import { Tooltip, LoadingSpinner, QuestionSVG } from "~/components";
import { useOnboarding } from "~/features/onboarding/onboardingwrapper";

export const WizardTask: React.FC<WizardTaskProps> = ({ projectTitle, projectSummary, taskNumber, goalNumber, userId }) => {
    // Use the mutation and specify the onError callback directly.
    const {  isGeneratingTasks,isGeneratingGoals,isGeneratingPost,generateProjectTask,generateProjectGoal,generateProjectPost} = useOpenAIMutation()
     // States for the checkboxes
    const [isTasksChecked, setIsTasksChecked] = useState(false);
    const [isGoalsChecked, setIsGoalsChecked] = useState(false);
    const [isPostChecked, setIsPostChecked] = useState(false);
    const isLoading = isGeneratingGoals || isGeneratingTasks || isGeneratingPost
    const dispatch = useDispatch();
    const onboarding = useOnboarding()
  
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
                    const rawDataTasks = await generateProjectTask(payloadTask);  
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
            else if (!isPostChecked && !isGoalsChecked && !isTasksChecked)
            {toast.error("Please tick an option")}
        } catch (error) {
            console.error('Failed to generate content:', error);
        }
    }
        
    
    function processRawDataForTasksOrGoals(rawData: OpenAI.Chat.Completions.ChatCompletion.Choice[]): string[] {
        const results: string[] = [];
    
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
                <div className="flex font-semibold"> AI Project Manager 👋 

                    <span 
                        className="ml-2 text-blue-600 cursor-pointer"
                        onClick={() => { onboarding.setActiveJoyrideIndex(2)}}
                    >
                        <Tooltip content="Click me for help with a guided tour for using Mister Watt Project Manager Instance" width="150px">
                            <QuestionSVG width="4" height="4" colorStrokeHex="#2563eb"></QuestionSVG>
                        </Tooltip>
                    </span>
                
                </div>
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
                    className="bg-blue-500 text-white rounded px-4 mt-2 py-1 justify-center focus:outline-none focus:ring focus:ring-blue-200"
                    disabled={isLoading}
                    onClick={() => {
                        generateProjectAIData().catch(error => {
                            console.error('Error in generateAndLogTasks:', error);
                        });
                    }}
                >
                    {isLoading ? <div className="flex items-center "> <LoadingSpinner size={16}></LoadingSpinner> Generating Content  </div>: "Generate Content"}
                </button>
                <div className="italic text-sm"> By clicking this will overide the selected fields in the &apos;Create Project&apos; popup  </div>
            </div>
        </div>
    );
};