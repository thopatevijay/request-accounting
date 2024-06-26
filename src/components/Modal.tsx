import React from 'react';
import { FaWindowClose } from 'react-icons/fa';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalProps): JSX.Element => {
  return (
    <>
    {isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="relative bg-white rounded-lg shadow-lg p-4 w-full max-w-2xl max-h-screen overflow-y-auto">
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <FaWindowClose />
          </button>
          {children}
        </div>
      </div>
    )}
  </>
);
};

export default Modal;
