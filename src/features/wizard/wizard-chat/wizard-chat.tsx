import { useState } from "react";
import { useStreamedData } from "~/hooks/stream-data-openai";

export type WizardChatProps = {
    projectTitle: string;
    projectSummary: string;
    ripleContent: string;
    modalStep: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const WizardChat: React.FC<WizardChatProps> = ({ projectTitle, projectSummary, ripleContent, modalStep }) => {

    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Use the hook
    const { data: chatResponse, streamDataFromServer } = useStreamedData();

    const handleChat = async () => {
        setIsLoading(true);
        await streamDataFromServer({prompt: inputValue})
        setIsLoading(false);
        setInputValue("");
    }

    return (
        <div>
            <div className="onboarding-status-window">
                <div className="font-semibold flex items-center"> <span className="text-3xl mr-2"> 👩 </span> Chat Wizard </div>
                <div className="mb-4">Lets talk </div>

                <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full p-2 border rounded-md resize-none"
                    disabled= {isLoading}
                    rows={3}
                ></textarea>

                <button
                    className="bg-blue-500 text-white rounded px-4 mt-2 py-1 justify-center focus:outline-none focus:ring focus:ring-blue-200"
                    onClick={() => void handleChat()}
                >
                    Chat
                </button>

                <div>
                    {chatResponse && <p className="mt-4">{chatResponse}</p>}
                </div>
            </div>
        </div>
    );
}
