import React, { useState } from 'react';
import { LoadingSpinner } from '~/components/reusables/loading';
import { useRipleInteractionsMutation } from '../riplecardapi';
import { useSession } from 'next-auth/react';
import { TrashSVG } from '~/components/reusables/svgstroke';
import toast from 'react-hot-toast';
import { NavBarSignInModal } from '~/components/navbar/signinmodal';
import Link from 'next/link';
import { ProfileImage } from '~/components/reusables/profileimage';

interface RipleCommentProps {
    comments: Array<{ 
        id: string;
        content: string;
        createdAt: Date;
        ripleId: string;
        authorID: string | null;
        authorUsername: string | null;
        authorImage: string;
        authorEmail: string;
        authorName: string;
    }>;
    onCommentSubmit: (commentContent: string) => void;
    isAddingComment: boolean;
}

export const RipleCommentListAndForm: React.FC<RipleCommentProps> = ({ comments, onCommentSubmit, isAddingComment }) => {
    const [commentContent, setCommentContent] = useState('');
    const { data: session } = useSession()
    const [showSignInModal, setShowSignInModal] = useState(false); // If click on folllow when not signed in we redirect

    const {removeCommentFromRiple, isRemovingComment} = useRipleInteractionsMutation();

     // Handlers for deleting a comment
     const handleCommentDelete = (commentId: string) => {
        if (!session) {
            toast.error("You must be signed in to comment");
            setShowSignInModal(true); // Show sign-in modal if the user is not logged in
            return;
        }

        const performCommentOperation = async (commentId: string) => {
            try {
                await removeCommentFromRiple(commentId);
            } catch (error) {
                console.error("Error while handling comment operation:", error);
                toast.error("Error while deleting comment. Sorry please try again later");
            }
        };
        // Call the async function
        void performCommentOperation(commentId);
    };

    return (
        <div className="mt-4 p-4 border-t border-slate-300">

            {/* Comments List */}
            <div className="space-y-4">
                {comments.map(comment => (
                    <div key={comment.id} className="border bg-sky-100 rounded-md p-3">
                        <div className="flex justify-between mb-2 items-center flex-wrap">
                            <div id="riple-comment-header" className="flex items-center font-semibold text-gray-800 mr-2">
                                <Link href={`/users/${comment.authorID}`}>
                                    <ProfileImage  username={comment.authorUsername ?? ""} email={comment.authorEmail ?? ""} image={comment.authorImage ?? "" } name={comment.authorName ?? ""}  size={32} />
                                </Link>
                                <span className="font-medium ml-2 text-gray-800">
                                    {comment.authorUsername}
                                </span> 
                            </div>
                            <div id="riple-comment-delete-optional">
                                {comment.authorID === session?.user.id && 
                                    isRemovingComment ? 
                                        (<LoadingSpinner size={20}></LoadingSpinner> ):
                                        (<button className="bg-red-500 px-2 py-1 rounded-lg" onClick={() => handleCommentDelete(comment.id)}><TrashSVG width="4" height="4"></TrashSVG></button>
                                    )}
                            </div>
                        </div>
                        <div className="text-gray-600">{comment.content}</div>
                        <div className="text-sm text-gray-400">{comment.createdAt.toLocaleString()}</div>
                    </div>
                ))}
            </div>
            
            {/* Comment Form */}
            <div className="mt-4">
                <textarea 
                    value={commentContent}
                    onChange={e => setCommentContent(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full p-2 border rounded-md resize-none"
                    rows={2}
                    disabled= {isAddingComment}
                ></textarea>

            {isAddingComment ? 
                (<LoadingSpinner size={20}></LoadingSpinner> ):(
                    <button 
                        onClick={() => { 
                            onCommentSubmit(commentContent);
                            setCommentContent(''); 
                        }}
                        className="mt-2 bg-blue-600 text-white px-4 py-1 rounded-full hover:bg-blue-700"
                    >
                        Post Comment
                    </button>)}
                </div>
                <NavBarSignInModal showModal={showSignInModal} onClose={() => setShowSignInModal(false)} />
        </div>
    );
}
