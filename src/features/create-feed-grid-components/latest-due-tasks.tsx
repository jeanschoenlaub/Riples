import { useMemo } from "react";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { LoadingPage } from "~/components";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
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
        return tasks?.filter(task => task.task.status !== "Done") // Filter tasks not done
            .sort((a, b) => {
                // Convert due dates to timestamps, default to a large number for invalid dates
                const dateATimestamp = new Date(a.task.due).getTime() || Number.MAX_VALUE;
                const dateBTimestamp = new Date(b.task.due).getTime() || Number.MAX_VALUE;
    
                // Subtract timestamps for sorting
                return dateATimestamp - dateBTimestamp;
            });
    }, [tasks]);
    

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
                                <div className="font-medium md:font-medium text-xs md:text-base text-sky-500 ml-1">
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
                                        taskStatus === "To-Do" ? "bg-gray-500" : "" // Make sure you handle all possible statuses here
                                    }`}>
                                        <Link href={`/projects/${item.task.projectId}`}>
                                            {taskStatus}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
