import React, { useEffect, useRef, useState } from 'react';
import { api, type RouterOutputs } from "~/utils/api";
import { RipleCardFooter } from "./riplecardsections/riplecardfooter";
import { UseRiplesMutations } from "./riplecardapi";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { NavBarSignInModal } from "../../navbar/signinmodal";
import { RipleCommentListAndForm } from "./riplecardsections/riplecardcomment";

//import { toPng } from 'html-to-image';
import { Modal } from "~/components/reusables/modaltemplate";
import { RipleCardHeader } from "./riplecardsections/riplecardheader";
import { RipleCardBody } from "./riplecardsections/riplecardbody";
import { LoadingSpinner } from '~/components/reusables/loading';
import { useRipleInteractions } from './ripleLikeCommentInteractions';
import { RipleCardImages } from './riplecardsections/ripleImages';

type FullRiple = RouterOutputs["riples"]["getAll"][number]

export const RipleCard = ({ riple, author }: FullRiple ) => {
    const [showSignInModal, setShowSignInModal] = useState(false); // If click on folllow when not signed in we redirect
    const [commentsCount, setCommentsCount] = useState<number>(0);
    const [showComment, setShowComment] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [shareImageUrl, setShareImageUrl] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [ripleToDelete, setRipleToDelete] = useState<string | null>(null);
    const ripleCardRef = useRef<HTMLDivElement>(null); // For sharing

    const { data: session } = useSession()
    const shouldExecuteQuery = !!session?.user?.id; // Run query only if session and user ID exist
    const userId = session?.user?.id ?? ''; //will never be empty 

    //All below is used to get the data and set up the interactions for the footer 
    const { data: ripleDetails, isLoading: isLoadingRiplesDetails } = api.feed.getRipleDetails.useQuery({ ripleId: riple.id });
    const { data: hasLiked } = api.like.hasLiked.useQuery(
        { ripleId: riple.id, userId: userId },
        { enabled: shouldExecuteQuery }
    );
    const comments = ripleDetails?.comments;
    const likeCount = ripleDetails?.likeCount;
    
    // When the data is fetched from the API, update the state
    useEffect(() => {
        if (ripleDetails?.commentCount) {
            setCommentsCount(ripleDetails.commentCount);
        }
    }, [ripleDetails]);

    const { handleLike, handleCommentAdd, generateShareImage, transformComments, isAddingComment, isChangingLikeState } = useRipleInteractions({ riple, ripleCardRef, session, setShowSignInModal, hasLiked : hasLiked ?? false, setShareImageUrl, setShowShareModal });
    const isLoadingLikeState = isChangingLikeState || isLoadingRiplesDetails
    

    // Delete Operations
    const onDelete = userId === riple.authorID ? () => handleDeleteClick() : undefined;
    const handleDeleteClick = () => {
        setRipleToDelete(riple.id);
        setShowDeleteModal(true);
    };
    const { deleteRiple, isDeleting } = UseRiplesMutations();
    const handleConfirmDelete = () => {
        if (ripleToDelete) {
            deleteRiple({ ripleId: ripleToDelete }).then(() => {
                toast.success('Riples Deleted Successfully');
                setShowDeleteModal(false);
            })
            .catch(() => {
                toast.error('Error deleting Riples');
                setShowDeleteModal(false);
            });
        }
    };
    const handleCancelDelete = () => {
        setRipleToDelete(null);
        setShowDeleteModal(false);
    };


    const cardBackgroundColor = 
        riple.ripleType === "creation" ? "bg-orange-50" :
        riple.ripleType === "goalFinished" ? "bg-green-50" :
        "bg-white";
    const cardBorderClass = riple.ripleType == "creation" ? "" : "border border-slate-300";
  
    return (
        <div ref={ripleCardRef} id="riple-card" key={riple.id}>
            <div className={`${cardBackgroundColor} ${cardBorderClass} rounded-lg flex flex-col mx-2 md:mx-5 p-2 shadow-md`}>
                <RipleCardHeader riple={riple} author={author} onDelete={onDelete} ></RipleCardHeader>

                <RipleCardBody ripleContent={riple.content}></RipleCardBody>

                {riple.images && (
                        <RipleCardImages images={riple.images}/>
                )}

                {/* Post Footer */}
                <div className="flex flex-col  justify-between h-full border-t px-4 border-slate-300 ">
                    <RipleCardFooter 
                        likesCount={likeCount ?? 0}
                        hasLiked={hasLiked ?? false}
                        onLike={handleLike}
                        isChangingLikeState= {isLoadingLikeState}
                        commentsCount={commentsCount} 
                        showComment={showComment}
                        onComment={() => setShowComment(!showComment)}
                        onShare={generateShareImage} 
                    />
                </div>

                {showComment && (
                    <div className="">
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
                <Modal showModal={showDeleteModal} onClose={handleCancelDelete} size="small">
                    <p>Are you sure you want to delete this riple?</p>
                    <div className="flex justify-end">
                        <button onClick={handleCancelDelete} className="bg-red-500 text-white rounded px-4 py-2">No</button>
                        <button onClick={handleConfirmDelete} className="bg-green-500 text-white rounded px-4 py-2 ml-2">{isDeleting && <LoadingSpinner size={16} />}  Yes</button>
                    </div>
                </Modal>
            </div>
        </div>
    );
}

