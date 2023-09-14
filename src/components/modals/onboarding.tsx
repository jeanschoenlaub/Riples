import { api } from "~/utils/api";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { UserNameModal } from "./usernamemodal";

export const OnboardingWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session } = useSession();
  if (session){
    const [showUserNameModal, setShowUserNameModal] = useState(false);
    const userQuery = api.users.getUserByUserId.useQuery({ userId: session?.user.id || "forTsButShouldNeverBeCalled" });

    const closeModal = () => setShowUserNameModal(false);

    if (userQuery.data?.user.username === "") {
      return (
        <>
          {session && userQuery.data?.user.username === "" && (
            <UserNameModal showModal={showUserNameModal} onClose={closeModal} />
          )}
          {children}
        </>
      );
    }
    else {
      return <>{children}</>; 
    }
  }
};
