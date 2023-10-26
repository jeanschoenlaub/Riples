import Image from 'next/image';
import { useState } from 'react';
import { RouterOutputs } from '~/utils/api';
import { buildRiplesImageUrl } from '~/utils/s3';

type RipleCardImagesProps = {
    images: RouterOutputs["riples"]["getAll"][0]["images"];
};

export const RipleCardImages: React.FC<RipleCardImagesProps> = ({ images }) => {

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Helper functions to navigate between images
    const goToNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const goToPreviousImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };
    
    return (
        <div className="mt-4">
            {images.map((image, index) => {
                const imageUrl = buildRiplesImageUrl(image.ImageId); // Assuming buildRiplesImageUrl is a function you've created elsewhere
                console.log("images url"+imageUrl)
                return (
                    <div key={index}>
                        <img
                            src={imageUrl} 
                            alt={image.caption || 'Uploaded preview'}
                        />
                    </div>
                );
            })}
        </div>
    );
}
