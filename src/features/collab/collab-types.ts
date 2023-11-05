type CreateForumQuestionPayload = {
    projectId: string;
    content: string;
};
  
type Follower = {
    userId: string;
};

type CreateForumAnswerPayload = {
    questionId: string;
    content: string;
    authorId: string;
    projectId: string;
 };