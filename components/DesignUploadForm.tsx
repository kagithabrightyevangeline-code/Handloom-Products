
import React, { useState } from 'react';
import { Design } from '../types';

interface DesignUploadFormProps {
  onAddDesign: (design: Design) => void;
}

const DesignUploadForm: React.FC<DesignUploadFormProps> = ({ onAddDesign }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [materials, setMaterials] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>('');
  const [error, setError] = useState<string>('');
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
          setError('Image file is too large. Please upload an image under 2MB.');
          return;
      }
      setError('');
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setImage(base64String);
        setImageMimeType(file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !materials || !image) {
      setError('Please fill out all fields and upload an image.');
      return;
    }
    
    onAddDesign({
      id: new Date().toISOString(),
      name,
      description,
      materials,
      image,
      imageMimeType,
    });

    setName('');
    setDescription('');
    setMaterials('');
    setImage(null);
    setImageMimeType('');
    // Reset file input
    const fileInput = document.getElementById('design-image') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg mb-12 border border-orange-200/50">
      <h2 className="text-3xl font-bold text-orange-900 mb-6">Showcase Your New Design</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            placeholder="Design Name (e.g., 'Mayuri Saree')"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
            required
          />
          <input
            type="text"
            placeholder="Materials Used (e.g., 'Silk, Zari Thread')"
            value={materials}
            onChange={(e) => setMaterials(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
            required
          />
        </div>
        <textarea
          placeholder="Describe your design... Talk about its inspiration, the technique, and what makes it unique."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
          required
        />
        <div className="flex items-center gap-6">
            <div className="w-full md:w-1/2">
                <label htmlFor="design-image" className="block text-sm font-medium text-gray-700 mb-2">Upload Design Image</label>
                <input
                    id="design-image"
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-100 file:text-orange-800 hover:file:bg-orange-200"
                    required
                />
            </div>
            {image && (
            <div className="w-24 h-24 rounded-md overflow-hidden border-2 border-orange-200 shadow-sm">
                <img src={`data:${imageMimeType};base64,${image}`} alt="Design Preview" className="w-full h-full object-cover" />
            </div>
            )}
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" className="w-full bg-orange-800 text-white font-bold py-3 px-6 rounded-md hover:bg-orange-900 transition-colors duration-300 ease-in-out shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-700">
          Add Design to Showcase
        </button>
      </form>
    </div>
  );
};

export default DesignUploadForm;
