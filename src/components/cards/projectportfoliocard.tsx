import Link from 'next/link';
import Image from 'next/image';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
dayjs.extend(relativeTime);
import type { RouterOutputs } from "~/utils/api";
import { buildProjectCoverImageUrl } from '~/utils/s3';
import { ProfileImage } from '../reusables/profileimage';


type FullProjectWithUser = RouterOutputs["projects"]["getProjectByAuthorId"][number]
type PortofolioProjectCardProps = FullProjectWithUser & {
  borderColor?: string;
  onClick?: () => void; 
  isPrivate?: boolean; 
}

export const ProjectCardPortofolio = (props: PortofolioProjectCardProps) => {
  const {project, author} = props;

  const opacityStyle = props.isPrivate ? "opacity-60" : "";


  //const completedTasksCount = project.tasks.filter(task => task.status === "Done").length;
  //const allSubtasks = project.tasks.flatMap(task => task.subTasks);
  //const completedSubtasksCount = allSubtasks.filter(subtask => subtask?.status === true).length;

  const renderTags = () => {
    return project.tags.map((tag, index) => (
        <span key={index} className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-2 mb-2">
            #{tag.tag.name}
        </span>
    ));
}


  return (
    <div 
      key={project.id}
      className={`border border-slate-300 flex flex-col bg-white w-full rounded-lg mx-2 md:mx-5 mt-4 mb-4 shadow-md ${opacityStyle}`}
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
            <div className="text-lg tracking-tight font-bold">
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
            
        </div>
    </div>
  );
}
