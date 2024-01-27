import type { RouterOutputs } from "~/utils/api";

type NoteData = RouterOutputs["notes"]["edit"];

export interface NoteModalProps {
    noteToEdit: NoteData | null; 
    projectId: string, //Prepping for project -> task prop change
    projectType: string, //Prepping for project -> task prop change
    showModal: boolean;
    isMember: boolean;
    isProjectLead: boolean;
    onClose: () => void;
}
  
export  interface CreateNotePayload {
    projectId: string;
    title: string;
    content: string;
}
  
// export  interface ChangeNoteOwnerPayload {
//     id: string;
//     projectId: string;
//     userId: string;
// }
  
export  interface DeleteNotePayload {
    id: string;
    projectId: string;
    userId: string;
}
  
  
export interface EditNotePayload extends CreateNotePayload {
    id: string;
}
