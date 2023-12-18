import { useEffect, useRef, useState } from "react";
import { useProjectAssistant } from "~/features/wizard/wizard-project/use-project-assistant";
import ReactMarkdown from "react-markdown";
import { LoadingSpinner } from "~/components";
import { ApprovalToolCallState, WizardAboutProps } from "./wizard-project-types";

export const WizardAbout: React.FC<WizardAboutProps> = ({ projectId }) => {
    const [inputValue, setInputValue] = useState('');
    const [chatHistory, setChatHistory] = useState<string>('');
    const [approvalRequests, setApprovalRequests] = useState<ApprovalToolCallState>([]);
    const approvalRequestsRef = useRef(approvalRequests);

    const { data: chatResponse, threadId, loading, error, fetchData } = useProjectAssistant();

     // Function to handle user approval
     const handleApproval = (id: string , approval: boolean) => {
        setApprovalRequests(prevRequests => 
            prevRequests.map(req => 
                req.toolCallId === id ? { ...req, approved: approval } : req
            )
        );
        console.log(approvalRequests)
    };

    //callback frunction to check from the hook if the user as accepted 
    //returns true if still some request request.approved === null (the user hasn't clicked)
    const checkApprovalStatus = (): Promise<boolean> => {
        return new Promise<boolean>(resolve => {
            const currentApprovalRequests = approvalRequestsRef.current;
            if (currentApprovalRequests && currentApprovalRequests.length > 0) {
                const result = currentApprovalRequests.some(request => request.approved === null);
                resolve(result);
            } else {
                resolve(true); // Resolve with true if there are no approval requests
            }
        });
    };
    

    useEffect(() => {
        approvalRequestsRef.current = approvalRequests;
    }, [approvalRequests]);

    // Function to handle chat
    function handleChat() {
        const fetchDataPromise = threadId 
            ? fetchData({ prompt: inputValue, projectId: projectId, existingThreadId: threadId, approvalRequestsRef, setApprovalRequests, checkApprovalStatus })
            : fetchData({ prompt: inputValue, projectId: projectId, approvalRequestsRef, setApprovalRequests, checkApprovalStatus });

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

                {approvalRequests.map(request => (
                    request.approved === null && (
                        <div key={request.toolCallId}>
                            <p>Approve action: {request.functionName} with args {request.functionArguments} ?</p>
                            <button 
                                className="bg-blue-500 text-white rounded px-4 mt-2 py-1 justify-center focus:outline-none focus:ring focus:ring-blue-200"
                                onClick={() => handleApproval(request.toolCallId, true)}>Yes</button>
                            <button 
                                className="bg-blue-500 text-white rounded px-4 mt-2 py-1 justify-center focus:outline-none focus:ring focus:ring-blue-200"
                                onClick={() => handleApproval(request.toolCallId, false)}>No</button>
                        </div>
                    )
                ))}

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