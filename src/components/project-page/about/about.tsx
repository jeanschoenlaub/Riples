import React from 'react';
import dayjs from 'dayjs';
import { ProjectAboutGoal } from './goals/goals';
import { ProjectAboutInfo } from './projectinfo/projectinfo';
import type { RouterOutputs } from '~/utils/api';

export type ProjectData = RouterOutputs["projects"]["getProjectByProjectId"] 
export interface AboutTabProps {
  project: ProjectData;
  isMember: boolean;
  isPending: boolean;
  isProjectLead: boolean;
  userId: string | undefined;
}


export const AboutTab : React.FC<AboutTabProps> = ({ project, isMember, isPending, isProjectLead, userId }) => {
    return (
      <div id="proj-about-html" className="border-r-2 border-l-2 border-gray-200 dark:border-gray-700 mb-2 space-y-4">
        <ProjectAboutInfo
            project={project}
            isProjectLead={isProjectLead}
            isMember={isMember}
            isPending={isPending}
            userId={userId}
        />
        <hr/>
        <ProjectAboutGoal 
            projectId={project.project.id}
            goals={project.project.goals}
            projectPrivacy={project.project.projectPrivacy}
            isProjectLead={isProjectLead}
            isMember={isMember}
        />
        <hr/>
        <div className='text-lg ml-2 font-semibold'> Project Stats </div>
        {/* Project Tasks and Subtasks Stats */}
        {(project.project.projectPrivacy === "public" || isProjectLead || isMember) &&
            <div id="project-tasks-stats" className="mb-4">

                <div className="mt-2">
                    {/* Completed Tasks */}
                    <div className="flex items-center mb-2">
                        <span className="text-sm text-gray-500 font-semibold justify-br flex-shrink-0 ml-2 mr-2">Completed Tasks:</span>
                        2/2
                    </div>
                    
                    {/* Completed Subtasks */}
                    <div className="flex items-center mb-2">
                        <span className="text-sm text-gray-500 font-semibold justify-br flex-shrink-0 ml-2 mr-2">Completed Sub-Tasks:</span>
                        2/2
                    </div>
                    </div>
                </div>
        }


                <p className="ml-2 italic text-sm text-gray-600">
                  Created {dayjs(project.project.createdAt).format('DD/MM/YYYY')}
                </p>
          </div>
        )};