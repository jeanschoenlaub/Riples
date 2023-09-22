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
    projectStatus: string;
    tasks: string[];
}

export enum Step {
    ProjectDescription = 'DESCRIPTION',
    ProjectBuild = 'BUILD',
    ProjectSettings = 'SETTINGS',
}
  