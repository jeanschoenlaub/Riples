import type { RouterOutputs } from '~/utils/api';
import { TaskList } from "~/features/task/task-list";

type ProjectData = RouterOutputs["projects"]["getProjectByProjectId"]
interface TaskTabProps {
    project: ProjectData["project"];
    isMember: boolean;
    isPending: boolean;
    isProjectLead: boolean;
}

export const TaskTab: React.FC<TaskTabProps> = ({ project, isMember, isPending, isProjectLead}) => {

    return (
        <div id="project-collab-task-table" className="border-r-2 border-l-2 border-b-2 border-gray-200 ">
                { (project.projectPrivacy === "public" || isMember || isProjectLead) && ( 
                    <TaskList project={project} projectId={project.id} projectType={project.projectType} isMember={isMember} isProjectLead={isProjectLead} isPending={isPending}/>
                 )} 
        </div>
    )
}