import { useState } from "react";

interface ChatCompletionWithDelta {
    choices: {
        delta: {
            content: string;
        };
    }[];
}

// The hook
export const useStreamedData = () => {
    const [data, setData] = useState<string>('');

    const streamDataFromServer = async (inputValue: string) => {
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

                        if (json.choices?.[0]?.delta?.content) {
                            setData((prev) => prev + json.choices[0]!.delta.content);
                        }
                    } catch (error) {
                        tempState = newVal;
                    }
                });
            }

        } catch (error) {
            console.error('Failed to stream data:', error);
        }
    }

    return {
        data,
        streamDataFromServer
    }
}
