import { api } from "~/utils/api";

import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";
import { useState } from "react";
import { useSession } from "next-auth/react";

export function Wrapper({ children }: any) {
  const { data: session } = useSession();
  const userQuery = api.users.getUserByUserId.useQuery({ userId: session?.user.id || "forTsButShouldNeverBeCalled" });
  const userMutation = api.users.updateUsername.useMutation();
  

  const [username, setUsername] = useState("");

  // Only try and get userdata & then potentially set username if we're actually logged in
  if (session) {
    if (userQuery.status !== "success") {
      return <p>Loading...</p>;
    }

    if (userQuery.data?.user.username === "") {
      return (
        <div className="flex flex-col items-center justify-center px-4 pt-24 sm:px-6 lg:px-8 lg:pt-14">
          <div className="pb-5 text-3xl"> On - Boarding !</div>
          <h1 className="pb-5">
            Please add a username to complete account creation
          </h1>

          <div className="mt-2 flex rounded-md shadow-sm">
            <div className="relative flex flex-grow items-stretch focus-within:z-10">
              <input
                type="username"
                name="username"
                id="username"
                className="block w-72 border-0 p-3 py-1.5 text-center text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-3">
            <button
              onClick={() => {
                const randomName: string = uniqueNamesGenerator({
                  dictionaries: [adjectives, colors, animals],
                }); // big_red_donkey

                setUsername(randomName);
              }}
            >
              Generate Name
            </button>
          </div>

          <div className="p-5">
            <button
              onClick={() => {
                userMutation.mutate(
                  {
                    userId: session.user.id,
                    username: username,
                  },
                  {
                    onSuccess: () => {
                      // Invalidate userQuery, we'll now render the children instead of this block
                      userQuery.refetch().catch((err) => {
                        console.error(err);
                      });
                    },
                  }
                );
              }}
            >
              Submit
            </button>
          </div>
        </div>
      );
    }
    else { return (
    <div> 
      {session.user.username}
    </div>)
    ;}
  }
}