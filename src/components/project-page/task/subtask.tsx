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

    useEffect(() => {
      console.log(showSubTaskModal)
    }, [showSubTaskModal]); 



    const { data: session } = useSession();
    const allowedToEdit = session?.user.id === taskData.task.ownerId || session?.user.id === taskData.task.createdById

   
    const { isCreating, isDeleting, isEditingStatus, editStatus, createSubTask, deleteSubTask } = useSubTaskMutation(taskData.task.id, { onSuccess: resetSubTasks });
    const isLoading = isCreating || isDeleting 
  
    return (
        <div className="pl-4 border-l-2 border-gray-300">
          {taskData.task.subTasks.map((subTask, index) => (
            <div key={index} 
                className="flex items-center py-2 border-b cursor-pointer"
                onClick={() => {
                  setShowSubTaskModal(true);
                  setSelectedSubTask(subTask);
              }}
              >
                <input
                    type="checkbox"
                    className="mr-2"
                    checked={subTask.status}
                    disabled={isLoading}
                    onChange={() => {
                    setLoadingSubTaskId(subTask.id);
                    editStatus({ id: subTask.id, status: !subTask.status});
                    }}
                />
              <span className="text-sm text-gray-600 hover:text-blue-500 hover:underline underline-blue-500 flex-grow">{subTask.title}</span> {/* Replace `title` with your actual field name */}
              <button onClick={() => { deleteSubTask({ id: subTask.id }); setLoadingSubTaskId(subTask.id)}} className="text-blue-600 dark:text-blue-500 hover:underline ml-2">
                {LoadingSubTaskId === subTask.id ?
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
            />
            <button onClick={() => createSubTask({ taskId: taskData.task.id, title: subTaskTitle })} disabled={isLoading} >
            { isCreating? (
               <div className="ml-2"> <LoadingSpinner size={16} /> </div>
                ) : (
                    <svg className="w-4 h-4 ml-2 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                    <path stroke="#008000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
                    </svg>
            )}
            </button>
            </div>
            <SubTaskModal 
              subTaskToEdit={selectedSubTask} 
              allowedToEdit={allowedToEdit}
              showModal={showSubTaskModal}
              onClose={() => {
                setShowSubTaskModal(false); // Hide the modal when closing
                setSelectedSubTask(null);
              }}
            />
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
  
  const handleSuccess = () => {
    void apiContext.tasks.getSubTasksByTaskId.invalidate({taskId}); // Invalidate the cache for subtasks
    onSuccess(); // Execute any additional onSuccess logic
  };
  
  // Mutation for creating a subtask
  const { mutate: createSubTaskMutation, isLoading: isCreating } = api.tasks.createSubTask.useMutation({
    onSuccess: handleSuccess,
    onError: (e) => {
      const fieldErrors = e.data?.zodError?.fieldErrors;
      const message = handleZodError(fieldErrors);
      toast.error(message);
    },
  });

  // Mutation for deleting a subtask
  const { mutate: deleteSubTaskMutation, isLoading: isDeleting } = api.tasks.deleteSubTask.useMutation({
    onSuccess: handleSuccess,
    onError: (e) => {
      const fieldErrors = e.data?.zodError?.fieldErrors;
      const message = handleZodError(fieldErrors);
      toast.error(message);
    },
  });

  // Mutation for editing the status of a subtask
  const { mutate: editStatusMutation, isLoading: isEditingStatus } = api.tasks.changeSubTaskStatus.useMutation({
    onSuccess: handleSuccess,
    onError: (e) => {
      const fieldErrors = e.data?.zodError?.fieldErrors;
      const message = handleZodError(fieldErrors);
      toast.error(message);
    },
  });

  const editStatus = (payload: EditSubTaskStatusPayload) => {
    editStatusMutation(payload);
  };

  const deleteSubTask = (payload: DeleteSubTaskPayload) => {
    deleteSubTaskMutation(payload);
  };

  const createSubTask = (payload: CreateSubTaskPayload) => {
    createSubTaskMutation(payload);
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