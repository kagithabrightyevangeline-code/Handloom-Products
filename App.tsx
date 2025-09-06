
import React, { useState, useEffect } from 'react';
import { Design } from './types';
import Header from './components/Header';
import DesignUploadForm from './components/DesignUploadForm';
import DesignGallery from './components/DesignGallery';
import PitchModal from './components/PitchModal';
import { generatePitchForDesign } from './services/geminiService';

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
  
  const [loadingDesignId, setLoadingDesignId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    try {
      localStorage.setItem('handloomDesigns', JSON.stringify(designs));
    } catch (error) {
      console.error("Could not save designs to localStorage", error);
    }
  }, [designs]);

  const addDesign = (newDesign: Design) => {
    setDesigns(prevDesigns => [newDesign, ...prevDesigns]);
  };

  const handleGeneratePitch = async (designId: string) => {
    const designToUpdate = designs.find(d => d.id === designId);
    if (!designToUpdate) return;
    
    setSelectedDesign(designToUpdate);

    if (designToUpdate.pitch) {
        setIsModalOpen(true);
        return;
    }

    setLoadingDesignId(designId);
    setError(null);
    try {
      const pitch = await generatePitchForDesign(designToUpdate);
      setDesigns(prevDesigns =>
        prevDesigns.map(d =>
          d.id === designId ? { ...d, pitch } : d
        )
      );
      // After generating, update selectedDesign to include the new pitch before opening the modal
      setSelectedDesign({ ...designToUpdate, pitch });
      setIsModalOpen(true);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setLoadingDesignId(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDesign(null);
  };

  return (
    <div className="min-h-screen bg-orange-50/50 font-sans text-gray-800">
      <Header />
      <main className="container mx-auto px-6 py-12">
        <DesignUploadForm onAddDesign={addDesign} />
        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative my-4" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        )}
        <DesignGallery 
          designs={designs} 
          onGeneratePitch={handleGeneratePitch}
          loadingDesignId={loadingDesignId}
        />
      </main>
      <PitchModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        design={selectedDesign}
      />
    </div>
  );
};

export default App;
