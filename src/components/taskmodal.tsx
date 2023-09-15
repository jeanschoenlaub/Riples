import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import type { RouterOutputs} from "~/utils/api";
import { api } from "~/utils/api";
import { handleZodError } from "~/utils/error-handling";
import { Modal } from './reusables/modaltemplate';

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

interface EditTaskPayload extends CreateTaskPayload {
  id: string;
}

type ProjectData = RouterOutputs["projects"]["getProjectByProjectId"];
type TaskData = RouterOutputs["tasks"]["edit"];

// Main React Functional Component
export const TaskModal: React.FC<TaskModalProps> = ({ project, taskToEdit, showModal, onClose }) => {
  
  // Initialize state with values from props if taskToEdit is present (for edit mode)
  const initialTitle = taskToEdit ? taskToEdit.title : '';
  const initialContent = taskToEdit ? taskToEdit.content : defaultTemplate;
  
  // States and useEffects
  const [taskTitle, setTaskTitle] = useState(initialTitle);
  const [taskContent, setTaskContent] = useState(initialContent);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (taskToEdit) {
      setTaskTitle(taskToEdit.title);
      setTaskContent(taskToEdit.content);
      setIsEditMode(true);
    }
  }, [taskToEdit]);

  const resetForm = () => {
    setTaskTitle('');
    setTaskContent(defaultTemplate);
    onClose(); 
    setIsEditMode(false);
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
  const { isCreating, isEditing, createTask, editTask } = useTaskMutation(project.id, { onSuccess: resetForm });
  const isLoading = isCreating || isEditing;

  return (
    <div>
      <Modal showModal={showModal} isLoading={isLoading} size="medium">
        <h2 className="text-lg mb-4">Create New Task</h2>

        <label className="block text-sm mb-2" aria-label="Task Title">
          Task Title:
          <input
            type="text"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            className={`w-full p-2 mt-1 rounded border ${isLoading ? 'cursor-not-allowed' : ''}`}
            maxLength={1000}
            disabled={isLoading}
          />
        </label>

        <label className="block text-sm mb-2" aria-label="Task Content">
          Task Content:
          <textarea
            value={taskContent}
            onChange={(e) => setTaskContent(e.target.value)}
            className={`w-full p-2 mt-1 rounded border ${isLoading ? 'cursor-not-allowed' : ''}`}
            rows={10}
            maxLength={1000}
            disabled={isLoading}
          />
        </label>

        <button 
          onClick={handleSave}
          className="bg-green-500 text-white rounded px-4 py-2 mr-2"
          disabled={isLoading}
        >
          {isEditMode ? 'Save Changes' : 'Save Task'}
        </button>
        <button 
          onClick={resetForm}
          className="bg-red-500 text-white rounded px-4 py-2"
          disabled={isLoading}
        >
          Close
        </button>
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

  const createTask = (payload: CreateTaskPayload) => {
    createTaskMutation(payload);
  };

  const editTask = (payload: EditTaskPayload) => {
    editTaskMutation(payload);
  };

  return {
    isCreating,
    isEditing,
    createTask,
    editTask
  }
}

const defaultTemplate = `
 What ?

A complete description of the task, broken down in bullet points.
- Sub-Task 1
- Sub-Task 2

Why ?

A short section on why this task is important 

Resources

Any links, text, or images that can communicate the task at hand.

Work in progress:
Task owner to edit this`;