export interface CreateProjectModalProps {
    showModal: boolean;
    inputValue? : string;
    onClose: () => void;
  }
  
export interface CreateProjectPayload {
    title: string;
    summary: string;
    tags: string[];
    isSolo: boolean;
    isPrivate: boolean;
    tasks: string[];
    goals: string[];
}

export enum Step {
    ProjectDescription = 'DESCRIPTION',
    ProjectBuild = 'BUILD',
}
  