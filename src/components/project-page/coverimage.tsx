import Image from 'next/image';
import Tooltip from '../reusables/tooltip';
import { useState } from 'react';
import { api } from '~/utils/api';

interface ProjectCoverImageProps {
    coverImageId: string;
    projectId: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB for example, adjust as needed

const ProjectCoverImage: React.FC<ProjectCoverImageProps> = ({ coverImageId, projectId }) => {
    const uploadMutation = api.projects.createPresignedUrl.useMutation();
    const [file, setFile] = useState<File | null>(null);

    const s3BaseUrl = 'https://riples-public-images-08453786.s3.us-west-2.amazonaws.com';
    const imageUrl = `${s3BaseUrl}/${coverImageId}`;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) setFile(selectedFile);
    };
    
    const handleUploadClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (file) uploadImage();
    };
  
    const uploadImage = async () => {
        console.log("triggered")
        if (!file) return;
    
        const { url, fields } = await uploadMutation.mutateAsync({
            projectId,
        });
    
        console.log("url", url);
    
        const data: Record<string, any> = {
            ...fields,
            "Content-Type": file.type,
            file,
        };
    
        const formData = new FormData();
        for (const name in data) {
            formData.append(name, data[name]);
        }
    
        await fetch(url, {
            method: "POST",
            body: formData,
        });
    
        // refetchImages();
        setFile(null);
        // if (fileRef.current) {
        //   fileRef.current.value = "";
        // }
    };
      
    return (
        <div>
            <div id="project-main-cover-image" className="hidden md:flex group relative w-full h-[30vh] overflow-hidden">
                <Image 
                    src={imageUrl} 
                    alt="Project cover image" 
                    layout="fill" 
                    objectFit="cover"
                />
    
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
                            <button
                                className="m-2 py-1 px-2 bg-sky-100 text-black"
                                onClick={handleUploadClick}
                            >
                                Upload
                            </button>
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

export default ProjectCoverImage;
