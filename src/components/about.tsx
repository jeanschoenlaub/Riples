import React from 'react';
import dayjs from 'dayjs';
import { RouterOutputs } from '~/utils/api';
import Link from 'next/link';
import Image from 'next/image';

type ProjectData = RouterOutputs["projects"]["getProjectByProjectId"]
const AboutTab = (props: ProjectData) => {
  const {project, author} = props;

  return (
    <div id="proj-about-html" className="mt-4">
      <div>
        {project.summary}
      </div>
      <div>
        <p className="italic mt-2 text-sm text-gray-600">
          Created {dayjs(project.createdAt).format('DD/MM/YYYY')}
        </p>
      </div>
      
      {/* About the project Type*/}
      <div id="project-about-project-type" className="flex items-start space-x-3 mb-4">
          { project.projectType === "multi" ? 
              <div id="project-about-project-type-icon" className="flex items-center justify-center">
                <svg
                  className="w-4 h-4 mr-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#2563eb"  // Blue and Gray colors
                  viewBox="0 0 20 20"
                  >
                  <path d="M5 19h10v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2ZM5 7a5.008 5.008 0 0 1 4-4.9 3.988 3.988 0 1 0-3.9 5.859A4.974 4.974 0 0 1 5 7Zm5 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm5-1h-.424a5.016 5.016 0 0 1-1.942 2.232A6.007 6.007 0 0 1 17 17h2a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5ZM5.424 9H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h2a6.007 6.007 0 0 1 4.366-5.768A5.016 5.016 0 0 1 5.424 9Z" />
                </svg>
                Collaborative
              </div>
            :
              <div id="project-about-project-type-icon" className="flex items-center justify-center">
                <svg
                  className="w-4 h-4 mr-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#2563eb"  // Blue and Gray colors
                  viewBox="0 0 20 20"
                  >
                  <path d="M7 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm2 1H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                </svg>
                Individual
              </div>
          }

        <div id="project-about-project-type-description">
            <span className="text-sm text-gray-500">
                {`This is a `}
                <span className="font-medium text-sky-500">
                        {project.projectType}
                </span>
                {` project`}
            </span>
        </div>
      </div>

      {/* About the Author*/}
      <div id="project-about-author" className="flex items-start space-x-3 mb-4">
        <div id="riple-card-metadata-auth-name-and-created-date">
          <span className="text-sm text-gray-500">
              {`Project Lead:  `}
              <span className="font-medium text-gray-500">
                <Link href={`/users/${project.authorID}`}>
                  {`${author?.firstName} ${` `} ${author?.lastName}`}
                </Link>
              </span>
          </span>
        </div>
        <div id="riple-card-metadata-auth-profile-image">
          <Link href={`/users/${project.authorID}`}>
            <Image 
                src={author.imageUrl} 
                alt="Author Profile Image" 
                className="rounded-full border border-slate-300"
                width={40}
                height={40}
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutTab;