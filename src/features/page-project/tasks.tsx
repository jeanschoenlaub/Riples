import { api, type RouterOutputs } from '~/utils/api';
import { TaskList } from "~/features/task/task-list";
import { LoadingRiplesLogo } from '~/components/loading/loading';

type ProjectData = RouterOutputs["projects"]["getProjectByProjectId"]
interface TaskTabProps {
    project: ProjectData["project"];
    isMember: boolean;
    isPending: boolean;
    isProjectLead: boolean;
}

export const TaskTab: React.FC<TaskTabProps> = ({ project, isMember, isPending, isProjectLead}) => {

    const { data: taskData, isLoading: isLoadingTasks, isError } = api.tasks.getTasksByProjectId.useQuery({ projectId: project.id});
    const isLoading = isLoadingTasks 

    if (isLoading) return <div className="flex justify-center"><LoadingRiplesLogo isLoading={isLoading}/></div>;
    if (isError || !taskData) return <p>Error loading tasks.</p>;

    return (
        <div id="project-collab-task-table" className="border-r-2 border-l-2 border-b-2 border-gray-200 ">
                { (project.projectPrivacy === "public" || isMember || isProjectLead) && ( 
                    <TaskList taskData={taskData} projectId={project.id} projectType={project.projectType} isMember={isMember} isProjectLead={isProjectLead} isPending={isPending}/>
                 )} 
        </div>
    )
}