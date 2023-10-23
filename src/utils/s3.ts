const S3_BASE_URL = process.env.NEXT_PUBLIC_S3_PUBLIC_IMAGES_BUCKET 
    ? `https://${process.env.NEXT_PUBLIC_S3_PUBLIC_IMAGES_BUCKET}.s3.us-west-2.amazonaws.com`
    : '';

export const buildProjectCoverImageUrl = (imageId: string) => {
    return `${S3_BASE_URL}/project-cover-images/${imageId}`;
};


export const buildRiplesImageUrl = (imageId: string) => {
    return `${S3_BASE_URL}/riple-images/${imageId}`;
};
