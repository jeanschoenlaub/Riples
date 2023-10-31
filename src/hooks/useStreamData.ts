import { useState } from "react";

interface ChatCompletionWithDelta {
    choices: {
        delta: {
            content: string;
        };
    }[];
}

interface StreamDataParameters {
    prompt: string;
    systemMessage?: string;
    temperature?: number;
    top_p?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
    max_tokens?: number;
}

// The hook
export const useStreamedData = (onNewData?: (newData: string) => void) => {
    const [data, setData] = useState<string>('');

    const streamDataFromServer = async ({
        prompt,
        systemMessage = 'You are a helpful assistant.', // default system message
        temperature = 0.7,
        top_p = 1,
        frequency_penalty = 0,
        presence_penalty = 0,
        max_tokens = 2048,
    }: StreamDataParameters) => {
        let tempState = '';

        try {
            const response = await fetch('/api/openai/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt,
                    systemMessage,
                    temperature,
                    top_p,
                    frequency_penalty,
                    presence_penalty,
                    max_tokens
                }),
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
                        console.log("Received Data:", json.choices?.[0]?.delta?.content);
                        if (json.choices?.[0]?.delta?.content) {
                            setData((prev) => prev + json.choices[0]!.delta.content);
                            if (onNewData) { onNewData(json.choices[0]!.delta.content); }// <-- Call the callback with the new data, for things like updating global states
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
