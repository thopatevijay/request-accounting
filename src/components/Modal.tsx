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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-4 w-11/12 md:w-2/3 lg:w-1/2">
            <button
              className="top-2 right-2 text-gray-500 hover:text-gray-700"
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
