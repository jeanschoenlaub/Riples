import React, { useState } from 'react';
import { RouterOutputs } from '~/utils/api';
import { ProjectCardPortofolio } from '../cards/projectcard';

type UserPortofolioProps = {
    projectData?: RouterOutputs["projects"]["getProjectByAuthorId"];
}

export const UserPortofolio: React.FC<UserPortofolioProps> = ({ projectData }) => {
    const [onboardingComplete, setOnboardingComplete] = useState(false); 
    if (!projectData) return null;  // Or any other fallback UI

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
        </div>
    );
};
