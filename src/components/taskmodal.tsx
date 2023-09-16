import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import type { RouterOutputs} from "~/utils/api";
import { api } from "~/utils/api";
import { handleZodError } from "~/utils/error-handling";
import { Modal } from './reusables/modaltemplate';
import { useSession } from 'next-auth/react';
import { LoadingSpinner } from './loading';
import Link from 'next/link';
import { ProfileImage } from './profileimage';

interface TaskModalProps {
  project: ProjectData["project"];
  taskToEdit: TaskData | null; 
  showModal: boolean;
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

interface EditTaskPayload extends CreateTaskPayload {
  id: string;
}


type ProjectData = RouterOutputs["projects"]["getProjectByProjectId"];
type TaskData = RouterOutputs["tasks"]["edit"];

// Main React Functional Component
export const TaskModal: React.FC<TaskModalProps> = ({ project, taskToEdit, showModal,  onClose }) => {
  
  // Initialize state with values from props if taskToEdit is present (for edit mode vs create mode)
  const initialTitle = taskToEdit ? taskToEdit.title : '';
  const initialContent = taskToEdit ? taskToEdit.content : defaultTemplate;

  //Is the logged in user allowed to edit ?
  const { data: session } = useSession();
  const allowedToEdit =  
    session?.user.id === taskToEdit?.ownerId || 
    session?.user.id === taskToEdit?.createdById || 
    session?.user.id === project.authorID ||
    taskToEdit === null;


  // States and useEffects
  const [taskTitle, setTaskTitle] = useState(initialTitle);
  const [taskContent, setTaskContent] = useState(initialContent); //can the user edit ? 
  const [showHtmlPreview, setShowHtmlPreview] = useState(true); // state variable to control HTML preview mode
  const [isEditMode, setIsEditMode] = useState(!taskToEdit || allowedToEdit); //If the task is being created --> edit mode
  const [isOwner, setIsOwner] = useState(session?.user.id === taskToEdit?.ownerId);

  // Conditional query using tRPC if task owner to display profile image
  const shouldExecuteQuery = !!taskToEdit?.ownerId // Run query only if there is a task owner
  const userQuery = api.users.getUserByUserId.useQuery(
    { userId: session?.user?.id ?? "" },
    { enabled: shouldExecuteQuery }
  );

  useEffect(() => {
    if (taskToEdit) { // Existing task
      setTaskTitle(taskToEdit.title);
      setTaskContent(taskToEdit.content);
      setIsOwner(session?.user.id === taskToEdit.ownerId);
      if (allowedToEdit) {
        setIsEditMode(true); // If the task already exists + the user has the right to edit, we are editing vs creating
      }
    } 
  }, [taskToEdit, session]); // Adding allowedToEdit to dependencies
  

  const resetForm = () => {
    //Could add make sure to save ?
    setTaskTitle('');
    setTaskContent(defaultTemplate);
    onClose(); 
    setIsEditMode(false);
    setShowHtmlPreview(true);
    };

  const togglePreviewMode = () => {
    setShowHtmlPreview(!showHtmlPreview);
  };

  const toggleOwnership = () => {
    if (isOwner) {
      changeTaskOwner({ id: taskToEdit!.id, projectId: project.id, userId: "" }) 
    } else {
      changeTaskOwner({ id: taskToEdit!.id, projectId: project.id, userId: session!.user.id })
    }
    setIsOwner(!isOwner);
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
  const { isCreating, isEditing, isDeleting, isChangingOwner, changeTaskOwner, createTask, editTask, deleteTask } = useTaskMutation(project.id, { onSuccess: resetForm });
  const isLoading = isCreating || isEditing;

  return (
    <div>
      <Modal showModal={showModal} isLoading={isLoading} size="medium" onClose={onClose}>
        <h2 className="text-lg mb-4">{taskToEdit ? "Edit Task" : "Create New Task"}</h2>

        <label className="block text-sm mb-3" aria-label="Task Content">
          Task Title:
          {showHtmlPreview ? (
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
              maxLength={1000}
              disabled={isLoading}
            />
          )}
        </label>
   
        <div id="task-modal-owner-info" className="flex flex-wrap items-center space-x-3 md:space-x-0 md:flex-nowrap">
          <span className="text-sm mb-2 flex items-center space-x-4 w-full md:w-auto" aria-label="Task Title">Task owner & status:</span> 
          {taskToEdit && ( // If taskToEdit exists (in edit mode)
            <span className={`flex ml-2 rounded text-white py-1 px-2 items-center md:w-auto ${
              taskToEdit.status === "In Progress" ? "bg-green-500" : 
              taskToEdit.status === "NOT STARTED" ? "bg-gray-500" : 
              taskToEdit.status === "Planning" ? "bg-yellow-500" : 
              taskToEdit.status === "Finished" ? "bg-red-500" : ""
            }`}>
              {taskToEdit.status}
            </span>
          )}

          {taskToEdit && ( // If taskToEdit exists (in edit mode)
            <span className="flex items-center space-x-2 w-full md:w-auto"> 
              {taskToEdit.ownerId ? (
                <Link href={`/users/${taskToEdit.ownerId}`} className="flex items-center space-x-2">
                  {userQuery.data ? (
                    <span className="flex items-center rounded border px-2"> 
                    <ProfileImage user={userQuery.data.user} size={32} />
                    {`  `}{userQuery.data?.user.username} 
                    </span>
                  ) : ""}
                </Link>
              ) : (
                <span className="text-gray-400 flex items-center">N/A</span> 
              )}

              <button 
                onClick={toggleOwnership}
                className={`text-white rounded px-4 py-1 flex items-center justify-center ${isOwner ? 'bg-red-500' : 'bg-green-500'}`}
                disabled={isLoading || isChangingOwner}
              >
                {isChangingOwner && <LoadingSpinner size={20} />}
                <span className={isChangingOwner ? 'ml-2 opacity-50' : 'ml-0'}>
                  {isOwner ? "Quit" : "I'll do it"}
                </span>
              </button>
            </span>
          )}
        </div>

        <label className="block text-sm mb-2" aria-label="Task Content">
          Task Content:
          {showHtmlPreview ? (
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
                maxLength={1000}
                disabled={isLoading}
              />
          )}
        </label>

        <div className="flex md:flex-nowrap">
          {/*Buttons for users allowed to edit*/}
          {allowedToEdit && (
            <>
              <button 
                onClick={handleSave}
                className="bg-green-500 text-white rounded px-4 py-2 mr-2  flex items-center justify-center w-auto"
                disabled={isLoading}
              >
                <span>Save</span>
              </button>
              <button 
                onClick={() => deleteTask({ id: taskToEdit!.id, projectId: project.id, userId: session!.user.id })} 
                className="bg-red-500 text-white rounded px-4 py-2 mr-2 flex items-center justify-center w-auto"
                disabled={isLoading || isDeleting}
              >
                <span>Delete Task</span>
              </button>
              <button 
                onClick={togglePreviewMode}
                className="bg-blue-500 text-white rounded px-4 py-2 flex items-center justify-center w-auto"
                disabled={isLoading}
              >
                <span>{showHtmlPreview ? 'Switch to Edit Mode' : 'Preview'}</span>
              </button>
           </>
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

  // Mutation for deleting a task
  const { mutate: changeTaskOwnerMutation, isLoading: isChangingOwner } = api.tasks.changeOwner.useMutation({
    onSuccess: handleSuccess,
    onError: (e) => {
      const fieldErrors = e.data?.zodError?.fieldErrors;
      const message = handleZodError(fieldErrors);
      toast.error(message);
    }
  });

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
    createTask,
    changeTaskOwner,
    editTask,
    deleteTask  
  }
}

const defaultTemplate = `
<h3>What ?</h3>
<br>

<p><em>A complete description of the task, broken down in To-Do.</em></p>
<br>
  <li><input type="checkbox" disabled> <em>Task 1</em></li>
  <li><input type="checkbox" disabled> <em>Task 1</em></li>
<br>

<h3>Why ?</h3>
<br>

<p><em>Why is it important to do this task ?</em></p>
<br>

<h3>Work in progress</h3>
<p><em> Keep a reord of your work here, for easy access.</em></p>
<br>
`;