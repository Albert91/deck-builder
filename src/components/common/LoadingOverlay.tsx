import React from 'react';

interface LoadingOverlayProps {
  isLoading: boolean;
  message: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading, message }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
        <div className="flex flex-col items-center gap-4">
          {/* Spinner */}
          <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />

          {/* Message */}
          <p className="text-lg font-medium">{message}</p>
        </div>
      </div>
    </div>
  );
};
