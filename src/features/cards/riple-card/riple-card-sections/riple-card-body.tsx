
import DOMPurify from 'dompurify';
import React from 'react';
import '../riple-card.module.css';

type RipleCardBodyProps = {
    ripleContent: string;
    isExpanded: boolean;
    setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
};

export const RipleCardBody = ({ ripleContent,isExpanded, setIsExpanded }: RipleCardBodyProps) => {
    const rawHTML = ripleContent;

    let cleanHTML = rawHTML; // Default to rawHTML

    // Run DOMPurify only on the client side
    if (typeof window !== 'undefined') {
        cleanHTML = DOMPurify.sanitize(rawHTML)
    }

    const showReadMore = cleanHTML.length > 500; // If the content is longer than 500 characters

    // Calculate max height based on whether the content is expanded.
    const maxHeightClass = isExpanded ? 'max-h-200' : 'max-h-40';

    return (
            <div className="flex flex-col mb-2 justify-between h-full">
                {cleanHTML != "" && (
                    <div 
                        id="riple-content" 
                        className={`text-gray-700 mt-1 overflow-hidden transition-all duration-500 ${maxHeightClass}`}
                    >
                        {/* Horizontal Divider */}
                        <hr className="border-t mb-2 border-slate-200"/>

                        <div dangerouslySetInnerHTML={{ __html: cleanHTML }}></div>
                    </div>
                )}
            
                {/* Conditionally render Read More button */}
                { showReadMore && (
                    <div className="text-right">
                        <button onClick={() =>  setIsExpanded(!isExpanded)} className="mt-2 bg-gray-300 text-sm flex-shrink-0 w-22 hover:bg-blue-600 hover:text-white font-bold px-2 rounded-full transition duration-300 ease-in-out ">
                            {isExpanded ? 'Read Less' : '... Read More'}
                        </button>
                    </div>
                )}
            </div> 
    );
}

