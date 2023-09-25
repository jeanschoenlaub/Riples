import React, { useEffect, useState } from 'react';
import type { RouterOutputs} from "~/utils/api";
import { api } from "~/utils/api";
import { LoadingRiplesLogo, LoadingSpinner } from '../../reusables/loading';
import toast from 'react-hot-toast';
import { handleZodError } from '~/utils/error-handling';
import { SubTaskModal } from '~/components/project-page/task/subtaskmodal';
import { useSession } from 'next-auth/react';

type TaskData = RouterOutputs["tasks"]["getTasksByProjectId"][0];
interface SubTasksRowsProps {
    taskData: TaskData;
}
type SubTaskData = RouterOutputs["tasks"]["getTasksByProjectId"][0]["task"]["subTasks"][0];
  
export const SubTasksRows: React.FC<SubTasksRowsProps> = ({ taskData }) => {
    const [subTaskTitle, setSubTaskTitle] = useState(''); // state variable to store sub-task title
    const [LoadingSubTaskId, setLoadingSubTaskId] = useState<string | null>(null);
    const [showSubTaskModal, setShowSubTaskModal] = useState(false);
    const [selectedSubTask, setSelectedSubTask] = useState<SubTaskData | null>(null);

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


  useEffect(() => {
    console.log(showSubTaskModal)
  }, [showSubTaskModal]); 

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
            <span className="text-sm text-gray-600 hover:text-blue-500 hover:underline underline-blue-500 flex-grow"
                  onClick={() => {
                    setShowSubTaskModal(true);
                    setSelectedSubTask(subTask);
                }}
                >{subTask.title}
            </span>
            {/*Sub task delete */}
            <button 
              className="text-blue-600 dark:text-blue-500 hover:underline ml-2"
              onClick={() => handleDeleteSubTask(subTask.id)}
              disabled={isLoading}
              >
              {(LoadingSubTaskId === subTask.id && isDeleting )?
                    (<LoadingSpinner size={16} />) 
                    :(
                  <svg className="w-4 h-4 text-gray-800  dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
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
              <div className="ml-2"> <LoadingSpinner size={16} /> </div>
              ) : (
                  <svg className="w-4 h-4 ml-2 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
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
  
// Payload for creating a new sub-task
interface CreateSubTaskPayload {
    taskId: string;
    title: string;
  }

// Payload for deleting a sub-task
interface DeleteSubTaskPayload {
id: string;
}

// Payload for changing the status of a sub-task
interface EditSubTaskStatusPayload {
id: string;
status: boolean;  // Note: using boolean to match your Prisma model
}
  
// Custom hook to handle mutations and their state for Subtasks
const useSubTaskMutation = (taskId: string, { onSuccess }: { onSuccess: () => void }) => {
  const apiContext = api.useContext();
  
  const handleSuccess = async () => {
    await apiContext.tasks.getTasksByProjectId.invalidate();
    onSuccess();
  };
  
  const { mutate: createSubTaskMutation, isLoading: isCreating } = api.tasks.createSubTask.useMutation({
    onSuccess: handleSuccess
  });
  const createSubTask = (payload: CreateSubTaskPayload) => {
      return new Promise<void>((resolve, reject) => {
          createSubTaskMutation(payload, {
              onSuccess: () => { resolve(); },
              onError: (e) => {
                  const errorMessage = e.data?.zodError?.fieldErrors.title;
                  if (errorMessage?.[0]) {
                      toast.error(errorMessage[0]);
                  } else {
                      toast.error("Failed to create subtask! Please try again later.");
                  }
                  reject(e);
              }
          });
      });
  };

  const { mutate: deleteSubTaskMutation, isLoading: isDeleting } = api.tasks.deleteSubTask.useMutation({
    onSuccess: handleSuccess
  });
  const deleteSubTask = (payload: DeleteSubTaskPayload) => {
    return new Promise<void>((resolve, reject) => {
        deleteSubTaskMutation(payload, {
            onSuccess: () => { resolve(); },
            onError: (e) => {
                const errorMessage = e.data?.zodError?.fieldErrors.id;
                if (errorMessage?.[0]) {
                    toast.error(errorMessage[0]);
                } else {
                    toast.error("Failed to delete subtask! Please try again later.");
                }
                reject(e);
            }
        });
    });
  };

  const { mutate: editStatusMutation, isLoading: isEditingStatus } = api.tasks.changeSubTaskStatus.useMutation({
    onSuccess: handleSuccess
  });
  const editStatus = (payload: EditSubTaskStatusPayload) => {
    return new Promise<void>((resolve, reject) => {
        editStatusMutation(payload, {
            onSuccess: () => { resolve(); },
            onError: (e) => {
                const errorMessage = e.data?.zodError?.fieldErrors.status;
                if (errorMessage?.[0]) {
                    toast.error(errorMessage[0]);
                } else {
                    toast.error("Failed to edit subtask status! Please try again later.");
                }
                reject(e);
            }
        });
    });
  };

  return {
    isCreating,
    isDeleting,
    isEditingStatus,
    createSubTask,
    deleteSubTask,
    editStatus,
  };
};