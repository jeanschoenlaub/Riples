import DOMPurify from "dompurify";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from 'react';
import { AboutSVG, LikeSVG } from "~/components/reusables/svg";
import { FollowEmptySVG, ShareSVG } from "~/components/reusables/svgstroke";
import { buildProjectCoverImageUrl } from "~/utils/s3";


interface RipleCardPreviewProps {
    ripleTitle: string;
    ripleContent: string;
    projectTitle: string;
    projectCoverImageId: string;
}

export const RipleCardPreview : React.FC<RipleCardPreviewProps> = ({
    ripleTitle,
    ripleContent,
    projectTitle,
    projectCoverImageId,
}) => {
    const { data: session } = useSession()
    const user = session?.user
    const [isExpanded, setIsExpanded] = useState(true);
    const rawHTML = ripleContent;

    let cleanHTML = rawHTML; // Default to rawHTML

    // Run DOMPurify only on the client side
    if (typeof window !== 'undefined') {
        cleanHTML = DOMPurify.sanitize(rawHTML);
    }

    const showReadMore = cleanHTML.length > 500; // If the content is longer than 500 characters

    // Calculate max height based on whether the content is expanded.
    const maxHeightClass = isExpanded ? 'max-h-40' : 'max-h-200';

    const [imgDimensions, setImgDimensions] = useState({width: 100, height: 100});
    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (window.innerWidth < 640) {
                setImgDimensions({width: 80, height: 80});
            }
        }
    }, []);

    return (
        <div className="rounded-lg bg-white flex flex-col mx-2 md:mx-5 p-4 mt-4 shadow-md">
            <div className="flex items-center space-x-3">
                <div id="riple-card-header-image" className="flex-none">
                    <img
                        src={buildProjectCoverImageUrl(projectCoverImageId)}
                        alt="Profile Image"
                        className="rounded-full border border-slate-300"
                        width={imgDimensions.width}
                        height={imgDimensions.height}
                    />
                </div>

                <div className="flex-grow">
                    {/* Riple Title */}
                    <div className="flex justify-between items-center flex-wrap">
                        <div id="riple-card-header-title" className="font-semibold text-gray-800 mr-2">
                            {ripleTitle}
                        </div>
                        <div id="riple-card-header-follow">
                            <FollowEmptySVG colorStrokeHex='#2563eb'></FollowEmptySVG> 
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="space-y-1">
                        <div className="text-sm text-gray-500">
                            Update on
                            <span className="font-medium text-sky-500 ml-1">{projectTitle}</span>
                            {/*&nbsp;&#40;{project.projectType}&#41; */}
                        </div>
                        <div className="text-sm text-gray-500">
                            By user&nbsp;
                            <span className="font-medium text-black">{user?.username}</span>
                            <span className="ml-2">just now</span>
                        </div>
                    </div>
                </div>
                </div>


                    <div className="flex flex-col mb-2 justify-between h-full">
                        {cleanHTML !== "" && (
                            <div   
                                id="riple-preview-content" 
                                className={`text-gray-700 mt-2 overflow-hidden transition-all duration-500 ${maxHeightClass}`}
                            >
                                {/* Horizontal Divider */}
                                <hr className="border-t mb-4 border-slate-200"/>
                                <div dangerouslySetInnerHTML={{ __html: cleanHTML }}></div>
                            </div>
                        )}

                        {/* Conditionally render Read More button */}
                        {showReadMore && (
                            <div className="text-right">
                                <button onClick={() => setIsExpanded(!isExpanded)} className="mt-2 bg-gray-300 text-sm flex-shrink-0 w-22 hover:bg-blue-600 hover:text-white font-bold px-2 rounded-full transition duration-300 ease-in-out ">
                                    {isExpanded ? 'See More' : 'See Less'}
                                </button>
                            </div>
                        )}
                        
                        {/* Placeholder for likes, comments, etc. */}
                        <div className="flex mt-1 justify-between h-full  rounded-lg border px-4 py-1 border-slate-300">
                            {/* Like Button and Count */}
                            <div className="rounded-full border px-4 py-1 border-slate-300 ">
                                        <div className="flex items-center space-x-2">
                                            <div className="focus:outline-none text-gray-400">
                                                <LikeSVG></LikeSVG>
                                            </div>
                                            <span>{0}</span>
                                    </div>
                            </div>
                    
                            <div className="rounded-full border px-4 py-1 border-slate-300 ">
                                        <div className="flex items-center space-x-2">
                                            <div className="focus:outline-none text-gray-400">
                                                <AboutSVG></AboutSVG>
                                            </div>
                                            <span>{0}</span>
                                    </div>
                            </div>

                            <div className="rounded-full border px-4 py-1 border-slate-300 ">
                                        <div className="flex items-center space-x-2">
                                            <div className="focus:outline-none text-gray-400">
                                                <ShareSVG></ShareSVG>
                                            </div>
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
    );
}



