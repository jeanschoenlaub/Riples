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
          return projects.slice(0, 3).map((projectData) => (
            <ProjectCardCarousel key={projectData.project.id} {...projectData} />
          ));
        };
      
        // If no projects, we render nothing.
        if (!projects.length) return null;
      
        return (
          <div className="bg-white p-4 shadow rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Projects to Follow</h2>
            <div className="carousel-container flex overflow-x-auto gap-2">
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
        className="border border-slate-300 flex flex-col bg-white w-full rounded-lg mx-2 md:mx-5 mt-4 mb-4 shadow-md"
      >
          {/* Image */}
          <div className="relative border-b border-gray-400 h-40">
              <Image
                  className="rounded-t-lg object-cover"
                  src={buildProjectCoverImageUrl(project.coverImageId)}
                  alt={`${project.title} image`}
                  layout="fill" // This prop will ensure it fills the parent div's dimensions
              />
          </div>
  
          <div className="p-4 space-y-4">
              {/* Status and Accessibility */}
              <div className="flex space-x-2 items-center">
                  <div className="text-sm flex items-center space-x-2">
                      <span className={` px-2 py-0.5 rounded-lg ${
                          project.status === "Doing" ? "bg-yellow-500" : 
                          project.status === "To-Do" ? "bg-gray-400" : 
                          project.status === "Done" ? "bg-green-500" : "text-gray-500"
                      }`}>
                          {project.status.toLowerCase()}
                      </span>
                  </div>
  
                  <div className="text-sm text-gray-800 ">
                          <span className={` px-2 py-1 rounded-lg ${
                              project.projectType === "solo" ? "bg-yellow-500" :  "bg-violet-400" 
                          }`}>
                              {project.projectType}
                          </span>
                  </div>
  
                  <div className="text-sm text-gray-800">
                          <span className={` px-2 py-1 rounded-lg ${
                              project.projectPrivacy === "private" ? "bg-pink-300" :  "bg-blue-300" 
                          }`}>
                              {project.projectPrivacy}
                          </span>
                  </div>
              </div>
  
              {/* Project Title */}
              <div className="text-lg tracking-tight font-bold ">
                  <Link href={`/projects/${project.id}`} className="">
                      {project.title}
                  </Link>
              </div>
  
              {/* Placeholder for Description */}
              <div className="font-light text-gray-500 md:text-lg">
                  {project.summary}
              </div>
  
              {/* Project Tags */}
              <div className="text-sm text-gray-800">
                  <span className="text-gray-500">
                      Project Tags:
                  </span>
                  {renderTags()}
              </div>
  
              {/* Creation Date */}
              <div className="text-sm text-gray-800">
                  <span className="text-gray-500">
                  Created:
                  </span>
                  <span className="ml-2">{`${dayjs(project.createdAt).fromNow()}`}</span>
              </div>
              
              <div className="text-sm flex items-center text-gray-800">
                  <span className="text-gray-500">
                  Lead by:
                  </span>
                  <span className="ml-1 flex items-center text-black font-normal  ">
                      <div id="project-lead-profile-image" className="flex items-center ">
                          <Link href={`/users/${project.authorID}`}>
                            <ProfileImage username={author.username} email={author.email} image={author.image} name={author.name} size={32} />
                          </Link>
                      </div>
                      <Link href={`/users/${project.authorID}`} className="ml-2">
                          {author.username}
                      </Link>
                  </span>
              </div>
              <hr></hr>
              <Follow projectId={project.id} showText={true}></Follow>
              
          </div>
      </div>
    );
  }
