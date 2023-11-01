import { LoadingSpinner, AboutSVG, ShareSVG, LikeSVG } from "~/components";

interface RipleCardFooterProps {
    likesCount: number;
    hasLiked: boolean;
    onLike: () => void;
    isChangingLikeState? : boolean;
    commentsCount: number;
    showComment: boolean;
    onComment: () => void;
    onShare: () => void;
    isLoadingRiplesDetails: boolean;
  }
  
  export const RipleCardFooter: React.FC<RipleCardFooterProps> = ({
    likesCount,
    hasLiked,
    onLike,
    isChangingLikeState,
    commentsCount,
    showComment,
    onComment,
    onShare,
    isLoadingRiplesDetails,
  }) => {

    return (
      <div className="flex items-center mb-2 justify-between ">
        
            {/* Like Button and Count */}
            <div className="mt-1 px-2 border-slate-300 ">
                { (isChangingLikeState || isLoadingRiplesDetails) ?
                    (<LoadingSpinner size={20}></LoadingSpinner> ):
                    (
                    <div className="flex items-center space-x-2">
                        <button onClick={onLike} className={`focus:outline-none ${hasLiked ? 'text-blue-500' : 'text-gray-400'}`}>
                            <LikeSVG width="4" height="4"></LikeSVG>
                        </button>
                        <span>{likesCount}</span>
                    </div>)
                }
            </div>
  
             {/* Comments */}
            { isLoadingRiplesDetails ?
            (<LoadingSpinner size={20}></LoadingSpinner> ):
            (
                <div className="flex items-center space-x-2">
                    <div className="flex items-center ">
                        <button onClick={onComment} className="focus:outline-none text-gray-400">
                        {showComment ?
                            <AboutSVG width="4" height="4" marginRight='2' marginTop='1' colorFillHex='#2563eb'></AboutSVG> // Blue color
                            :<AboutSVG width="4" height="4" marginRight='2'  marginTop='1' colorFillHex='#9CA3AF'></AboutSVG>  // Gray color
                        }
                        </button>
                        <span className="">{commentsCount}</span>
                    </div>
                </div>
            )}


        {/* SHARE SVG */}
        {commentsCount !== undefined  && (
            <div className="flex items-center  ">
                <button 
                onClick={onShare}
                className="focus:outline-none text-gray-400 mt-1">
                    <ShareSVG width="4" height="4"></ShareSVG> 
                </button>
            </div>
        )}
        
      </div>
    );
  }
  