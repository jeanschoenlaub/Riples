import { api } from "~/utils/api";
import { Modal } from "~/components/reusables/modaltemplate";
import { uniqueNamesGenerator, adjectives, colors, animals } from "unique-names-generator";
import { useState } from "react";
import { useSession } from "next-auth/react";

export const NavBarUserNameModal: React.FC<{ showModal: boolean; onClose: () => void }> = ({ showModal, onClose }) => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false); 

  const shouldExecuteQuery = !!session?.user?.id; // Run query only if session and user id is not null
  
  // Conditional query using tRPCto avoid no user error if not signed-in
  const userQuery = api.users.getUserByUserId.useQuery(
    { userId: session?.user?.id ?? "" },
    { enabled: shouldExecuteQuery }
  );

  const userMutation = api.users.updateUsername.useMutation();
  const [username, setUsername] = useState(userQuery.data?.user.username ?? "");

  const handleClose = () => {
    onClose();
  };

  console.log(showModal)

  if (session) {
    return (
        <Modal showModal={showModal} isLoading={isLoading} size="medium">
          <div className="flex flex-col">
          <div> Username: </div>
          <div className="flex flex-wrap items-center justify-between">
            <input
              className="border p-2 flex-grow"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button className="bg-blue-500 text-white rounded px-4 py-2 ml-2 flex items-center" onClick={() => {
              const randomName = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] });
              setUsername(randomName);
            }}>
              <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 22 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16.5A2.493 2.493 0 0 1 6.51 18H6.5a2.468 2.468 0 0 1-2.4-3.154 2.98 2.98 0 0 1-.85-5.274 2.468 2.468 0 0 1 .921-3.182 2.477 2.477 0 0 1 1.875-3.344 2.5 2.5 0 0 1 3.41-1.856A2.5 2.5 0 0 1 11 3.5m0 13v-13m0 13a2.492 2.492 0 0 0 4.49 1.5h.01a2.467 2.467 0 0 0 2.403-3.154 2.98 2.98 0 0 0 .847-5.274 2.468 2.468 0 0 0-.921-3.182 2.479 2.479 0 0 0-1.875-3.344A2.5 2.5 0 0 0 13.5 1 2.5 2.5 0 0 0 11 3.5m-8 5a2.5 2.5 0 0 1 3.48-2.3m-.28 8.551a3 3 0 0 1-2.953-5.185M19 8.5a2.5 2.5 0 0 0-3.481-2.3m.28 8.551a3 3 0 0 0 2.954-5.185"/>
              </svg>
            </button>
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <button className="bg-green-500 text-white rounded px-4 py-2" onClick={() => {
              setIsLoading(true); // Set loading state
              userMutation.mutate(
                {
                  userId: session.user.id,
                  username: username,
                },
                {
                  onSuccess: () => {
                    userQuery.refetch().catch((err) => {
                      console.error(err);
                    });
                    setIsLoading(false); // Unset loading state
                    handleClose();
                  },
                }
              );
            }}>
              Save
            </button>
            <button className="bg-red-500 text-white rounded px-4 py-2" onClick={handleClose}>
              Close
            </button>
          </div>
        </div>
      </Modal>
    );
  } 
};