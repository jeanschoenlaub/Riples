import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import type { RouterOutputs } from "~/utils/api";


type ProjectWithUser = RouterOutputs["projects"]["getProjectByAuthorId"][number]

type ProjectCardProps = ProjectWithUser & {
  borderColor?: string;
}

export const ProjectCard = (props: ProjectCardProps) => {
  const { data: session } = useSession(); 
  const {project, author} = props;

 
  return (
    <li className="py-3 sm:py-4">
      <div className="flex items-center space-x-2">
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