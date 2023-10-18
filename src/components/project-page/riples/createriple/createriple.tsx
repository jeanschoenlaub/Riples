// CreateRipleModal.tsx
import React, { useState } from 'react';
import { Modal } from '~/components/reusables/modaltemplate';
import { CreateRipleModalProps, CreateRiplePayload } from './createripletypes';
import toast from 'react-hot-toast';
import { useRipleMutation } from './createripleapi';
import { LoadingSpinner } from '~/components/reusables/loading';
import { api } from "~/utils/api";

export const CreateRipleModal: React.FC<CreateRipleModalProps> = ({ showModal, onClose, isLoading, projectId, projectTitle }) => {
    const [ripleContent, setRipleContent] = useState('');
    const [ripleTitle, setRipleTitle] = useState('');

    const handleRipleSubmit = () => {
        
        const payload = generateCreatePayload();
        createRiple(payload).then(() => {
          toast.success('Riple created successfully!');
          resetForm();
        })
        .catch(() => {
          toast.error('Error creating riple');
        });
    };
    
    const resetForm = () => {
        setRipleTitle(''); // Reset content after submitting
        setRipleContent(''); // Reset content after submitting
        onClose()
    }

    // Helper function to generate create payload
    const generateCreatePayload = (): CreateRiplePayload => ({
        projectId: projectId,
        projectTitle: projectTitle,
        title: ripleTitle,
        content: ripleContent,
    });

    const { data: followers, isLoading: isLoadingFollowers, isError } = api.projectFollowers.getFollowersByProjectId.useQuery({ projectId: projectId });
    const { isCreating, createRiple } = useRipleMutation(followers);
  

    return (
        <Modal showModal={showModal} size="medium" onClose={onClose}>
            <span className="text-lg flex justify-center items-center space-x-4 mb-2w-auto">
                Create New Riple
            </span>
            <label className="block text-sm mb-3 justify-br" aria-label="Riple Title">
            Riple Title:
                <input
                type="text"
                value={ripleTitle}
                onChange={(e) => setRipleTitle(e.target.value)}
                className={`w-full p-2 mt-1 rounded border ${isLoading ? 'cursor-not-allowed' : ''}`}
                maxLength={255}
                disabled={isLoading}
                />
            </label>
            <label className="block text-sm mb-3 justify-br" aria-label="Riple Content">
                Riple Content:
                <textarea 
                    value={ripleContent} 
                    onChange={(e) => setRipleContent(e.target.value)}
                    className={`w-full p-2 mt-1 rounded border ${isLoading ? 'cursor-not-allowed' : ''}`}
                    maxLength={255}
                    disabled={isLoading}
                />
            </label>
            <button 
                className={`p-2 bg-blue-500 text-white rounded ${isLoading ? 'cursor-not-allowed' : ''}`} 
                onClick={handleRipleSubmit}
                disabled={isLoading}
            >
               <span className='flex items-center space-x-2'>
                    Post
                    {isCreating && (<LoadingSpinner size={16} />)}
                </span>
            </button>
        </Modal>
    );
}
