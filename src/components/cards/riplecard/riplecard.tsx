import DOMPurify from "dompurify";
import React, { useEffect, useRef, useState } from 'react';
import { api, type RouterOutputs } from "~/utils/api";
import { RipleCardFooter } from "./riplecardsections/riplecardfooter";
import { useRipleInteractionsMutation } from "./riplecardapi";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { NavBarSignInModal } from "../../navbar/signinmodal";
import { RipleCommentListAndForm } from "./riplecardsections/riplecardcomment";
import type { AddCommentPayload, AddlikePayload } from "./riplecardtypes";

//import { toPng } from 'html-to-image';
import * as htmlToImage from 'html-to-image';
import { Modal } from "~/components/reusables/modaltemplate";
import { RipleCardHeader } from "./riplecardsections/riplecardheader";
import { RipleCardBody } from "./riplecardsections/riplecardbody";

type FullRiple = RouterOutputs["riples"]["getAll"][number]&{
    onDelete?: (rippleId: string) => void;
}

type CommentWithUser = RouterOutputs["comment"]["getCommentsByRiple"][number]&{
    onDelete?: (rippleId: string) => void;
}
export const RipleCard = ({ riple, author, onDelete }: FullRiple ) => {
    
    const [showSignInModal, setShowSignInModal] = useState(false); // If click on folllow when not signed in we redirect
    const [commentsCount, setCommentsCount] = useState<number>(0);
    const [showComment, setShowComment] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [shareImageUrl, setShareImageUrl] = useState("");

    const { data: session } = useSession()
    const shouldExecuteQuery = !!session?.user?.id; // Run query only if session and user ID exist
    const userId = session?.user?.id ?? ''; //will never be empty 


    const cardBackgroundColor = 
        riple.ripleType === "creation" ? "bg-orange-50" :
        riple.ripleType === "goalFinished" ? "bg-green-50" :
        "bg-white";
    const cardBorderClass = riple.ripleType == "creation" ? "" : "border border-slate-300";


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


    

    //All below is used to pass like counts to the riplecardfooter component
    const { addLikeToRiple,removeLikeFromRiple, isAddingLike, isRemovingLike, addCommentToRiple, isAddingComment} = useRipleInteractionsMutation();
    const { data: likeData, isLoading: isLoadingLikeCount  } = api.like.getLikeCount.useQuery({ ripleId: riple.id });
    const { data: hasLiked } = api.like.hasLiked.useQuery(
        { ripleId: riple.id, userId: userId },
        { enabled: shouldExecuteQuery }
    );
    const isChangingLikeState = isAddingLike || isRemovingLike || isLoadingLikeCount

    //All below is used to pass comments and comment counts to the riplecardcomment component
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

    //All below is used to transform a Riple card to image and put in a modal on the press of share button
    const rippleCardRef = useRef<HTMLDivElement>(null);
    const generateImage = () => {
        if (rippleCardRef.current) {
            htmlToImage.toPng(rippleCardRef.current)
                .then(dataUrl => {
                        setShareImageUrl(dataUrl)
                        setShowShareModal(true);  // Display the modal with the image.
                })
                .catch(error => {
                    console.error("Couldn't generate the image", error);
                });
        } else {
            console.error("Ripple Card Ref is not attached yet");
        }
    };


    useEffect(() => {
        // Check if we got a response for comments count and update the state
        if (commentsCountData) {
            setCommentsCount(commentsCountData);
        }
    }, [commentsCountData]);

  
    return (
        <div ref={rippleCardRef} id="riple-card" key={riple.id}>
            <div className={`${cardBackgroundColor} ${cardBorderClass} rounded-lg flex flex-col mx-2 md:mx-5 p-4 mt-4 shadow-md`}>
                <RipleCardHeader riple={riple} author={author} onDelete={onDelete} ></RipleCardHeader>

            
                <RipleCardBody ripleContent={riple.content}></RipleCardBody>

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
                <Modal showModal={showShareModal} Logo={false} size="medium" onClose={() => setShowShareModal(false)}>
                    <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col ">
                        <p className="mt-4 text-center text-lg font-semibold text-gray-700">Sharing this Riple </p>
                        <p className="mt-4 text-gray-700"> 1. Hold or left click the image below to save it </p>
                        <div className="items-center">
                            <img id="generatedImage" alt="Generated Image" src={shareImageUrl} />
                        </div>
                        <p className="mt-4 text-gray-700"> 2. Share it !</p>
                    </div>
                </Modal> 
            </div>
        </div>
    );
}

