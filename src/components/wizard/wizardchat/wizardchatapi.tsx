import OpenAI from "openai";
import { useState } from "react";

export type WizardChatProps = {
    projectTitle: string;
    projectSummary: string;
    ripleContent: string;
    modalStep: string;
};

interface Delta {
    content: string;
}

interface ChoiceWithDelta {
    delta: Delta;
}

interface ChatCompletionWithDelta {
    choices: ChoiceWithDelta[];
}

export const WizardChat: React.FC<WizardChatProps> = ({ projectTitle, projectSummary, ripleContent, modalStep }) => {

    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chatResponse, setChatResponse] = useState<string>('');

    async function generateRipleAIData() {
        setIsLoading(true);
        let tempState = '';

        try {
            const response = await fetch('/api/openai/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: inputValue }),
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            if (!response.body) {
                throw new Error("No response body received.");
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let done = false;

            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;

                const newValue = decoder.decode(value).split('\n\n').filter(Boolean);

                if (tempState) {
                    newValue[0] = tempState + newValue[0];
                    tempState = '';
                }

                newValue.forEach((newVal) => {
                    try {
                        const json = JSON.parse(newVal.replace('data: ', '')) as ChatCompletionWithDelta;

                        if (!json) {
                            throw new Error("Parsed JSON is undefined.");
                        }
                        if (json.choices?.[0]?.delta?.content){

                            setChatResponse((prev) => prev + json.choices[0]!.delta.content);
                        }
                    } catch (error) {
                        tempState = newVal;
                    }
                });
            }

        } catch (error) {
            console.error('Failed to generate content:', error);
        } finally {
            setIsLoading(false);
            setInputValue("");
        }
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
                    rows={3}
                ></textarea>

                <button
                    className="bg-blue-500 text-white rounded px-4 mt-2 py-1 justify-center focus:outline-none focus:ring focus:ring-blue-200"
                    onClick={() => void generateRipleAIData()}
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
