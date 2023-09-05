import { useUser } from "@clerk/nextjs";
import Link from "next/link"
import toast from "react-hot-toast";
import { RouterOutputs, api } from "~/utils/api";

type ProjectData = RouterOutputs["projects"]["getProjectByProjectId"]
interface CollabTabProps {
    project: ProjectData["project"];
    author?: ProjectData["author"];
  }

export const CollabTab: React.FC<CollabTabProps> = ({ project }) => {
    const user = useUser(); // logged in user
    let userId: string | null = null;

    if (user.user) {
        userId = user.user.id;
    }

    const { data: projectMembersData, isLoading, isError } = api.projectMembers.getMembersByProjectId.useQuery({ projectId: project.id });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error loading project members</div>;
    }

    if (!projectMembersData) {
        return <div>No data</div>; // or some other handling for this scenario
    }

    const projectMembers = projectMembersData.members;

    // Now, it is assumed that projectMembers is an array
    const isMemberOrPending = projectMembers.some(member => 
        member.userID === userId && (member.status === 'APPROVED' || member.status === 'PENDING')
    );

    const {mutate, isLoading: isApplying}  = api.projects.applyToProject.useMutation({
        onError: (e) => {
          console.error("Mutation error: ", e);
          const errorMessage = e.data?.zodError?.fieldErrors.content
          if (errorMessage?.[0]){
            toast.error(errorMessage[0])
          }
          else {toast.error("Application failed ! Please try again later")}
        },
        onSuccess: (data) => {
            console.log("Mutation successful, data: ", data);
        }
    })
  
    
    return (
        <div>
            <div id="project-collab-how-to-apply" className="mt-4 ml-2 mb-2 space-y-4">
                <section>
                    <ol className="list-decimal list-inside">
                    <li> Read this info page about what to expect: <Link href="/about/collaborate-on-a-riple-project" className="text-blue-500"> How to collaborate on Riples </Link> </li>
                    <li> Sign in to your Riples Account (on the top right)</li>
                    <li> Join us: </li>
                    </ol>
                </section>
            </div>

            <div id="project-collab-apply-button" className="mt-4 mb-4 flex justify-center items-center">
                {userId ? (
                    <>
                        {isMemberOrPending ? (
                            <div>Application Processing</div>
                        ) : (
                            <button 
                                onClick={() => {
                                    if (userId) {  // Adding this check ensures userId is not null
                                        const newApplication = {
                                            userId: userId,
                                            projectId: project.id,
                                        };
                                        
                                        mutate(newApplication);
                                    }
                                }}
                                disabled={isApplying}
                            >
                                {isApplying ? 'Applying...' : 'Join the project'}
                            </button>
                        )}
                    </>
                ) : (
                    <div>You must be signed in to apply.</div>
                )}
            </div>
        </div>
    )
}