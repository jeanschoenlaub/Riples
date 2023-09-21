import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import type { RouterOutputs} from "~/utils/api";
import { api } from "~/utils/api";
import { handleZodError } from "~/utils/error-handling";
import { Modal } from '../../reusables/modaltemplate';
import { useSession } from 'next-auth/react';
import { LoadingSpinner } from '../../reusables/loading';
import Link from 'next/link';
import { ProfileImage } from '../../reusables/profileimage';

interface TaskModalProps {
  project: ProjectData["project"];
  taskToEdit: TaskData | null; 
  showModal: boolean;
  isMember: boolean;
  isProjectLead: boolean;
  inputValue: string; //If the user types some text before clicking create task
  onClose: () => void;
}

interface CreateTaskPayload {
  projectId: string;
  title: string;
  content: string;
}

interface ChangeTaskOwnerPayload {
  id: string;
  projectId: string;
  userId: string;
}

interface DeleteTaskPayload {
  id: string;
  projectId: string;
  userId: string;
}

interface EditStatusPayload {
  id: string;
  status: string;
}


interface EditTaskPayload extends CreateTaskPayload {
  id: string;
}


type ProjectData = RouterOutputs["projects"]["getProjectByProjectId"];
type TaskData = RouterOutputs["tasks"]["edit"];

