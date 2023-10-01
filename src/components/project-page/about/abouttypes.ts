import type { RouterOutputs } from "~/utils/api";

export type ProjectData = RouterOutputs["projects"]["getProjectByProjectId"] & {
    members?: RouterOutputs["projectMembers"]["getMembersByProjectId"];
  };
  
export  interface ProjectMemberMutationPayload {
    userId: string;
    projectId: string;
};
  
export interface AboutTabProps {
    project: ProjectData;
    isMember: boolean;
    isPending: boolean;
    isProjectLead: boolean;
    userId: string | undefined;
  }
  
export  interface EditProjectPayload {
    projectId: string;
    title: string;
    summary: string;
    status: string;
  }
  