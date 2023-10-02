import type { RouterOutputs } from "~/utils/api";

export type CreateProjectGoalPayload = {
    projectId: string;
    title: string;
    progress: number;
    progressFinalValue: number;
};

export type EditProjectGoalPayload = {
    goalId: string;
    projectId: string;
    title: string;
    progress: number;
    notes: string;
    status: string;
    progressFinalValue: number;
};

export type DeleteProjectGoalPayload = {
    goalId: string;
};

export type FinishProjectGoalPayload = {
    goalId: string;
    goalTitle: string;
    postToFeed: boolean;
    postContent: string;
};

export type Goal = RouterOutputs["projects"]["getProjectByProjectId"]["project"]["goals"][0]

export type FinishGoalPayload = {
    goalId: string;
    goalTitle: string;
    postToFeed: boolean;
    postContent: string;
};

export interface GoalFinishedModalType {
    goalFinished: Goal; 
    showModal: boolean;
    isProjectLead: boolean;
    isPrivate: string;
    onClose: () => void;
}

export type EditGoalPayload = {
    goalId: string;
    projectId: string;
    title: string;
    progress: number;
    notes: string;
    status:string;
    progressFinalValue: number;
};

export interface GoalModalProps {
    goalToEdit: Goal; 
    projectId: string;
    showModal: boolean;
    isMember: boolean;
    isProjectLead: boolean;
    onClose: () => void;
}