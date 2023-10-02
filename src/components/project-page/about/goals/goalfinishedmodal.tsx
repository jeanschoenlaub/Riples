// External Imports
import toast from 'react-hot-toast';

// Local Imports
import { Modal } from '../../../reusables/modaltemplate';
import { useProjectGoalMutation } from './goalsapi';
import { LoadingSpinner } from '~/components/reusables/loading';
import { GoalSVG } from '~/components/reusables/svg';
import type { FinishGoalPayload, GoalFinishedModalType } from './goaltypes';


// Main React Functional Component
export const GoalFinishedModal: React.FC<GoalFinishedModalType> = ({ goalFinished, showModal, isProjectLead, onClose }) => {

  const { isFinishing, finishProjectGoal } = useProjectGoalMutation();
  const isLoading = isFinishing

  const handleSave = () => {
    const payload = generateEditPayload();
    finishProjectGoal(payload)
      .then(() => {
        toast.success('Goal status changed to "Finished"');
        onClose();
      })
      .catch(() => {
        toast.error('Error saving goal');
      });
  };
  
  // Helper function to generate edit payload
  const generateEditPayload = (): FinishGoalPayload => ({
    goalId: goalFinished.id,
  });

  return (
    <div>
    <Modal showModal={showModal} isLoading={isLoading} Success={true} size="medium" onClose={onClose}>
        <span className="text-lg flex justify-center items-center space-x-4 mb-2 w-auto">
            Congratulations 
        </span>

        <div className="block text-sm mb-3 justify-br" aria-label="Goal Title">
            You just finished:
        </div>

        <div className="flex items-center mb-2">
              <div className="flex flex-col items-bottom justify-center ml-2 mr-4">
                  <GoalSVG colorFillHex='#22c55e'/>
              </div>

              <div className="flex flex-col w-1/8 md:w-3/5 mr-2">
                  <div>{goalFinished.title}</div>
              </div>
      
              <div className="flex flex-col ml-2">
                  <div className="flex items-center">
                          <div className="border rounded px-2 py-1 mr-1 w-auto">
                              {goalFinished.progress}
                          </div>
                          <span>/</span>
                          <div className="px-2 py-1 ml-1 w-auto">
                              {goalFinished.progressFinalValue}
                          </div>
                  </div>
              </div>
        </div>
        <div className="flex md:flex-nowrap space-x-4 mt-4">
        {isProjectLead && (
            <>
                <button 
                    onClick={handleSave}
                    className="bg-green-500 text-white rounded px-4 py-2 flex items-center justify-center w-auto"
                    disabled={isLoading}
                >
                  {isFinishing && <LoadingSpinner size={20} />}  Save Goal
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
        </div>
    </Modal>
    </div>
  );
};
