import type { RouterOutputs } from '~/utils/api';
import { Forum } from '../collab/forum-list';

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
                    <>

                        {/*<CollabTaskList 
                            project={project} 
                            isMember={isMember} 
                            isProjectLead={isProjectLead} 
                            isPending={isPending}
                />*/}
                        <Forum 
                            project={project} 
                            isMember={isMember} 
                            isProjectLead={isProjectLead} 
                            isPending={isPending}
                        />
                    </>
                )} 
        </div>
    )
}