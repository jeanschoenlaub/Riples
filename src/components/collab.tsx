import Link from "next/link"
import toast from "react-hot-toast";
import { api } from "~/utils/api";
import type { RouterOutputs } from '~/utils/api';
import { TaskList } from "~/components//tasklist";
import { useSession } from "next-auth/react";

type ProjectData = RouterOutputs["projects"]["getProjectByProjectId"]
interface CollabTabProps {
    project: ProjectData["project"];
    author?: ProjectData["author"];
  }

export const CollabTab: React.FC<CollabTabProps> = ({ project }) => {
    const { data: session, status } = useSession()
    const loading = status === 'loading'

    if (loading) return null

    console.log(session?.user)  // Access user ID here.
    const { data: projectMembersData, isLoading, isError } = api.projectMembers.getMembersByProjectId.useQuery({ projectId: project.id });

    const ctx = api.useContext();
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
            void ctx.projectMembers.getMembersByProjectId.invalidate()
        }
    })

    let userId: string | null = null;
    
    if (status == "authenticated" ) {
        userId = session.user.id
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error loading project members</div>;
    }

    if (!projectMembersData) {
        return <div>No data</div>; // or some other handling for this scenario
    }

    //helpers to determine if the current user is a Member or the project Lead 
    const isMemberOrPending = projectMembersData.some(({ member }) =>
        member.userId === userId && (member.status === 'APPROVED' || member.status === 'PENDING')
    );
    //const isProjectLead = userId === project.authorID;
    
    return (
        <div>
            {/* TASK TABLE DIV ONLY FOR PROJECT MEMBERS + CREATE TASK */}
            <div id="project-collab-task-table" className="mt-4 ml-2 mb-2 space-y-4">
                {isMemberOrPending && ( 
                    <TaskList project={project} />
                 )} 
            </div>
            {/* JOIN / LEAVE PROJECT SECTION AND BUTTON */}
            <div id="project-collab-how-to-apply" className="mt-4 ml-2 mb-2 space-y-4">
                <section>
                    <ol className="list-decimal list-inside">
                    <li> Read this info page about what to expect: <Link href="/about/collaborate-on-a-riple-project" className="text-blue-500"> How to collaborate on Riples </Link> </li>
                    <li> Sign in to your Riples Account (on the top right)</li>
                    </ol>
                </section>
            </div>

            <div id="project-collab-apply-button" className="mt-4 mb-4 flex justify-center items-center">
                {userId ? ( <>
                    <button className={`text-white rounded py-1 px-2 text-center ${isMemberOrPending ? 'bg-red-500' : 'bg-blue-500'}`} //This is a Aplly Quit button and the logic is handled in router
                        onClick={() => {
                            if (userId) {  // Adding this check ensures userId is not null for typescript
                                const newApplication = {
                                    userId: userId,
                                    projectId: project.id,
                                };
                                mutate(newApplication);
                            }
                        }}
                        disabled={isApplying}
                    >
                        {isApplying ? 'Updating...' : (isMemberOrPending ? 'Quit the project' : 'Join the project')}
                    </button>
                </>
                ) : (
                    <div className="bg-blue-500 text-white rounded py-1 px-2 text-center">You must be signed in to apply.</div>
                )}
            </div>
        </div>
    )
}