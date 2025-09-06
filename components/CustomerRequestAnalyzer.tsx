
import React, { useState } from 'react';
import Loader from './Loader';

interface CustomerRequestAnalyzerProps {
  onAnalyze: (request: string) => void;
  isAnalyzing: boolean;
  disabled: boolean;
}

const CustomerRequestAnalyzer: React.FC<CustomerRequestAnalyzerProps> = ({ onAnalyze, isAnalyzing, disabled }) => {
  const [request, setRequest] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (request.trim()) {
      onAnalyze(request);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg my-12 border border-orange-200/50">
      <h2 className="text-3xl font-bold text-orange-900 mb-2">Find the Perfect Match</h2>
      <p className="text-gray-600 mb-6">Enter a buyer's request, and our AI will find the best matching design from your collection and suggest where to sell it.</p>
      
      {disabled ? (
        <div className="text-center py-8 px-6 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-600">Please upload at least one design to use the AI Matchmaker.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <textarea
            placeholder="e.g., 'Looking for a traditional silk saree with peacock motifs for a wedding, preferably in blue and gold...'"
            value={request}
            onChange={(e) => setRequest(e.target.value)}
            rows={5}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
            required
            disabled={isAnalyzing}
          />
          <button 
            type="submit" 
            className="w-full bg-orange-800 text-white font-bold py-3 px-6 rounded-md hover:bg-orange-900 transition-colors duration-300 ease-in-out shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-700 disabled:bg-orange-400 disabled:cursor-not-allowed flex items-center justify-center"
            disabled={isAnalyzing || !request.trim()}
          >
            {isAnalyzing ? <Loader text="Analyzing..." /> : 'Analyze Request & Find Match'}
          </button>
        </form>
      )}
    </div>
  );
};

export default CustomerRequestAnalyzer;
