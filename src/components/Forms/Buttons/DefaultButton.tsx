import React from 'react';

interface ButtonProps {
  disabled?: boolean;
  loadingData: boolean;
  onClick: () => void;
  buttonText?: string;
}

const DefaultButton: React.FC<ButtonProps> = ({
  disabled,
  loadingData,
  onClick,
  buttonText = 'Enviar',
}) => {
  return (
    <button
      className='flex justify-center items-center bg-indigo-500 enabled:hover:bg-indigo-800 disabled:opacity-75 rounded w-full h-10 text-white cursor-pointer disabled:cursor-not-allowed'
      disabled={disabled || loadingData}
      onClick={onClick}
    >
      {loadingData && (
        <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {buttonText}
    </button>
  );
};

export default DefaultButton;
