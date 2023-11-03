import { api } from "~/utils/api";
import { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";

export const UserNameForm: React.FC<{ onSuccess: () => void , onLoadingChange?: (loading: boolean) => void }> = ({ onSuccess,  onLoadingChange  }) => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false); 

  const setAndNotifyLoading = (state: boolean) => {
    setIsLoading(state);
    onLoadingChange?.(state);
  }

  const shouldExecuteQuery = !!session?.user?.id; // Run query only if session and user id is not null
  
  // Conditional query using tRPCto avoid no user error if not signed-in
  const userQuery = api.users.getUserByUserId.useQuery(
    { userId: session?.user?.id ?? "" },
    { enabled: shouldExecuteQuery }
  );


  const userMutation = api.users.updateUsername.useMutation();
  const [username, setUsername] = useState(userQuery.data?.user.username ?? "");

  useEffect(() => {
    if (userQuery.data?.user) {
      setUsername(userQuery.data.user.username ?? ""); // Set to empty string if null
    }
    onLoadingChange?.(isLoading);
    console.log("aa")
}, [userQuery.data?.user, onLoadingChange, isLoading]);


  if (session) {
    return (
      <div className="flex flex-col">
        <div className="flex flex-wrap items-center justify-between">
        <input
          className="border p-2 flex-grow"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
        <div className="flex items-center space-x-2 mt-2">
          <button className="bg-green-500 text-white rounded px-4 py-2" onClick={() => {
            setAndNotifyLoading(true); // this will both set the state and notify the parent
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
                  setAndNotifyLoading(false); // this will both set the state and notify the parent
                  onSuccess();  // Call the passed-in callback
                },
              }
            );
          }}>
            Save
          </button>
        </div>
      </div>
    );
  }
};