import React, { useState, useEffect } from 'react';

interface WeaverContactProps {
  initialEmail: string | null;
  onSave: (email: string) => void;
}

const WeaverContact: React.FC<WeaverContactProps> = ({ initialEmail, onSave }) => {
  const [email, setEmail] = useState(initialEmail || '');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setEmail(initialEmail || '');
  }, [initialEmail]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(email);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-12 border border-orange-200/50">
      <h2 className="text-2xl font-bold text-orange-900 mb-2">Your Contact Information</h2>
      <p className="text-gray-600 mb-4">Provide your email so interested buyers can contact you. This will be included in your generated pitches.</p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-4">
        <input
          type="email"
          placeholder="your.email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full flex-grow px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
          required
          aria-label="Weaver's contact email"
        />
        <button 
          type="submit" 
          className={`w-full sm:w-auto px-6 py-3 font-bold text-white rounded-md transition-colors duration-300 ease-in-out shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            saved 
            ? 'bg-green-600 focus:ring-green-500' 
            : 'bg-orange-800 hover:bg-orange-900 focus:ring-orange-700'
          }`}
          disabled={!email.trim()}
        >
          {saved ? 'Saved!' : 'Save Contact Info'}
        </button>
      </form>
    </div>
  );
};

export default WeaverContact;
