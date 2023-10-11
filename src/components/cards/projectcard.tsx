import Link from 'next/link';
import Image from 'next/image';
import type { RouterOutputs } from "~/utils/api";


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

