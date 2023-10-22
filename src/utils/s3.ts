const S3_BASE_URL = process.env.NEXT_PUBLIC_S3_PUBLIC_IMAGES_BUCKET 
    ? `https://${process.env.NEXT_PUBLIC_S3_PUBLIC_IMAGES_BUCKET}.s3.us-west-2.amazonaws.com/project-cover-images`
    : '';

export const buildImageUrl = (imageId: string) => {
    return `${S3_BASE_URL}/${imageId}`;
};
