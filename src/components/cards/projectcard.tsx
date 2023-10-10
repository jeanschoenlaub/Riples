import Link from 'next/link';
import Image from 'next/image';
import dayjs from 'dayjs';
import type { RouterOutputs } from "~/utils/api";
import { useEffect, useState } from 'react';


type ProjectWithUser = RouterOutputs["projects"]["getProjectByAuthorId"][number]

type ProjectCardProps = ProjectWithUser & {
  borderColor?: string;
  onClick?: () => void;  
}

export const ProjectCard = (props: ProjectCardProps) => {
  const {project, author} = props;
 
  return (
      <div onClick={props.onClick} className="flex items-center space-x-2">
        <div className="flex-shrink-0">
          <Image
            className={`rounded-full border-2 ${props.borderColor ?? "border-gray-300"}`}
            src={project.coverImageUrl}
            alt={`${project.title} image`}
            width={50}
            height={50}
          />
        </div>
        <div className="flex-1 min-w-0">
          <Link href={`/projects/${project.id}`} className="text-sm font-medium text-sky-500 truncate">
            {project.title}
          </Link>
          <p className="text-sm text-gray-500 truncate ">
            {author.username}
          </p>
        </div>
      </div>
  );
}

export const ProjectCardPortofolio = (props: ProjectCardProps) => {
  const {project, author} = props;

  const [imgDimensions, setImgDimensions] = useState({width: 100, height: 100});
  useEffect(() => {
      if (typeof window !== 'undefined') {
          if (window.innerWidth < 640) {
              setImgDimensions({width: 80, height: 80});
          }
      }
  }, []);

  return (
    <div 
      key={project.id}
      className={`border border-slate-300 rounded-lg mx-2 md:mx-5 p-4 mt-4 mb-4 shadow-md`}
    >
      <div className="flex items-center space-x-3">
      
        {/* Project Image */}
        <div className="flex-none">
            <Link href={`/projects/${project.id}`}>
                <Image
                    src={project.coverImageUrl} 
                    alt="Project Image" 
                    className="rounded-full border border-slate-300"
                    width={imgDimensions.width} 
                    height={imgDimensions.height}
                />
            </Link>
        </div>

        <div className="flex-grow">
            {/* Project Title */}
            <div className="font-semibold text-gray-800 mr-2">
                {project.title}
            </div>
          
            {/* Metadata */}
            <div className="space-y-1">
                <div className="text-sm text-gray-500">
                    <span className="font-medium text-sky-500 ml-1">
                        <Link href={`/projects/${project.id}`}>
                            {project.title}
                        </Link>
                    </span>
                    &nbsp;&#40;{project.projectType}&#41;
                </div>

                <div className="text-sm text-gray-500">
                    By user &nbsp;
                    <span className="font-medium text-black">
                        <Link href={`/users/${project.authorID}`}>
                            {author?.username}
                        </Link>
                    </span>
                    <span className="ml-2">{`${dayjs(project.createdAt).fromNow()}`}</span>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}