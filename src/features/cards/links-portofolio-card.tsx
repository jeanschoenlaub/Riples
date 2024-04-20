import Link from 'next/link';
import Image from 'next/image';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
dayjs.extend(relativeTime);
import type { RouterOutputs } from "~/utils/api";
import { buildProjectCoverImageUrl } from '~/utils/s3';
import { ExternalLinkSVG, GlobeSVG, ProfileImage } from '~/components';
import { getProjectStatusColor } from '~/utils/constants/dbValuesConstants';

type FullProjectWithUser = RouterOutputs["projects"]["getProjectByAuthorId"][number]
type PortofolioLinksCardProps = FullProjectWithUser & {
  borderColor?: string;
  onClick?: () => void; 
  isPrivate?: boolean; 
}

export const LinksCardPortofolio = (props: PortofolioLinksCardProps) => {
  const {project, author} = props;

  const opacityStyle = props.isPrivate ? "opacity-60" : "";

  const renderTags = () => {
    return project.projectTags.map((tag, index) => (
        <span key={index} className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-2 mb-2">
            #{tag.name}
        </span>
    ));
}


  return (
    <div 
      key={project.id}
      className={`flex flex-col border border-slate-300 bg-white w-full rounded-lg mx-2 md:mx-5 mt-4 mb-4 shadow-md ${opacityStyle}`}
    >

        {/* Project cover Image and title section*/}
        <div className='flex items-center mb-2 mt-2 space-x-4'>
            
            <div className={`flex-shrink-0 ml-2 rounded-full border border-black`}>
                <img
                    className={`rounded-full`}
                    src={buildProjectCoverImageUrl(project.coverImageId)}
                    alt={`${project.title} image`}
                    width={80}
                    height={80}
                />
            </div>

            <div className="text-lg tracking-tight font-bold">
                {project.title}
            </div>

            <span className="mx-2">•</span> {/* Dot as a spacer */}

            <div>
                <Link href={`/projects/${project.id}`} className="flex items-center text-blue-500 underline">
                 <ExternalLinkSVG  width="4" height="4" marginRight='1' colorStrokeHex='#2563eb'></ExternalLinkSVG>
                  Riple project link
                </Link>
            </div>

            <span className="mx-2">•</span> {/* Dot as a spacer */}

            <div>
            
                <Link href={`/projects/${project.link}`} className="flex items-center text-blue-500 underline">
                    <GlobeSVG width="4" height="4" marginRight='1' colorStrokeHex='#2563eb'></GlobeSVG>
                    External Link
                </Link>
            </div>
      
        </div>
    </div>
  );
}
