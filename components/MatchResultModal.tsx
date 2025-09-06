import React from 'react';
import { Design, MatchResult } from '../types';

interface MatchResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: MatchResult | null;
  matchedDesign: Design | null;
  weaverEmail: string | null;
}

const MatchResultModal: React.FC<MatchResultModalProps> = ({ isOpen, onClose, result, matchedDesign, weaverEmail }) => {
  if (!isOpen || !result || !matchedDesign) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-200 flex justify-between items-start">
            <div>
                <h2 className="text-2xl font-bold text-orange-900">AI Matchmaking Result</h2>
                <p className="text-sm text-gray-500">The best match from your collection for the buyer's request.</p>
            </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors text-3xl leading-none" aria-label="Close modal">&times;</button>
        </div>
        
        <div className="p-6 flex-grow grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Matched Design Info */}
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-bold text-orange-800 mb-4 text-center">Best Match: "{matchedDesign.name}"</h3>
            <div className="w-full aspect-square rounded-lg overflow-hidden border-2 border-orange-200 shadow-md mb-4">
              <img src={`data:${matchedDesign.imageMimeType};base64,${matchedDesign.image}`} alt={matchedDesign.name} className="w-full h-full object-cover" />
            </div>
             <p className="text-gray-600 text-sm"><span className="font-semibold">Materials:</span> {matchedDesign.materials}</p>
          </div>

          {/* AI Analysis */}
          <div className="space-y-6">
            <div>
                <h3 className="text-xl font-bold text-orange-800 mb-2 border-b-2 border-orange-200 pb-2">AI Justification</h3>
                <p className="text-gray-700 text-base">{result.justification}</p>
            </div>
             <div>
                <h3 className="text-xl font-bold text-orange-800 mb-3 border-b-2 border-orange-200 pb-2">Recommended Sales Platforms</h3>
                <div className="space-y-4">
                    {result.platformRecommendations.map((rec, index) => (
                        <div key={index}>
                            <h4 className="font-bold text-gray-800">{rec.platformName}</h4>
                            <p className="text-gray-600 text-sm">{rec.reason}</p>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        </div>

        {weaverEmail && (
            <div className="p-6 border-t border-gray-200 bg-orange-50/50">
                <h3 className="text-xl font-bold text-orange-800 mb-2">Interested in this Design?</h3>
                <p className="text-gray-700 mb-1">Contact the weaver directly to discuss purchasing or collaboration:</p>
                <a href={`mailto:${weaverEmail}`} className="text-lg font-semibold text-orange-700 hover:underline break-all">{weaverEmail}</a>
            </div>
        )}

        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button
                onClick={onClose}
                className="bg-orange-800 text-white font-bold py-2 px-6 rounded-md hover:bg-orange-900 transition-colors duration-300"
            >
                Close
            </button>
        </div>
      </div>
    </div>
  );
};

export default MatchResultModal;