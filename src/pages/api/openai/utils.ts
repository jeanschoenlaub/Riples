interface Message {
    role: string;
    content: Content[];
}

interface Content {
    type: string;
    text?: {
        value: string;
    };
}

export type Messages = Message[];

export function processAssistantMessages(messages: Messages): string {
    let messageContent = '';

    if (messages) {
        const assistantMessages = messages.filter(msg => msg.role === 'assistant');
        if (assistantMessages[0]) {
            // Process the latest message from the assistant
            const latestAssistantMessage = assistantMessages[0];
            messageContent = latestAssistantMessage.content
                .filter(content => content.type === 'text' && content.text)
                .map(content => content.text!.value) // Non-null assertion as we've already checked for existence
                .join('\n');
        } else {
            console.log("No response from the assistant found.");
        }
    } else {
        console.log("No messages found in the response.");
    }

    return messageContent;
}
