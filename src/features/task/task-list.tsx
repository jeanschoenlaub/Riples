import React, { useEffect, useState } from 'react';
import type { RouterOutputs} from "~/utils/api";
import { api } from "~/utils/api";
import Link from 'next/link'; 
import { TaskModal } from '~/features/task/task-modal/task-modal';
import { ProfileImage, LoadingRiplesLogo, StyledTable, DownArrowSVG, UpArrowSVG, RocketSVG } from '~/components';
import { SubTasksRows } from './subtask/subtask';


interface TaskListProps {
  taskData: TaskData;
  projectId: string, //Prepping for project -> task prop change
  projectType: string, //Prepping for project -> task prop change
  isMember: boolean,
  isPending: boolean
  isProjectLead: boolean
}

type TaskData = RouterOutputs["tasks"]["getTasksByProjectId"];
type TaskEditData = RouterOutputs["tasks"]["edit"];

export const TaskList: React.FC<TaskListProps> = ({ taskData, projectId, projectType, isMember, isProjectLead}) => {
  const [selectedTask, setSelectedTask] = useState<TaskEditData | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [displaySubtasks, setDisplaySubtasks] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  
  //const { data: subTaskData, isLoading: isLoadingSubTasks, isError: isErrorSubTasks } = api.tasks.getSubTasksByTaskId.useQuery(
  //  { taskId: taskIdToFetch ?? "" },
  //  { enabled: taskIdToFetch !== null }
  //);
  // const { data: taskData, isLoading: isLoadingTasks, isError } = api.tasks.getTasksByProjectId.useQuery({ projectId: projectId});
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);  // Assuming mobile devices have a width of 768px or less

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    }
  
    window.addEventListener('resize', handleResize);
  
    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, []);

  

  let headers = isMobile ? ["Sub", "Task"] : ["Sub", "Task Title", "Status", "Owner"];
  let columnWidths = isMobile ? ["15%", "50%"] : ["6%", "30%", "8%", "8%"];
  if (projectType === "solo") {
    headers = headers.filter(header => header !== "Owner");
    isMobile ? columnWidths =["15%","50%"] :columnWidths =["6%","50%","8%"]
  }

  const handleCreateClick = () => {
    setSelectedTask(null); //Notna task to edit 
    setShowTaskModal(true);
  };

  const toggleSubtasks = (taskId: string) => {
    if (displaySubtasks === taskId) {
      setDisplaySubtasks(null); // If the clicked task is already open, close it
    } else {
      setDisplaySubtasks(taskId); // Show subtasks for the clicked task
    }
  };

  const openEditModal = (task: TaskEditData | null) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  // const isLoading = isLoadingTasks 

  // if (isLoading) return <div className="flex justify-center"><LoadingRiplesLogo isLoading={isLoading}/></div>;
  // if (isError || !taskData) return <p>Error loading tasks.</p>;

  return (
    <div className='mb-10'>
      {(isMember || isProjectLead) &&
        <div id="project-collab-task-create-button" className="mb-2 flex">
          <div className='mt-2 ml-2 mr-2 flex flex-grow space-x-2 items-center'> 
          <input 
            type="text" 
            value={inputValue}  // Controlled input
            onChange={(e) => setInputValue(e.target.value)}  // Update state on change
            placeholder="Create a task" 
            className="py-2 px-4 rounded grow focus:outline-none focus:border-gray-500 border-2"
          />
          <button 
            className="bg-green-500 text-white text-xs md:text-base rounded px-4 py-2 hover:bg-green-600 focus:outline-none focus:border-green-700 focus:ring focus:ring-blue-200"
            onClick={() => {handleCreateClick();}}
          >
            <span className='flex items-center'>
             Create Task
             <RocketSVG 
              width={window.innerWidth >= 768 ? '4' : '0'} 
              height={window.innerWidth >= 768 ? '4' : '0'} 
              marginLeft={window.innerWidth >= 768 ? '2' : '0'}
            />
            </span>
          </button>
        </div>
      </div> 
      }

      <div className="relative overflow-x-auto ml-2 mb-2  mr-2 shadow-md sm:rounded-lg">
        <StyledTable headers={headers} columnWidths={columnWidths}>
          {taskData.map((taskDetail, index) => (
            <React.Fragment key={index}>
            <tr key={index} id={`project-tasklist-task-${index}`}  className="bg-white border-b items-center ">
              <td id={`task-${index}-table-action-column`} className="px-9 justify-center py-2 table-cell" style={{ width: columnWidths[0] }}>
                <button onClick={() => toggleSubtasks(taskDetail.task.id)} className="flex text-blue-600 ">
                {displaySubtasks === taskDetail.task.id ? (
                <div className='flex flex-col items-center'>
                  {(() => {
                    const totalSubtasks = taskDetail.task.subTasks.length;
                    const doneSubtasks = taskDetail.task.subTasks.filter(subtask => subtask.status).length;

                    // Display these numbers in a badge
                    return (
                      <div className="text-sm">
                          {`${doneSubtasks}/${totalSubtasks}`}
                      </div>
                    );
                  })()}
                  <UpArrowSVG width='5' height='5'></UpArrowSVG>
                  </div>
                ) : (
 
                <div className='flex flex-col items-center'>
                    {(() => {
                      const totalSubtasks = taskDetail.task.subTasks.length;
                      const doneSubtasks = taskDetail.task.subTasks.filter(subtask => subtask.status).length;

                      // Display these numbers in a badge
                      return (
                        <div className="text-sm">
                            {`${doneSubtasks}/${totalSubtasks}`}
                        </div>
                      );
                    })()}
                    <DownArrowSVG width='5' height='5'></DownArrowSVG>
                  </div>
                )}
              </button>
              </td>
              
              <td className="px-6 py-2 overflow-x-auto whitespace-nowrap font-medium text-gray-900 no-scrollbar" style={{ width: columnWidths[1]}}>
                <button onClick={() => openEditModal(taskDetail.task)} className="text-blue-600  hover:underline">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-gray-800 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17v1a.97.97 0 0 1-.933 1H1.933A.97.97 0 0 1 1 18V5.828a2 2 0 0 1 .586-1.414l2.828-2.828A2 2 0 0 1 5.828 1h8.239A.97.97 0 0 1 15 2M6 1v4a1 1 0 0 1-1 1H1m13.14.772 2.745 2.746M18.1 5.612a2.086 2.086 0 0 1 0 2.953l-6.65 6.646-3.693.739.739-3.692 6.646-6.646a2.087 2.087 0 0 1 2.958 0Z"/>
                    </svg>
                    {taskDetail.task.title}
                  </div>
                </button>
              </td>
              <td className="px-6 justify-center py-2 hidden md:table-cell" style={{  width: columnWidths[2] }}>
                <div onClick={() => openEditModal(taskDetail.task)} style={{ cursor: 'pointer' }} className={`text-white text-center items-center rounded w-auto px-2 py-2 ${
                  taskDetail.task.status === "Doing" ? "bg-yellow-500" : 
                  taskDetail.task.status === "To-Do" ? "bg-gray-500" : 
                  taskDetail.task.status === "Done" ? "bg-green-500" : ""
                }`}>
                  {taskDetail.task.status}
                </div>
              </td>
              {(projectType != "solo") ? (
              <td className="px-6 py-4 hidden md:table-cell" style={{ textAlign: 'center', verticalAlign: 'middle',   width: columnWidths[3]  }}>
                {taskDetail.owner ? (
                  <Link href={`/users/${taskDetail.owner.id}`} className="flex items-center justify-center space-x-2">
                    <ProfileImage username={taskDetail.owner.username} email={taskDetail.owner.email} image={taskDetail.owner.image} name={taskDetail.owner.name} size={32} showUsernameOnHover={true}/>
                    {taskDetail.owner.name ?? ''}
                  </Link>
                ) : (
                  "N/A"
                )}</td>) : "" }
            </tr>
            {/* Conditionally display subtasks */}
            {displaySubtasks === taskDetail.task.id && (
              <tr className="bg-white border-b ">
                <td colSpan={headers.length} className="px-6 py-4">
                  <SubTasksRows taskData={taskDetail} />
                </td>
              </tr>
            )}

            </React.Fragment>
          ))}
        </StyledTable>
        
      </div>
        <TaskModal 
          projectId={projectId} 
          projectType={projectType} 
          inputValue = {inputValue}
          taskToEdit={selectedTask}
          isMember={isMember} 
          isProjectLead={isProjectLead} 
          showModal={showTaskModal}
          onClose={() => {
            setSelectedTask(null);
            setInputValue('');
            setShowTaskModal(false); // Hide the modal when closing
          }}
        />
      </div>
  );
};



   