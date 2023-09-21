import dayjs from "dayjs";

import Link from 'next/link';
import Image from 'next/image';
import type { RouterOutputs } from "~/utils/api";


type ProjectWithUser = RouterOutputs["projects"]["getProjectByAuthorId"][number]
export const ProjectCard = (props: ProjectWithUser) => {
  const {project, author} = props;
 
  return (
    <li className="py-3 sm:py-4">
    <div className="flex items-center space-x-4">
      <div className="flex-shrink-0">
        <img className="w-8 h-8 rounded-full" src={project.coverImageUrl} alt={`${project.title} image`} />
      </div>
      <div className="flex-1 min-w-0">
        <Link href={`/projects/${project.id}`} className="text-sm font-medium text-gray-900 truncate dark:text-white underline">
          {project.title}
        </Link>
        <p className="text-sm text-gray-500 truncate dark:text-gray-400">
          {author.username}
        </p>
      </div>
      <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
        222
      </div>
    </div>
  </li>
  );
}

/* <div id="project-card" className="bg-white border border-slate-300 rounded-lg mx-5 p-4 mt-4 mb-4 shadow-md" key={project.id}>
<div id="project-card-metadata" className="flex items-start space-x-3 mb-4">
      <div id="project-card-metadata-auth-profile-image">
          <Link href={`/projects/${project.id}`}>
          <Image 
              src={project.coverImageUrl} 
              alt="Profile Image" 
              className="rounded-full border border-slate-300"
              width={50}
              height={50}
          />
          </Link>
      </div>

     

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

<hr className="border-t border-slate-200 my-4" />


<div className="text-gray-700"> {project.summary} </div>
<div className="text-gray-700">  Created {dayjs(project.createdAt).format('DD/MM/YYYY')} </div>


</div> */