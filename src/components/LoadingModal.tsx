import React from 'react';

interface LoadingModalProps {
    isLoading: boolean;
}

export const LoadingModal = ({ isLoading }: LoadingModalProps): JSX.Element => {
    return (
        <>
            {isLoading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center">
                        <svg className="animate-spin h-10 w-10 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8v-8H4z"></path>
                        </svg>
                        <p className="text-gray-700 text-lg">Loading, please wait...</p>
                    </div>
                </div>
            )}
        </>
    );
};
