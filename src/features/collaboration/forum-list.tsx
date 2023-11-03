import React, { useEffect, useState } from 'react';
import type { RouterOutputs} from "~/utils/api";
import { api } from "~/utils/api";
import { ProfileImage, LoadingRiplesLogo, StyledTable, UpArrowSVG, DownArrowSVG } from '~/components';
import { useCollabMutation } from './collab-apis';
import toast from 'react-hot-toast';


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
  
  const { data: followers } = api.projectFollowers.getFollowersByProjectId.useQuery({ projectId: project.id });
  const { isCreatingQuestion, createForumQuestion } = useCollabMutation(followers);

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

  let headers = isMobile ? ["Question", "Details"] : ["Replies", "Question", "Posted By", "Created At"];
let columnWidths = isMobile ? ["50%", "50%"] : ["10%", "40%", "25%", "15%"];

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
          placeholder="Type your question here" 
          className="py-2 px-4 rounded grow focus:outline-none focus:border-gray-500 border-2"
        />
        <button 
          onClick={handleCreateQuestion}
          className="bg-green-500 text-white text-xs md:text-base rounded px-4 py-2 hover:bg-green-600 focus:outline-none focus:border-green-700 focus:ring focus:ring-blue-200"
        >
          Create Question
        </button>
      </div>
    )}
    <div className="relative overflow-x-auto ml-2 mb-2 mr-2 shadow-md sm:rounded-lg">
      <StyledTable headers={headers} columnWidths={columnWidths}>
        {forumData.map((question, index) => (
          <React.Fragment key={question.id}>
            <tr className="bg-white border-b items-center ">
              {/* Replies Toggle */}
              {!isMobile && (
                <td className="px-6 py-2" style={{ width: columnWidths[0] }}>
                  <button onClick={() => handleArrowClick(question.id)} className="text-blue-600">
                    {displayAnswers === question.id ? (
                      <span>{`${question.answers.length}`} <UpArrowSVG width='5' height='5'/></span>
                    ) : (
                      <span>{`${question.answers.length}`} <DownArrowSVG width='5' height='5' /></span>
                    )}
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
                  {question.user.name}
                </td>
              )}

              {/* Created At */}
              {!isMobile && (
                <td className="px-6 py-2" style={{ width: columnWidths[3] }}>
                  {new Date(question.createdAt).toLocaleDateString()}
                </td>
              )}
            </tr>

            {/* Conditionally display answers */}
            {displayAnswers === question.id && (
              <tr className="bg-white border-b ">
                <td colSpan={headers.length} className="px-6 py-4">
                  {/* Answers here */}
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </StyledTable>
    </div>
  </div>
)};