import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { DownArrowSVG, LoadingPage, UpArrowSVG } from "~/components";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
import { SubTasksRows } from "../task/subtask/subtask";
import { TASK_STATUS_VALUES } from "~/utils/constants/dbValuesConstants";
dayjs.extend(relativeTime);

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
        return tasks?.filter(task => (task.task.status == TASK_STATUS_VALUES[1] || task.task.status == TASK_STATUS_VALUES[2])) // Filter tasks with doing or to-do status
            .sort((a, b) => {
                // Convert due dates to timestamps, default to a large number for invalid dates
                const dateATimestamp = new Date(a.task.due).getTime() || Number.MAX_VALUE;
                const dateBTimestamp = new Date(b.task.due).getTime() || Number.MAX_VALUE;
    
                // Subtract timestamps for sorting
                return dateATimestamp - dateBTimestamp;
            });
    }, [tasks]);

    const [displaySubtasks, setDisplaySubtasks] = useState<string | null>(null);
    const toggleSubtasks = (taskId: string) => {
        if (displaySubtasks === taskId) {
        setDisplaySubtasks(null); // If the clicked task is already open, close it
        } else {
        setDisplaySubtasks(taskId); // Show subtasks for the clicked task
        }
    };

    

    if (!session) {
        return <div> Log in to see your projects </div>;
    }

    if (projectLeadLoading) return <LoadingPage isLoading={projectLeadLoading} />;

    return (
        <div id="todolist" className="p-3 mt-2 mr-2 bg-white rounded-lg border-slate-300 border space-y-2 ml-2 md:mr-5 md:ml-5">
            {filteredAndSortedTasks?.map((item) => {
                const taskStatus = item.task.status; 

                return (
                    <div key={item.task.id} className="p-2 border-2 rounded-lg border-gray-200">
                        <div className="flex">
                            <div className="flex flex-grow justify-between items-center">
                                <div className="flex items-center font-medium md:font-medium text-xs md:text-base text-sky-500 ml-1">
                                    <button onClick={() => toggleSubtasks(item.task.id)} className="flex mr-4 text-blue-600 ">
                                        {displaySubtasks === item.task.id ? (
                                        <div className='flex flex-col items-center'>
                                        {(() => {
                                            const totalSubtasks = item.task.subTasks.length;
                                            const doneSubtasks = item.task.subTasks.filter(subtask => subtask.status).length;

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
                                            const totalSubtasks = item.task.subTasks.length;
                                            const doneSubtasks = item.task.subTasks.filter(subtask => subtask.status).length;

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
                                    <Link href={`/projects/${item.task.projectId}`}>
                                        {item.task.title}
                                    </Link>
                                </div>
                                <div className="flex items-center">
                                    <div className="mr-2">
                                        {`due ${dayjs(item.task.due).fromNow()}`}
                                    </div>
                                    <div className={`text-white text-base font-base text-center items-center rounded px-2 py-1 ${
                                        taskStatus === "Doing" ? "bg-yellow-500" : 
                                        taskStatus === "To-Do" ? "bg-gray-500" : "" 
                                    }`}>
                                        <Link href={`/projects/${item.task.projectId}`}>
                                            {taskStatus}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                        {/* Conditional Subtask Rows */}
                        {displaySubtasks === item.task.id && (
                                <div className="bg-white border-b">
                                    <SubTasksRows taskData={item} />
                                </div>
                            )}
                    </div>
                );
            })}
        </div>
    );
};
