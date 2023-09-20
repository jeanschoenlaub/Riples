import React, { useEffect, useState } from 'react';
import type { RouterOutputs} from "~/utils/api";
import { api } from "~/utils/api";
import Link from 'next/link'; // import Next.js Link component
import { TaskModal } from '~/components/project-page/task/taskmodal';
import { ProfileImage } from '../../profileimage';
import { LoadingRiplesLogo } from '../../loading';
import { StyledTable } from '../../reusables/styledtables';
import { SubTasksRows } from './subtask';


interface TaskListProps {
  project: ProjectData["project"];
  isMember: boolean,
  isPending: boolean
}

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

type ProjectData = RouterOutputs["projects"]["getProjectByProjectId"];
type TaskData = RouterOutputs["tasks"]["edit"];
type SubTaskData = RouterOutputs["tasks"]["getSubTasksByTaskId"][0];

export const TaskList: React.FC<TaskListProps> = ({ project, isMember}) => {
  const [selectedTask, setSelectedTask] = useState<TaskData | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false); 
  const [displaySubtasks, setDisplaySubtasks] = useState<Record<string, boolean>>({});
  const [subTasks, setSubTasks] = useState<Record<string, SubTaskData[]>>({});
  const [taskIdToFetch, setTaskIdToFetch] = useState<string | null>(null);

  const { data: subTaskData, isLoading: isLoadingSubTasks, isError: isErrorSubTasks } = api.tasks.getSubTasksByTaskId.useQuery(
    { taskId: taskIdToFetch ?? "" },
    { enabled: taskIdToFetch !== null }
  );
  const { data: taskData, isLoading: isLoadingTasks, isError } = api.tasks.getTasksByProjectId.useQuery({ projectId: project.id });

  useEffect(() => {
    if (subTaskData) {
      setSubTasks((prevSubTasks) => ({
        ...prevSubTasks,
        [taskIdToFetch!]: subTaskData,
      }));
    }
  }, [subTaskData, taskIdToFetch]);

  const toggleSubtasks = (taskId: string) => {
    if (!displaySubtasks[taskId]) {
      setTaskIdToFetch(taskId); // This will trigger the useQuery to refetch
    }
    
    setDisplaySubtasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  const openEditModal = (task: TaskData | null) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const isLoading = isLoadingTasks 

  if (isLoading) return <div className="flex justify-center"><LoadingRiplesLogo/></div>;
  if (isError || !taskData) return <p>Error loading tasks.</p>;

  return (
    <div>
      {isMember &&
      <div id="project-collab-task-create-button" className="mt-4 ml-2 mb-2 space-y-4 justify-center">
        <button className="bg-blue-500 text-white rounded px-4 py-2" onClick={() => openEditModal(null)}>
            Create Task 
        </button>      
      </div>}

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <StyledTable headers={["Task Title", "Status", "Owner", "Created","Actions"]}>
          {taskData.map((taskDetail, index) => (
            <React.Fragment key={index}>
            <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                <button onClick={() => openEditModal(taskDetail.task)} className="text-blue-600 dark:text-blue-500 hover:underline">
                  {taskDetail.task.title}
                </button>
              </th>
              <td className="px-6 py-4 flex text-center">
                <span className={`text-white rounded w-auto px-2 py-2 ${
                  taskDetail.task.status === "Doing" ? "bg-yellow-500" : 
                  taskDetail.task.status === "To-Do" ? "bg-gray-500" : 
                  taskDetail.task.status === "Done" ? "bg-green-500" : ""
                }`}>
                  {taskDetail.task.status}
                </span>
              </td>

              <td className="px-6 py-4" style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                {taskDetail.owner ? (
                  <Link href={`/users/${taskDetail.owner.id}`} className="flex items-center justify-center space-x-2">
                    <ProfileImage user={taskDetail.owner} size={32} showUsernameOnHover={true}/>
                    {taskDetail.owner.name ?? ''}
                  </Link>
                ) : (
                  "N/A"
                )}
              </td>
              <td className="px-6 py-4">
                <Link href={`/users/${taskDetail.createdBy?.id}`} className="flex items-center justify-center space-x-2">
                  <ProfileImage user={taskDetail.createdBy} size={32} showUsernameOnHover={true}/>
                  {taskDetail.createdBy?.name ?? ''}
                </Link>
              </td>
              <td className="px-6 py-4 flex justify-center">
                <button onClick={() => toggleSubtasks(taskDetail.task.id)} className="text-blue-600 dark:text-blue-500 hover:underline">
                {displaySubtasks[taskDetail.task.id] ? (
                  <svg className="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 8">
                    <path stroke="#2563eb" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M13 7 7.674 1.3a.91.91 0 0 0-1.348 0L1 7"/>
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="#2563eb" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="m1 1 4 4 4-4" />
                  </svg>  // If not, display this SVG
                )}
              </button>
              </td>
            </tr>
            {/* Conditionally display subtasks */}
            {displaySubtasks[taskDetail.task.id] && (
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td colSpan={5} className="px-6 py-4">
                  <SubTasksRows taskId={taskDetail.task.id} subTasks={subTasks[taskDetail.task.id] ?? []} isLoadingSubtasks={isLoadingSubTasks}  isErrorSubStaks={isErrorSubTasks} />
                </td>
              </tr>
            )}
            </React.Fragment>
          ))}
        </StyledTable>
      
      </div>
        <TaskModal 
          project={project} 
          taskToEdit={selectedTask}
          isMember={isMember} 
          showModal={showTaskModal}
          onClose={() => {
            setSelectedTask(null);
            setShowTaskModal(false); // Hide the modal when closing
          }}
        />
      </div>
  );
};



   