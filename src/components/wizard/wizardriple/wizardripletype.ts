
export type WizardRipleProps = {
    projectTitle: string;
    projectSummary: string;
    userId: string;
};



export interface GenerateRipleContentPayload {
    projectTitle: string;
    projectSummary: string;
    userPrompt: string;
    userId: string;
}

