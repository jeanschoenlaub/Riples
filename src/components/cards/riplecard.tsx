
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
dayjs.extend(relativeTime);
import DOMPurify from "dompurify";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { RouterOutputs } from "~/utils/api";
import Follow from "../reusables/follow";
import { TrashSVG } from "../reusables/svgstroke";

type RipleWithUser = RouterOutputs["riples"]["getAll"][number]&{
    onDelete?: (rippleId: string) => void;
}

export const RipleCard = ({ riple, author, onDelete }: RipleWithUser ) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const rawHTML = riple.content;
  
  let cleanHTML = rawHTML; // Default to rawHTML

  // Run DOMPurify only on the client side
  if (typeof window !== 'undefined') {
    cleanHTML = DOMPurify.sanitize(rawHTML,{ALLOWED_ATTR: ['class', 'style', 'img', 'alt', 'src']});
  }

  const showReadMore = cleanHTML.length > 500; // If the content is longer than 500 characters
  const cardBackgroundColor = 
    riple.ripleType === "creation" ? "bg-orange-50" :
    riple.ripleType === "goalFinished" ? "bg-green-50" :
    "bg-white";
  const cardBorderClass = riple.ripleType == "creation" ? "" : "border border-slate-300";

  // Calculate max height based on whether the content is expanded.
  const maxHeightClass = isExpanded ? 'max-h-40' : 'max-h-200';

  //Smaller images if phone
  const [imgDimensions, setImgDimensions] = useState({width: 100, height: 100});
  useEffect(() => {
      if (typeof window !== 'undefined') {
          if (window.innerWidth < 640) {
              setImgDimensions({width: 80, height: 80});
          }
      }
  }, []);
  
  return (
    <div 
      id="riple-card" 
      key={riple.id}
      className={`${cardBackgroundColor} ${cardBorderClass} rounded-lg mx-2 md:mx-5 p-4 mt-4 mb-4 shadow-md`}
      >
      <div id="riple-card-header" className="flex items-center space-x-3">
      
        {/* Author's Profile Image */}
        <div id="riple-card-header-image" className="flex-none">
            <Link href={`/projects/${riple.projectId}`}>
                <Image
                    src={riple.project.coverImageUrl} 
                    alt="Profile Image" 
                    className="rounded-full border border-slate-300"
                    width={imgDimensions.width} 
                    height={imgDimensions.height}
                />
            </Link>
        </div>

        <div className="flex-grow  ">
            {/* Project Title and Follow Button */}
            <div className="flex justify-between items-center flex-wrap">
                <div id="riple-card-header-title" className="font-semibold text-gray-800 mr-2">
                    {riple.title}
                </div>
                <div id="riple-card-header-delete-optional">
                    {onDelete ? <button  className="bg-red-500 px-2 py-1 rounded-lg" onClick={() => onDelete(riple.id)}><TrashSVG width="4" height="4"></TrashSVG></button> : null}
                </div>
                <div id="riple-card-header-follow">
                    <Follow projectId={riple.projectId} />
                </div>
            </div>
          
            {/* Metadata */}
            <div className="space-y-1">
                <div className="text-sm text-gray-500">
                    {riple.ripleType == "update" ? `Update on` : `Check out project`}
                    <span className="font-medium text-sky-500 ml-1">
                        <Link href={`/projects/${riple.projectId}`}>
                            {riple.project.title}
                        </Link>
                  </span>
                  &nbsp;&#40;{riple.project.projectType}&#41;
              </div>

              <div className="text-sm text-gray-500">
                  By user &nbsp;
                  <span className="font-medium text-black">
                      <Link href={`/users/${riple.authorID}`}>
                          {author?.username}
                      </Link>
                  </span>
                  <span className="ml-2">{`${dayjs(riple.createdAt).fromNow()}`}</span>
              </div>
          </div>

      </div>
  </div>

    
     {/* Post Content */}
     {cleanHTML != "" && (
        <div 
            id="riple-content" 
            className={`text-gray-700 mt-2 overflow-hidden transition-all duration-500 ${maxHeightClass}`}
        >
            {/* Horizontal Divider */}
            <hr className="border-t mb-4 border-slate-200"/>

            <div dangerouslySetInnerHTML={{ __html: cleanHTML }}></div>
        </div>
      )}
  
      {/* Conditionally render Read More button */}
      { showReadMore && (
        <button onClick={() => setIsExpanded(!isExpanded)} className="mt-4">
          {isExpanded ? 'Read More' : 'Read Less'}
        </button>
      )}
    </div>
  );
}

