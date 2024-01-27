import { api, type RouterOutputs } from '~/utils/api';
import { TaskList } from "~/features/task/task-list";
import { LoadingRiplesLogo } from '~/components/loading/loading';
import { NoteModal } from './notes-modal/note-modal';
import { useState } from 'react';

type ProjectData = RouterOutputs["projects"]["getProjectByProjectId"]
interface NotesTabProps {
    project: ProjectData["project"];
    isMember: boolean;
    isPending: boolean;
    isProjectLead: boolean;
}

type NoteEditData = RouterOutputs["notes"]["edit"];


export const NoteTab: React.FC<NotesTabProps> = ({ project, isMember, isPending, isProjectLead}) => {

    const [selectedNote, setSelectedNote] = useState<NoteEditData | null>(null);
    const [showNoteModal, setShowNoteModal] = useState(false);
    
    const { data: noteData, isLoading: isLoadingNotes, isError } = api.notes.getNotesByProjectId.useQuery({ projectId: project.id});
    const isLoading = isLoadingNotes 

    if (isLoading) return <div className="flex justify-center"><LoadingRiplesLogo isLoading={isLoading}/></div>;
    if (isError || !noteData) return <p>Error loading tasks.</p>;

    

    const handleCreateClick = () => {
        setSelectedNote(null); //Not a task to edit 
        setShowNoteModal(true);
    };

    const openEditModal = (note: NoteEditData) => {
        setSelectedNote(note);
        setShowNoteModal(true);
    };
    

    return (
        <>
        <div id="project-notes" className="border-r-2 border-l-2 border-b-2 border-gray-200 ">
                { (project.projectPrivacy === "public" || isMember || isProjectLead) && ( 
                     <div>
                     <div> 
                         <button 
                             className="bg-green-500 text-white text-xs md:text-base rounded px-4 py-2 hover:bg-green-600 focus:outline-none focus:border-green-700 focus:ring focus:ring-blue-200"
                             onClick={() => {handleCreateClick();}}
                         >
                             Create Note
                         </button>
                     </div>
                     {noteData.map((note, index) => (
                         <li key={index} className="border border-slate-300 flex flex-col bg-white w-full rounded-lg mx-2 md:mx-5 mt-4 mb-4 shadow-md">
                             <div 
                                onClick={() => openEditModal(note.note)} // Assuming openEditModal is the function you want to call
                                className="p-4 space-y-4 cursor-pointer" // This class changes the cursor to a pointer, indicating it's clickable
                            >

                                 {/* Note Title */}
                                 <div className="text-lg tracking-tight font-bold">
                                     {note.note.title}

                                {/* Note Content */}
                                <div className="font-light text-gray-500 md:text-lg">
                                    {note.note.content}
                                </div>

                                {/* Additional Note Details (Optional) */}
                                <div className="text-sm text-gray-800">
                                    <span className="text-gray-500">Created By: </span>
                                    <span>{note.createdBy?.name ?? "NA"}</span>
                                </div>

                                <div className="text-sm text-gray-800">
                                    <span className="text-gray-500">Created At: </span>
                                    <span>{note.note.createdAt.toDateString()}</span>
                                </div>

                                {/* Other details can be added here similar to the project component */}
                                </div>
                            </div>
                        </li>
                ))}
            </div>
        )}
        </div>
        <NoteModal 
            projectId={project.id} 
            projectType={project.projectType} 
            noteToEdit={selectedNote}
            isMember={isMember} 
            isProjectLead={isProjectLead} 
            showModal={showNoteModal}
            onClose={() => {
                setSelectedNote(null);
                setShowNoteModal(false); // Hide the modal when closing
            }}
      />
      </>
    )
}