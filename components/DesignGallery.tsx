
import React from 'react';
import { Design } from '../types';
import DesignCard from './DesignCard';

interface DesignGalleryProps {
  designs: Design[];
  onGeneratePitch: (id: string) => void;
  loadingDesignId: string | null;
}

const DesignGallery: React.FC<DesignGalleryProps> = ({ designs, onGeneratePitch, loadingDesignId }) => {
  if (designs.length === 0) {
    return (
      <div className="text-center py-16 px-6 bg-orange-100/50 rounded-lg border-2 border-dashed border-orange-300">
        <h3 className="text-2xl font-bold text-orange-900">Your Showcase is Empty</h3>
        <p className="text-gray-600 mt-2">Upload your first design using the form above to get started!</p>
      </div>
    );
  }

  return (
    <div>
        <h2 className="text-3xl font-bold text-orange-900 mb-6 text-center">Your Design Collection</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {designs.map((design) => (
            <DesignCard
            key={design.id}
            design={design}
            onGeneratePitch={onGeneratePitch}
            isLoading={loadingDesignId === design.id}
            />
        ))}
        </div>
    </div>
  );
};

export default DesignGallery;
