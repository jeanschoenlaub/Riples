import { Modal } from "~/components/reusables/modaltemplate";
import { UserNameForm } from "../reusables/usernameform";
import { useState } from "react";


export const NavBarUserNameModal: React.FC<{ showModal: boolean; onClose: () => void }> = ({ showModal, onClose }) => {
  const [isLoading, setIsLoading] = useState(false); // Declare the state in the parent

  const handleClose = () => {
    onClose();
  };

  const handleUsernameChangeSuccess = () => {
    // Perform any additional operations you want when the username is successfully changed
    handleClose();
  };

  const handleLoadingChange = (loadingState : boolean) => {
    setIsLoading(loadingState);  // Update the isLoading state when notified
  };

  return (
    <Modal showModal={showModal} size="medium" isLoading={isLoading} onClose={handleClose}>
      <div className="flex flex-col">
        <div className="mb-2">Choose a username:</div>
        <UserNameForm 
          onSuccess={handleUsernameChangeSuccess} 
          onLoadingChange={handleLoadingChange}  // Pass the function that sets the isLoading state
        />
      </div>
    </Modal>
  );
};