// Main React Functional Component
export const TaskModal: React.FC<TaskModalProps> = ({ project, taskToEdit, showModal, isMember, isProjectLead, inputValue, onClose }) => {
  
  // Initialize state with values from props if taskToEdit is present (for edit mode vs create mode)
  const initialTitle = taskToEdit ? taskToEdit.title : inputValue;
  const initialContent = taskToEdit ? taskToEdit.content : defaultTemplate;

  console.log("Input Value in Modal: ", inputValue);

  //Is the logged in user allowed to edit ?
  const { data: session } = useSession();
  const allowedToEdit =  
    ((isMember && (
    session?.user.id === taskToEdit?.ownerId || 
    session?.user.id === taskToEdit?.createdById || 
    session?.user.id === project.authorID ||
    taskToEdit === null)) || isProjectLead)

  const allowedToDelete =  
   (isMember || isProjectLead) && (
    session?.user.id === taskToEdit?.createdById || 
    session?.user.id === project.authorID)

  // States and useEffects
  const [taskTitle, setTaskTitle] = useState(initialTitle);
  const [taskContent, setTaskContent] = useState(initialContent); //can the user edit ? 
  const [showHtmlPreview, setShowHtmlPreview] = useState(true); // state variable to control HTML preview mode -- Set to edit by default
  const [isEditMode, setIsEditMode] = useState(false); //If the task is being created --> edit mode
  const [isOwner, setIsOwner] = useState(session?.user.id === taskToEdit?.ownerId);
  const [taskStatus, setTaskStatus] = useState(taskToEdit ? taskToEdit.status : 'To-Do');
  const [taskOwnerId, setTaskOwnerId] = useState(taskToEdit ? taskToEdit.ownerId: null);

  // Conditional query using tRPC if task owner to display profile image
  const shouldExecuteQuery = !!taskToEdit?.ownerId // Run query only if there is a task owner
  const userQuery = api.users.getUserByUserId.useQuery(
    { userId: session?.user?.id ?? "" },
    { enabled: shouldExecuteQuery }
  );

  useEffect(() => {
    if (taskToEdit) { // Existing task
      setTaskTitle(taskToEdit.title);
      console.log("no")
      setShowHtmlPreview(false); 
      setTaskStatus(taskToEdit.status);
      setTaskContent(taskToEdit.content);
      setTaskOwnerId(taskToEdit.ownerId);
      setIsOwner(session?.user.id === taskToEdit.ownerId);
      if (allowedToEdit) {
        setIsEditMode(true); // If the task already exists + the user has the right to edit, we are editing vs creating
      }
    }
    else {
      setTaskTitle(inputValue);
    }
  }, [taskToEdit, session]); 
  
  const enhancedOnClose = () => {
    resetForm();
    onClose();
  };

  const resetForm = () => {
    //Could add make sure to save ?
    setTaskTitle('');
    setTaskContent(defaultTemplate);
    setIsEditMode(false);
    setShowHtmlPreview(true);
    onClose(); 
    };

  const togglePreviewMode = () => {
    setShowHtmlPreview(!showHtmlPreview);
  };

  const toggleOwnership = () => {
    if (!isMember || !isProjectLead ){
      toast.error("Apply to join the project to claim task")
    }
    else{
      if (isOwner) {
        changeTaskOwner({ id: taskToEdit!.id, projectId: project.id, userId: "" }) 
      } else {
        changeTaskOwner({ id: taskToEdit!.id, projectId: project.id, userId: session!.user.id })
      }
      setIsOwner(!isOwner);
    }
  };

  // Helper function to generate edit payload
  const generateEditPayload = (): EditTaskPayload => ({
    projectId: project.id,
    title: taskTitle,
    content: taskContent,
    id: taskToEdit!.id
  });

  // Helper function to generate create payload
  const generateCreatePayload = (): CreateTaskPayload => ({
    projectId: project.id,
    title: taskTitle,
    content: taskContent
  });

  const handleSave = () => {
    const payload = isEditMode && taskToEdit ? generateEditPayload() : generateCreatePayload();
    isEditMode ? editTask(payload as EditTaskPayload) : createTask(payload);
  };

  //Custom Hooks
  const { isCreating, isEditing, isDeleting, isChangingOwner, isEditingStatus, editStatus, changeTaskOwner, createTask, editTask, deleteTask } = useTaskMutation(project.id, { onSuccess: resetForm });
  const isLoading = isCreating || isEditing || isDeleting || isChangingOwner || isEditingStatus;

  return (
    <div>
      <Modal showModal={showModal} isLoading={isLoading} size="medium" onClose={enhancedOnClose}>
      <span className="text-lg flex justify-center items-center space-x-4 mb-2w-auto">
        {taskToEdit ? (showHtmlPreview ? "Edit Task" : "View Task") : "Create New Task"}
        {allowedToEdit && (<button 
                onClick={togglePreviewMode}
                className="bg-blue-500 text-white text-sm rounded px-4 py-1 ml-2 flex items-center justify-center w-auto"
                disabled={isLoading}
              >
                <span className='flex items-center'>{!showHtmlPreview ? 
                  <>
                      Edit 
                      <svg className="w-6 h-6 ml-2 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                        <path d="M12.687 14.408a3.01 3.01 0 0 1-1.533.821l-3.566.713a3 3 0 0 1-3.53-3.53l.713-3.566a3.01 3.01 0 0 1 .821-1.533L10.905 2H2.167A2.169 2.169 0 0 0 0 4.167v11.666A2.169 2.169 0 0 0 2.167 18h11.666A2.169 2.169 0 0 0 16 15.833V11.1l-3.313 3.308Zm5.53-9.065.546-.546a2.518 2.518 0 0 0 0-3.56 2.576 2.576 0 0 0-3.559 0l-.547.547 3.56 3.56Z"/>
                        <path d="M13.243 3.2 7.359 9.081a.5.5 0 0 0-.136.256L6.51 12.9a.5.5 0 0 0 .59.59l3.566-.713a.5.5 0 0 0 .255-.136L16.8 6.757 13.243 3.2Z"/>
                      </svg>
                    </>: 
                  'Preview'}
                </span>
            </button>)}
      </span>

        <label className="block text-sm mb-3 justify-br" aria-label="Task Content">
          Task Title:
          {!showHtmlPreview ? (
            <>
              <div className="w-full p-2 mt-1 rounded border bg-gray-100">
                {taskTitle}
              </div>
            </>
          ) : (
            <input
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className={`w-full p-2 mt-1 rounded border ${isLoading ? 'cursor-not-allowed' : ''}`}
              maxLength={50}
              disabled={isLoading}
            />
          )}
        </label>
   
        <div id="task-modal-owner-info" className="flex flex-wrap items-center space-x-5 mb-2 md:flex-nowrap">
          {taskToEdit && ( // If taskToEdit exists (in edit mode)]
            <span className="text-sm flex items-center space-x-4 w-auto mr-2" aria-label="Task Title">Task Status:
              <select 
                value={taskStatus} 
                onChange={(e) => {
                  setTaskStatus(e.target.value);
                  editStatus({ id: taskToEdit.id, status: e.target.value });
                }}
                disabled={!showHtmlPreview}
              >
                <option value="To-Do">To-Do</option>
                <option value="Doing">Doing</option>
                <option value="Done">Done</option>
              </select>
            </span>
          )}
        </div>


        <div id="task-modal-owner-info" className="flex flex-wrap items-center space-x-5 mb-2 md:flex-nowrap">
        {taskToEdit && ( // If taskToEdit exists (in edit mode)
          <span className="text-sm flex items-center space-x-4 w-auto" aria-label="Task Title">Task Owner:
            {taskOwnerId ? (
              <Link href={`/users/${taskOwnerId}`} className="flex items-center space-x-4">
                {userQuery.data ? (
                  <span className="flex items-center rounded border px-2"> 
                    <ProfileImage user={userQuery.data.user} size={32} />
                    {`  `}{userQuery.data?.user.username} 
                  </span>
                ) : ""}
              </Link>
            ) : (
              <span className="text-gray-400 flex items-center ml-2 ">N/A</span> 
            )}

            <button 
              onClick={() => {
                toggleOwnership();
                if (isMember) {setTaskOwnerId(session!.user.id);} 
              }}
              className={`text-white rounded px-4 py-1 flex items-center justify-center ${isOwner ? 'bg-red-500' : 'bg-green-500'}`}
              disabled={isLoading || isChangingOwner}
            >
              {isChangingOwner && <LoadingSpinner size={20} />}
              <span className={isChangingOwner ? 'flex items-center opacity-50' : 'flex items-center '}>
              {isOwner ? (
                    <>
                      <svg className="w-6 h-6 text-gray-800 dark:text-white flex items-center mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 8h6m-9-3.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0ZM5 11h3a4 4 0 0 1 4 4v2H1v-2a4 4 0 0 1 4-4Z"/>
                      </svg>
                      Quit
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6 text-gray-800 dark:text-white flex items-center mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 8h6m-3 3V5m-6-.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0ZM5 11h3a4 4 0 0 1 4 4v2H1v-2a4 4 0 0 1 4-4Z"/>
                      </svg>
                      I will do it
                    </>
                  )}
              </span>
            </button>
          </span>
        )}
      </div>

        <label className="block text-sm mb-2" aria-label="Task Content">
          Task Content:
          {!showHtmlPreview ? (
            <>
              <div 
                className="w-full p-2 mt-1 rounded border bg-gray-100"
                style={{ maxHeight: '200px', overflow: 'auto' }} 
                dangerouslySetInnerHTML={{ __html: taskContent }} 
              ></div>
            </>
          ) : (
            <textarea
                value={taskContent}
                onChange={(e) => setTaskContent(e.target.value)}
                className={`w-full p-2 mt-1 rounded border ${isLoading ? 'cursor-not-allowed' : ''}`}
                rows={10}
                maxLength={10000}
                disabled={isLoading}
              />
          )}
        </label>

        <div className="flex md:flex-nowrap">
          {/*Buttons for users allowed to edit*/}
          {allowedToEdit &&
              <button 
                onClick={handleSave}
                className="bg-green-500 text-white rounded px-4 py-2 mr-2  flex items-center justify-center w-auto"
                disabled={isLoading}
              >
                <span>{(isEditing || isCreating) && <LoadingSpinner size={20} />}Save</span>
              </button>
          }
          {allowedToDelete && (
            <button 
            onClick={() => deleteTask({ id: taskToEdit!.id, projectId: project.id, userId: session!.user.id })} 
            className="bg-red-500 text-white rounded px-4 py-2 mr-2 flex items-center justify-center w-auto"
            disabled={isLoading || isDeleting}
          >
            <span>Delete Task</span>
            </button>
          )}
        </div>
      </Modal>
    </div>
  );
};

