import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
dayjs.extend(relativeTime);
import DOMPurify from "dompurify";
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { api, type RouterOutputs } from "~/utils/api";
import Follow from "../../reusables/follow";
import { TrashSVG } from "../../reusables/svgstroke";
import { RipleCardFooter } from "./riplecardFooters/riplecardfooter";
import { useRipleInteractionsMutation } from "./riplecardapi";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { NavBarSignInModal } from "../../navbar/signinmodal";
import { RipleCommentListAndForm } from "./riplecardFooters/riplecomment";
import type { AddCommentPayload, AddlikePayload } from "./riplecardtypes";

//import { toPng } from 'html-to-image';
import * as htmlToImage from 'html-to-image';

type RipleWithUser = RouterOutputs["riples"]["getAll"][number]&{
    onDelete?: (rippleId: string) => void;
}

type CommentWithUser = RouterOutputs["comment"]["getCommentsByRiple"][number]&{
    onDelete?: (rippleId: string) => void;
}
export const RipleCard = ({ riple, author, onDelete }: RipleWithUser ) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [showSignInModal, setShowSignInModal] = useState(false); // If click on folllow when not signed in we redirect
    const [commentsCount, setCommentsCount] = useState<number>(0);
    const [showComment, setShowComment] = useState(false);

    const rawHTML = riple.content;

    let cleanHTML = rawHTML; // Default to rawHTML
    const { data: session } = useSession()

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

    

    // Handlers for liking and unliking
    const handleLike = () => {
        if (!session) {
            toast.error("You must be signed in to Like");
            setShowSignInModal(true); // Show sign-in modal if the user is not logged in
            return;
        }

        const performLikeOperation = async () => {
            try {
                if (hasLiked) {
                    await removeLikeFromRiple(riple.id);
                } else {
                    await addLikeToRiple(generateLikePayload());
                }
            } catch (error) {
                console.error("Error while handling like operation:", error);
                toast.error("Error while liking. Sorry please try again later");
            }
        };
        console.log(generateLikePayload())
        // Call the async function
        void performLikeOperation();
    };

    const generateLikePayload = (): AddlikePayload => ({
        ripleAuthorID: riple.authorID ?? "",
        ripleTitle: riple.title,
        username: session?.user.username ?? "",
        ripleId: riple.id,
        projectId: riple.projectId,
    });

    const generateCommentPayload = (commentContent: string): AddCommentPayload => ({
        ripleAuthorID: riple.authorID ?? "",
        ripleTitle: riple.title,
        content: commentContent,
        username: session?.user.username ?? "",
        ripleId: riple.id,
        projectId: riple.projectId,
    });

    // Handlers for liking and unliking
    const handleCommentAdd = (commentContent: string) => {
        if (!session) {
            toast.error("You must be signed in to comment");
            setShowSignInModal(true); // Show sign-in modal if the user is not logged in
            return;
        }

        const performCommentOperation = async (commentContent: string) => {
            try {
                   await addCommentToRiple(generateCommentPayload(commentContent));
            } catch (error) {
                console.error("Error while handling comment operation:", error);
                toast.error("Error while commenting. Sorry please try again later");
            }
        };
        console.log(generateLikePayload())
        // Call the async function
        void performCommentOperation(commentContent);
    };


    const shouldExecuteQuery = !!session?.user?.id; // Run query only if session and user ID exist
    const userId = session?.user?.id ?? ''; //will never be empty 

    const { addLikeToRiple,removeLikeFromRiple, isAddingLike, isRemovingLike, addCommentToRiple, isAddingComment} = useRipleInteractionsMutation();

    const { data: likeData, isLoading: isLoadingLikeCount  } = api.like.getLikeCount.useQuery({ ripleId: riple.id });
    const { data: hasLiked } = api.like.hasLiked.useQuery(
        { ripleId: riple.id, userId: userId },
        { enabled: shouldExecuteQuery }
    );
    const isChangingLikeState = isAddingLike || isRemovingLike || isLoadingLikeCount


    const { data: commentsCountData } = api.comment.getCommentCount.useQuery({ ripleId: riple.id });
    const { data: comments } = api.comment.getCommentsByRiple.useQuery({ ripleId: riple.id });
    const transformComments = (rawComments: CommentWithUser[]) => {
        return rawComments.map(comment => ({
            id: comment.id,
            authorUsername: comment.author?.username ?? 'Unknown',  // if username is not available, fallback to 'Unknown'
            content: comment.content,
            createdAt: comment.createdAt,
            ripleId: comment.ripleId,
            authorID: comment.authorID,
            authorImage: comment.author?.image ?? "",
            authorName: comment.author?.name ?? "",
            authorEmail: comment.author?.email ?? "",
        }));
    };

    const rippleCardRef = useRef<HTMLDivElement>(null);

    const generateImage = () => {
        if (rippleCardRef.current) {
            htmlToImage.toPng(rippleCardRef.current)
                .then(dataUrl => {
                    const blob = dataURLtoBlob(dataUrl);
                    const url = URL.createObjectURL(blob);
                    window.open(url, '_blank');
                })
                .catch(error => {
                    console.error("Couldn't generate the image", error);
                });
        } else {
            console.error("Ripple Card Ref is not attached yet");
        }
    };

    // Helper function to convert dataURL to Blob
    function dataURLtoBlob(dataurl) {
        const arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }
    
    

    useEffect(() => {
        // Check if we got a response for comments count and update the state
        if (commentsCountData) {
            setCommentsCount(commentsCountData);
        }
    }, [commentsCountData]);

  
    return (
        <div 
        ref={rippleCardRef}
        id="riple-card" 
        key={riple.id}
        >
        <div className={`${cardBackgroundColor} ${cardBorderClass} rounded-lg flex flex-col mx-2 md:mx-5 p-4 mt-4 shadow-md`}>
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

        
        {/* Post Content and Read More button */}
        <div className="flex flex-col mb-2 justify-between h-full">
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
                <div className="text-right">
                <button onClick={() => setIsExpanded(!isExpanded)} className="mt-2 bg-gray-300 text-sm flex-shrink-0 w-22 hover:bg-blue-600 hover:text-white font-bold px-2 rounded-full transition duration-300 ease-in-out ">
                {isExpanded ? 'See More' : 'See Less'}
                </button>
                </div>
            )}
        </div>

        {/* Post Footer */}
        <div className="flex flex-col  justify-between h-full  rounded-lg border px-4 py-1 border-slate-300 ">
            <RipleCardFooter 
                likesCount={likeData ?? 0}
                hasLiked={hasLiked ?? false}
                onLike={handleLike}
                isChangingLikeState= {isChangingLikeState}
                commentsCount={commentsCount} 
                showComment={showComment}
                onComment={() => setShowComment(!showComment)}
                onShare={generateImage} 
            />
        </div>

        {showComment && (
            <div className="mb-20">
            <RipleCommentListAndForm 
                comments={transformComments(comments ?? [])}  // Add author.username
                onCommentSubmit={handleCommentAdd} 
                isAddingComment={isAddingComment}
            />
            </div>
        )}

        <NavBarSignInModal showModal={showSignInModal} onClose={() => setShowSignInModal(false)} />
        </div>
        </div>
    );
}

