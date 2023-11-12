import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { useCollabMutation } from './collab-apis';
import { useSession } from 'next-auth/react';
import type { RouterOutputs } from '~/utils/api';
import { NavBarSignInModal } from '../navbar/signinmodal';
import { ProfileImage } from '~/components';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
dayjs.extend(relativeTime);

import Link from 'next/link';

type QuestionType = RouterOutputs["forum"]["getForumQuestionsByProjectId"][number];
type AnswerType = QuestionType['answers'][number]; // This extracts the type of a single answer

interface ForumAnswersComponentProps {
   questionId: string;
   projectId: string;
   existingAnswers: AnswerType[]; // replace AnswerType with the correct type for your answers
}

export const ForumAnswersComponent: React.FC<ForumAnswersComponentProps> = ({ questionId, projectId, existingAnswers }) => {
    const [showSignInModal, setShowSignInModal] = useState(false); // If click on folllow when not signed in we redirect
    const [answerInput, setAnswerInput] = useState<string>('');

    const { data: session } = useSession()
    // Use the custom hook to get the createForumAnswer function
    const { isCreatingAnswer,  createForumAnswer  } = useCollabMutation();


    // Handle the logic for creating a new answer
    const handleCreateAnswer = () => {
        if (!session?.user?.id) {
        toast.error("You must be signed in to create a project")
        setShowSignInModal(true); // Show sign-in modal if the user is not logged in
        } 
        else if (answerInput.trim()) {
        const payload = generateCreateAnswerPayload();
        createForumAnswer(payload).then(() => {
            toast.success('Answer posted successfully!');
            setAnswerInput('');
        })
        .catch(() => {
            toast.error('Error posting answer');
        });
        }
    };

    // Generate the payload for creating an answer
    const generateCreateAnswerPayload = (): CreateForumAnswerPayload => {
        return {
        questionId: questionId,
        content: answerInput,
        authorId: session!.user.id, // Replace `user.id` with the actual author's user ID
        projectId: projectId, // Replace `project.id` with the actual project ID
        };
    };


    return (
        <>
        {existingAnswers.map((answer, index) => (
            <tr key={index} className="bg-white border-b">
                {/* Answer content */}
                <td></td>
                <td className="px-6 py-4">
                    <p className="text-gray-700">{answer.content}</p>
                    {/* Additional answer details can be placed here */}
                </td>

                {/* Answer user info */}
                <td className="px-6 py-4">
                    <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-500">
                            <span className="ml-1 flex items-center text-black font-normal  ">
                                <div id="project-lead-profile-image" className="flex items-center ">
                                    <Link href={`/users/${answer.user.id}`}>
                                            <ProfileImage
                                                username={answer.user.username}
                                                email={answer.user.email}
                                                image={answer.user.image}
                                                name={answer.user.name}
                                                size={32}
                                            />
                                        </Link>
                                </div>
                                <Link href={`/users/${answer.user.id}`} className="ml-2">
                                        {answer.user.username}
                                </Link>
                            </span>
                        </div>
                    </div>
                    <div className="flex text-sm text-gray-500">
                          <span className="mr-1">{`${dayjs(answer.createdAt).fromNow()}`}</span>
                    </div>
                </td>
            </tr>
        ))}
        
       <tr className="bg-white border-b">
            <td className="px-6 py-4" colSpan={3}>
                <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Type your answer here..."
                        className="flex-1 p-2 border rounded"
                        value={answerInput}  // Controlled input
                        disabled={isCreatingAnswer}
                        onChange={(e) => setAnswerInput(e.target.value)}  // Update state on change
                      />
                      <button
                        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={handleCreateAnswer}
                        disabled={isCreatingAnswer}
                      >
                        Submit
                      </button>
                </div>
            </td>
        </tr>
         <NavBarSignInModal showModal={showSignInModal} onClose={() => setShowSignInModal(false)} />
     </>
    );
};
