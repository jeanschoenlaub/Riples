
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
dayjs.extend(relativeTime);
import DOMPurify from "dompurify";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { RouterOutputs } from "~/utils/api";


type RipleWithUser = RouterOutputs["riples"]["getAll"][number]
export const RipleCard = (props: RipleWithUser) => {
  const {riple, author} = props;
  const [isExpanded, setIsExpanded] = useState(true);
  const rawHTML = riple.content;
  
  let cleanHTML = rawHTML; // Default to rawHTML

  // Run DOMPurify only on the client side
  if (typeof window !== 'undefined') {
    cleanHTML = DOMPurify.sanitize(rawHTML);
  }

  const showReadMore = cleanHTML.length > 500; // If the content is longer than 500 characters


  // Calculate max height based on whether the content is expanded.
  const maxHeightClass = isExpanded ? 'max-h-screen' : 'max-h-200';
  
  return (
    <div id="riple-card" className="bg-white border border-slate-300 rounded-lg mx-2 md:mx-5 p-4 mt-4 mb-4 shadow-md" key={riple.id}>
      <div id="riple-card-metadata" className="flex items-center space-x-3 mb-4">
          {/* Author's Profile Image */}
          <div id="riple-card-metadata-auth-profile-image">
            <Link href={`/projects/${riple.projectId}`}>
              <Image
                  src={riple.project.coverImageUrl} 
                  alt="Profile Image" 
                  className="rounded-full border border-slate-300"
                  width={100}
                  height={100}
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
      <div id="riple-content" 
           className={`text-gray-700 overflow-hidden transition-all duration-500 ${maxHeightClass}`}>
        <div dangerouslySetInnerHTML={{ __html: cleanHTML }}></div>
      </div>

      {/* Conditionally render Read More button */}
      { showReadMore && (
        <button onClick={() => setIsExpanded(!isExpanded)} className="mt-4">
          {isExpanded ? 'Read More' : 'Read Less'}
        </button>
      )}
    </div>
  );
}