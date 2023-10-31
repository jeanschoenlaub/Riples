import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import type { RouterOutputs} from "~/utils/api";
import { api } from "~/utils/api";
import { Modal } from '~/components';
import { handleMutationError } from '~/utils/error-handling';

interface SubTaskModalProps {
  subTaskToEdit: SubTaskData; 
  showModal: boolean;
  allowedToEdit: boolean;
  onClose: () => void;
}


interface EditSubTaskPayload {
  id: string;
  title: string;
  content: string;
}

type SubTaskData = RouterOutputs["tasks"]["getSubTasksByTaskId"][0];

// Main React Functional Component
export const SubTaskModal: React.FC<SubTaskModalProps> = ({ subTaskToEdit, showModal, allowedToEdit, onClose }) => {  
    //Custom Hooks
  const {isEditing, editSubTask} = useSubTaskMutation();
  const isLoading =  isEditing;

  // States and useEffects
  const [subTaskTitle, setSubTaskTitle] = useState(() =>  subTaskToEdit?.title )
  const [subTaskContent, setSubTaskContent] = useState(() =>  subTaskToEdit?.content )

  useEffect(() => {
    setSubTaskTitle(subTaskToEdit?.title);
    setSubTaskContent(subTaskToEdit?.content);
  }, [subTaskToEdit, showModal]); 
  
  // Helper function to generate edit payload
  const generateEditPayload = (): EditSubTaskPayload => ({
    title: subTaskTitle,
    content: subTaskContent,
    id: subTaskToEdit.id
  });
  
  const handleSave = () => {
    const payload = generateEditPayload();
    
    editSubTask(payload)
      .then(() => {
        toast.success('subtask saved successfully!');
        onClose();
      })
      .catch(() => {
        toast.error('Error saving subtask');
      });
  };

  return (
    <div>
      <Modal showModal={showModal} isLoading={isLoading} size="medium" onClose={onClose}>
      <span className="text-lg flex justify-center items-center space-x-4 mb-2w-auto">
        {allowedToEdit ? "Edit subtask" : "View subtask"}
      </span>

        <label className="block text-sm mb-3 justify-br" aria-label="subtask Content">
          SubTask Title:
            <input
              type="text"
              value={subTaskTitle}
              onChange={(e) => setSubTaskTitle(e.target.value)}
              className={`w-full p-2 mt-1 rounded border ${isLoading ? 'cursor-not-allowed' : ''}`}
              maxLength={255}
              disabled={!allowedToEdit || isLoading}
            />
        </label>

        <label className="block text-sm mb-2" aria-label="subtask Content">
          SubTask Content:
            <textarea
                value={subTaskContent}
                onChange={(e) => setSubTaskContent(e.target.value)}
                className={`w-full p-2 mt-1 rounded border ${isLoading ? 'cursor-not-allowed' : ''}`}
                rows={5}
                maxLength={10000}
                disabled={!allowedToEdit || isLoading}
              />
        </label>

        <div className="flex md:flex-nowrap">
          {/*Buttons for users allowed to edit*/}
          {allowedToEdit &&
              <button 
                onClick={handleSave}
                className="bg-green-500 text-white rounded px-4 py-2 mr-2  flex items-center justify-center w-auto"
                disabled={isLoading}
              >
                Save
              </button>
          }
        </div>
      </Modal>
    </div>
  );
};

// Custom hook to handle mutations and their state
const useSubTaskMutation = () => {
  const apiContext = api.useContext();
  
  const handleSuccess = async () => {
    await apiContext.tasks.getTasksByProjectId.invalidate();
  };

  // Edit subtask Mutation
const { mutate: editSubTaskMutation, isLoading: isEditing } = api.tasks.editSubTask.useMutation({
    onSuccess: handleSuccess,
  });
  
  const editSubTask = (payload: EditSubTaskPayload) => {
    return new Promise<void>((resolve, reject) => {
      editSubTaskMutation(payload, {
        onSuccess: () => { resolve(); },
        onError: (e) => {
          handleMutationError(e, reject);
        }  
      });
    });
  };

  return {
    isEditing,
    handleSuccess, 
    editSubTask,
  }
}

