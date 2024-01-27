// External Imports
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';

// Local Imports
import { api } from "~/utils/api";
import { Modal } from '~/components';
import { useNoteMutation } from './note-modal-api';
import { CreateNotePayload, EditNotePayload, NoteModalProps } from './note-modal-types';

// Main React Functional Component
export const NoteModal: React.FC<NoteModalProps> = ({ projectId, projectType, noteToEdit, showModal, isMember, isProjectLead, onClose }) => {
  
  // Initialize state with values from props if noteToEdit is present (for edit mode vs create mode)
  const defaultTemplate = ``
  const initialContent = noteToEdit ? noteToEdit.content : defaultTemplate;

  //Is the logged in user allowed to edit ?
  const { data: session } = useSession();
  const allowedToEdit =  
    ((isMember && (
    session?.user.id === noteToEdit?.ownerId || 
    session?.user.id === noteToEdit?.createdById || 
    noteToEdit === null)) || isProjectLead)

  const allowedToDelete =  
   (isProjectLead || (isMember && session?.user.id === noteToEdit?.createdById))  && noteToEdit

  // States and useEffects
  const [noteTitle, setNoteTitle] = useState(() => noteToEdit ? noteToEdit.title : "")
  const [noteContent, setNoteContent] = useState(initialContent); //can the user edit ? 
  const [isEditMode, setIsEditMode] = useState(false); //If the task is being created --> edit mode

  // Conditional query using tRPC if task owner to display profile image
  const shouldExecuteQuery = !!noteToEdit?.ownerId // Run query only if there is a task owner
  const userQuery = api.users.getUserByUserId.useQuery(
    { userId: noteToEdit?.ownerId ?? "" },
    { enabled: shouldExecuteQuery }
  );

  useEffect(() => {
    if (noteToEdit) { // Existing task
      setNoteTitle(noteToEdit.title);
      setNoteContent(noteToEdit.content);
      if (allowedToEdit) {
        setIsEditMode(true); // If the task already exists + the user has the right to edit, we are editing vs creating
      }
    }
  }, [noteToEdit, allowedToEdit, session?.user.id]); 

  const enhancedOnClose = () => {
    resetForm();
    onClose();
  }

  const resetForm = () =>{
    setNoteTitle("");
    setIsEditMode(false)
    setNoteContent(defaultTemplate);
  }
    
  // Helper function to generate edit payload
  const generateEditPayload = (): EditNotePayload => ({
    projectId: projectId,
    title: noteTitle,
    content: noteContent,
    id: noteToEdit!.id
  });

  // Helper function to generate create payload
  const generateCreatePayload = (): CreateNotePayload => ({
    projectId: projectId,
    title: noteTitle,
    content: noteContent
  });

  const handleSave = () => {
    const payload = isEditMode && noteToEdit 
      ? generateEditPayload() 
      : generateCreatePayload();
  
    const noteAction = isEditMode 
      ? editNote(payload as EditNotePayload) 
      : createNote(payload);
  
    noteAction
      .then(() => {
        toast.success('Task saved successfully!');
        enhancedOnClose();
      })
      .catch(() => {
        toast.error('Error saving note');
      });
  };


  const handleDelete = () => {
    if (noteToEdit) {
      deleteNote({ id: noteToEdit.id, projectId: projectId, userId: session!.user.id })
        .then(() => {
          toast.success('Note deleted successfully!');
          enhancedOnClose();
        })
        .catch(() => {
          toast.error('Error deleting note');
        });
    }
  };
  

  //Custom Hooks
  const { isCreating, isEditing, isDeleting, createNote, editNote, deleteNote } = useNoteMutation();
  const isLoading = isCreating || isEditing || isDeleting ;

  return (
    <div>
      <Modal showModal={showModal} isLoading={isLoading} size="medium" onClose={enhancedOnClose}>
      <span className="text-lg font-semibold flex justify-center items-center space-x-4 mb-2w-auto">
        {noteToEdit ? (isEditMode ? "Edit Note" : "View Note") : "Create New Note"}
      </span>

        <label className="block text-base mb-3 justify-br" aria-label="Note Title">
          Note Title:
            <input
              type="text"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              className={`w-full p-2 mt-1 rounded border ${isLoading ? 'cursor-not-allowed' : ''}`}
              maxLength={255}
              disabled={!allowedToEdit || isLoading}
            />
        </label>
  

        <label className="block text-base mb-2" aria-label="Note Content">
          Note Content:
            <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className={`w-full p-2 mt-1 rounded border ${isLoading ? 'cursor-not-allowed' : ''}`}
                rows={7}
                maxLength={10000}
                disabled={!allowedToEdit || isLoading}
              />
        </label>

        <div className="flex md:flex-nowrap">
          {/*Buttons for users allowed to edit*/}
          {allowedToEdit &&
              <button 
                onClick={handleSave}
                className="bg-green-500 text-white text-lg rounded px-4 py-2 mr-2  flex items-center justify-center w-auto"
                disabled={isLoading}
              >
              <span>Save Note</span>
              </button>
          }
          {allowedToDelete && (
            <button 
            onClick={handleDelete} 
            className="bg-red-500 text-white rounded text-lg px-4 py-2 mr-2 flex items-center justify-center w-auto"
            disabled={isLoading || isDeleting}
          >
            <span>Delete Note</span>
            </button>
          )}
        </div>
      </Modal>
    </div>
  );
};




