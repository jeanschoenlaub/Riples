import Link from 'next/link';

import type { RouterOutputs } from "~/utils/api";


type Project = RouterOutputs["projectFollowers"]["getProjectsFollowedByFollowerId"][0]
export const ProjectCard = (props: Project) => {
  const {project,author} = props;
 
  return (
    <li className="py-3 sm:py-4">
    <div className="flex items-center space-x-2">
      <div className="flex-shrink-0">
        <img className="w-10 h-10 rounded-full border" src={project.coverImageUrl} alt={`${project.title} image`} />
      </div>
      <div className="flex-1 min-w-0">
        <Link href={`/projects/${project.id}`} className="text-sm font-medium text-gray-900 truncate dark:text-white underline">
          {project.title}
        </Link>
        <p className="text-sm text-gray-500 truncate dark:text-gray-400">
          {author.username}
        </p>
      </div>
    </div>
  </li>
  );
}
