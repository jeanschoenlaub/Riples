import Link from 'next/link';
import Image from 'next/image';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
dayjs.extend(relativeTime);
import type { RouterOutputs } from "~/utils/api";
import { useEffect, useState } from 'react';


type ProjectWithUser = RouterOutputs["projects"]["getProjectByAuthorIdForSideBar"][number]


type SideBarProjectCardProps = ProjectWithUser & {
  borderColor?: string;
  onClick?: () => void;  
}

export const ProjectCard = (props: SideBarProjectCardProps) => {
  const {project, author} = props;
 
  return (
    <li className="py-3 sm:py-4">
    <div onClick={props.onClick} className="flex items-center space-x-2">
      <div className="flex-shrink-0">
        <Image
          className={`rounded-full border-2 ${props.borderColor ?? "border-gray-300"}`}
          src={project.coverImageUrl}
          alt={`${project.title} image`}
          width={60}
          height={60}
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
  </li>
  );
}

type FullProjectWithUser = RouterOutputs["projects"]["getProjectByAuthorId"][number]
type PortofolioProjectCardProps = FullProjectWithUser & {
  borderColor?: string;
  onClick?: () => void;  
}

export const ProjectCardPortofolio = (props: PortofolioProjectCardProps) => {
  const {project, author} = props;

  const [imgDimensions, setImgDimensions] = useState({width: 120, height: 120});
  const completedTasksCount = project.tasks.filter(task => task.status === "Done").length;
  const allSubtasks = project.tasks.flatMap(task => task.subTasks);
  const completedSubtasksCount = allSubtasks.filter(subtask => subtask?.status === true).length;

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
      className={`border border-slate-300 bg-white w-full rounded-lg mx-2 md:mx-5 p-4 mt-4 mb-4 shadow-md`}
    >
    <div onClick={props.onClick} className="flex items-center space-x-2">
        <div className="flex-none">
            <Image
                className={`rounded-full border-2 ${props.borderColor ?? "border-gray-300"}`}
                src={project.coverImageUrl}
                alt={`${project.title} image`}
                width={imgDimensions.width}
                height={imgDimensions.height}
            />
        </div>
        
        {/* Metadata */}
        <div className="space-y-1 mt-2">
                <div className="text-lg font-medium text-sky-500">
                    <Link href={`/projects/${project.id}`} className="">
                        {project.title}
                    </Link>
                </div>
                <div className="text-sm text-gray-800">
                    <span className="text-gray-500  ml-1">
                        Accessibility:
                    </span>
                    &nbsp;{project.projectType}&nbsp;project
                </div>

                <div className="text-sm text-gray-800">
                    <span className="text-gray-500 ml-1">
                      Created:
                    </span>
                    <span className="ml-2">{`${dayjs(project.createdAt).fromNow()}`}</span>
                </div>

                <div className="text-sm text-gray-800">
                  {/* Completed Tasks and Subtasks */}
                          <span className="text-gray-500  ml-1">
                              Completed Tasks:
                          </span>
                          <span>{`${completedTasksCount}/${project.tasks.length}`}</span>
                      </div>
                    
                      <div className="text-sm text-gray-800">
                          <span className="text-gray-500  ml-1">
                              Completed Subtasks:
                          </span>
                          <span>{`${completedSubtasksCount}/${allSubtasks.length}`}</span>
                      </div>


                  {/* Number of Project Members */}
                  <div className="text-sm text-gray-800">
                  {(project.projectType === "collab") && (
                      <div id="project-about-members" className="flex flex-col mt-3 ml-2 mb-4">
                          <div className="flex items-center mb-2">
                              <span className="text-gray-500  ml-1">
                                  Project Members:
                              </span>
                              {project.members.filter(user => user.status === "APPROVED").length === 0
                                  ? <span>No members</span>
                                  : project.members.filter(user => user.status === "APPROVED").map(member => (
                                      <span key={member.id} className="mr-2">{member.user.name}</span> // Adjust based on your data structure
                                  ))
                              }
                          </div>
                      </div>
                  )}
</div>




            <div className="text-sm text-gray-800">
                <span className="text-gray-500 ml-1">Project Status:</span>
                <span className={`ml-2 ${
                        project.status === "Doing" ? "text-yellow-500" : 
                        project.status === "To-Do" ? "text-black" : 
                        project.status === "Done" ? "text-green-500" : "text-gray-500"
                    }`}>
                    {project.status}
                </span>
            </div>


        </div>
    </div>
    </div>
);
}
