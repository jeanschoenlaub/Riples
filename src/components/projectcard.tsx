import dayjs from "dayjs";

import Link from 'next/link';
import Image from 'next/image';
import type { RouterOutputs } from "~/utils/api";


type ProjectWithUser = RouterOutputs["projects"]["getProjectByAuthorId"][number]
export const ProjectCard = (props: ProjectWithUser) => {
  const {project} = props;
 
  return (
    <div id="project-card" className="bg-white border border-slate-300 rounded-lg mx-5 p-4 mt-4 mb-4 shadow-md" key={project.id}>
      <div id="project-card-metadata" className="flex items-start space-x-3 mb-4">
            {/* Author's Profile Image */}
            <div id="project-card-metadata-auth-profile-image">
                <Link href={`/projects/${project.authorId}`}>
                <Image 
                    src={project.coverImageUrl} 
                    alt="Profile Image" 
                    className="rounded-full border border-slate-300"
                    width={100}
                    height={100}
                />
                </Link>
            </div>

           

            {/* Author's Name and Post Date */}
            <div id="project-card-metadata-auth-name-and-created-date" className="space-y-1">
                <div className="font-medium text-sky-500">
                    <Link href={`/projects/${project.id}`}>
                        {project.title}
                    </Link>
                </div>

                <div>
                    <span className={`text-sm inline-block px-2 py-1 rounded text-white ${
                        project.status === "In Progress" ? "bg-green-500" : 
                        project.status === "Planning" ? "bg-yellow-500" : 
                        project.status === "Finished" ? "bg-red-500" : ""
                    }`}>
                        {project.status}
                    </span>
                </div>

                <div className="text-sm text-gray-500">
                    Created {dayjs(project.createdAt).format('DD/MM/YYYY')}
                </div>

            </div>
      </div>

      {/* Horizontal Divider */}
      <hr className="border-t border-slate-200 my-4" />

      {/* Post Content */}
      <div className="text-gray-700"> {project.summary} </div>
      <div className="text-gray-700">  Created {dayjs(project.createdAt).format('DD/MM/YYYY')} </div>


    </div>
  );
}