
import React from 'react';

interface LoaderProps {
  text?: string;
}

const Loader: React.FC<LoaderProps> = ({ text = "Generating Pitch..." }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-orange-800"></div>
      <p className="text-orange-800 font-medium">{text}</p>
    </div>
  );
};

export default Loader;
