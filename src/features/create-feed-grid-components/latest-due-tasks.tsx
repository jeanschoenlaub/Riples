import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { type RouterOutputs, api } from "~/utils/api";
import { DownArrowSVG, LoadingPage, UpArrowSVG } from "~/components";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
import { SubTasksRows } from "../task/subtask/subtask";
import { TASK_STATUS_VALUES, getTaskStatusColor } from "~/utils/constants/dbValuesConstants";
import { TaskModal } from "../task/task-modal/task-modal";
dayjs.extend(relativeTime);


type TaskEditData = RouterOutputs["tasks"]["edit"];

export const DueTasks = () => {
    const { data: session } = useSession();
    const userId = session?.user?.id ?? '';
    const shouldExecuteQuery = !!userId;
    
    const { data: projectLead, isLoading: projectLeadLoading } = api.projects.getProjectByAuthorId.useQuery(
        { authorId: userId },
        { enabled: shouldExecuteQuery }
    );

    const { data: tasks } = api.tasks.getTasksByCreatedOrOwnerId.useQuery({ userId });

    const filteredAndSortedTasks = useMemo(() => {
        return tasks?.filter(task => task.task.status === TASK_STATUS_VALUES[1] || task.task.status === TASK_STATUS_VALUES[2])
            .map(task => {
                // Find the project that this task belongs to
                const project = projectLead?.find(p => p.project.id === task.task.projectId);
                // Return a new object containing both task and project details
                return { task: task, project: project?.project };
            })
            .sort((a, b) => {
                const dateATimestamp = new Date(a.task.task.due).getTime() || Number.MAX_VALUE;
                const dateBTimestamp = new Date(b.task.task.due).getTime() || Number.MAX_VALUE;
                return dateATimestamp - dateBTimestamp;
            });
    }, [tasks, projectLead]);

    const [displaySubtasks, setDisplaySubtasks] = useState<string | null>(null);
    const toggleSubtasks = (taskId: string) => {
        if (displaySubtasks === taskId) {
        setDisplaySubtasks(null); // If the clicked task is already open, close it
        } else {
        setDisplaySubtasks(taskId); // Show subtasks for the clicked task
        }
    };


    const [inputValue, setInputValue] = useState('');
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState<TaskEditData | null>(null); // State to hold the selected task

    const openEditModal = (task: TaskEditData | null) => {
        setSelectedTask(task); // Update the selected task
        setShowTaskModal(true); // Show the modal
    };    

    if (!session) {
        return <div> Log in to see your projects </div>;
    }

    if (projectLeadLoading) return <LoadingPage isLoading={projectLeadLoading} />;

    return (
        <div id="todolist" className="p-3 mt-2 mr-2 bg-white rounded-lg border-slate-300 border space-y-2 ml-2 md:mr-5 md:ml-5">
            {filteredAndSortedTasks?.map((item) => {
                const taskStatus = item.task.task.status; 

                return (
                    <div key={item.task.task.id} className="p-2 border-2 rounded-lg border-gray-200">
                        <div className="flex">
                            <div className="flex flex-grow justify-between items-center">
                                <div className="flex items-center font-medium md:font-medium text-xs md:text-base text-sky-500 ml-1">
                                    <button onClick={() => toggleSubtasks(item.task.task.id)} className="flex mr-4 text-blue-600 ">
                                        {displaySubtasks === item.task.task.id ? (
                                        <div className='flex flex-col items-center'>
                                        {(() => {
                                            const totalSubtasks = item.task.task.subTasks.length;
                                            const doneSubtasks = item.task.task.subTasks.filter(subtask => subtask.status).length;

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
                                            const totalSubtasks = item.task.task.subTasks.length;
                                            const doneSubtasks = item.task.task.subTasks.filter(subtask => subtask.status).length;

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
                                    <button onClick={() => openEditModal(item.task.task)} className="text-blue-600  hover:underline">
                                        {item.project?.title} / {item.task.task.title}
                                    </button>
                                    
                                </div>
                                <div className="flex items-center">
                                    <div className="mr-2">
                                        {`due ${dayjs(item.task.task.due).fromNow()}`}
                                    </div>
                                    <div className={`text-white text-base font-base text-center items-center rounded px-2 py-1 ${getTaskStatusColor(taskStatus) }`}>
                                        <button onClick={() => openEditModal(item.task.task)}>
                                            {taskStatus}
                                        </button>
                                    </div>
                                </div>
    
                            </div>
                        </div>
                        {/* Conditional Subtask Rows */}
                        {displaySubtasks === item.task.task.id && (
                                <div className="bg-white border-b">
                                    <SubTasksRows taskData={item.task} />
                                </div>
                        )}
                        
                    </div>
                );
            })}
            {selectedTask && (
                <TaskModal 
                    projectId={selectedTask.projectId} 
                    projectType="private" // TO-DO maake sure these values are correct (otherwise user might be able to modify tasks)
                    inputValue={inputValue}
                    taskToEdit={selectedTask}
                    isMember={true} // If the user is owner of the task he must ba a member
                    isProjectLead={true} // TO-DO maake sure these values are correct (otherwise user might be able to modify tasks)
                    showModal={showTaskModal}
                    onClose={() => {
                        setSelectedTask(null);
                        setInputValue('');
                        setShowTaskModal(false);
                    }}
                />
        )}
        </div>
    );
};
