import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { TaskList } from "../task/task-list";
import { RouterOutputs, api } from "~/utils/api";
import { DownArrowSVG, LoadingPage, UpArrowSVG } from "~/components";

type ProjectData = RouterOutputs["projects"]["getProjectByAuthorId"];
type TaskData = RouterOutputs["tasks"]["getTasksByProjectId"];
type TasksDataState = { [key: string]: TaskData | undefined };

export const ToDoList = () => {
    const { data: session } = useSession();
    const userId = session?.user?.id ?? '';
    const shouldExecuteQuery = !!userId;
    
    const { data: projectLead, isLoading: projectLeadLoading } = api.projects.getProjectByAuthorId.useQuery(
        { authorId: userId },
        { enabled: shouldExecuteQuery }
    );

    const [visibleTaskListIds, setVisibleTaskListIds] = useState(new Set<string>());
    const [tasksData, setTasksData] = useState<TasksDataState>({});

    useEffect(() => {
        visibleTaskListIds.forEach(projectId => {
            const { data } = useFetchTaskData(projectId);
            useEffect(() => {
                if (data) {
                    setTasksData(prevTasksData => ({
                        ...prevTasksData,
                        [projectId]: data
                    }));
                }
            }, [data, projectId]);
        });    
    }, [visibleTaskListIds]);

    const toggleTaskListVisibility = (projectId: string) => {
        setVisibleTaskListIds(prevVisibleTaskListIds => {
            const newVisibleTaskListIds = new Set(prevVisibleTaskListIds);
            if (newVisibleTaskListIds.has(projectId)) {
                newVisibleTaskListIds.delete(projectId);
            } else {
                newVisibleTaskListIds.add(projectId);
            }
            return newVisibleTaskListIds;
        });
    };

    const countNotDoneTasks = (project: ProjectData[0]) => {
        return project.project.tasks.filter(task => task.status != "Done").length;
    };

    if (!session) {
        return <div> Log in to see your projects </div>;
    }

    if (projectLeadLoading) return <LoadingPage isLoading={projectLeadLoading} />;

    return (
        <div id="todolist">
            {projectLead && projectLead.map(item => (
                <div key={item.project.id}>
                    <button onClick={() => toggleTaskListVisibility(item.project.id)} className="flex items-center text-blue-600">
                        <div className="flex flex-col items-center mr-2">
                            <div className="text-sm">{countNotDoneTasks(item)}</div>
                            {visibleTaskListIds.has(item.project.id) ? (
                                <UpArrowSVG width='5' height='5' />
                            ) : (
                                <DownArrowSVG width='5' height='5' />
                            )}
                        </div>
                        <div className="text-xl mr-2">{item.project.title}</div>
                    </button>
                    {visibleTaskListIds.has(item.project.id) && (
                        <TaskList
                            taskData={tasksData[item.project.id] || []}
                            projectId={item.project.id} 
                            projectType={item.project.projectType}
                            isMember={true}
                            isProjectLead={true}
                            isPending={true}
                        />
                    )}
                </div>
            ))}
        </div>
    );
};

function useFetchTaskData(projectId:string) {
    const { data, isLoading, isError } = api.tasks.getTasksByProjectId.useQuery({ projectId });
    return { data, isLoading, isError };
}
