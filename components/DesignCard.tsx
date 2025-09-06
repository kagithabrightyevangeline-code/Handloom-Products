
import React from 'react';
import { Design } from '../types';
import Loader from './Loader';

interface DesignCardProps {
  design: Design;
  onGeneratePitch: (id: string) => void;
  isLoading: boolean;
}

const DesignCard: React.FC<DesignCardProps> = ({ design, onGeneratePitch, isLoading }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-orange-200/50 transform hover:-translate-y-1 transition-transform duration-300">
      <div className="w-full h-56">
        <img src={`data:${design.imageMimeType};base64,${design.image}`} alt={design.name} className="w-full h-full object-cover" />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-orange-900 mb-2">{design.name}</h3>
        <p className="text-gray-600 text-sm mb-2"><span className="font-semibold">Materials:</span> {design.materials}</p>
        <p className="text-gray-700 text-sm mb-4 h-20 overflow-y-auto">{design.description}</p>
        
        {isLoading ? (
          <div className="w-full flex justify-center py-2">
            <Loader text="Thinking..." />
          </div>
        ) : (
          <button
            onClick={() => onGeneratePitch(design.id)}
            className={`w-full font-bold py-2 px-4 rounded-md transition-colors duration-300 ${
              design.pitch
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-orange-800 hover:bg-orange-900 text-white'
            }`}
          >
            {design.pitch ? 'View Business Pitch' : 'Generate Business Pitch'}
          </button>
        )}
      </div>
    </div>
  );
};

export default DesignCard;
