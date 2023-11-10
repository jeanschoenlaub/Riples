import React, { useEffect, useState } from 'react';
import type { RouterOutputs} from "~/utils/api";
import { api } from "~/utils/api";
import { ProfileImage, LoadingRiplesLogo, StyledTable, UpArrowSVG, DownArrowSVG, ExternalLinkSVG, LoadingSpinner } from '~/components';
import { useCollabMutation } from './collab-apis';
import toast from 'react-hot-toast';
import Link from 'next/link';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
import { useSession } from 'next-auth/react';
import { ForumAnswersComponent } from './answers';
dayjs.extend(relativeTime);


interface ForumProps {
  project: ProjectData["project"];
  isMember: boolean,
  isPending: boolean
  isProjectLead: boolean
}

type ProjectData = RouterOutputs["projects"]["getProjectByProjectId"];

export const Forum: React.FC<ForumProps> = ({ project, isMember, isProjectLead}) => {

  const [displayAnswers, setDisplayAnswers] = useState<string | null>(null);
  const [questionInput, setQuestionInput] = useState('');
  
  const { data: forumData, isLoading: isLoadingForum, isError } = api.forum.getForumQuestionsByProjectId.useQuery({ projectId: project.id });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);  // Assuming mobile devices have a width of 768px or less
  const { data: session } = useSession()
  const { data: followers } = api.projectFollowers.getFollowersByProjectId.useQuery({ projectId: project.id });
  // Use the custom hook to get the createForumAnswer function
  const { isCreatingQuestion, createForumQuestion, } = useCollabMutation(followers);

  // Handle the logic for creating a new question
  const handleCreateQuestion = () => {
    if (questionInput.trim()) {
      const payload = generateCreateQuestionPayload();
      createForumQuestion(payload).then(() => {
        toast.success('Question created successfully!');
        setQuestionInput(''); // Clear input field after submission
      })
      .catch(() => {
        toast.error('Error creating question');
      });
    }
  };
  
  const generateCreateQuestionPayload = (): CreateForumQuestionPayload => {
    return {
      projectId: project.id, // Assume `project` is available in your component's scope
      content: questionInput,
    };
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, []);

  const isLoading = isLoadingForum 

  if (isLoading) return <div className="flex justify-center"><LoadingRiplesLogo isLoading={isLoading}/></div>;
  if (isError || !forumData) return <p>Error loading tasks.</p>;

  const headers = isMobile ? ["Question", "Details"] : ["Replies", "Question", "Posted By"];
  const columnWidths = isMobile ? ["50%", "50%"] : ["10%", "50%", "20%"];

  const handleArrowClick = (questionId: string) => {
    if (displayAnswers === questionId) {
      setDisplayAnswers(null);
    } else {
      setDisplayAnswers(questionId);
    }
  };

  return (
    <div className='mb-10'>
      <div className='text-lg font-semibold py-2 ml-4 '> Forum Questions </div> 
      {(isMember || isProjectLead) && (
        <div className="mb-2 ml-2 mr-2 flex items-center space-x-2">
          <input 
            type="text" 
            value={questionInput} 
            onChange={(e) => setQuestionInput(e.target.value)}
            disabled={isCreatingQuestion}
            placeholder="Type your question here" 
            className="py-2 px-4 rounded grow focus:outline-none focus:border-gray-500 border-2"
          />
          <button 
            onClick={handleCreateQuestion}
            disabled={isCreatingQuestion}
            className="bg-green-500 text-white text-xs md:text-base rounded px-4 py-2 hover:bg-green-600 focus:outline-none focus:border-green-700 focus:ring focus:ring-blue-200"
          >
            Create Question
            {isCreatingQuestion && <LoadingSpinner size={16}></LoadingSpinner>}
          </button>
        </div>
      )}
      <div className="relative overflow-x-auto ml-2 mb-2 mr-2 shadow-md sm:rounded-lg">
        <StyledTable headers={headers} columnWidths={columnWidths}>
          {forumData.map((question, index) => (
            <React.Fragment key={question.id}>
            <tr className="bg-white border-b items-center">
              {/* Replies Toggle */}
              {!isMobile && (
                <td className="px-12 justify-center py-2 table-cell" style={{ width: columnWidths[0] }}>
                  <button onClick={() => handleArrowClick(question.id)} className="flex text-blue-600 justify-center items-center">
                    <div className='flex flex-col items-center'>
                      {/* Content remains unchanged */}
                      {displayAnswers === question.id ? (
                        <>
                          <span className="text-sm">{`${question.answers.length}`}</span>
                          <UpArrowSVG width='5' height='5'/>
                        </>
                      ) : (
                        <>
                          <span className="text-sm">{`${question.answers.length}`}</span>
                          <DownArrowSVG width='5' height='5' />
                        </>
                      )}
                    </div>
                  </button>
                  </td>
                )}
                
                {/* Question Details */}
                <td className="px-6 py-2 overflow-x-auto whitespace-nowrap font-medium text-gray-900 no-scrollbar" style={{ width: columnWidths[1] }}>
                  <div className="text-blue-600 hover:underline">
                    {question.content}
                  </div>
                </td>

                {/* Posted By */}
                {!isMobile && (
                  <td className="px-6 py-2" style={{ width: columnWidths[2] }}>
                     <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-500">
                              <span className="ml-1 flex items-center text-black font-normal  ">
                                  <div id="project-lead-profile-image" className="flex items-center ">
                                      <Link href={`/users/${question.user.id}`}>
                                      <ProfileImage username={question.user.username} email={question.user.email} image={question.user.image} name={question.user.name} size={32} />
                                      </Link>
                                  </div>
                                  <Link href={`/users/${question.user.id}`} className="ml-2">
                                      {question.user.username}
                                  </Link>
                              </span>
                          </div>
                      </div>
                      <div className="flex text-sm text-gray-500">
                          <span className="mr-1">{`${dayjs(question.createdAt).fromNow()}`}</span>
                          <span className="flex items-center text-sm text-sky-500 hover:text-sky-700 hover:underline">
                            on project &nbsp;
                            <Link className='text-base hover:text-sky-700 hover:underline' href={`/projects/${question.projectId}`}>
                              <ExternalLinkSVG width='4' height='4' />
                            </Link>
                          </span>
                      </div>
                      <div>
                      </div>
                  </td>
                )}
              </tr>

              {displayAnswers === question.id && (
                    <ForumAnswersComponent projectId={project.id} questionId={displayAnswers} existingAnswers={question.answers}></ForumAnswersComponent>
              )}
            </React.Fragment>
          ))}
        </StyledTable>
      </div>
    </div>
)};