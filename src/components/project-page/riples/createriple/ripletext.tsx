import React, { useRef } from 'react';
import { LoadingRiplesLogo } from '~/components/reusables/loading';
import { api } from '~/utils/api';
import { buildRiplesImageUrl } from '~/utils/s3';

type RipleTextComponentProps = {
    ripleTitle: string;
    setRipleTitle: React.Dispatch<React.SetStateAction<string>>;
    ripleContent: string;
    setRipleContent: React.Dispatch<React.SetStateAction<string>>;
    isLoading: boolean;
    ripleImages: { url: string; id: string; caption: string }[];
    setRipleImages: React.Dispatch<React.SetStateAction<{ url: string; id: string; caption: string }[]>>;
}

const RipleTextComponent: React.FC<RipleTextComponentProps> = ({ 
    ripleTitle, 
    setRipleTitle, 
    isLoading, 
    ripleContent, 
    setRipleContent,
    ripleImages,
    setRipleImages
}) => {

    const { file, setFile, isUploading, uploadImage } = useRipleImageUpload();


    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile); // Assuming setFile is used somewhere else; otherwise, remove this line
            
            uploadImage() // assuming uploadImage doesn't need any parameter like projectId in the other function
            .then(newImageId => {
                const newImageUrl = buildRiplesImageUrl(newImageId); 
                // Add the new image details to ripleImages
                const newImage = { url: newImageUrl, id: newImageId, caption: '' };
                setRipleImages(prev => [...prev, newImage]);
            })
            .catch(error => {
                console.error("Error uploading riple image:", error);
            });
        }
    };
    


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
                            maxLength={10000}
                            disabled={isLoading}
                            rows={10}
                        />
                    </div>

                    {/* Image Section */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-4">Images</h2>
                        <input type="file" onChange={handleImageUpload} multiple={false} />
                        
                        {/* Display the uploaded images */}
                        {ripleImages.map((image, index) => (
                            <div key={index} className="mt-4">
                                <img src={image.url} alt="Uploaded preview" className="w-32 h-32 object-cover" />
                                <input 
                                    type="text" 
                                    placeholder="Caption" 
                                    value={image.caption} 
                                    onChange={(e) => {
                                        const updatedImages = [...ripleImages];
                                        if (updatedImages[index]) {
                                            updatedImages[index]!.caption = e.target.value;
                                            setRipleImages(updatedImages);
                                        }
                                    }}
                                    className="mt-2 w-full p-2 rounded border"
                                />
                            </div>
                        ))}

                        {isUploading &&  <LoadingRiplesLogo isLoading={isUploading}></LoadingRiplesLogo>}
                    </div>
                </div>
            </div>
        </div>
    );
};


export const useRipleImageUpload = () => {
    const apiContext = api.useContext();

    const handleSuccess = async () => {
        //await apiContext.riples.getRipleById.invalidate();
    };

    const { mutateAsync: createPresignedUrlAsyncMutation, isLoading: isUploading } = api.riples.createRipleImagePresignedUrl.useMutation({
        onSuccess: handleSuccess,
    });

    const fileRef = useRef<File | null>(null);

    const uploadImage = async (): Promise<string> => {
        if (!fileRef.current) {
            console.error("File ref is empty.");
            throw new Error("No file selected");
        }

        try {
            const { url, fields } = await createPresignedUrlAsyncMutation();

            if (!fields.key) {
                console.error("Unexpected response: 'fields.key' is missing.");
                throw new Error("Unexpected server response");
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data: Record<string, any> = {
                ...fields,
                "Content-Type": fileRef.current.type,
                file: fileRef.current,
            };

            const formData = new FormData();
            for (const name in data) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                formData.append(name, data[name]);
            }

            await fetch(url, {
                method: "POST",
                body: formData,
            });

            const newImageId = fields.key.split("/")[1] ?? "";  // Extract new ID from the result's key field
            return newImageId;

        } catch (e) {
            console.error("Error in uploadImage:", e);
            throw e;
        }
    };

    return {
        file: fileRef.current,
        setFile: (newFile: File | null) => {
            fileRef.current = newFile;
        },
        isUploading,
        uploadImage,
    };
};


export default RipleTextComponent;
