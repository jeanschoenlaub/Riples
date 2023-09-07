import React from 'react';
import { RouterOutputs, api } from "~/utils/api";
import Link from 'next/link'; // import Next.js Link component

interface TaskListProps {
  project: ProjectData["project"];
}

type ProjectData = RouterOutputs["projects"]["getProjectByProjectId"];

export const TaskList: React.FC<TaskListProps> = ({ project }) => {
  const { data: taskData, isLoading, isError } = api.tasks.getTasksByProjectId.useQuery({ projectId: project.id });

  if (isLoading) return <p>Loading...</p>;
  if (isError || !taskData) return <p>Error loading tasks.</p>;

  return (
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
              <Link href={`/tasks/${taskDetail.task.id}`} className="text-blue-600 dark:text-blue-500 hover:underline">
                {taskDetail.task.title}
              </Link>
            </th>
            <td className="px-6 py-4">{taskDetail.task.status}</td>
            <td className="px-6 py-4">
              {taskDetail.owner ? (
                <Link href={`/users/${taskDetail.owner.id}`} className="flex items-center space-x-2">
                  <img 
                    src={taskDetail.owner.imageUrl || '/default-image-url'} 
                    alt="Owner Profile Image" 
                    className="rounded-full border border-slate-300" 
                    width={32} 
                    height={32}
                  />
                  {taskDetail.owner.firstName || ''}
                </Link>
              ) : (
                "N/A"
              )}
            </td>
            <td className="px-6 py-4">
              <Link href={`/users/${taskDetail.createdBy?.id}`} className="flex items-center space-x-2">
                <img 
                  src={taskDetail.createdBy?.imageUrl || '/default-image-url'} 
                  alt="Created By Profile Image" 
                  className="rounded-full border border-slate-300" 
                  width={32} 
                  height={32}
                />
                {taskDetail.createdBy?.firstName || ''}
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
      </table>
    </div>
  );
};