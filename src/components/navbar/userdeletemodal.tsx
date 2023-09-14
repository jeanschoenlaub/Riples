import { Modal } from "~/components/reusables/modaltemplate";

interface DeleteModalProps {
  showDeleteModal: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export const NavBarUserDeleteModal: React.FC<DeleteModalProps> = ({ showDeleteModal, onClose, onDelete }) => {
  return (
    <Modal showModal={showDeleteModal} size="small">
      <p>Are you sure you want to delete your account?</p>
      <div className="flex justify-end">
        <button onClick={onClose} className="bg-red-500 text-white rounded px-4 py-2">No</button>
        <button onClick={onDelete} className="bg-green-500 text-white rounded px-4 py-2 ml-2">Yes</button>
      </div>
    </Modal>
  );
};
