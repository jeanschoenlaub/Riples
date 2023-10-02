// External Imports
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';

// Local Imports
import { Modal } from '../../../reusables/modaltemplate';
import { useProjectGoalMutation } from './goalsapi';
import { RouterOutputs } from '~/utils/api';
import { LoadingSpinner } from '~/components/reusables/loading';

type Goal = RouterOutputs["projects"]["getProjectByProjectId"]["project"]["goals"][0]

type EditGoalPayload = {
    goalId: string;
    projectId: string;
    title: string;
    progress: number;
    progressFinalValue: number;
};

interface GoalModalProps {
    goalToEdit: Goal; 
    projectId: string;
    showModal: boolean;
    isMember: boolean;
    isProjectLead: boolean;
    onClose: () => void;
}


// Main React Functional Component
export const GoalModal: React.FC<GoalModalProps> = ({ goalToEdit, projectId, showModal, isMember, isProjectLead, onClose }) => {
  // States
  const [goalTitle, setGoalTitle] = useState(goalToEdit ? goalToEdit.title : "");
  const [goalProgress, setGoalProgress] = useState(goalToEdit ? goalToEdit.progress : 0);
  const [goalFinalValue, setGoalFinalValue] = useState(goalToEdit ? goalToEdit.progressFinalValue : 0);
  
  const { isEditing, isDeleting, editProjectGoal, deleteProjectGoal } = useProjectGoalMutation();

  const isLoading =isDeleting || isEditing

  useEffect(() => {
    if (goalToEdit) { 
      setGoalTitle(goalToEdit.title);
      setGoalProgress(goalToEdit.progress);
      setGoalFinalValue(goalToEdit.progressFinalValue);
    }
  }, [goalToEdit]);

  const handleSave = () => {
    const payload = generateEditPayload();
    editProjectGoal(payload)
      .then(() => {
        toast.success('Goal saved successfully!');
        onClose();
      })
      .catch(() => {
        toast.error('Error saving goal');
      });
  };

  const handleDelete = () => {
    if (goalToEdit) {
      deleteProjectGoal({ goalId: goalToEdit.id })
        .then(() => {
          toast.success('Goal deleted successfully!');
          onClose();
        })
        .catch(() => {
          toast.error('Error deleting goal');
        });
    }
  };

  // Helper function to generate edit payload
  const generateEditPayload = (): EditGoalPayload => ({
    goalId: goalToEdit!.id,
    projectId: projectId,
    title: goalTitle,
    progress: goalProgress,
    progressFinalValue: goalFinalValue
  });

  return (
    <div>
    <Modal showModal={showModal} isLoading={isLoading} size="medium" onClose={onClose}>
        <span className="text-lg flex justify-center items-center space-x-4 mb-2 w-auto">
            {goalToEdit ? "Edit Goal" : "Create New Goal"}
        </span>

        <label className="block text-sm mb-3 justify-br" aria-label="Goal Title">
            Goal Title:
            <input
                type="text"
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
                className={`w-full p-2 mt-1 rounded border ${isLoading ? 'cursor-not-allowed' : ''}`}
                maxLength={255}
                disabled={isLoading}
            />
        </label>

        <label className="block text-sm mb-3 justify-br" aria-label="Goal Progress">
            Goal Progress:
            <input 
                type="number" 
                value={goalProgress}
                onChange={(e) => setGoalProgress(Number(e.target.value))}
                className={`w-full p-2 mt-1 rounded border ${isLoading ? 'cursor-not-allowed' : ''}`}
                disabled={isLoading}
            />
        </label>

        <label className="block text-sm mb-3 justify-br" aria-label="Goal Final Value">
            Goal Final Value:
            <input 
                type="number" 
                value={goalFinalValue}
                onChange={(e) => setGoalFinalValue(Number(e.target.value))}
                className={`w-full p-2 mt-1 rounded border ${isLoading ? 'cursor-not-allowed' : ''}`}
                disabled={isLoading}
            />
        </label>

        <div className="flex md:flex-nowrap space-x-4 mt-4">
            {isProjectLead && (
                <>
                    <button 
                        onClick={handleSave}
                        className="bg-green-500 text-white rounded px-4 py-2 flex items-center justify-center w-auto"
                        disabled={isLoading}
                    >
                       {isEditing && <LoadingSpinner size={20} />}  Save Goal
                    </button>
                    <button 
                        onClick={onClose}
                        className="bg-gray-300 text-gray-600 rounded px-4 py-2 flex items-center justify-center w-auto"
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                </>
            )}

            {(isProjectLead || isMember) && (
                <button 
                    onClick={handleDelete} 
                    className="bg-red-500 text-white rounded px-4 py-2 flex items-center justify-center w-auto"
                    disabled={isLoading}
                >
                    {isDeleting && <LoadingSpinner size={20} />}  Delete Goal
                </button>
            )}
        </div>
    </Modal>
</div>

  );
};
