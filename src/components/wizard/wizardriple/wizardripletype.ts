
export type WizardRipleProps = {
    projectTitle: string;
    projectSummary: string;
    ripleContent: string;
    userId: string;
    modalStep: string;
};



export interface GenerateRipleContentPayload {
    projectTitle: string;
    projectSummary: string;
    userPrompt: string;
    userId: string;
}

export interface GenerateRipleHTMLPayload {
    ripleContent: string;
    userPrompt: string;
    userId: string;
}

