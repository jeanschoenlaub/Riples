import Image from 'next/image';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
import DOMPurify from "dompurify";
import React, { useState } from 'react';
dayjs.extend(relativeTime);

import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";

//My components
import { LoadingPage } from "~/components/loading";
import Link from 'next/link';

export const Feed = () => {
    const { data, isLoading } = api.riples.getAll.useQuery();

    if (isLoading) return(<LoadingPage></LoadingPage>)
  
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
  const [isExpanded, setIsExpanded] = useState(false);
  const rawHTML = `
  
  <b>First Stop, Tasmania</b>

  <p></br>
    For the first leg of my year-long journey, I left Sydney and headed for Tasmania, an island off the southeast coast of Australia. This adventure promises to be exciting, so buckle up and join me for the ride!
  </p>
  
  <p></br>
    I should add a bit of background to this journey. I lived in Sydney for about 18 months, had amazing flatmates, and worked at a solar start-up called "5B." Life was easy-going. However, after four years in Australia, I decided it was time to explore the world once more. This marks a significant turning point for me.
  </p>
  <p></br>
    Fast-forward to a Sunday evening following a farewell dinner with my flatmates. After a weekend of goodbyes—and nursing a heavy heart alongside a slightly heavier head—I hit the road. My first stop: Canberra, as part of my plan to break up the long drive.
  </p>
  
  <!-- Insert Photos -->
  <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 20px;">
    <div style="flex: 1;">
      <img src="/images/day1-1.jpeg" alt="Strolling around the Australian government in Canberra" style="width: auto; height: 300px;">
      <p style="text-align: center; font-style: italic;">Strolling around the Australian government in Canberra</p>
    </div>
    <div style="flex: 1;">
      <img src="/images/day1-2.jpeg" alt="Finding 'Mavericks' 5B solar products at a petrol station" style="width: auto; height: 300px;">
      <p style="text-align: center; font-style: italic;">Finding 'Mavericks' 5B solar products at a random petrol station en route to Geelong</p>
    </div>
  </div>

  `//riple.content;
  const cleanHTML = DOMPurify.sanitize(rawHTML);
  const showReadMore = riple.content.length > 15; // Show "Read More" if content is longer than X characters - TO-DO make cleaner with UseRef ?

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
      <div className={`text-gray-700 overflow-hidden transition-all duration-500 ${isExpanded ? 'max-h-200' : 'max-h-24'}`} dangerouslySetInnerHTML={{ __html: cleanHTML }}></div> 

      {/* Conditionally render Read More button */}
      { showReadMore && (
        <button onClick={() => setIsExpanded(!isExpanded)} className="mt-4">
          {isExpanded ? 'Read Less' : 'Read More'}
        </button>
      )}

    </div>
  );
}

