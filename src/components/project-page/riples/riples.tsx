import { api, type RouterOutputs } from '~/utils/api';
import { RipleCard } from '../../cards/riplecard/riplecard';
import { handleMutationError } from '~/utils/error-handling';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Modal } from '../../reusables/modaltemplate';
import { LoadingSpinner } from '../../reusables/loading';
import { CreateRipleModal } from './createriple/createriple';

type RipleData = RouterOutputs["riples"]["getAll"]
interface RipleTabProps {
    ripleData: RipleData;
    projectId: string;
    projectTitle: string,
    projectSummary: string,
    projectCoverImageId: string,
}

export const RiplesTab: React.FC<RipleTabProps> = ({ ripleData, projectId, projectTitle, projectSummary, projectCoverImageId  }) => {
    const { deleteRiple, isDeleting } = UseRiplesMutations();
    const { data: session } = useSession();
    const userId = session?.user.id;

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [ripleToDelete, setRipleToDelete] = useState<string | null>(null);
    const [showCreateRipleModal, setShowCreateRipleModal] = useState(false);

    const handleDeleteClick = (ripleId: string) => {
        setRipleToDelete(ripleId);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        if (ripleToDelete) {
            deleteRiple({ ripleId: ripleToDelete }).then(() => {
                toast.success('Riples Deleted Successfully');
                setShowDeleteModal(false);
            })
            .catch(() => {
                toast.error('Error deleting Riples');
                setShowDeleteModal(false);
            });
        }
    };

    const handleCancelDelete = () => {
        setRipleToDelete(null);
    };

    // Function to open the creation modal
    const openCreateRipleModal = () => {
        setShowCreateRipleModal(true);
    };

    // Function to close the creation modal
    const closeCreateRipleModal = () => {
        setShowCreateRipleModal(false);
    };

    return (
        <div className=" space-y-4 border-r-2 border-l-2 border-b-2 border-gray-200 text-gray-800">
            <div className="mb-4">
                <Modal showModal={showDeleteModal} onClose={handleCancelDelete} size="small">
                    <p>Are you sure you want to delete this riple?</p>
                    <div className="flex justify-end">
                        <button onClick={handleCancelDelete} className="bg-red-500 text-white rounded px-4 py-2">No</button>
                        <button onClick={handleConfirmDelete} className="bg-green-500 text-white rounded px-4 py-2 ml-2">{isDeleting && <LoadingSpinner size={16} />}  Yes</button>
                    </div>
                </Modal>
            </div>
            {/* Post Content Bar */}
            <div className="p-3 mt-4 ml-2 mr-2 bg-gray-200 rounded-lg shadow-md mb-5">
                <div className="flex justify-between items-center">
                    {/* Post Content Input */}
                        <div className="flex flex-grow items-center"
                        onClick={openCreateRipleModal}>
                            <input 
                                type="text" 
                                placeholder="What's on your mind?" 
                                className="p-2 flex-grow bg-white w-full rounded border border-gray-300 shadow-sm mr-2" 
                                disabled={true}
                            />
                        </div>
                    
                    {/* Post Button */}
                        <button className="p-2 bg-gray-500 text-white rounded" onClick={openCreateRipleModal}>
                            Post
                        </button>
                </div>
            </div>
            {/* Display ripples */}
            {ripleData && ripleData.length > 0 ? (
                <div className='space-y-2'>
                    {ripleData.map((fullRiple) => (
                        <RipleCard 
                        key={fullRiple.riple.id} 
                        onDelete={userId === fullRiple.riple.authorID ? () => handleDeleteClick(fullRiple.riple.id) : undefined}
                        {...fullRiple}
                    />
                    ))}
                </div>
            ) : (
                <div className="flex justify-center items-center h-full text-center">
                    Your Riples (project updates) will be displayed here once you start posting for this project.
                </div>
            )}
            {/* Create Riple Modal usage */}
            <CreateRipleModal 
                showModal={showCreateRipleModal}
                projectId={projectId}
                projectTitle={projectTitle}
                projectSummary={projectSummary}
                projectCoverImageId={projectCoverImageId}
                onClose={closeCreateRipleModal}
            />
        </div>
        
    )
}

export type DeleteRiplePayload = {
    ripleId: string;
}

export const UseRiplesMutations  = () => {
    const apiContext = api.useContext();
    const handleSuccess = async () => {
        await apiContext.riples.getRipleByProjectId.invalidate();
    };

    // Delete Riple Mutation
    const { mutate: deleteRipleMutation, isLoading: isDeleting } = api.riples.delete.useMutation({
        onSuccess: handleSuccess,
    });
    
    const deleteRiple = (payload: DeleteRiplePayload) => {
        return new Promise<void>((resolve, reject) => {
        deleteRipleMutation(payload, {
            onSuccess: () => { resolve(); },
            onError: (e) => {
                handleMutationError(e, reject);
              }        
        });
        });
    };
  
  return {
    // ... other returned values
    isDeleting,
    deleteRiple,
  };
}