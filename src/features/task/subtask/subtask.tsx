import React, { useState } from 'react';
import { LoadingSpinner } from '~/components';
import toast from 'react-hot-toast';
import { SubTaskModal } from '~/features/task/subtask/subtaskmodal/subtaskmodal';
import { useSession } from 'next-auth/react';
import type { SubTaskData, SubTasksRowsProps } from './subtasktypes';
import { useSubTaskMutation } from './subtaskapi';
import { useOnboarding } from '../../onboarding/onboardingwrapper';


  
export const SubTasksRows: React.FC<SubTasksRowsProps> = ({ taskData }) => {
    const [subTaskTitle, setSubTaskTitle] = useState(''); // state variable to store sub-task title
    const [LoadingSubTaskId, setLoadingSubTaskId] = useState<string | null>(null);
    const [showSubTaskModal, setShowSubTaskModal] = useState(false);
    const [selectedSubTask, setSelectedSubTask] = useState<SubTaskData | null>(null);
    const { triggerOnboardingWatch } = useOnboarding();

    const resetSubTasks = () => {
        setLoadingSubTaskId(null)
        setSubTaskTitle('');
    };

    const handleChangeSubTaskStatus = (subTaskId: string, newStatus: boolean) => {
      setLoadingSubTaskId(subTaskId);
  
      const payload = {
        id: subTaskId,
        status: newStatus
      };
  
      editStatus(payload)
        .then(() => {
          triggerOnboardingWatch();
          toast.success('Subtask status updated successfully!');
        })
        .catch(() => {
          toast.error('Error updating subtask status');
        });
  };

  const handleDeleteSubTask = (subTaskId: string) => {
    setLoadingSubTaskId(subTaskId);

    const payload = {
        id: subTaskId,
    };

    deleteSubTask(payload)
        .then(() => {
            toast.success('Subtask deleted successfully!');
        })
        .catch(() => {
            toast.error('Error deleting subtask');
        });
  };

  const handleCreateSubTask = (title: string) => {
    if (title.trim()) {
        const payload = {
            taskId: taskData.task.id,
            title: title.trim(),
        };

        createSubTask(payload)
            .then(() => {
                toast.success('Subtask created successfully!');
            })
            .catch(() => {
                toast.error('Error creating subtask');
            });
    }
  };

  const { data: session } = useSession();
  const allowedToEdit = session?.user.id === taskData.task.ownerId || session?.user.id === taskData.task.createdById

  
  const { isCreating, isDeleting, isEditingStatus, editStatus, createSubTask, deleteSubTask } = useSubTaskMutation(taskData.task.id, { onSuccess: resetSubTasks });
  const isLoading = isCreating || isDeleting || isEditingStatus;

  return (
      <div className="pl-4 border-l-2 border-gray-300">
        {taskData.task.subTasks.map((subTask, index) => (
          <div key={index} 
              className="flex items-center py-2 border-b cursor-pointer"
            >
            {/*Checkbox*/}
            { (LoadingSubTaskId === subTask.id && isEditingStatus) ? (
              <div className="mr-2"> <LoadingSpinner size={16} /> </div>
              ) : (
              <input
                  type="checkbox"
                  className="mr-2"
                  checked={subTask.status}
                  disabled={isLoading}
                  onChange={() => { handleChangeSubTaskStatus(subTask.id, !subTask.status); }}
              />)}
            {/*Sub task title */}
            <span className="text-sm text-gray-700 hover:text-blue-500 hover:underline underline-blue-500 flex-grow"
                  onClick={() => {
                    setShowSubTaskModal(true);
                    setSelectedSubTask(subTask);
                }}
                >{subTask.title}
            </span>
            {/*Sub task delete */}
            <button 
              className="text-blue-600  hover:underline ml-2 mr-6"
              onClick={() => handleDeleteSubTask(subTask.id)}
              disabled={isLoading}
              >
              {(LoadingSubTaskId === subTask.id && isDeleting )?
                    (<LoadingSpinner size={16} />) 
                    :(
                  <svg className="w-4 h-4 text-gray-800  " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h16M7 8v8m4-8v8M7 1h4a1 1 0 0 1 1 1v3H6V2a1 1 0 0 1 1-1ZM3 5h12v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5Z" />
                  </svg>)
              }
            </button>
          </div>
        ))}
        {/*Add a new Sub-Task*/}
        <div className="flex items-center mt-2 opacity-50">
          <input
              type="text"
              placeholder="Add a Sub-Task"
              className="flex-grow border-b py-1 px-2"
              disabled={isLoading}
              value={subTaskTitle}
              onChange={(e) => setSubTaskTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && subTaskTitle.trim()) {  // Ensure it's the Enter key and there's a title
                  handleCreateSubTask(subTaskTitle);
                }
              }}
          />
          <button onClick={() => handleCreateSubTask(subTaskTitle)} disabled={isLoading} >
          { isCreating? (
              <div className="ml-2 mr-6"> <LoadingSpinner size={16} /> </div>
              ) : (
                  <svg className="w-4 h-4 ml-2 mr-6 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                  <path stroke="#008000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
                  </svg>
          )}
          </button>
          </div>
          {selectedSubTask && (
            <SubTaskModal 
                subTaskToEdit={selectedSubTask} 
                allowedToEdit={allowedToEdit}
                showModal={showSubTaskModal}
                onClose={() => {
                    setShowSubTaskModal(false); // Hide the modal when closing
                    setSelectedSubTask(null);
                }}
            />
        )}
      </div>
    )      
};
  

