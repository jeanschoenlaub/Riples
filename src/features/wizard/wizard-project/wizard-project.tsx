import { useEffect, useRef, useState } from "react";
import { useProjectAssistant } from "~/hooks/use-project-assistant";
import ReactMarkdown from "react-markdown";
import { LoadingSpinner } from "~/components";

export type WizardAboutProps = {
    projectId: string;
};

export interface ApprovalRequest {
    id: string;
    name: string;
    arguments: string; // Assuming arguments are stored as a JSON string
    approved: boolean | null; // null indicates awaiting approval, boolean for user's response
}

export type ApprovalRequestsState = ApprovalRequest[];

export const WizardAbout: React.FC<WizardAboutProps> = ({ projectId }) => {
    const [inputValue, setInputValue] = useState('');
    const [chatHistory, setChatHistory] = useState<string>('');
    const [approvalRequests, setApprovalRequests] = useState<ApprovalRequestsState>([]);
    const approvalRequestsRef = useRef(approvalRequests);


    const { data: chatResponse, threadId, loading, error, fetchData } = useProjectAssistant();

     // Function to handle user approval
     const handleApproval = (id: string , approval: boolean) => {
        setApprovalRequests(prevRequests => 
            prevRequests.map(req => 
                req.id === id ? { ...req, approved: approval } : req
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
                console.log("Current approval requests:", currentApprovalRequests);
                console.log("Approval status result:", result);
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
            ? fetchData({ prompt: inputValue, projectId: projectId, existingThreadId: threadId, approvalRequests, setApprovalRequests, checkApprovalStatus })
            : fetchData({ prompt: inputValue, projectId: projectId, approvalRequests, setApprovalRequests, checkApprovalStatus });

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
                        <div key={request.id}>
                            <p>Approve action: {request.name} with args {request.arguments} ?</p>
                            <button 
                                className="bg-blue-500 text-white rounded px-4 mt-2 py-1 justify-center focus:outline-none focus:ring focus:ring-blue-200"
                                onClick={() => handleApproval(request.id, true)}>Yes</button>
                            <button 
                                className="bg-blue-500 text-white rounded px-4 mt-2 py-1 justify-center focus:outline-none focus:ring focus:ring-blue-200"
                                onClick={() => handleApproval(request.id, false)}>No</button>
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