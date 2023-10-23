import Image from 'next/image';
import Tooltip from '../reusables/tooltip';
import { useEffect, useRef, useState } from 'react';
import { api } from '~/utils/api';
import { buildProjectCoverImageUrl } from '~/utils/s3';
import { LoadingRiplesLogo } from '../reusables/loading';

interface ProjectCoverImageProps {
    coverImageId: string;
    projectId: string;
}

//TO-DO
interface Fields {
    key: string;
    bucket: string;
    Policy?: string;  // This is optional since it might not always be present.
    [key: string]: string | undefined;  // This is for any additional properties that might appear in the object.
}

const ProjectCoverImage: React.FC<ProjectCoverImageProps> = ({ coverImageId, projectId }) => {
    const [imageUrl, setImageUrl] = useState(buildProjectCoverImageUrl(coverImageId));
    const [imageChanging, setImageChanging] = useState(false);

    const { file, setFile, isUploading, uploadImage} = useProjectCoverImageUpload();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setImageChanging(true);
            uploadImage(projectId)
            .then(newCoverImageId => {
                const newUrl = buildProjectCoverImageUrl(newCoverImageId) + `?timestamp=${Date.now()}`;
                setImageUrl(newUrl);
                setImageChanging(false);
            })
            .catch(err => {
                setImageChanging(false);
                console.error("Error uploading project cover Image");
            });
        }
    };
    

    //For reloading when navigating between projects 
    useEffect(() => {
        const newUrl = buildProjectCoverImageUrl(coverImageId);
        setImageUrl(newUrl);
    }, [coverImageId]);

    return (
        <div>
            <div id="project-main-cover-image" className="hidden border-b border-l border-gray-500 md:flex group relative w-full h-[35vh] overflow-hidden justify-center items-center">
                {(isUploading || imageChanging)?  ( <LoadingRiplesLogo isLoading={isUploading}></LoadingRiplesLogo>) : (
                <Image 
                key={imageUrl}
                src={imageUrl} 
                alt="Project cover image" 
                layout="fill" 
                objectFit="cover"
            />)}
    
                <div className="absolute top-0 right-0 flex flex-row items-end mb-4 mr-2 transition-opacity duration-300">
                    <Tooltip content="The feature of repositioning project cover image is coming soon." shiftRight={true} width="200px">
                        <span>
                            <button className="py-1 px-2 mt-4 bg-sky-100 text-black cursor-not-allowed" disabled>
                                Reposition
                            </button>
                        </span>
                    </Tooltip>
                </div>
                <div className="absolute bottom-0 right-0 flex flex-row items-end mb-4 mr-2 transition-opacity duration-300">
                  
                    <span className="mb-1">
                        <label 
                            htmlFor="replaceImageInput"
                            className="py-2 px-2 bg-sky-100  text-black cursor-pointer"
                        >
                            Upload Cover Image
                        </label>
                    </span>

                    
                    </div>
                    <input 
                        type="file" 
                        id="replaceImageInput"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
            </div>
        </div>
    );  
}

export const useProjectCoverImageUpload = () => {
    const apiContext = api.useContext();

    const handleSuccess = async () => {
        await apiContext.projects.getProjectByProjectId.invalidate();
      };
      

    const { mutateAsync: createPresignedUrlAsyncMutation, isLoading: isUploading } = api.projects.createPresignedUrl.useMutation({
        onSuccess: handleSuccess,
    });

    const fileRef = useRef<File | null>(null);  // Create a ref for the file

    const uploadImage = async (projectId: string): Promise<string> => {
        if (!fileRef.current) {
            console.error("File ref is empty.");
            throw new Error("No file selected");
        }

        try {
            const { url, fields } = await createPresignedUrlAsyncMutation({
                projectId,
            });

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

            const newCoverImageId = fields.key.split("/")[1] ?? "";  // Extract new ID from the result's key field
            return newCoverImageId;

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




export default ProjectCoverImage;
