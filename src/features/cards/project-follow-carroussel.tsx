import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { RouterOutputs } from '~/utils/api';
import { buildProjectCoverImageUrl } from '~/utils/s3';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
dayjs.extend(relativeTime);
import { Follow, ProfileImage } from '~/components';


type ProjectWithUser = RouterOutputs["projects"]["getAll"]
type ProjectWithUserCard = RouterOutputs["projects"]["getAll"][number]

export const ProjectFollowCarousel = ({ projects }: { projects: ProjectWithUser }) => {
        const renderProjectCards = () => {
          // Assuming you only want to show a set number of projects, like 3
          return projects.slice(0, 2).map((projectData) => (
            <ProjectCardCarousel key={projectData.project.id} {...projectData} />
          ));
        };
      
        // If no projects, we render nothing.
        if (!projects.length) return null;
      
        return (
          <div className="bg-white p-4 border border-slate-300 rounded-lg shadow-md">
            <div className="text-lg font-bold mb-4">Projects you might be interested in</div>
            <div className="max-h-30 w-30 flex justify-center flex-col md:flex-row gap-2">
              {renderProjectCards()}
            </div>
          </div>
        );
};
      

export const ProjectCardCarousel = ( props: ProjectWithUserCard ) => {
    const {project, author} = props;
  

    const renderTags = () => {
        return project.tags.map((taggedItem, tagIndex) => (
                <span key={tagIndex} className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-2 mb-2">
                    #{taggedItem.tag.name}
                </span>
        ));
    };
  
  
    return (
      <div 
        key={project.id}
        className="border border-slate-300  flex-shrink-0  w-60 h-62 bg-white  rounded-lg mx-2 md:mx-5 mt-2 mb-4 shadow-md"
      >
          {/* Image */}
          <div className="relative border-b border-gray-400 h-20 flex-shrink-0">
              <Image
                  className="rounded-t-lg object-cover"
                  src={buildProjectCoverImageUrl(project.coverImageId)}
                  alt={`${project.title} image`}
                  layout="fill" // This prop will ensure it fills the parent div's dimensions
              />
          </div>
  
          <div className="p-4 space-y-2 flex-grow">
              {/* Project Title */}
              <div className="text-base truncate tracking-tight font-bold ">
                  <Link href={`/projects/${project.id}`} className="">
                      {project.title}
                  </Link>
              </div>
  
  
              {/* Project Tags */}
              <div className="text-sm flex truncate-2-lines text-gray-800">
                  {renderTags()}
              </div>
              
              <div className="text-sm flex truncate items-center text-gray-800">
                  <span className="flex items-center text-black font-normal  ">
                      <div id="project-lead-profile-image" className="flex flex-shrink-0 items-center truncate  ">
                          <Link href={`/users/${project.authorID}`}>
                            <ProfileImage username={author.username} email={author.email} image={author.image} name={author.name} size={32} />
                          </Link>
                      </div>
                      <Link href={`/users/${project.authorID}`} className="ml-2 truncate">
                          {author.username}
                      </Link>
                  </span>
              </div>
              <hr></hr>
              <div className='flex justify-center text-xb flex-shrink-0 font-semibold' style={{ height: '50px' }}>
                <Follow projectId={project.id} showText={true}></Follow>
              </div>
          </div>
      </div>
    );
  }
