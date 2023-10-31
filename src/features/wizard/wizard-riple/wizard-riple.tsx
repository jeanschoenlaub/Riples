import { useState } from "react";
import { useDispatch } from "react-redux";
import { LoadingSpinner } from "~/components/loading/loading";
import { resetRipleContent, setRipleContent } from "~/redux/ripleslice";
import { useStreamedData } from "~/hooks/stream-data-openai";


export type WizardRipleProps = {
    projectTitle: string;
    projectSummary: string;
    ripleContent: string;
    userId: string;
    modalStep: string;
};

export const WizardProjectRiples: React.FC<WizardRipleProps> = ({ projectTitle, projectSummary, ripleContent, modalStep, userId }) => {

    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    
    const processAndDispatch = (rawData: string) => {
        dispatch(setRipleContent(rawData));
    };
    
    // Initialize the hook with the callback
    const { streamDataFromServer } = useStreamedData(processAndDispatch);
        
    async function generateTextContent() {
        setIsLoading(true);

        try {
            // Reset the content before generating a new one
            dispatch(resetRipleContent());

            // Directly use the streaming function here
            const promptContent = `
                You are writing for a project titled "${projectTitle}".
                This project is about "${projectSummary}".
                Following this user prompt: "${inputValue + " for this text " + ripleContent}", write a short post content.`;

            await streamDataFromServer({
                prompt: promptContent,
                systemMessage: "As an experienced content manager, you are to generate a short 3 paragraph post content."
                // ... add any other parameters you'd like to include
            });
        } catch (error) {
            console.error('Failed to generate content:', error);
        } finally {
            setIsLoading(false);
            setInputValue("");
        }
    }

    async function generateHTMLStyle() {
        setIsLoading(true);

        try {
            // Reset the content before generating a new one
            dispatch(resetRipleContent());

            // Directly use the streaming function here
            const prompt = `
            User prompt: "${inputValue}" 
            HTML: "${ripleContent}"`;
        
            await streamDataFromServer({
                prompt: prompt,
                systemMessage: `You will be provided with an HTML and a user prompt. Edit the HTML based on the user prompt, using tailwind and class=""

                For example: <div class="container mx-auto">
                    <p class="font-bold">Title</p>
                
                    <ul class="list-disc pl-5 px-4">
                        <li>Bullet point </li>
                    </ul>
                
                    <div class="flex justify-center my-4">
                        <div class="text-center">
                            <img src="image source" alt="image caption" class="mx-auto block responsive-image">
                            <p class="italic">asdxcwec</p>
                        </div>
                    </div>
                </div>

                Return only HTML code`
                // ... add any other parameters you'd like to include
            });
        } catch (error) {
            console.error('Failed to generate content:', error);
        } finally {
            setIsLoading(false);
            setInputValue("");
        }
    }

    function getButtonFunction() {
        if (modalStep === "html") {
            void generateHTMLStyle();
        } else {
            void generateTextContent();
        }
    }

    function getButtonText() {
        if (modalStep === "html") {
            if (isLoading) {return  <div className="flex items-center"><LoadingSpinner size={16}></LoadingSpinner> Syling Riple</div>}
            return "Style HTML";
        } else {
            if (isLoading) {return  <div className="flex items-center"><LoadingSpinner size={16}></LoadingSpinner> Generating content</div>}
            return "Generate Content";
        }
    }

    return (
        <div>
            <div className="onboarding-status-window">
                <div className="font-semibold flex items-center"> <span className="text-3xl mr-2"> 👩‍🎨 </span> Content Creator Wizard </div>

                {modalStep === "html" ? 
                    (<div className="mb-4">Do you want help styling the Riple ?  </div>) 
                    :
                    (<div className="mb-4"> Do you want help creating content ?  </div>) 
                }

                <textarea 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={modalStep === "html" ? "Optionally add some instructions" : "Write about the progress we made on our project this week"}
                    className="w-full p-2 border rounded-md resize-none"
                    rows={3}
                    disabled= {isLoading}
                ></textarea>

                <button 
                    className="bg-blue-500 text-white rounded px-4 mt-2 py-1 justify-center focus:outline-none focus:ring focus:ring-blue-200"
                    disabled={isLoading}
                    onClick={() => getButtonFunction()}
                >
                    {getButtonText()}
                </button>

                {modalStep != "html" && <div className="italic text-sm">By clicking this will override the selected fields in the &apos;Riple Content&apos; popup section</div>}
            </div>
        </div>
    );
}
