import toast from "react-hot-toast";
import type { RouterOutputs } from "~/utils/api";
import type { AddCommentPayload, AddlikePayload } from "./riplecardtypes";
import type { Session } from "next-auth";
import { useRipleInteractionsMutation } from "./riplecardapi";
import * as htmlToImage from 'html-to-image';


type CommentWithUser = RouterOutputs["comment"]["getCommentsByRiple"][number];
type Riple = RouterOutputs["riples"]["getAll"][number]["riple"];
type RipleInteractionsProps = {
    riple: Riple;
    session: Session | null;  // Assuming the session can also be null
    hasLiked: boolean;
    ripleCardRef: React.RefObject<HTMLDivElement>;
    setShowSignInModal: React.Dispatch<React.SetStateAction<boolean>>;
    setShowShareModal: React.Dispatch<React.SetStateAction<boolean>>;  // Type for its updater function
    setShareImageUrl: React.Dispatch<React.SetStateAction<string>>;  
};


export const useRipleInteractions = (props: RipleInteractionsProps) => {
    const { riple, ripleCardRef, session, hasLiked, setShowSignInModal, setShowShareModal, setShareImageUrl } = props;
    const { addLikeToRiple,removeLikeFromRiple, isAddingLike, isRemovingLike, addCommentToRiple, isAddingComment} = useRipleInteractionsMutation();
    const isChangingLikeState = isAddingLike || isRemovingLike 
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

     const generateShareImage = () => {
        if (ripleCardRef.current) {
            htmlToImage.toPng(ripleCardRef.current)
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


    return {
        handleLike,
        handleCommentAdd,
        transformComments,
        generateShareImage,
        isChangingLikeState,
        isAddingComment,
    }
}