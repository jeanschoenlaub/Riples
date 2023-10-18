
export  interface AddlikePayload {
    ripleId: string;
    projectId: string;
    ripleAuthorID: string;
    ripleTitle: string;
    username: string;
}

export interface AddCommentPayload {
    ripleId: string;
    projectId: string;
    ripleAuthorID: string;
    ripleTitle: string;
    username: string;
    content: string;
}
