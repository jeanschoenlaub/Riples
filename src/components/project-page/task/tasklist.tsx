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
  isProjectLead: boolean
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

export const TaskList: React.FC<TaskListProps> = ({ project, isMember, isProjectLead}) => {
  const [selectedTask, setSelectedTask] = useState<TaskData | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false); 
  const [displaySubtasks, setDisplaySubtasks] = useState<string | null>(null);
  const [subTasks, setSubTasks] = useState<Record<string, SubTaskData[]>>({});
  const [taskIdToFetch, setTaskIdToFetch] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');

  const { data: subTaskData, isLoading: isLoadingSubTasks, isError: isErrorSubTasks } = api.tasks.getSubTasksByTaskId.useQuery(
    { taskId: taskIdToFetch ?? "" },
    { enabled: taskIdToFetch !== null }
  );
  const { data: taskData, isLoading: isLoadingTasks, isError } = api.tasks.getTasksByProjectId.useQuery({ projectId: project.id });

  const handleCreateClick = () => {
    console.log(inputValue)
    setShowTaskModal(true);
    // Pass `inputValue` to your modal here if needed
  };

  useEffect(() => {
    if (subTaskData) {
      setSubTasks((prevSubTasks) => ({
        ...prevSubTasks,
        [taskIdToFetch!]: subTaskData,
      }));
    }
  }, [subTaskData, taskIdToFetch]);

  const toggleSubtasks = (taskId: string) => {
    // If the clicked task is already open, close it
    if (displaySubtasks === taskId) {
      setDisplaySubtasks(null); // Close the current task
    } else {
      setTaskIdToFetch(taskId); // This will trigger the useQuery to refetch
      setDisplaySubtasks(taskId); // Open the clicked task
    }
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
      {(isMember || isProjectLead) &&
        <div id="project-collab-task-create-button" className="mt-4 mb-2 flex items-center grow space-x-2">
          <input 
            type="text" 
            value={inputValue}  // Controlled input
            onChange={(e) => setInputValue(e.target.value)}  // Update state on change
            placeholder="I want to ..." 
            className="py-2 px-4 rounded grow focus:outline-none focus:border-gray-500 border-2"
          />
          <button 
            className="bg-green-500 text-white text-xs md:text-base rounded px-4 py-2 hover:bg-green-600 focus:outline-none focus:border-green-700 focus:ring focus:ring-blue-200"
            onClick={() => {
              handleCreateClick();
              //setInputValue('');  // Reset the input value
            }}
          >
            <span className='flex items-center'>
             Create Task
            <svg className="w-0 md:w-4 h-0 md:h-4 md:ml-2 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 21 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m8.806 5.614-4.251.362-2.244 2.243a1.058 1.058 0 0 0 .6 1.8l3.036.356m9.439 1.819-.362 4.25-2.243 2.245a1.059 1.059 0 0 1-1.795-.6l-.449-2.983m9.187-12.57a1.536 1.536 0 0 0-1.26-1.26c-1.818-.313-5.52-.7-7.179.96-1.88 1.88-5.863 9.016-7.1 11.275a1.05 1.05 0 0 0 .183 1.25l.932.939.937.936a1.049 1.049 0 0 0 1.25.183c2.259-1.24 9.394-5.222 11.275-7.1 1.66-1.663 1.275-5.365.962-7.183Zm-3.332 4.187a2.115 2.115 0 1 1-4.23 0 2.115 2.115 0 0 1 4.23 0Z"/>
            </svg>
            </span>
          </button>
        </div>
      }

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
              <td className="px-6 py-4 hidden md:table-cell">
                <span className={`text-white flex text-center rounded w-auto px-2 py-2 ${
                  taskDetail.task.status === "Doing" ? "bg-yellow-500" : 
                  taskDetail.task.status === "To-Do" ? "bg-gray-500" : 
                  taskDetail.task.status === "Done" ? "bg-green-500" : ""
                }`}>
                  {taskDetail.task.status}
                </span>
              </td>

              <td className="px-6 py-4 hidden md:table-cell" style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                {taskDetail.owner ? (
                  <Link href={`/users/${taskDetail.owner.id}`} className="flex items-center justify-center space-x-2">
                    <ProfileImage user={taskDetail.owner} size={32} showUsernameOnHover={true}/>
                    {taskDetail.owner.name ?? ''}
                  </Link>
                ) : (
                  "N/A"
                )}
              </td>
              <td className="px-6 py-4 hidden md:table-cell">
                <Link href={`/users/${taskDetail.createdBy?.id}`} className="flex items-center justify-center space-x-2">
                  <ProfileImage user={taskDetail.createdBy} size={32} showUsernameOnHover={true}/>
                  {taskDetail.createdBy?.name ?? ''}
                </Link>
              </td>
              <td className="px-6 py-4 flex items-center justify-center">
                <button onClick={() => toggleSubtasks(taskDetail.task.id)} className="  text-blue-600 dark:text-blue-500 hover:underline">
                {displaySubtasks === taskDetail.task.id ? (
                  <svg className="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 8">
                    <path stroke="#2563eb" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M13 7 7.674 1.3a.91.91 0 0 0-1.348 0L1 7"/>
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="#2563eb" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="m1 1 4 4 4-4" />
                  </svg>  
                )}
              </button>
              </td>
            </tr>
            {/* Conditionally display subtasks */}
            {displaySubtasks === taskDetail.task.id && (
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
          inputValue = {inputValue}
          taskToEdit={selectedTask}
          isMember={isMember} 
          isProjectLead={isProjectLead} 
          showModal={showTaskModal}
          onClose={() => {
            setSelectedTask(null);
            setShowTaskModal(false); // Hide the modal when closing
          }}
        />
      </div>
  );
};



   