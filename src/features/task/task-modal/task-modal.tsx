// External Imports
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { SingleDatepicker } from "chakra-dayzed-datepicker";

// Local Imports
import { api } from "~/utils/api";
import { LoadingSpinner, Modal, ProfileImage } from '~/components';
import type { CreateTaskPayload, EditTaskPayload, TaskModalProps } from './task-modal-types';
import { useTaskMutation } from './task-modal-api';
import { TASK_STATUS_VALUES } from '~/utils/constants/dbValuesConstants';

// Main React Functional Component
export const TaskModal: React.FC<TaskModalProps> = ({ projectId, projectType, taskToEdit, showModal, isMember, isProjectLead, inputValue, onClose }) => {
  
  // Initialize state with values from props if taskToEdit is present (for edit mode vs create mode)
  const defaultTemplate = ``
  const initialContent = taskToEdit ? taskToEdit.content : defaultTemplate;

  

  //Is the logged in user allowed to edit ?
  const { data: session } = useSession();
  const allowedToEdit =  
    ((isMember && (
    session?.user.id === taskToEdit?.ownerId || 
    session?.user.id === taskToEdit?.createdById || 
    taskToEdit === null)) || isProjectLead)

  const allowedToDelete =  
   (isProjectLead || (isMember && session?.user.id === taskToEdit?.createdById))  && taskToEdit

  // States and useEffects
  const [taskTitle, setTaskTitle] = useState(() => taskToEdit ? taskToEdit.title : inputValue)
  const [taskContent, setTaskContent] = useState(initialContent); //can the user edit ? 
  const [isEditMode, setIsEditMode] = useState(false); //If the task is being created --> edit mode
  const [isOwner, setIsOwner] = useState(session?.user.id === taskToEdit?.ownerId);
  const [taskStatus, setTaskStatus] = useState(taskToEdit ? taskToEdit.status : 'To-Do');
  const [taskOwnerId, setTaskOwnerId] = useState(taskToEdit ? taskToEdit.ownerId: null);
  const [taskDate, setTaskDate] = useState(new Date());

  // Conditional query using tRPC if task owner to display profile image
  const shouldExecuteQuery = !!taskToEdit?.ownerId // Run query only if there is a task owner
  const userQuery = api.users.getUserByUserId.useQuery(
    { userId: taskToEdit?.ownerId ?? "" },
    { enabled: shouldExecuteQuery }
  );

  useEffect(() => {
    if (taskToEdit) { // Existing task
      setTaskTitle(taskToEdit.title);
      setTaskStatus(taskToEdit.status);
      setTaskContent(taskToEdit.content);
      setTaskOwnerId(taskToEdit.ownerId);
      setTaskDate(taskToEdit.due)
      setIsOwner(session?.user.id === taskToEdit.ownerId);
      if (allowedToEdit) {
        setIsEditMode(true); // If the task already exists + the user has the right to edit, we are editing vs creating
      }
    }
    else {
      setTaskTitle(inputValue);
    }
  }, [taskToEdit, inputValue, allowedToEdit, session?.user.id]); 

  const handleToogleOwnership = () => {
    if (!isMember && !isProjectLead) {
      toast.error("Apply to join the project to claim task");
      return;
    }
  
    const payload = isOwner 
      ? { id: taskToEdit!.id, projectId: projectId, userId: "" }
      : { id: taskToEdit!.id, projectId: projectId, userId: session!.user.id };
  
    changeTaskOwner(payload)
      .then(() => {
        setIsOwner(!isOwner);
        toast.success('Ownership toggled successfully!');
      })
      .catch(() => {
        toast.error('Error claiming task');
      });
  };

  const enhancedOnClose = () => {
    resetForm();
    onClose();
  }

  const resetForm = () =>{
    setTaskTitle("");
    setIsEditMode(false)
    setTaskStatus("To-Do");
    setTaskDate(new Date())
    setTaskOwnerId(null)
    setTaskContent(defaultTemplate);
  }
    

  // Helper function to generate edit payload
  const generateEditPayload = (): EditTaskPayload => ({
    projectId: projectId,
    title: taskTitle,
    status: taskStatus,
    content: taskContent,
    due: taskDate,
    id: taskToEdit!.id
  });

  // Helper function to generate create payload
  const generateCreatePayload = (): CreateTaskPayload => ({
    projectId: projectId,
    title: taskTitle,
    status: taskStatus,
    due: taskDate,
    content: taskContent
  });

  const handleSave = () => {
    const payload = isEditMode && taskToEdit 
      ? generateEditPayload() 
      : generateCreatePayload();
  
    const taskAction = isEditMode 
      ? editTask(payload as EditTaskPayload) 
      : createTask(payload);
  
    taskAction
      .then(() => {
        toast.success('Task saved successfully!');
        enhancedOnClose();
      })
      .catch(() => {
        toast.error('Error saving task');
      });
  };


  const handleDelete = () => {
    if (taskToEdit) {
      deleteTask({ id: taskToEdit.id, projectId: projectId, userId: session!.user.id })
        .then(() => {
          toast.success('Task deleted successfully!');
          enhancedOnClose();
        })
        .catch(() => {
          toast.error('Error deleting task');
        });
    }
  };
  

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = event.target.value;
    setTaskStatus(newStatus);
  
    if (taskToEdit) {
      editStatus({ id: taskToEdit.id, status: newStatus })
        .then(() => {
          toast.success('Status updated successfully!');
        })
        .catch(() => {
          toast.error('Error updating status');
        });
    }
  };
  

  //Custom Hooks
  const { isCreating, isEditing, isDeleting, isChangingOwner, isEditingStatus, editStatus, changeTaskOwner, createTask, editTask, deleteTask } = useTaskMutation();
  const isLoading = isCreating || isEditing || isDeleting || isChangingOwner || isEditingStatus;

  return (
    <div>
      <Modal showModal={showModal} isLoading={isLoading} size="medium" onClose={enhancedOnClose}>
      <span className="text-lg font-semibold flex justify-center items-center space-x-4 mb-2w-auto">
        {taskToEdit ? (isEditMode ? "Edit Task" : "View Task") : "Create New Task"}
      </span>

        <label className="block text-base mb-3 justify-br" aria-label="Task Content">
          Task Title:
            <input
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className={`w-full p-2 mt-1 rounded border ${isLoading ? 'cursor-not-allowed' : ''}`}
              maxLength={255}
              disabled={!allowedToEdit || isLoading}
            />
        </label>

        {/* DUE DATE */}
        <div id="task-modal-due-date" className="flex items-center space-x-5 mb-2 flex-nowrap">
          <span className="text-base flex flex-shrink items-center space-x-4 w-auto" aria-label="Task Title">
              <div className='flex-shrink-0'>Due date:</div>
              
  
          <SingleDatepicker
                name="date-input"
                date={taskDate}
                onDateChange={setTaskDate}
                propsConfigs={{
                  popoverCompProps: {
                    popoverBodyProps: {
                      fontSize: "xs", // Adjust font size doesn't work
                    },
                  },
                  // ... other props
                }}
                
              />
            </span>
        </div>
   
        <div id="task-modal-status" className="flex flex-wrap items-center space-x-5 mb-2 md:flex-nowrap">
            <span className="text-base flex items-center space-x-4 w-auto mr-2" aria-label="Task Title">Task Status:
              <select 
                value={taskStatus} 
                onChange={handleStatusChange}
                disabled={!allowedToEdit || isLoading}
              >
                {TASK_STATUS_VALUES.map((status, index) => (
                    <option key={index} value={status}>{status}</option>
                ))}
              </select>
            </span>
        </div>


        <div id="task-modal-owner-info" className="flex flex-wrap items-center space-x-5 mb-2 md:flex-nowrap">
        {(taskToEdit && projectType === "collab") && ( // If taskToEdit exists (in edit mode)
          <span className="text-sm flex items-center space-x-4 w-auto" aria-label="Task Title">Task Owner:
            {taskOwnerId ? (
              <Link href={`/users/${taskOwnerId}`} className="flex items-center space-x-4">
                {userQuery.data ? (
                  <span className="flex items-center rounded border px-2"> 
                    <ProfileImage username={userQuery.data.user.username} email={userQuery.data.user.email} image={userQuery.data.user.image} name={userQuery.data.user.name} size={32} />
                    {`  `}{userQuery.data?.user.username} 
                  </span>
                ) : ""}
              </Link>
            ) : (
              <span className="text-gray-400 flex items-center ml-2 ">N/A</span> 
            )}

            <button 
              onClick={() => {handleToogleOwnership(); }}
              className={`text-white rounded px-4 py-1 flex items-center justify-center ${isOwner ? 'bg-red-500' : 'bg-green-500'}`}
              disabled={isLoading || isChangingOwner}
            >
              {isChangingOwner && <LoadingSpinner size={20} />}
              <span className={isChangingOwner ? 'flex items-center opacity-50' : 'flex items-center '}>
              {isOwner ? (
                    <>
                      <svg className="w-6 h-6 text-gray-800 flex items-center mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 8h6m-9-3.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0ZM5 11h3a4 4 0 0 1 4 4v2H1v-2a4 4 0 0 1 4-4Z"/>
                      </svg>
                      Quit
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6 text-gray-800  flex items-center mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 8h6m-3 3V5m-6-.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0ZM5 11h3a4 4 0 0 1 4 4v2H1v-2a4 4 0 0 1 4-4Z"/>
                      </svg>
                      I will do it
                    </>
                  )}
              </span>
            </button>
          </span>
        )}
      </div>

      

        <label className="block text-base mb-2" aria-label="Task Content">
          Notes:
            <textarea
                value={taskContent}
                onChange={(e) => setTaskContent(e.target.value)}
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
              <span>Save Task</span>
              </button>
          }
          {allowedToDelete && (
            <button 
            onClick={handleDelete} 
            className="bg-red-500 text-white rounded text-lg px-4 py-2 mr-2 flex items-center justify-center w-auto"
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




