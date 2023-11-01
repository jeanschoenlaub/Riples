import type { RouterOutputs } from '~/utils/api';
import { TaskList } from "~/features/task/task-list";

type ProjectData = RouterOutputs["projects"]["getProjectByProjectId"]
interface CollabTabProps {
    project: ProjectData["project"];
    isMember: boolean;
    isPending: boolean;
    isProjectLead: boolean;
}

export const CollabTab: React.FC<CollabTabProps> = ({ project, isMember, isPending, isProjectLead}) => {

    return (
        <div id="project-collab-task-table" className="border-r-2 border-l-2 border-b-2 border-gray-200 ">
                { (project.projectPrivacy === "public" || isMember || isProjectLead) && ( 
                    <TaskList project={project} isMember={isMember} isProjectLead={isProjectLead} isPending={isPending}/>
                 )} 
        </div>
    )
}