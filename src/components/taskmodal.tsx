import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { RouterOutputs, api } from "~/utils/api";
import { handleZodError } from "~/utils/error-handling";

interface TaskModalProps {
  project: ProjectData["project"];
  taskToEdit: TaskData | null;
  showModal: boolean;
  onClose: () => void;
}
type ProjectData = RouterOutputs["projects"]["getProjectByProjectId"];
type TaskData = RouterOutputs["tasks"]["edit"];

// Set default template text
const defaultTemplate = `
### What ?

*A complete description of the task, broken down in To-Do, including team (if multiple teams).*

- [ ]  *Task 1*

### Why ?

*Why is it important to do this task ?*

### Resources

************Any links or images that can communicate the task at hand.************

## Work in progress`;


export const TaskModal: React.FC<TaskModalProps> = ({ project, taskToEdit, showModal, onClose }) => {
  const [isEditMode, setIsEditMode] = useState(false); // New state to handle edit mode
  
  useEffect(() => {
    if (taskToEdit) {
      setTaskTitle(taskToEdit.title);
      setTaskContent(taskToEdit.content);
      setIsEditMode(true);
    }
  }, [taskToEdit]);

  const [taskTitle, setTaskTitle] = useState('');
  const [taskContent, setTaskContent] = useState(defaultTemplate);
  const ctx = api.useContext();

  const resetForm = () => {
    setTaskTitle('');
    setTaskContent(defaultTemplate);
    onClose(); 
    setIsEditMode(false);  // Reset edit mode
  };
  
  
  //We add a mutation for creating a task (with on success)
  const {mutate, isLoading: isCreating}  = api.tasks.create.useMutation({
    onSuccess: () => {
      void ctx.tasks.getTasksByProjectId.invalidate();
      resetForm();
    },
    onError: (e) => {
      const message = handleZodError(e);
      toast.error(message);
    }
    });

    // Mutation for editing a task
    const editTaskMutation = api.tasks.edit.useMutation({
      onSuccess: () => {
        void ctx.tasks.getTasksByProjectId.invalidate();
        resetForm();
      },
      onError: (e) => {
        const message = handleZodError(e);
        toast.error(message);
      }
    });

    //handling both create and edit modes
    const handleSave = () => {
      const payload = { projectId: project.id, title: taskTitle, content: taskContent };
  
      if (isEditMode && taskToEdit) {
        editTaskMutation.mutate({ ...payload, id: taskToEdit.id });
      } else {
        mutate(payload); // Create new task
      }
    };

  return (
    <div>
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded p-4 w-1/3">
            <h2 className="text-lg mb-4">Create New Task</h2>

            <label className="block text-sm mb-2">
              Task Title:
              <input
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="w-full p-2 mt-1 rounded border"
                maxLength={1000}
              />
            </label>

            <label className="block text-sm mb-2">
              Task Content:
              <textarea
                value={taskContent}
                onChange={(e) => setTaskContent(e.target.value)}
                className="w-full p-2 mt-1 rounded border"
                rows={10}
                maxLength={1000}
              />
            </label>

            <button 
                onClick={handleSave}
                className="bg-green-500 text-white rounded px-4 py-2 mr-2"
              >
                {isEditMode ? 'Save Changes' : 'Save Task'}
              </button>
            <button 
              onClick={resetForm}
              className="bg-red-500 text-white rounded px-4 py-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

