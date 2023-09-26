import Link from "next/link"
import toast from "react-hot-toast";
import { api } from "~/utils/api";
import type { RouterOutputs } from '~/utils/api';
import { TaskList } from "~/components/task/tasklist";

type ProjectData = RouterOutputs["projects"]["getProjectByProjectId"]
interface CollabTabProps {
    project: ProjectData["project"];
    isMember: boolean;
    isPending: boolean;
    isProjectLead: boolean;
    userId: string | undefined;
  }

export const CollabTab: React.FC<CollabTabProps> = ({ project, isMember, isPending, isProjectLead, userId }) => {
    
    return (
        <div>
            {/* TASK TABLE DIV ONLY FOR PROJECT MEMBERS + CREATE TASK */}
            <div id="project-collab-task-table" className="mt-4 ml-2 mb-2 space-y-4">
                { (project.projectPrivacy === "public" || isMember || isProjectLead) && ( 
                    <TaskList project={project} isMember={isMember} isProjectLead={isProjectLead} isPending={isPending}/>
                 )} 
            </div>
            
        </div>
    )
}