import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { EditSVG } from '~/components/reusables/svg';
import { LoadingSpinner } from '~/components/reusables/loading';
import { api } from '~/utils/api';
import { handleZodError } from '~/utils/error-handling';
import { NavBarUserNameModal } from '../navbar/usernamemodal';
import MultiSelect from '../reusables/multiselect';
import { sortedProjectClassifications } from '~/utils/constants/projectclassifications';


interface OptionType {
    value: string;
    label: string;
  }

type UserAboutInfoProps = {
    user: {
        id: string;
        name: string;
        username: string;
        description: string;
        // interestTags: string[];
    };
    isUserOwner: boolean;
};

export const UserAbout: React.FC<UserAboutInfoProps> = ({ user, isUserOwner }) => {
    const [name, setName] = useState(user.name);
    const [description, setDescription] = useState(user.description);
    const [showUserNameModal, setShowUserNameModal] = useState(false);

    //For interest tags
    const [tags, setTags] = useState<string[]>([]);
    const handleTagsChange = (updatedTags: string[]) => {
        setTags(updatedTags);
      };
    const selectedTags: OptionType[] = tags.map(tag => ({ value: tag, label: tag }));

    const [isEditMode, setIsEditMode] = useState(false);
    const toggleEditMode = () => {
        setIsEditMode(!isEditMode);
    }

    const { isEditing, editUserInfo } = useUserInfoMutation()

    const handleSave = () => {
        editUserInfo({
            userId: user.id,
            name,
            description,
            // interestTags, // Uncomment this when you're ready to handle interest tags
        })
        .then(() => {
            toast.success('User modifications saved successfully!');
            toggleEditMode();
        })
        .catch((error) => {
            // Assuming the error toast is already handled inside the `editUserInfo` function.
            // If you want additional error handling, you can add it here.
            toggleEditMode();
        });
    };
    

    return (
        <div>
            <div className="flex items-center space-x-4 ml-2">
                <div className='text-lg mt-2 font-semibold'>Public Profile</div>
                
                {(isUserOwner && !isEditMode) && (
                    <button 
                        onClick={toggleEditMode}
                        className="bg-blue-500 mt-2 text-white text-sm rounded px-4 py-1 flex items-center justify-center w-auto"
                    >
                        <span className='flex items-center'>
                            Edit 
                            <EditSVG width='4' height='4' marginLeft='2'/>
                        </span>
                    </button>
                )}
                
                {(isUserOwner && isEditMode) && (
                    <>
                        <button 
                            onClick={handleSave}
                            className="bg-green-500 mt-2 text-white text-sm rounded px-4 py-1 flex items-center justify-center w-auto"
                        >
                            <span className='flex items-center space-x-2'>
                                Save 
                                {isEditing && (<LoadingSpinner size={16} />) }
                            </span>
                        </button>
                        <button 
                            onClick={toggleEditMode}
                            className="bg-red-500 mt-2 text-white text-sm rounded px-4 py-1 flex items-center justify-center w-auto"
                        >
                            Cancel
                        </button>
                    </>
                )}
            </div>

            {/* User Name */}
            <div className="flex items-center ml-2 mr-2 mt-3 mb-3 space-x-2">
                <label htmlFor="user-name" className="text-sm text-gray-500 font-semibold justify-br flex-shrink-0 w-32" aria-label="Username">
                    Username:
                </label>
                <div className="flex-grow w-full p-2 rounded border bg-gray-100 cursor-pointer">
                    {user.username}
                </div>
                <div>
                {((isUserOwner && isEditMode) &&
                    <button 
                        className="bg-blue-500 text-white text-sm rounded px-4 py-2 flex items-center justify-center w-auto"
                        onClick={() => setShowUserNameModal(true)}>
                        Change
                    </button>
                )}
                </div>
            </div>

            {/* User Description */}
            <div className="flex ml-2 mr-2 mt-4 mb-3 space-x-2">
                <label htmlFor="user-description" className="text-sm text-gray-500 font-semibold justify-br flex-shrink-0 w-32" aria-label="User Description">
                    Bio:
                </label>
                    <textarea
                        id="user-description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="flex-grow w-full p-2 rounded border"
                        maxLength={250}
                        disabled={!isEditMode}
                        rows={4}
                    />
            </div>

            {/* User Name */}
            <div className="flex items-center ml-2 mr-2 mt-3 mb-3 space-x-2">
                <label htmlFor="user-name" className="text-sm text-gray-500 font-semibold justify-br flex-shrink-0 w-32" aria-label="User Name">
                    Name:
                </label>
                <input
                    id="user-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex-grow w-full p-2 rounded border"
                    maxLength={50}
                    disabled={!isEditMode}
                />
            </div>

            {/* User Interests */}
            <div className="flex items-center ml-2 mr-2 mt-3 mb-3 space-x-2">
                <label htmlFor="user-name" className="text-sm text-gray-500 font-semibold justify-br flex-shrink-0 w-32" aria-label="User Name">
                    Interests:
                </label>
                <div className="flex-grow w-full">
                <MultiSelect
                          options={sortedProjectClassifications}
                          value={selectedTags}
                          disabled={!isEditMode}
                          onChange={(selected) => {
                          // Convert OptionType[] back to string[] for onTagsChange
                          if (selected) {
                              handleTagsChange(selected.map(option => option.value));
                          } else {
                              handleTagsChange([]);
                          }
                          }}
                          maxSelection={5}
                          placeholder="Add tags..."
                      />
                    </div>
            </div>

            <NavBarUserNameModal showModal={showUserNameModal} onClose={() => setShowUserNameModal(false)} />
        </div>
    );
};

export type EditUserPayload = {
    userId: string;
    name: string;
    description: string;
    // interestTags: string[]; // Uncomment this when you're ready to handle interest tags
};

export const useUserInfoMutation = () => {
    const apiContext = api.useContext();
    const handleSuccess = async () => {
        await apiContext.users.getUserByUserId.invalidate();
    };

    const { mutate: editUserInfoMutation, isLoading: isEditing } = api.users.editUserInfo.useMutation({
        onSuccess: handleSuccess,
    });

    const editUserInfo = (payload: EditUserPayload) => {
        return new Promise<void>((resolve, reject) => {
            editUserInfoMutation(payload, {
                onSuccess: () => { resolve(); },
                onError: (e) => {
                    const fieldErrors = e.data?.zodError?.fieldErrors;
                    const message = handleZodError(fieldErrors);
                    toast.error(message);
                    reject(e);
                }
            });
        });
    };

    return {
      isEditing,
      editUserInfo,
    };
  };