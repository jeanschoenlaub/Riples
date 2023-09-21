import { api } from "~/utils/api";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Modal } from "~/components/reusables/modaltemplate";  
import { UserNameForm } from "~/components/reusables/usernameform";


export const OnboardingWrapper: React.FC = () => {
  const { data: session } = useSession();
  const [showUserNameModal, setShowUserNameModal] = useState(false);
  
  const shouldExecuteQuery = !!session?.user?.id; // Run query only if session and user id is not null
  
  // Conditional query using tRPC
  const userQuery = api.users.getUserByUserId.useQuery(
    { userId: session?.user?.id ?? "" },
    { enabled: shouldExecuteQuery }
  );

  const closeModal = () => setShowUserNameModal(false);

  useEffect(() => {
    if (userQuery.data?.user.username === "") {
      setShowUserNameModal(true);
    }
  }, [userQuery.data]);

  return (
    <>
      {showUserNameModal && (
        <Modal showModal={showUserNameModal} size="medium" onClose={closeModal}> {/* Assuming your modal component uses these props */}
          <div>
            <div className="pb-5 text-3xl">On-Boarding!</div>
            <h1 className="pb-5">Please add a username to complete account creation:</h1>
            <UserNameForm onSuccess={closeModal} /> {/* This will replace the previous NavBarUserNameModal */}
          </div>
        </Modal>
      )}
    </>
  );
};
