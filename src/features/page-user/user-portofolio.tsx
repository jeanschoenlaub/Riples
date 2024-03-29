import React from 'react';
import type { RouterOutputs } from '~/utils/api';
import { ProjectCardPortofolio } from '../cards/project-portfolio-card';

type UserPortofolioProps = {
    projectData?: RouterOutputs["projects"]["getProjectByAuthorId"];
    isUserOwner: boolean;
}

export const UserPortofolio: React.FC<UserPortofolioProps> = ({ projectData, isUserOwner }) => {
    if (!projectData) return null; 

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ml-2 mr-10">
                {projectData.map((fullProject) => {
                    const isPrivate = fullProject.project.projectPrivacy === 'private';

                    // Render only if the project is public, or if it's private and the user is the owner
                    if (!isPrivate || (isPrivate && isUserOwner)) {
                        return (
                            <ProjectCardPortofolio
                                key={fullProject.project.id}
                                isPrivate={isPrivate}
                                {...fullProject}
                            />
                        );
                    }
                    return null;
                })}
            </div>
        </div>
    );
};
