import { useState } from "react";
import { RipleCardPreview } from "~/components/cards/riplecard/riplecardpreview";

type RipleHTMLComponentProps = {
    ripleTitle: string;
    setRipleTitle: React.Dispatch<React.SetStateAction<string>>;
    ripleContent: string;
    setRipleContent: React.Dispatch<React.SetStateAction<string>>;
    projectTitle: string;
    projectCoverImageUrl: string;
    isLoading: boolean;
}

const RipleHTMLComponent: React.FC<RipleHTMLComponentProps> = ({ ripleTitle, setRipleTitle, projectTitle, projectCoverImageUrl, isLoading, ripleContent, setRipleContent }) => {
        const [isEditMode, setIsEditMode] = useState(false);
    
        return (
            <div className="container mx-auto">
                <div className="p-4 rounded-lg shadow-lg bg-gray-100">
                    <button 
                        onClick={() => setIsEditMode(!isEditMode)} 
                        disabled={isLoading}
                        className="mb-2"
                    >
                        {isEditMode ? 'Preview' : 'Edit Raw HTML'}
                    </button>
        
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
                                    value={ripleContent} 
                                    onChange={(e) => setRipleContent(e.target.value)}
                                    className={`w-full p-2 mt-1 rounded border ${isLoading ? 'cursor-not-allowed' : ''}`}
                                    maxLength={255}
                                    disabled={isLoading}
                                    rows={10}
                                />
                            </label>
                        </div>
                    ) : (
                        <div id="riple-card-preview" className="bg-sky-50 border border-slate-300 rounded-lg flex flex-col mx-2 md:mx-5 p-4 mt-4 shadow-md">
                            <RipleCardPreview 
                                ripleTitle={ripleTitle}
                                ripleContent={ripleContent} 
                                projectTitle={projectTitle}
                                projectCoverImageUrl={projectCoverImageUrl}>
                            </RipleCardPreview>  
                        </div>
                    )}
                </div>
            </div>
        );
    };
    
    export default RipleHTMLComponent;