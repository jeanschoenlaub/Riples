import Image from 'next/image';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
dayjs.extend(relativeTime);

import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";

//My components
import { LoadingPage } from "~/components/loading";
import Link from 'next/link';

export const Feed = () => {
    const { data, isLoading } = api.riples.getAll.useQuery();

    if (isLoading ) return(<LoadingPage></LoadingPage>)
  
    if (!data) return(<div> Something went wrong</div>)
  
    return ( 
      <div>

        <div>
          {/*<CreateRipleWizard></CreateRipleWizard>*/}
        </div>

        <div>
          {data?.map((fullRiple) => (
            <RipleCardMeta key={fullRiple.riple.id} {...fullRiple}></RipleCardMeta>
          ))}
        </div>

      </div>
    )
} 


type RipleWithUser = RouterOutputs["riples"]["getAll"][number]
export const RipleCardMeta = (props: RipleWithUser) => {
  const {riple, author} = props;

  return (
    <div id="riple-card" className="bg-white border border-slate-300 rounded-lg mx-5 p-4 mt-4 mb-4 shadow-md" key={riple.id}>
      <div id="riple-card-metadata" className="flex items-start space-x-3 mb-4">
          {/* Author's Profile Image */}
          <div id="riple-card-metadata-auth-profile-image">
            <Link href={`/projects/${riple.projectId}`}>
              <Image 
                  src={riple.project.coverImageUrl} 
                  alt="Profile Image" 
                  className="rounded-full border border-slate-300"
                  width={80}
                  height={80}
              />
            </Link>
          </div>

          {/* Author's Name and Post Date */}
          <div id="riple-card-metadata-auth-name-and-created-date">
              <div className="font-semibold text-gray-800">
                  {riple.title}
              </div>
              <span className="text-sm text-gray-500">
                  {`Update on `}
                  <span className="font-medium text-sky-500">
                      <Link href={`/projects/${riple.projectId}`}>
                          {riple.project.title}
                      </Link>
                  </span>
                  {` by `}
                  <span className="font-medium text-gray-500">
                    <Link href={`/users/${riple.authorID}`}>
                      {`${author?.firstName} ${author?.lastName}`}
                    </Link>
                  </span>
                  <span className="ml-2">{`${dayjs(riple.createdAt).fromNow()}`}</span>
              </span>
          </div>
      </div>

      {/* Horizontal Divider */}
      <hr className="border-t border-slate-200 my-4" />

      {/* Post Content */}
      <div className="text-gray-700">
          {riple.content}
      </div>
    </div>
  );
}