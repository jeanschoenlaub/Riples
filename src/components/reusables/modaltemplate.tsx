import React from 'react';
import { LoadingRiplesLogo } from '../loading';

interface ModalProps {
  showModal: boolean;
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  isLoading?: boolean;
}

export const Modal: React.FC<ModalProps> = ({ showModal, isLoading, size = 'medium', children }) => {
  const sizeClass = {
    small: 'w-2/3 md:w-1/4',
    medium: 'w-2/3 md:w-1/2',
    large: 'w-3/4',
  };

  return (
    <div>
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className={`bg-white rounded-lg p-4 ${sizeClass[size]} shadow-lg`}>
            <div className="flex justify-center my-4">
              {isLoading ? (
                <LoadingRiplesLogo />
              ) : (
                <div className="loading-container">
                  <img
                    src="/images/logo_128x128.png"
                    className="droplet"
                    alt="Riple logo"
                  />
                </div>
              )}
            </div>
            {children}
          </div>
        </div>
      )}
    </div>
  );
};