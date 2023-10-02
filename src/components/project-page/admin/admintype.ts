import type { RouterOutputs } from "~/utils/api";

export type ProjectData = RouterOutputs["projects"]["getProjectByProjectId"]
export type MemberData = RouterOutputs["projectMembers"]["getMembersByProjectId"];

export interface AdminTabProps {
    project: ProjectData["project"];
    members: MemberData;
    isProjectLead: boolean;
}

export type EditProjectAdminPayload = {
    projectId: string;
    projectPrivacy: string;
    projectType: string;
};