import type { RouterOutputs } from "~/utils/api";

export type ProjectData = RouterOutputs["projects"]["getProjectByProjectId"] 
export type ProjectCreateData = RouterOutputs["projects"]["create"] 
  
export  interface ProjectMemberMutationPayload {
    userId: string;
    projectId: string;
    projectTitle: string;
    username: string;
    projectLeadId: string;
}
  
export interface ProjectAboutInfoProps {
    project: ProjectData;
    isMember: boolean;
    isPending: boolean;
    isProjectLead: boolean;
    projectTags: string[];
    userId: string | undefined;
    username: string | undefined;
  }
  
export type EditProjectPayload = {
    projectId: string;
    title: string;
    link: string;
    summary: string;
    tags: string[];
    status: string;
};