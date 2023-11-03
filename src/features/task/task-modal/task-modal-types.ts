import type { RouterOutputs } from "~/utils/api";

export interface TaskModalProps {
    project: ProjectData["project"];
    taskToEdit: TaskData | null; 
    showModal: boolean;
    isMember: boolean;
    isProjectLead: boolean;
    inputValue: string; //If the user types some text before clicking create task
    onClose: () => void;
}
  
export  interface CreateTaskPayload {
    projectId: string;
    title: string;
    status: string;
    content: string;
}
  
export  interface ChangeTaskOwnerPayload {
    id: string;
    projectId: string;
    userId: string;
}
  
export  interface DeleteTaskPayload {
    id: string;
    projectId: string;
    userId: string;
}
  
export  interface EditStatusPayload {
    id: string;
    status: string;
}
  
  
export interface EditTaskPayload extends CreateTaskPayload {
    id: string;
}
  
  
type ProjectData = RouterOutputs["projects"]["getProjectByProjectId"];
type TaskData = RouterOutputs["tasks"]["edit"];