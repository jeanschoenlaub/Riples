import { api } from "~/utils/api";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Modal } from "~/components/reusables/modaltemplate";  
import { handleZodError } from "~/utils/error-handling";
import toast from "react-hot-toast";


interface CreateProjectModalProps {
  showModal: boolean;
  onClose: () => void;
}

interface CreateProjectPayload {
  title: string;
  summary: string;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ showModal, onClose }) => {
  const { data: session } = useSession(); 
  const initialName =  '';
  const initialDescription =  '';
  const [projectName, setProjectName] = useState(initialName);
  const [projectDescription, setProjectDescription] = useState(initialDescription);

  const resetForm = () => {
    setProjectName('');
    setProjectDescription('');
    onClose();
  };

  const generateCreatePayload = (): CreateProjectPayload => ({
    title: projectName,
    summary: projectDescription
  });

  const handleSave = () => {
    const payload = generateCreatePayload();
    createProject(payload);
  };

  const { isCreating, createProject} = useProjectMutation({ onSuccess: resetForm });
  const isLoading = isCreating;

  const closeModal = () => {};

  return (
    <>
      <Modal showModal={showModal} size="medium" onClose={closeModal}> 
        <div>
          <div className="pb-5 text-3xl">On-Boarding!</div>
          <h1 className="pb-5">Please add a username to complete account creation:</h1>
        </div>
      </Modal>
    </>
  );
};

// Custom hook to handle mutations and their state
const useProjectMutation =  ({ onSuccess }: { onSuccess: () => void }) => {
  const apiContext = api.useContext();
  
  // Function to run on successful mutations
  const handleSuccess = () => {
    void apiContext.projects.getAll.invalidate(); // Invalidate the cache
    onSuccess(); // Execute any additional onSuccess logic
  };
  
  //We add a mutation for creating a task (with on success)
  const { mutate: createProjectMutation, isLoading: isCreating }  = api.projects.create.useMutation({
    onSuccess: handleSuccess,
    onError: (e) => {
      const fieldErrors = e.data?.zodError?.fieldErrors; 
      const message = handleZodError(fieldErrors);
      toast.error(message);
    }
  });

  const createProject = (payload: CreateProjectPayload) => {
    createProjectMutation(payload);
  };


  return {
    isCreating,
    createProject,
  }
}