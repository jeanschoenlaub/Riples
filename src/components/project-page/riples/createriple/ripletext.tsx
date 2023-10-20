import React from 'react';


type RipleTextComponentProps = {
    ripleTitle: string;
    setRipleTitle: React.Dispatch<React.SetStateAction<string>>;
    ripleContent: string;
    setRipleContent: React.Dispatch<React.SetStateAction<string>>;
    isLoading: boolean;
}

const RipleTextComponent: React.FC<RipleTextComponentProps> = ({ ripleTitle, setRipleTitle, isLoading, ripleContent, setRipleContent }) => {
    return (
        <div className="container mx-auto">
            <div className="p-4 rounded-lg shadow-lg bg-gray-100">
                <div className="text-center mb-4">
                    <h1 className="text-xl font-semibold">Create New Riple</h1>
                </div>
                <div className="mb-6">
                    <div className="flex items-center mb-4">
                        <label htmlFor="ripleTitle" className="text-base w-24 font-semibold mr-3">
                            Title *
                        </label>
                        <input
                            id="ripleTitle"
                            type="text"
                            value={ripleTitle}
                            onChange={(e) => setRipleTitle(e.target.value)}
                            className={`w-full p-2 mt-1 rounded border ${isLoading ? 'cursor-not-allowed' : ''}`}
                            maxLength={255}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="flex items-start mb-4">
                        <label htmlFor="ripleContent" className="text-base font-semibold w-24 mr-3 mt-2">
                            Content *
                        </label>
                        <textarea 
                            id="ripleContent"
                            value={ripleContent} 
                            onChange={(e) => setRipleContent(e.target.value)}
                            className={`w-full p-2 mt-1 rounded border ${isLoading ? 'cursor-not-allowed' : ''}`}
                            maxLength={255}
                            disabled={isLoading}
                            rows={10}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RipleTextComponent;
