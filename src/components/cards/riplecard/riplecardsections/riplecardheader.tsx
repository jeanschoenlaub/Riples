import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
import Follow from '~/components/reusables/follow';
import { TrashSVG } from '~/components/reusables/svgstroke';
import { RouterOutputs } from '~/utils/api';
import { buildProjectCoverImageUrl } from '~/utils/s3';
import { ThreeDotSVG } from '~/components/reusables/svg';
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
    const [iconSizes, setIconSizes] = useState("6");
    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (window.innerWidth < 640) {
                setImgDimensions({width: 50, height: 50});
                setIconSizes("4")
            }
        }
    }, []);
    return (
        <div id="riple-card-header" className="flex items-center space-x-3">
            {/* Author's Profile Image */}
            <div id="riple-card-header-image" className="flex items-center flex-none" style={{ width: imgDimensions.width, height: imgDimensions.height }}>
                <Link href={`/projects/${riple.projectId}`}>
                    <Image
                        src={buildProjectCoverImageUrl(riple.project.coverImageId)} 
                        alt="Profile Image" 
                        className="rounded-full border border-slate-300"
                        width={imgDimensions.width} 
                        height={imgDimensions.height}
                        layout="responsive"
                    />
                </Link>
            </div>

            {/* Title and Metadata */}
            <div className="flex flex-col justify-center ">
                {/* Project Title */}
                <div id="riple-card-header-title" className="font-semibold text-xs md:text-base text-gray-800">
                    <Link href={`/projects/${riple.projectId}`}>
                        {riple.title}
                    </Link>
                </div>

                {/* Metadata */}
                <div id="riple-card-header-metadata" className="text-xs md:text-sm text-gray-500">
                    {riple.ripleType == "update" ? `Update on project:` : `Update on project:`}
                    <span className="font-medium md:font-medium text-xs md:text-base text-sky-500 ml-1">
                        <Link href={`/projects/${riple.projectId}`}>
                            {riple.project.title}
                        </Link>
                    </span>
                    <span className="ml-2">{`${dayjs(riple.createdAt).fromNow()}`}</span>
                </div>
            </div>

            {/* Follow Button and Delete */}
            <div id="riple-card-header-actions" className="flex flex-col justify-between items-end">
                <div id="riple-card-header-delete-optional">
                    {/*{onDelete ? 
                        <button className="bg-red-500 px-2 py-1 rounded-lg" onClick={() => onDelete(riple.id)}>
                            <TrashSVG width="4" height="4"></TrashSVG>
                        </button> 
                        : null}*/}
                </div>
                <div id="riple-card-header-follow">
                    <ThreeDotSVG width={iconSizes} height={iconSizes}></ThreeDotSVG>
                    {/*<Follow projectId={riple.projectId} />*/}
                </div>
            </div>
        </div>

    );
}

