export interface CreateRiplePayload {
    projectId: string;
    projectTitle: string;
    title: string;
    content: string;
    ripleImages?: RipleImageDB[]; // Optional list of image IDs
}

type RipleImageDB = {
    id: string;        // Image ID
    caption: string;   // Caption for the image
};


export interface CreateRipleModalProps {
    showModal: boolean;
    onClose: () => void;
    isLoading?: boolean;
    projectId: string;
    projectTitle: string;
    projectSummary: string;
    projectCoverImageId: string;
}
