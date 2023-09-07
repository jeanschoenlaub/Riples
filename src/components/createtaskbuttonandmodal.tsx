import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { RouterOutputs, api } from "~/utils/api";

interface CreateTaskButtonAndModalProps {
  project: ProjectData["project"];
}
type ProjectData = RouterOutputs["projects"]["getProjectByProjectId"]

export const CreateTaskButtonAndModal: React.FC<CreateTaskButtonAndModalProps> = ({ project }) => {
  const [showModal, setShowModal] = useState(false);
  
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

  const [taskTitle, setTaskTitle] = useState('');
  const [taskContent, setTaskContent] = useState(defaultTemplate);

  const resetForm = () => {
    setTaskTitle('');
    setTaskContent(defaultTemplate);
    setShowModal(false);
  };
  
  // Trigger the mutation to create a new task
  const ctx = api.useContext();
  
  //We add a mutation for creating a post (with on success)
  const {mutate, isLoading: isCreating}  = api.tasks.create.useMutation({
    onSuccess: () => {
      void ctx.tasks.getTasksByProjectId.invalidate();
      resetForm();
    },
    onError: (e) => {
      const fieldErrors = e.data?.zodError?.fieldErrors;
    
      if (fieldErrors) {
        let messages = [];
    
        if (fieldErrors.title) {
          messages.push(fieldErrors.title[0]);
        }
    
        if (fieldErrors.content) {
          messages.push(fieldErrors.content[0]);
        }
    
        if (messages.length > 0) {
          toast.error(messages.join(" | "));
          return;
        }
      }
    
      // If the error doesn't match any of the conditions above, show a generic error
      toast.error("Task Creation failed! Please try again later");
    }
    });

  return (
    <div>
      {/* Button to open the Modal */}
      <button 
        onClick={() => setShowModal(true)}
        className="bg-blue-500 text-white rounded px-4 py-2"
      >
        Create Task
      </button>

      {/* Modal */}
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
              onClick={() => mutate({ projectId: project.id, title: taskTitle, content: taskContent})}
              className="bg-green-500 text-white rounded px-4 py-2 mr-2"
            >
              Save Task
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

