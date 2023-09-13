import { api } from "~/utils/api";
import { Modal } from "~/components/modals/modaltemplate";
import { uniqueNamesGenerator, adjectives, colors, animals } from "unique-names-generator";
import { useState } from "react";
import { useSession } from "next-auth/react";

export function OnboardingWrapper({ children }: any) {
  const { data: session } = useSession();
  const userQuery = api.users.getUserByUserId.useQuery({ userId: session?.user.id || "forTsButShouldNeverBeCalled" });
  const userMutation = api.users.updateUsername.useMutation();
  const [username, setUsername] = useState("");
  const [showModal, setShowModal] = useState(true);

  const handleClose = () => {
    setShowModal(false);
  };

  if (session) {
    if (userQuery.status !== "success") {
      return <p>Loading...</p>;
    }

    if (userQuery.data?.user.username === "") {
      return (
        <Modal showModal={showModal} size="medium">
          <div className="flex flex-col items-center justify-center">
            <div className="pb-5 text-3xl">On-Boarding!</div>
            <h1 className="pb-5">Please add a username to complete account creation</h1>
            
            
            {/* Input field */}
            <input
              type="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center space-x-2">
            <button className="bg-blue-500 text-white rounded px-4 py-2 mb-2"
                    onClick={() => {
                const randomName = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] });
                setUsername(randomName);
              }}>
                Generate Name
              </button>
              <button className="bg-green-500 text-white rounded px-4 py-2 mb-2" 
                      onClick={() => {
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
                      setShowModal(false);
                    },
                  }
                );
              }}>
                Submit
              </button>

              <button
              onClick={handleClose}
              className="bg-red-500 text-white rounded px-4 py-2 mb-2"
              >
              Close
            </button>
          </div>
        </Modal>
      );
    } else {
      return (
        <div> 
          {session.user.username}
        </div>
      );
    }
  }
  // ... the rest of your component logic
}