// Custom hook to handle mutations and their state
const useTaskMutation = (projectId: string, { onSuccess }: { onSuccess: () => void }) => {
  const apiContext = api.useContext();
  
  // Function to run on successful mutations
  const handleSuccess = () => {
    void apiContext.tasks.getTasksByProjectId.invalidate(); // Invalidate the cache
    onSuccess(); // Execute any additional onSuccess logic
  };
  
  //We add a mutation for creating a task (with on success)
  const { mutate: createTaskMutation, isLoading: isCreating }  = api.tasks.create.useMutation({
    onSuccess: handleSuccess,
    onError: (e) => {
      const fieldErrors = e.data?.zodError?.fieldErrors; 
      const message = handleZodError(fieldErrors);
      toast.error(message);
    }
  });

  // Mutation for editing a task
  const { mutate: editTaskMutation, isLoading: isEditing } = api.tasks.edit.useMutation({
    onSuccess: handleSuccess,
    onError: (e) => {
      const fieldErrors = e.data?.zodError?.fieldErrors; 
      const message = handleZodError(fieldErrors);
      toast.error(message);
    }
  });

    // Mutation for deleting a task
  const { mutate: deleteTaskMutation, isLoading: isDeleting } = api.tasks.delete.useMutation({
    onSuccess: handleSuccess,
    onError: (e) => {
      const fieldErrors = e.data?.zodError?.fieldErrors;
      const message = handleZodError(fieldErrors);
      toast.error(message);
    }
  });

  // Mutation for changing owner of the task
  const { mutate: changeTaskOwnerMutation, isLoading: isChangingOwner } = api.tasks.changeOwner.useMutation({
    onError: (e) => {
      const fieldErrors = e.data?.zodError?.fieldErrors;
      const message = handleZodError(fieldErrors);
      toast.error(message);
    }
  });

  const { mutate: editStatusMutation, isLoading: isEditingStatus } = api.tasks.changeStatus.useMutation({
    onError: (e) => {
      const fieldErrors = e.data?.zodError?.fieldErrors;
      const message = handleZodError(fieldErrors);
      toast.error(message);
    }
  });

  const editStatus = (payload: EditStatusPayload) => {  // <-- Added
    editStatusMutation(payload);
  };

  const changeTaskOwner = (payload: ChangeTaskOwnerPayload) => {
    changeTaskOwnerMutation(payload);
  };

  const deleteTask = (payload: DeleteTaskPayload) => {
    deleteTaskMutation(payload);
  };

  const createTask = (payload: CreateTaskPayload) => {
    createTaskMutation(payload);
  };

  const editTask = (payload: EditTaskPayload) => {
    editTaskMutation(payload);
  };


  return {
    isCreating,
    isEditing,
    isDeleting,
    isChangingOwner,
    isEditingStatus, 
    createTask,
    changeTaskOwner,
    editTask,
    deleteTask,
    editStatus  
  }
}

const defaultTemplate = `You can add more details about the task or store knowledge here :)  `