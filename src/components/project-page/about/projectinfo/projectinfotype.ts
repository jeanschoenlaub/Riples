import type { RouterOutputs } from "~/utils/api";

export type ProjectData = RouterOutputs["projects"]["getProjectByProjectId"] 
export type ProjectCreateData = RouterOutputs["projects"]["create"] 
  
export  interface ProjectMemberMutationPayload {
    userId: string;
    projectId: string;
};
  
export interface ProjectAboutInfoProps {
    project: ProjectData;
    isMember: boolean;
    isPending: boolean;
    isProjectLead: boolean;
    userId: string | undefined;
  }
  
export type EditProjectPayload = {
    projectId: string;
    title: string;
    summary: string;
    status: string;
};