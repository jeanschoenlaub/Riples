import { LoadingSpinner } from "../../../reusables/loading";
import { AboutSVG, LikeSVG } from "../../../reusables/svg";

interface RipleCardFooterProps {
    likesCount: number;
    hasLiked: boolean;
    onLike: () => void;
    isChangingLikeState? : boolean;
    commentsCount: number;
    showComment: boolean;
    onComment: () => void;
  }
  
  export const RipleCardFooter: React.FC<RipleCardFooterProps> = ({
    likesCount,
    hasLiked,
    onLike,
    isChangingLikeState,
    commentsCount,
    showComment,
    onComment
  }) => {
    return (
      <div className="flex items-center justify-between mt-2">
        
        {/* Like Button and Count */}
        <div className="rounded-full border px-4 py-1 border-slate-300 ">
        {isChangingLikeState ?
          (<LoadingSpinner size={20}></LoadingSpinner> ):
          (
            <div className="flex items-center space-x-2">
            <button onClick={onLike} className={`focus:outline-none ${hasLiked ? 'text-blue-500' : 'text-gray-400'}`}>
                <LikeSVG></LikeSVG>
            </button>
          <span>{likesCount}</span>
          </div>)
        }
        </div>
  
        {/* Comment Button and Count (Optional) */}
        {commentsCount !== undefined  && (
          <div className="flex items-center space-x-2">
            <div className="rounded-full flex items-center border px-4 py-1 border-slate-300 ">
            <button onClick={onComment} className="focus:outline-none text-gray-400">
            {showComment ?
                <AboutSVG width="6" height="6" marginRight='2' marginTop='1' colorFillHex='#2563eb'></AboutSVG> // Blue color
                :<AboutSVG width="6" height="6" marginRight='2'  marginTop='1' colorFillHex='#9CA3AF'></AboutSVG>  // Gray color
            }
            </button>
            <span className="">{commentsCount}</span>
          </div>
          </div>
        )}
      </div>
    );
  }
  