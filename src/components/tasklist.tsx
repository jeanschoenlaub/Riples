import React, { useState } from 'react';
import type { RouterOutputs} from "~/utils/api";
import { api } from "~/utils/api";
import Link from 'next/link'; // import Next.js Link component
import { TaskModal } from '~/components/taskmodal';
import { ProfileImage } from './profileimage';
import { LoadingRiplesLogo } from './loading';

interface TaskListProps {
  project: ProjectData["project"];
}

type ProjectData = RouterOutputs["projects"]["getProjectByProjectId"];
type TaskData = RouterOutputs["tasks"]["edit"];

export const TaskList: React.FC<TaskListProps> = ({ project }) => {
  // To allow the editing of Tasks 
  const [selectedTask, setSelectedTask] = useState<TaskData | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false); 

  const { data: taskData, isLoading, isError } = api.tasks.getTasksByProjectId.useQuery({ projectId: project.id });
            
  if (isLoading) return <div className="flex justify-center"><LoadingRiplesLogo/></div>;
  if (isError || !taskData) return <p>Error loading tasks.</p>;

  const openEditModal = (task: TaskData | null) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  return (
    <div>
      <div id="project-collab-task-create-button" className="mt-4 ml-2 mb-2 space-y-4 justify-center">
        <button className="bg-blue-500 text-white rounded px-4 py-2" onClick={() => openEditModal(null)}>
            Create Task 
        </button>      
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Task Title</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Owner</th>
              <th scope="col" className="px-6 py-3">Created By</th>
            </tr>
          </thead>
        <tbody>
          {taskData.map((taskDetail, index) => (
            <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                <button onClick={() => openEditModal(taskDetail.task)} className="text-blue-600 dark:text-blue-500 hover:underline">
                  {taskDetail.task.title}
                </button>
              </th>
              <td className="px-6 py-6 flex items-center">
                <span className={`text-white rounded w-auto px-2 py-2 ${
                  taskDetail.task.status === "Doing" ? "bg-yellow-500" : 
                  taskDetail.task.status === "To-Do" ? "bg-gray-500" : 
                  taskDetail.task.status === "Done" ? "bg-green-500" : ""
                }`}>
                  {taskDetail.task.status}
                </span>
              </td>

              <td className="px-6 py-4">
                {taskDetail.owner ? (
                  <Link href={`/users/${taskDetail.owner.id}`} className="flex items-center space-x-2">
                    <ProfileImage user={taskDetail.owner} size={32} showUsernameOnHover={true}/>
                    {taskDetail.owner.name ?? ''}
                  </Link>
                ) : (
                  "N/A"
                )}
              </td>
              <td className="px-6 py-4">
                <Link href={`/users/${taskDetail.createdBy?.id}`} className="flex items-center space-x-2">
                  <ProfileImage user={taskDetail.createdBy} size={32} showUsernameOnHover={true}/>
                  {taskDetail.createdBy?.name ?? ''}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
        </table>

      </div>
        <TaskModal 
          project={project} 
          taskToEdit={selectedTask} 
          showModal={showTaskModal}
          onClose={() => {
            setSelectedTask(null);
            setShowTaskModal(false); // Hide the modal when closing
          }}
        />
      </div>
  );
};