import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { useProjectAssistant } from "~/hooks/project-assistant";
import ReactMarkdown from "react-markdown";

export type WizardAboutProps = {
    projectId: string;
};
export const WizardAbout: React.FC<WizardAboutProps> = ({ projectId }) => {
    const [inputValue, setInputValue] = useState('');
    const [chatHistory, setChatHistory] = useState<string>('');

    const { data: chatResponse, threadId, loading, error, fetchData } = useProjectAssistant();

    // Function to handle chat
    function handleChat() {
        if (threadId) {
            fetchData({ prompt: inputValue, projectId: projectId, threadId: threadId });
        } else {
            fetchData({ prompt: inputValue, projectId: projectId });
        }
        const updatedChatHistory = chatHistory + `**You:** ${inputValue} \n\n`;
        setChatHistory(updatedChatHistory);
    }

    useEffect (() => { 
        if (chatResponse) {
            const updatedChatHistory = chatHistory + `\n---**Mr Watt:**  ${chatResponse} \n`;
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
                    rows={3}
                ></textarea>

                <button
                    className="bg-blue-500 text-white rounded px-4 mt-2 py-1 justify-center focus:outline-none focus:ring focus:ring-blue-200"
                    onClick={() => void handleChat()}
                >
                    Chat
                </button>
                {loading && <p>Loading...</p>}
                {error && <p>Error: {error}</p>}
            </div>
        </div>
    );
};