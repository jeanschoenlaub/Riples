import React, { useState } from 'react';
import { RouterOutputs } from '~/utils/api';
import { ProjectCardPortofolio } from '../cards/projectcard';
import { userAgent } from 'next/server';
import { useSession } from 'next-auth/react';

type UserPortofolioProps = {
    projectData?: RouterOutputs["projects"]["getProjectByAuthorId"];
    isUserOwner: boolean;
}

export const UserPortofolio: React.FC<UserPortofolioProps> = ({ projectData, isUserOwner }) => {

    if (!projectData) return null; 

    return (
        <div>
            <div className="flex items-center space-x-4 ml-2">
                <div className='text-lg mt-2 font-semibold'>Public Projects</div>
                {/* Add more buttons or UI elements here, similar to UserAbout if needed */}
            </div>
            <div className="flex items-center space-x-4 ml-2">
                {projectData.filter(project => project.project.projectPrivacy === "public").map((fullProject) => (
                    <ProjectCardPortofolio key={fullProject.project.id} {...fullProject} />
                ))}
            </div>
            <hr></hr>
            {isUserOwner && 
            <div>
            <div className="flex items-center space-x-4 ml-2">
                <div className='text-lg mt-2 font-semibold'>Private Projects</div>
                {/* Add more buttons or UI elements here, similar to UserAbout if needed */}
            </div>
            <div className="flex items-center space-x-4 ml-2">
                {projectData.filter(project => project.project.projectPrivacy === "private").map((fullProject) => (
                    <ProjectCardPortofolio key={fullProject.project.id} {...fullProject} />
                ))}
            </div>
            </div>
            }
        </div>
    );
};
