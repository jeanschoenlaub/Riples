import { useState } from "react";
import { useDispatch } from "react-redux";
import { LoadingSpinner } from "~/components/reusables/loading";
import { useOpenAIRipleMutation } from "./wizardripleapi";
import { WizardRipleProps } from "./wizardripletype";
import { setRipleContent } from "~/redux/ripleslice";
import OpenAI from "openai";

export const WizardProjectRiples: React.FC<WizardRipleProps> = ({ projectTitle, projectSummary, userId }) => {

    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const { isGeneratingRipleContent, generateRipleContent} = useOpenAIRipleMutation()
    

    async function generateRipleAIData() {
        setIsLoading(true);

        const generateRipleAIPayload = {
            userPrompt: inputValue,
            projectTitle: projectTitle,
            projectSummary: projectSummary,
            userId: userId,
        };

        try {
            const rawDataRipleContent = await generateRipleContent(generateRipleAIPayload);
            const RipleContent = processRawDataForRipleContent(rawDataRipleContent);
            dispatch(setRipleContent(RipleContent));

        } catch (error) {
            console.error('Failed to generate content:', error);
        } finally {
            setIsLoading(false);
        }
    }


    function processRawDataForRipleContent(rawData: OpenAI.Chat.Completions.ChatCompletion.Choice[]): string {
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
                <div className="font-semibold flex items-center"> <span className="text-3xl mr-2"> 👩‍🎨 </span> Content Creator Wizard </div>
                <div className="mb-4"> I already know a lot about your project, but what do you want to post about ?  </div>

                <textarea 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Write about the progress we made on our project this week"
                    className="w-full p-2 border rounded-md resize-none"
                    rows={3}
                    disabled= {isGeneratingRipleContent}
                ></textarea>

                <button 
                    className="bg-blue-500 text-white rounded px-4 mt-2 py-1 justify-center focus:outline-none focus:ring focus:ring-blue-200"
                    disabled={isGeneratingRipleContent}
                    onClick={generateRipleAIData}
                >
                    {isLoading ? 
                        <div className="flex items-center">
                            <LoadingSpinner size={16}></LoadingSpinner> Generating Content
                        </div> 
                        : "Generate Content"}
                </button>

                <div className="italic text-sm">
                    By clicking this will override the selected fields in the &apos;Riple Content&apos; popup section
                </div>
            </div>
        </div>
    );
}
