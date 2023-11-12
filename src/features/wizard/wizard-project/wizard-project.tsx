import { useEffect, useState } from "react";
import { useProjectAssistant } from "~/hooks/project-assistant";
import ReactMarkdown from "react-markdown";
import { LoadingSpinner } from "~/components";

export type WizardAboutProps = {
    projectId: string;
};
export const WizardAbout: React.FC<WizardAboutProps> = ({ projectId }) => {
    const [inputValue, setInputValue] = useState('');
    const [chatHistory, setChatHistory] = useState<string>('');

    const { data: chatResponse, threadId, loading, error, fetchData } = useProjectAssistant();

    // Function to handle chat
    function handleChat() {
        const fetchDataPromise = threadId 
            ? fetchData({ prompt: inputValue, projectId: projectId, existingThreadId: threadId })
            : fetchData({ prompt: inputValue, projectId: projectId });

        fetchDataPromise.then(() => {
            const updatedChatHistory = chatHistory + `**You:** ${inputValue}\n\n`;
            setChatHistory(updatedChatHistory);
            setInputValue('');
        }).catch(error => {
            console.error('Error fetching data:', error);
            setInputValue('');
        });
    }


    useEffect (() => { 
        if (chatResponse) {
            const updatedChatHistory = chatHistory + `---\n\n**Mr. Watt:** ${chatResponse}\n\n`;
            setChatHistory(updatedChatHistory);
        }
    }, [chatResponse])

    return (
        <div>
            <div className="onboarding-status-window">
                <div className="font-semibold flex items-center">
                    <span className="text-3xl mr-2">🦸</span>
                    Project Wizard
                </div>
                <div className="mb-4"> Ask me anything about this project </div>

                {chatResponse && chatResponse && (
                    <div className="prose">
                       <ReactMarkdown>{chatHistory}</ReactMarkdown>
                    </div>
                )}


                <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full p-2 border rounded-md resize-none"
                    disabled={loading}
                    rows={3}
                ></textarea>

                <button
                    className="bg-blue-500 text-white rounded px-4 mt-2 py-1 justify-center focus:outline-none focus:ring focus:ring-blue-200"
                    onClick={() => void handleChat()}
                    disabled={loading}
                >
                    {loading && <LoadingSpinner size={16}></LoadingSpinner>}Chat
                </button>
                
                {error && <p>Error: {error}</p>}
            </div>
        </div>
    );
};