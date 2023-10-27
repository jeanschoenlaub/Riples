import Image from 'next/image';
import { useState } from 'react';
import { NextRightArrowSVG, PrevLeftArrowSVG } from '~/components/reusables/svgstroke';
import { RouterOutputs } from '~/utils/api';
import { buildRiplesImageUrl } from '~/utils/s3';

type RipleCardImagesProps = {
    images: RouterOutputs["riples"]["getAll"][0]["images"];
    isExpanded: boolean;
};

export const RipleCardImages: React.FC<RipleCardImagesProps> = ({ images, isExpanded }) => {

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Helper functions to navigate between images
    const goToNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const goToPreviousImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };
    
    const currentImage = images[currentImageIndex];
    if (!currentImage)return (<div></div>)
    const imageUrl = buildRiplesImageUrl(currentImage.ImageId);

    return (
        <div id="riple-image-section" className="mt-4 flex justify-center relative border border-slate-300">
            {/* Display the current image */}
            {!isExpanded && (
                <>
                <img src={imageUrl} alt={currentImage.caption ?? 'Uploaded preview'} className='responsive-image border border-slate-500' />

                {currentImageIndex > 0 && (  // Check if there's a previous image
                    <div className="absolute top-1/2 transform -translate-y-1/2 left-0">
                        <button onClick={goToPreviousImage}><PrevLeftArrowSVG width="10" height="10"></PrevLeftArrowSVG></button>
                    </div>
                )}
                {currentImageIndex < images.length - 1 && (  // Check if there's a next image
                    <div className="absolute top-1/2 transform -translate-y-1/2 right-0">
                        <button onClick={goToNextImage}><NextRightArrowSVG  width="10" height="10"></NextRightArrowSVG></button>
                    </div>
                )}
                </>
            )}
        </div>
    );
}
