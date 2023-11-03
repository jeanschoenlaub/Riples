

export type WizardTaskProps = {
    projectTitle: string;
    projectSummary: string;
    taskNumber: string;
    goalNumber: string;
    userId: string;
};

export interface GenerateProjectTaskMutationPayload {
    projectTitle: string;
    projectSummary: string;
    taskNumber: string;
    userId: string;
}
 
export interface GenerateProjectGoalMutationPayload {
    projectTitle: string;
    projectSummary: string;
    goalNumber: string;
    userId: string;
}

export interface GenerateProjectPostMutationPayload {
    projectTitle: string;
    projectSummary: string;
    userId: string;
}