import React from 'react';
import dayjs from 'dayjs';
import type { RouterOutputs } from '~/utils/api';
import Link from 'next/link';
import { ProfileImage } from './profileimage';

type ProjectData = RouterOutputs["projects"]["getProjectByProjectId"] & {
  members?: RouterOutputs["projectMembers"]["getMembersByProjectId"];
};

export const AboutTab = (props: ProjectData) => {
  const {project, author, members} = props;

  return (
      <div id="proj-about-html" className="mt-4 ml-2 mb-2 space-y-4">
        <div>
          {project.summary}
        </div>
    
        <p className="italic text-sm text-gray-600">
          Created {dayjs(project.createdAt).format('DD/MM/YYYY')}
        </p>
    
        {/* Project Status */}
        <div>
          <span className={`inline-block px-2 py-1 rounded text-white ${
            project.status === "In Progress" ? "bg-green-500" : 
            project.status === "Planning" ? "bg-yellow-500" : 
            project.status === "Finished" ? "bg-red-500" : ""
          }`}>
            {project.status}
          </span>
        </div>

        
    
        {/* About the project Type */}
        <div id="project-about-project-type" className="flex items-center space-x-3 mb-4">
          <div id="project-about-project-type-icon" className="flex items-center justify-center">
            <svg
              className="w-4 h-4 mr-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="#2563eb"  // Blue and Gray colors
              viewBox="0 0 20 20"
            >
              {project.projectType === "multi" 
                ? <path d="M5 19h10v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2ZM5 7a5.008 5.008 0 0 1 4-4.9 3.988 3.988 0 1 0-3.9 5.859A4.974 4.974 0 0 1 5 7Zm5 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm5-1h-.424a5.016 5.016 0 0 1-1.942 2.232A6.007 6.007 0 0 1 17 17h2a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5ZM5.424 9H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h2a6.007 6.007 0 0 1 4.366-5.768A5.016 5.016 0 0 1 5.424 9Z"/> 
                : <path d="M7 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm2 1H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z"/>}
            </svg>
            {project.projectType === "multi" ? "Collaborative" : "Individual"}
          </div>
    
          <span className="text-sm text-gray-500">
            This is a <span className="font-medium text-sky-500">{project.projectType}</span> project
          </span>
        </div>
    
        {/* About the Author */}
        <div id="project-about-author" className="flex items-center space-x-3 mb-4">
          <span className="text-sm text-gray-500">
            Project Lead:  
            <span className="font-medium ml-1">
              <Link href={`/users/${project.authorID}`}>
                {author.name}
              </Link>
            </span>
          </span>
          <div id="riple-card-metadata-auth-profile-image">
            <Link href={`/users/${project.authorID}`}>
              <ProfileImage user={author} size={32} />
            </Link>
          </div>
        </div>

        {/* About the Project Members */}
        <div id="project-about-members" className="mb-4">
          <span className="text-sm text-gray-500">Project Members:</span>

          <div className="mt-2">
            {members?.map((user, index) => (
              <div key={index} className="flex items-center space-x-3 mb-2">
                <span className="text-sm font-medium">
                  <Link href={`/users/${user.user.id}`}>
                  {author.name}
                  </Link>
                </span>
                <div id={`riple-card-metadata-auth-profile-image-${index}`}>
                  <Link href={`/users/${user.user.id}`}>
                    <ProfileImage user={user.user} size={32} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
)};
