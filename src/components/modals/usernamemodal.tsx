import { api } from "~/utils/api";
import { Modal } from "~/components/modals/modaltemplate";
import { uniqueNamesGenerator, adjectives, colors, animals } from "unique-names-generator";
import { useState } from "react";
import { useSession } from "next-auth/react";

export const UserNameModal: React.FC<{ showModal: boolean; onClose: () => void }> = ({ showModal, onClose }) => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false); 
  const userQuery = api.users.getUserByUserId.useQuery({ userId: session?.user.id || "forTsButShouldNeverBeCalled" });
  const userMutation = api.users.updateUsername.useMutation();
  const [username, setUsername] = useState("");

  const handleClose = () => {
    onClose();
  };

  if (session) {
    return (
        <Modal showModal={showModal} isLoading={isLoading} size="medium">
        <div className="flex flex-col items-center justify-center">
          <div className="pb-5 text-3xl">On-Boarding!</div>
          <h1 className="pb-5">Please add a username to complete account creation</h1>

          <input
            type="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 mt-1 rounded border" // 3. Styling
            maxLength={100} // 3. Max Length
          />
        </div>

        <div className="flex items-center space-x-2">
          <button className="bg-blue-500 text-white rounded px-4 py-2 mb-2" onClick={() => {
            const randomName = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] });
            setUsername(randomName);
          }}>
            Generate Name
          </button>
          <button className="bg-green-500 text-white rounded px-4 py-2 mb-2" onClick={() => {
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
            Submit
          </button>
          <button className="bg-red-500 text-white rounded px-4 py-2 mb-2" onClick={handleClose}>
            Close
          </button>
        </div>
      </Modal>
    );
  } else {
    return ("error shoudl be logged in to access this modal"); 
  }
};