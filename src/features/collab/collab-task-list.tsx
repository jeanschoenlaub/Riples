import React, { useEffect, useState } from 'react';
import type { RouterOutputs} from "~/utils/api";
import { api } from "~/utils/api";
import Link from 'next/link'; 
import { TaskModal } from '~/features/task/task-modal/task-modal';
import { ProfileImage, LoadingRiplesLogo, StyledTable } from '~/components';
import { SubTasksRows } from '../task/subtask/subtask';
import { getTaskStatusColor } from '~/utils/constants/dbValuesConstants';


interface CollabTaskListProps {
  project: ProjectData["project"];
  isMember: boolean,
  isPending: boolean
  isProjectLead: boolean
}

type ProjectData = RouterOutputs["projects"]["getProjectByProjectId"];
type TaskData = RouterOutputs["tasks"]["edit"];

export const CollabTaskList: React.FC<CollabTaskListProps> = ({ project, isMember, isProjectLead}) => {
  const [selectedTask, setSelectedTask] = useState<TaskData | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [displaySubtasks, setDisplaySubtasks] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  

  const { data: taskData, isLoading: isLoadingTasks, isError } = api.tasks.getTasksByProjectId.useQuery({ projectId: project.id });
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

  

  let headers = isMobile ? ["Sub", "Open Source Tasks"] : ["Sub", " Task Title", "Status", "Owner"];
  let columnWidths = isMobile ? ["15%", "50%"] : ["6%", "30%", "8%", "8%"];
  if (project.projectType === "solo") {
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

  const openEditModal = (task: TaskData | null) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const isLoading = isLoadingTasks 

  if (isLoading) return <div className="flex justify-center"><LoadingRiplesLogo isLoading={isLoading}/></div>;
  if (isError || !taskData) return <p>Error loading tasks.</p>;
  const collabTasks = taskData.filter(task => task.task.openSource === true);

  return (
    <div className='mb-10'>
      {(isMember || isProjectLead) &&
        <div className=''> Member or Project Lead
      </div> 
      }
      <div className='text-lg font-semibold py-2 ml-4 '> Open sourced tasks  </div> 
      <div className="relative overflow-x-auto ml-2 mb-2  mr-2 shadow-md sm:rounded-lg">
            <StyledTable headers={headers} columnWidths={columnWidths}>
            {collabTasks.map((taskDetail, index) => (
                <React.Fragment key={index}>
                <tr key={index} id={`project-tasklist-task-${index}`}  className="bg-white border-b items-center ">
                <td id={`task-${index}-table-action-column`} className="px-9 justify-center py-2 table-cell" style={{ width: columnWidths[0] }}>
                    <button onClick={() => toggleSubtasks(taskDetail.task.id)} className="flex text-blue-600 ">
                    {displaySubtasks === taskDetail.task.id ? (
                    <div>
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

                    <svg className="w-5 h-5  text-gray-800 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 8">
                        <path stroke="#2563eb" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M13 7 7.674 1.3a.91.91 0 0 0-1.348 0L1 7"/>
                    </svg>

                    </div>
                    ) : (
    
                    <div>
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

                    <svg className="w-5 h-5 text-gray-800 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path stroke="#2563eb" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="m1 1 4 4 4-4" />
                    </svg> 
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
                    <div onClick={() => openEditModal(taskDetail.task)} style={{ cursor: 'pointer' }} className={`text-white text-center items-center rounded w-auto px-2 py-2 ${getTaskStatusColor(taskDetail.task.status)}
                    }`}>
                    {taskDetail.task.status}
                    </div>
                </td>
                {(project.projectType != "solo") ? (
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
               {(isMember || isProjectLead) && <td colSpan={headers.length} className="px-6 py-4 justify-center"><div> Add open-source from the task tab</div> </td>}
        </StyledTable>
    
            
        
      </div>
        <TaskModal 
          projectId={project.id} 
          projectType={project.projectType}
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



   