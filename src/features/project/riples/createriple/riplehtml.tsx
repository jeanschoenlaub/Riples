import { useEffect, useState } from "react";
import { RipleCardPreview } from "~/features/cards/riple-card";
import { CodeSVG } from "~/components/svg-stroke";

type RipleHTMLComponentProps = {
    ripleTitle: string;
    setRipleTitle: React.Dispatch<React.SetStateAction<string>>;
    ripleHTMLContent: string;
    setRipleHTMLContent: React.Dispatch<React.SetStateAction<string>>;
    projectTitle: string;
    projectCoverImageId: string;
    isLoading: boolean;
}

const RipleHTMLComponent: React.FC<RipleHTMLComponentProps> = ({ ripleTitle, setRipleTitle, projectTitle, projectCoverImageId, isLoading, ripleHTMLContent, setRipleHTMLContent }) => {
        const [isEditMode, setIsEditMode] = useState(false);

        //For when wizard changes the vlaue of html content 
        useEffect(() => {
            //setRipleHTMLContent(ripleHTMLContent)
    
        }, [ripleHTMLContent]);
    
        return (
            <div className="container mx-auto">
                <div className="p-4 rounded-lg shadow-lg bg-gray-100">
                    <div className="flex justify-center items-center mb-4">
                        <h1 className="text-xl font-semibold">Style your Riple</h1>
                        <button 
                        onClick={() => setIsEditMode(!isEditMode)} 
                        disabled={isLoading}
                        className="bg-blue-500 text-white rounded px-2 ml-4 py-1 flex flex-row justify-center focus:outline-none focus:ring focus:ring-blue-200"
                    >
                        {isEditMode ? 'Preview' : (<span className="flex items-center "><CodeSVG width="4" height="4" marginRight="2"></CodeSVG>HTML</span>)}
                    </button>
                    </div>
                    
        
                    {isEditMode ? (
                        <div>
                            <label className="block text-sm mb-3" aria-label="Riple Title">
                                Riple Title:
                                <input
                                    type="text"
                                    value={ripleTitle}
                                    onChange={(e) => setRipleTitle(e.target.value)}
                                    className={`w-full p-2 mt-1 rounded border ${isLoading ? 'cursor-not-allowed' : ''}`}
                                    maxLength={255}
                                    disabled={isLoading}
                                />
                            </label>
                            <label className="block text-sm mb-3" aria-label="Riple Content HTML">
                                Riple Content (HTML):
                                <textarea 
                                    value={ripleHTMLContent} 
                                    onChange={(e) => setRipleHTMLContent(e.target.value)}
                                    className={`w-full p-2 mt-1 rounded border ${isLoading ? 'cursor-not-allowed' : ''}`}
                                    maxLength={10000}
                                    disabled={isLoading}
                                    rows={10}
                                />
                            </label>
                        </div>
                    ) : (
                        <div id="riple-card-preview" className="bg-sky-50 border border-slate-300 rounded-lg flex flex-col mx-2 md:mx-5 p-4 mt-4 shadow-md">
                            <RipleCardPreview 
                                ripleTitle={ripleTitle}
                                ripleContent={ripleHTMLContent} 
                                projectTitle={projectTitle}
                                projectCoverImageId={projectCoverImageId}
                            />
                        </div>
                    )}
                </div>
            </div>
        );
    };
    
    export default RipleHTMLComponent;