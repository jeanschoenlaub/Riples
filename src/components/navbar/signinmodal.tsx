import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { signIn, getSession } from 'next-auth/react';
import { Modal} from "~/components/reusables/modaltemplate";

interface SignInModalProps {
  showModal: boolean;
  onClose: () => void;
}

export const NavBarSignInModal: React.FC<SignInModalProps> = ({ showModal, onClose }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true); // <- set loading state
    try {
      const result = await signIn('email', { email });
      if (result?.error) {
        toast.error(result.error);
        return; // return early if an error occurred
      }
      
      const newSession = await getSession(); // Use await here to satisfy ESLint
      console.log(newSession);
      onClose();
    } catch (error) {
      console.error("An error occurred during sign-in:", error);
    } finally {
      setIsLoading(false); // <- unset loading state
    }
  };

  return (
    <Modal showModal={showModal} isLoading={isLoading} onClose={onClose} size="small">
      <h1>Sign-In</h1>
      <label className="block text-xs mb-2 mt-4">
        Email:
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mt-1 rounded border"
          maxLength={100}
        />
      </label>
      <div className='flex flex-col'>
        <div className='text-sm italic mb-4 px-1'> (Make sure to check your email junk box) </div>
        <div className="flex items-center justify-center space-x-2">
        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <button className="bg-green-500 text-white rounded px-4 py-2 mb-2" onClick={ handleSignIn }>Sign In</button>

        </div>
      </div>
    </Modal>
  );
};
