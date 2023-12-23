import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { TaskList } from "../task/task-list";
import { RouterOutputs, api } from "~/utils/api";
import { DownArrowSVG, LoadingPage, UpArrowSVG } from "~/components";
import TaskFilter from "~/components/task-filter";

type TaskData = RouterOutputs["tasks"]["getTasksByCreatedOrOwnerId"];
type MappedTasksType = {[projectId: string]: TaskData;};


export const ToDoList = () => {
    const { data: session } = useSession();
    const userId = session?.user?.id ?? '';
    const shouldExecuteQuery = !!userId;
    
    const { data: projectLead, isLoading: projectLeadLoading } = api.projects.getProjectByAuthorId.useQuery(
        { authorId: userId },
        { enabled: shouldExecuteQuery }
    );

    const { data: tasks } = api.tasks.getTasksByCreatedOrOwnerId.useQuery({ userId });

    //For seeing / hiding tasks under project names 
    const [visibleTaskListIds, setVisibleTaskListIds] = useState(new Set<string>());

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

    //This part is for handling the filtering of tasks
    const [selectedFilterStatuses, setSelectedFilterStatuses] = useState<string[]>(['All']);
    const [selectedDates, setSelectedDates] = useState<Date[] | null>(null);

    const handleFilterChange = (filters: { selectedStatuses: string[], selectedDates: Date[] | null }) => {
        setSelectedFilterStatuses(filters.selectedStatuses);
        setSelectedDates(filters.selectedDates);
    };

    // Map tasks to their respective projects & filtesr
    const tasksData = useMemo(() => {
        const mappedTasks: MappedTasksType = {};
        projectLead?.forEach(project => {
            mappedTasks[project.project.id] = tasks?.filter(task => {
                const isStatusMatch = selectedFilterStatuses.length === 0 || selectedFilterStatuses.includes('All') || selectedFilterStatuses.includes(task.task.status);
                let isDateMatch = true; // Default to true if no date filter is applied
                if (selectedDates && selectedDates[0] && selectedDates[1]) {
                    // Set time to start of the day for comparison
                    const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
                    const taskDate = startOfDay(new Date(task.task.due));
                    const startDate = startOfDay(selectedDates[0]);
                    const endDate = startOfDay(selectedDates[1]);
    
                    console.log(taskDate, startDate, endDate); // For debugging
    
                    isDateMatch = taskDate >= startDate && taskDate <= endDate;
                }

                return task.task.projectId === project.project.id && isStatusMatch && isDateMatch;
            }) || [];
        });
        return mappedTasks;
    }, [projectLead, tasks, selectedFilterStatuses, selectedDates]);


    if (!session) {
        return <div> Log in to see your projects </div>;
    }

    if (projectLeadLoading) return <LoadingPage isLoading={projectLeadLoading} />;

    return (
        <div id="todolist">
            <TaskFilter onFilterChange={handleFilterChange} />
            {projectLead && tasksData && projectLead.map(item => {
                const taskCount = tasksData[item.project.id]?.length ?? 0;
                return taskCount > 0 && (
                    <div key={item.project.id}>
                        <button onClick={() => toggleTaskListVisibility(item.project.id)} className="flex items-center text-blue-600">
                            <div className="flex flex-col items-center mr-2">
                                <div className="text-sm">{taskCount}</div>
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
                )
            })}
        </div>
    );
};

