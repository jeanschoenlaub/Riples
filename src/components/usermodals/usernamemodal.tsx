import { Modal } from "~/components/reusables/modaltemplate";
import { UserNameForm } from "../reusables/usernameform";


export const NavBarUserNameModal: React.FC<{ showModal: boolean; onClose: () => void }> = ({ showModal, onClose }) => {
  const handleClose = () => {
    onClose();
  };

  const handleUsernameChangeSuccess = () => {
    // Perform any additional operations you want when the username is successfully changed
    handleClose();
  };

  return (
    <Modal showModal={showModal} size="medium" onClose={handleClose}>
      <div className="flex flex-col">
        <div className="mb-2">Choose a username:</div>
        <UserNameForm onSuccess={handleUsernameChangeSuccess} />
      </div>
    </Modal>
  );
};
