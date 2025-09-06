import React, { useState, useEffect } from 'react';
import { Design, MatchResult } from './types';
import Header from './components/Header';
import WeaverContact from './components/WeaverContact';
import DesignUploadForm from './components/DesignUploadForm';
import DesignGallery from './components/DesignGallery';
import PitchModal from './components/PitchModal';
import CustomerRequestAnalyzer from './components/CustomerRequestAnalyzer';
import MatchResultModal from './components/MatchResultModal';
import { generatePitchForDesign, analyzeCustomerRequest } from './services/geminiService';

const App: React.FC = () => {
  const [designs, setDesigns] = useState<Design[]>(() => {
    try {
      const savedDesigns = localStorage.getItem('handloomDesigns');
      return savedDesigns ? JSON.parse(savedDesigns) : [];
    } catch (error) {
      console.error("Could not parse designs from localStorage", error);
      return [];
    }
  });

  const [weaverEmail, setWeaverEmail] = useState<string | null>(() => {
    return localStorage.getItem('handloomWeaverEmail') || null;
  });
  
  const [loadingDesignId, setLoadingDesignId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // State for Pitch Modal
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);
  const [isPitchModalOpen, setIsPitchModalOpen] = useState(false);
  
  // State for new Matchmaking feature
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<MatchResult | null>(null);
  const [matchedDesignForModal, setMatchedDesignForModal] = useState<Design | null>(null);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('handloomDesigns', JSON.stringify(designs));
    } catch (error) {
      console.error("Could not save designs to localStorage", error);
    }
  }, [designs]);

  useEffect(() => {
    if (weaverEmail) {
      localStorage.setItem('handloomWeaverEmail', weaverEmail);
    } else {
      localStorage.removeItem('handloomWeaverEmail');
    }
  }, [weaverEmail]);


  const addDesign = (newDesign: Design) => {
    setDesigns(prevDesigns => [newDesign, ...prevDesigns]);
  };

  const handleGeneratePitch = async (designId: string) => {
    const designToUpdate = designs.find(d => d.id === designId);
    if (!designToUpdate) return;
    
    setSelectedDesign(designToUpdate);

    if (designToUpdate.pitch) {
        setIsPitchModalOpen(true);
        return;
    }

    setLoadingDesignId(designId);
    setError(null);
    try {
      const pitch = await generatePitchForDesign(designToUpdate, weaverEmail);
      setDesigns(prevDesigns =>
        prevDesigns.map(d =>
          d.id === designId ? { ...d, pitch } : d
        )
      );
      // After generating, update selectedDesign to include the new pitch before opening the modal
      setSelectedDesign({ ...designToUpdate, pitch });
      setIsPitchModalOpen(true);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setLoadingDesignId(null);
    }
  };

  const handleAnalyzeRequest = async (request: string) => {
    if (designs.length === 0) {
      setError("Please upload at least one design before using the analyzer.");
      return;
    }
    
    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await analyzeCustomerRequest(request, designs);
      const matchedDesign = designs.find(d => d.id === result.matchedDesignId);

      if (matchedDesign) {
        setAnalysisResult(result);
        setMatchedDesignForModal(matchedDesign);
        setIsMatchModalOpen(true);
      } else {
        throw new Error("AI returned a matching design ID that doesn't exist in your collection.");
      }
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred during analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const closePitchModal = () => {
    setIsPitchModalOpen(false);
    setSelectedDesign(null);
  };

  const closeMatchModal = () => {
    setIsMatchModalOpen(false);
    setAnalysisResult(null);
    setMatchedDesignForModal(null);
  };

  return (
    <div className="min-h-screen bg-orange-50/50 font-sans text-gray-800">
      <Header />
      <main className="container mx-auto px-6 py-12">
        <WeaverContact initialEmail={weaverEmail} onSave={setWeaverEmail} />
        <DesignUploadForm onAddDesign={addDesign} />
        
        <CustomerRequestAnalyzer 
          onAnalyze={handleAnalyzeRequest}
          isAnalyzing={isAnalyzing}
          disabled={designs.length === 0}
        />

        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative my-4" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
                <button onClick={() => setError(null)} className="absolute top-0 bottom-0 right-0 px-4 py-3" aria-label="Close error message">
                  <span className="text-2xl" aria-hidden="true">&times;</span>
                </button>
            </div>
        )}

        <DesignGallery 
          designs={designs} 
          onGeneratePitch={handleGeneratePitch}
          loadingDesignId={loadingDesignId}
        />
      </main>

      <PitchModal 
        isOpen={isPitchModalOpen}
        onClose={closePitchModal}
        design={selectedDesign}
      />
      
      <MatchResultModal 
        isOpen={isMatchModalOpen}
        onClose={closeMatchModal}
        result={analysisResult}
        matchedDesign={matchedDesignForModal}
        weaverEmail={weaverEmail}
      />
    </div>
  );
};

export default App;