import Image from 'next/image';
import Tooltip from '../reusables/tooltip';
import { useRef, useState } from 'react';
import { api } from '~/utils/api';
import { buildImageUrl } from '~/utils/s3';
import { LoadingRiplesLogo } from '../reusables/loading';

interface ProjectCoverImageProps {
    coverImageId: string;
    projectId: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB for example, adjust as needed

const ProjectCoverImage: React.FC<ProjectCoverImageProps> = ({ coverImageId, projectId }) => {
    const [imageUrl, setImageUrl] = useState(buildImageUrl(coverImageId));
    const [imageChanging, setImageChanging] = useState(false);


    const { file, setFile, isUploading, uploadImage} = useProjectCoverImageUpload();


    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            try {
                setImageChanging(true);
                const newCoverImageId = await uploadImage(projectId);
                const newUrl = buildImageUrl(newCoverImageId) + `?timestamp=${Date.now()}`;
                setImageUrl(newUrl);
                setImageChanging(false);
            } catch (err) {
                setImageChanging(false);
                console.error("Error uploading project cover Image");
            }
        }
    };

    return (
        <div>
            <div id="project-main-cover-image" className="hidden md:flex group relative w-full h-[30vh] overflow-hidden justify-center items-center">
                {(isUploading || imageChanging)?  ( <LoadingRiplesLogo isLoading={isUploading}></LoadingRiplesLogo>) : (
                <Image 
                key={imageUrl}
                src={imageUrl} 
                alt="Project cover image" 
                layout="fill" 
                objectFit="cover"
                onLoad={() => console.log("Loading image from:", imageUrl)} // Log here
            />)}
    
                {/* Hover buttons */}
                <div className="absolute bottom-0 right-0 flex flex-col items-end mb-2 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Tooltip content="Upload your own picture" shiftRight={true} width="200px">
                        <span className="mb-2">
                            <label 
                                htmlFor="replaceImageInput"
                                className="m-2 py-1 px-2 bg-sky-100 text-black cursor-pointer"
                            >
                                Upload
                            </label>
                        </span>
                    </Tooltip>
                    <Tooltip content="The feature of repositioning picture is coming." shiftRight={true} width="200px">
                        <span>
                            <button className="m-2 py-1 px-2 bg-sky-100 opacity-70 text-black cursor-not-allowed" disabled>
                                Reposition
                            </button>
                        </span>
                    </Tooltip>
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

            const data: Record<string, any> = {
                ...fields,
                "Content-Type": fileRef.current.type,
                file: fileRef.current,
            };

            const formData = new FormData();
            for (const name in data) {
                formData.append(name, data[name]);
            }

            await fetch(url, {
                method: "POST",
                body: formData,
            });
            console.log("fields:"+fields.key.split("/")[1] )
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
