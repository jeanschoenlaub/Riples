import type { RouterOutputs } from "~/utils/api";

type TaskData = RouterOutputs["tasks"]["edit"];

export interface TaskModalProps {
    taskToEdit: TaskData | null; 
    projectId: string, //Prepping for project -> task prop change
    projectType: string, //Prepping for project -> task prop change
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
    due: Date;
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
