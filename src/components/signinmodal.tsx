import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { signIn, getSession } from 'next-auth/react';

interface SignInModalProps {
  showModal: boolean;
  onClose: () => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({ showModal, onClose }) => {
  const [email, setEmail] = useState(""); // <-- Managed state for email

  const handleSignIn = async () => {
    const result = await signIn('email', { email });
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
    <div>
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded p-4 w-1/3">
            <label className="block text-sm mb-2">
              Email:
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 mt-1 rounded border"
                maxLength={100}
              />
            </label>
            <button 
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
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
