
import DOMPurify from 'dompurify';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';

type RipleCardBodyProps = {
    ripleContent: string;
};

export const RipleCardBody = ({ ripleContent }: RipleCardBodyProps) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const rawHTML = ripleContent;

    let cleanHTML = rawHTML; // Default to rawHTML
    const { data: session } = useSession()

    // Run DOMPurify only on the client side
    if (typeof window !== 'undefined') {
        cleanHTML = DOMPurify.sanitize(rawHTML)
    }

    const showReadMore = cleanHTML.length > 500; // If the content is longer than 500 characters

    // Calculate max height based on whether the content is expanded.
    const maxHeightClass = isExpanded ? 'max-h-40' : 'max-h-200';

    return (
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
                        <button onClick={() =>  setIsExpanded(!isExpanded)} className="mt-2 bg-gray-300 text-sm flex-shrink-0 w-22 hover:bg-blue-600 hover:text-white font-bold px-2 rounded-full transition duration-300 ease-in-out ">
                            {isExpanded ? '... Read More' : 'Read Less'}
                        </button>
                    </div>
                )}
            </div> 
    );
}

