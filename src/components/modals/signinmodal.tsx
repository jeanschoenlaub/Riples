import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { signIn, getSession } from 'next-auth/react';
import { Modal} from "~/components/modals/modaltemplate";
import { LoadingDropletSVG } from '../loading';

interface SignInModalProps {
  showModal: boolean;
  onClose: () => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({ showModal, onClose }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true); // <- set loading state
    const result = await signIn('email', { email });
    setIsLoading(false); // <- unset loading state
    if (result?.error) {
      toast.error(result.error);
    } else {
      getSession().then((newSession) => {
        console.log(newSession);
        onClose();
      });
    }
  };

  return (
    <Modal showModal={showModal} size="medium">
      {isLoading ? (
        <div className="flex justify-center my-4">
          {/*<Riples Logo + CSS Loading/>*/}
          <LoadingDropletSVG/>
        </div>
      ) : (
        <div className="flex justify-center my-4">
          {/*<Riples Logo />*/}
          <div className="loading-container">
          <img
              src="/images/logo_128x128.png" 
              className="droplet" 
              alt="Riple logo" 
          />
          </div>
        </div>
      )}
      <label className="block text-sm mb-5">
        Email:
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mt-1 rounded border"
          maxLength={100}
        />
      </label>
      <div className="flex items-center justify-center space-x-2">
      `<button 
        onClick={handleSignIn}
        className="bg-green-500 text-white rounded px-4 py-2 mb-2"
      >
        Sign In
      </button>
      <button
        onClick={onClose}
        className="bg-red-500 text-white rounded px-4 py-2 mb-2"
        >
        Close
      </button>`
      </div>
    </Modal>
  );
};
