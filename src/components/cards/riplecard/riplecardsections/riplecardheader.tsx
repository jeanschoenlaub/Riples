import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
import Follow from '~/components/reusables/follow';
import { TrashSVG } from '~/components/reusables/svgstroke';
import { RouterOutputs } from '~/utils/api';
import { buildProjectCoverImageUrl } from '~/utils/s3';
dayjs.extend(relativeTime);

type Riple = RouterOutputs["riples"]["getAll"][number]["riple"];
type Author = RouterOutputs["riples"]["getAll"][number]["author"];

type RipleWithAuthor = {
    riple: Riple,
    author: Author,
    onDelete?: (rippleId: string) => void;
}

export const RipleCardHeader = ({ riple, author, onDelete }: RipleWithAuthor ) => {
    //Smaller images if phone
    const [imgDimensions, setImgDimensions] = useState({width: 80, height: 80});
    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (window.innerWidth < 640) {
                setImgDimensions({width: 60, height: 60});
            }
        }
    }, []);
    return (
        <div id="riple-card-header" className="flex items-center space-x-3">
            {/* Author's Profile Image */}
            <div id="riple-card-header-image" className="flex-none">
                <Link href={`/projects/${riple.projectId}`}>
                    <Image
                        src={buildProjectCoverImageUrl(riple.project.coverImageId)} 
                        alt="Profile Image" 
                        className="rounded-full border border-slate-300"
                        width={imgDimensions.width} 
                        height={imgDimensions.height}
                    />
                </Link>
            </div>

            <div className="flex-grow  ">
                {/* Project Title and Follow Button */}
                <Link href={`/projects/${riple.projectId}`}>
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
                </Link>
            
                {/* Metadata */}
                <div className="space-y-1">
                    <div className="text-sm text-gray-500">
                        {riple.ripleType == "update" ? `Update on project:` : `Update on project:`}
                        <span className="font-medium text-base text-sky-500 ml-1">
                            <Link href={`/projects/${riple.projectId}`}>
                                {riple.project.title}
                            </Link>
                        </span>
                        {/*&nbsp;&#40;{riple.project.projectType}&#41;*/}
                    </div>
                    {/*
                    <div className="text-sm text-gray-500">
                        By user &nbsp;
                        <span className="font-medium text-black">
                            <Link href={`/users/${riple.authorID}`}>
                                {author?.username}
                            </Link>
                        </span>
                        <span className="ml-2">{`${dayjs(riple.createdAt).fromNow()}`}</span>
                    </div>
                    */}
                </div>
            </div>
        </div>
    );
}

