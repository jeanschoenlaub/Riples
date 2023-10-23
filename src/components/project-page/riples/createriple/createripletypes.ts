export  interface CreateRiplePayload {
    projectId: string;
    projectTitle: string;
    title: string;
    content: string;
}
  
export interface CreateRipleModalProps {
    showModal: boolean;
    onClose: () => void;
    isLoading?: boolean;
    projectId: string;
    projectTitle: string;
    projectSummary: string;
    projectCoverImageId: string;
}
